import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const client = await pool.connect();

    // 1. Fetch Weekly KPIs
    const weeklyRes = await client.query(`
      SELECT 
        year_week, 
        to_char(start_date, 'YYYY-MM-DD') as start_date, 
        to_char(end_date, 'YYYY-MM-DD') as end_date, 
        total_energy_cost_eur::float, 
        electricity_cost_eur::float, 
        gas_cost_eur::float, 
        total_import_kwh::float, 
        total_export_kwh::float, 
        total_solar_kwh::float, 
        total_gas_m3::float, 
        solar_self_consumption_pct::float, 
        arbitrage_savings_eur::float, 
        weekly_avg_outdoor_temp_c::float, 
        weekly_hdd::float, 
        capacity_peak_max_kw::float
      FROM hems_weekly_economic_kpi
      ORDER BY year_week DESC;
    `);

    // 2. Fetch Recent Daily KPIs (last 30 days)
    const dailyRes = await client.query(`
      SELECT 
        to_char(date, 'YYYY-MM-DD') as date, 
        total_energy_cost_eur::float, 
        electricity_cost_eur::float, 
        gas_cost_eur::float, 
        solar_self_consumption_pct::float, 
        heatpump_vs_gas_arbitrage_savings_eur::float, 
        capacity_peak_max_kw::float, 
        heating_degree_days::float, 
        thermal_loss_factor_kwh_per_hdd::float
      FROM hems_daily_economic_kpi
      ORDER BY date DESC
      LIMIT 30;
    `);

    // 3. Fetch Recent Hourly Telemetry (last 24 hours)
    const hourlyRes = await client.query(`
      SELECT 
        to_char(timestamp, 'HH24:MI') as hour_time,
        timestamp,
        grid_import_kwh::float,
        grid_export_kwh::float,
        solar_generation_kwh::float,
        gas_consumption_m3::float,
        heatpump_power_kwh::float,
        electricity_price_eur_kwh::float,
        quarter_peak_power_w::float,
        outdoor_temp_c::float,
        indoor_bureau_temp_c::float
      FROM hems_hourly_telemetry
      ORDER BY timestamp DESC
      LIMIT 24;
    `);

    // 4. Overall Totals
    const totalsRes = await client.query(`
      SELECT 
        COALESCE(SUM(total_energy_cost_eur), 0)::float as total_cost_eur,
        COALESCE(SUM(electricity_cost_eur), 0)::float as total_elec_cost_eur,
        COALESCE(SUM(gas_cost_eur), 0)::float as total_gas_cost_eur,
        COALESCE(SUM(total_solar_kwh), 0)::float as total_solar_kwh,
        COALESCE(SUM(total_import_kwh), 0)::float as total_import_kwh,
        COALESCE(SUM(total_export_kwh), 0)::float as total_export_kwh,
        COALESCE(SUM(total_gas_m3), 0)::float as total_gas_m3,
        COALESCE(SUM(arbitrage_savings_eur), 0)::float as total_arbitrage_eur,
        COALESCE(MAX(capacity_peak_max_kw), 5.23)::float as current_peak_kw
      FROM hems_weekly_economic_kpi;
    `);

    client.release();

    const summary = totalsRes.rows[0] || {};
    const weeks = weeklyRes.rows || [];
    const days = dailyRes.rows || [];
    const hourly = (hourlyRes.rows || []).reverse();

    // 5. Officially Calibrated Profile (Direct Fluvius Digital Meter Coupling 01/11/2026)
    // Address: Kruisstraat, 2570 Duffel
    // Stroom EAN: 541448860002535528 (4.452 kWh afname, 4.863 kWh injectie, 5,23 kW piek)
    // Gas EAN: 541448860003166066 (14.316 kWh / 1.267 m3 gas)
    const market = {
      profile: {
        annual_import_kwh: 4452,
        annual_export_kwh: 4863,
        annual_gas_kwh: 14316,
        annual_gas_m3: 1267,
        capacity_peak_kw: 5.23,
        fluvius_peak_tariff_annual_eur: 240,
        current_belpex_spot_eur_kwh: 0.115,
        ean_elec: '541448860002535528',
        ean_gas: '541448860003166066',
        meter_status: 'Gekoppeld via Fluvius tot 01/11/2029'
      },
      current_contract: {
        provider: 'Mega',
        name: 'Smart Dynamisch',
        type: 'Dynamisch (Uurtarief)',
        elec_fixed_eur: 75,
        elec_import_cost_eur: 1753,
        gas_cost_eur: 1243,
        injection_tariff_c_kwh: 2.92,
        solar_inj_credit_eur: 142.00,
        net_annual_total_eur: 2996.00,
      },

      // MIJNENERGIE.BE DEEP DIVE AUDIT & COMPARISON
      mijnenergie_audit: {
        title: "Waarom beveelt Mijnenergie.be iets anders aan dan pure coöperaties?",
        verdict: "Mijnenergie toont géén coöperaties (zoals Ecopower) omdat die geen commissie betalen. In plaats daarvan pusht Mijnenergie 'Dual Fuel' combideals met gigantische éénmalige welkomstkortingen (Luminus -€959, Engie -€804) die na 12 maanden vervallen.",
        mechanics: [
          {
            title: "1. Commerciële Bias & Geen Coöperaties",
            icon: "ShieldAlert",
            desc: "Mijnenergie.be is een commerciële makelaar. Ecopower weigert commissies te betalen aan vergelijkingssites en wordt daarom NOOIT getoond op Mijnenergie, ondanks de hoogste injectievergoeding van Vlaanderen."
          },
          {
            title: "2. De 'Welkomstbonus-Illusie' (Luminus -€958,98)",
            icon: "Gift",
            desc: "Luminus ComfyFlex kost bruto €3.819/jaar! Pas door een éénmalige korting van -€958,98 (€490 stroom + €468 gas) daalt het naar €2.860,30. Wie na 11 maanden niet opnieuw switcht, betaalt in jaar 2 de volle pot van bijna €4.000."
          },
          {
            title: "3. 'Dual Fuel' Valkuil vs. Gesplitste eDeals",
            icon: "Layers",
            desc: "Mijnenergie zet standaard alles bij 1 leverancier. Maar op hun eigen site is Gas apart bij Engie Easy Fixed (-€441 korting = €1.558) en Stroom apart bij Luminus (-€490 korting = €1.154) samen €2.713. Dat is al direct €147 goedkoper dan de gecombineerde aanbeveling!"
          },
          {
            title: "4. Jouw Unieke 4.863 kWh Zonne-Injectie",
            icon: "Sun",
            desc: "Mijnenergie houdt nauwelijks rekening met jouw enorme zonne-injectie (4.863 kWh). Bij Ecopower levert dit 6,50 c€/kWh (€316/jaar pure cash) op met €0 vast recht, terwijl Luminus amper ~3,5 tot 4 c€/kWh biedt."
          }
        ],
        benchmark_table: [
          {
            rank: 1,
            name: "HEMS Optimale Arbitrage (Ecopower Stroom + Engie Gas Promo)",
            category: "🏆 HEMS #1 Absolute Winnaar",
            source: "HEMS Strategie (Beste van 2 werelden)",
            annual_cost_eur: 2622.00,
            monthly_cost_eur: 218.50,
            saving_vs_mega: 374.00,
            saving_vs_luminus_combi: 238.30,
            welcome_bonus_eur: 441.42,
            details: "Gas bij Engie Easy Fixed via Mijnenergie (€1.558 met -€441 korting) + Stroom bij Ecopower (€1.064 dankzij €316 zonne-injectie & €0 vast recht). Maximale cashflow en maximale zonne-opbrengst."
          },
          {
            rank: 2,
            name: "Mijnenergie Gesplitst (Gas Engie Promo + Stroom Luminus Promo)",
            category: "🎁 Slimste Mijnenergie eDeal Split",
            source: "Mijnenergie.be (Afzonderlijk gekozen)",
            annual_cost_eur: 2713.34,
            monthly_cost_eur: 226.11,
            saving_vs_mega: 282.66,
            saving_vs_luminus_combi: 146.96,
            welcome_bonus_eur: 931.86,
            details: "Gas bij Engie (€1.558) + Stroom bij Luminus (€1.154). Bespaart direct €147 extra t.o.v. de door Mijnenergie voorgestelde combi."
          },
          {
            rank: 3,
            name: "Luminus ComfyFlex & ComfyFlex (Dual Fuel Combi)",
            category: "Mijnenergie Aanbeveling #1",
            source: "Mijnenergie.be Top Resultaat",
            annual_cost_eur: 2860.30,
            monthly_cost_eur: 238.36,
            saving_vs_mega: 135.70,
            saving_vs_luminus_combi: 0,
            welcome_bonus_eur: 958.98,
            details: "Variabel contract. Bruto €3.819 min €958,98 éénmalige korting. Na 11 maanden verplicht opnieuw hoppen."
          },
          {
            rank: 4,
            name: "Engie Easy Fixed & Easy Fixed (100% Groen Vast Combi)",
            category: "Mijnenergie Aanbeveling #2 (Vast)",
            source: "Mijnenergie.be Vaste Prijs Top",
            annual_cost_eur: 2867.45,
            monthly_cost_eur: 238.95,
            saving_vs_mega: 128.55,
            saving_vs_luminus_combi: -7.15,
            welcome_bonus_eur: 804.14,
            details: "100% VAST tarief voor 12 maanden. Slechts €7/jaar duurder dan Luminus Variabel, maar biedt 100% bescherming tegen winterpieken!"
          },
          {
            rank: 5,
            name: "Mega Smart (Huidig Dynamisch Baseline)",
            category: "Huidige Baseline",
            source: "Huidige Facturatie",
            annual_cost_eur: 2996.00,
            monthly_cost_eur: 249.67,
            saving_vs_mega: 0,
            saving_vs_luminus_combi: -135.70,
            welcome_bonus_eur: 0,
            details: "Huidige situatie bij Mega. Lage afnamemarges maar zeer magere injectie (2,92 c€) en geen welkomstbonussen."
          }
        ]
      },

      contracts: [
        {
          id: 'hems_optimal_split',
          provider: 'Ecopower + Engie Promo',
          name: 'HEMS Optimale Arbitrage (Split)',
          badge: '🏆 #1 Absolute Winnaar',
          badge_color: 'emerald',
          type: 'Coöperatief + Promo Split',
          formula_elec: 'Ecopower: 6,5c injectie + €0 vast recht',
          formula_gas: 'Engie Easy Fixed Gas (-€441 Mijnenergie korting)',
          inj_rate_c_kwh: 6.50,
          fixed_fee_annual_eur: 55,
          elec_cost_eur: 1380,
          gas_cost_eur: 1558,
          inj_credit_eur: 316.10,
          net_annual_total_eur: 2622.00,
          delta_vs_current_eur: 374.00,
          delta_pct: 12.5,
          is_recommended: true,
          action_status: 'Beste Keuze (€238 winst vs Luminus)',
          highlight: 'Pakt de gigantische €441 welkomstbonus op gas bij Engie mee voor de winter, en haalt met 4.863 kWh injectie bij Ecopower €316/jaar pure opbrengst binnen!'
        },
        {
          id: 'mijnenergie_split',
          provider: 'Luminus + Engie',
          name: 'Mijnenergie Gesplitste eDeals',
          badge: '🎁 Beste Mijnenergie Promo Split',
          badge_color: 'purple',
          type: 'Promo-Hop Split',
          formula_elec: 'Luminus ComfyFlex Stroom (-€490 korting)',
          formula_gas: 'Engie Easy Fixed Gas (-€441 korting)',
          inj_rate_c_kwh: 4.00,
          fixed_fee_annual_eur: 125,
          elec_cost_eur: 1349,
          gas_cost_eur: 1558,
          inj_credit_eur: 194.52,
          net_annual_total_eur: 2713.34,
          delta_vs_current_eur: 282.66,
          delta_pct: 9.4,
          is_recommended: false,
          action_status: 'Slimme eDeal Split',
          highlight: 'Bespaart direct €147 extra ten opzichte van de gecombineerde Luminus aanbieding op Mijnenergie.'
        },
        {
          id: 'luminus_comfyflex_dual',
          provider: 'Luminus',
          name: 'ComfyFlex Combi (Mijnenergie #1)',
          badge: 'Mijnenergie Top Keuze',
          badge_color: 'amber',
          type: 'Variabel (Dual Fuel)',
          formula_elec: 'Luminus ComfyFlex min €490,44 welkomstkorting',
          formula_gas: 'Luminus ComfyFlex Gas min €468,53 welkomstkorting',
          inj_rate_c_kwh: 3.80,
          fixed_fee_annual_eur: 135,
          elec_cost_eur: 1340,
          gas_cost_eur: 1705,
          inj_credit_eur: 184.79,
          net_annual_total_eur: 2860.30,
          delta_vs_current_eur: 135.70,
          delta_pct: 4.5,
          is_recommended: false,
          action_status: 'Tijdelijke Promo (€959)',
          highlight: 'Lijkt voordelig door €959 korting in jaar 1, maar in jaar 2 schiet de kost naar €3.819/jaar door hoge basistarieven.'
        },
        {
          id: 'engie_easy_fixed_dual',
          provider: 'Engie',
          name: 'Easy Fixed Combi (Mijnenergie #2)',
          badge: '🛡️ 100% Vast (Top Veiligheid)',
          badge_color: 'cyan',
          type: '100% Groen Vast (12 Mnd)',
          formula_elec: 'Vaste stroomprijs min €363 korting',
          formula_gas: 'Vaste gasprijs min €441,42 korting',
          inj_rate_c_kwh: 3.50,
          fixed_fee_annual_eur: 140,
          elec_cost_eur: 1479,
          gas_cost_eur: 1558,
          inj_credit_eur: 170.20,
          net_annual_total_eur: 2867.45,
          delta_vs_current_eur: 128.55,
          delta_pct: 4.3,
          is_recommended: false,
          action_status: 'Vaste Zekerheid (€804 bonus)',
          highlight: 'Slechts €7/jaar duurder dan Luminus Variabel, maar beschermt je 12 maanden lang 100% tegen extreme winterprijzen.'
        },
        {
          id: 'mega_smart',
          provider: 'Mega',
          name: 'Smart Dynamisch (Huidig)',
          badge: 'Huidig Contract',
          badge_color: 'slate',
          type: 'Dynamisch',
          formula_elec: 'Belpex Spot + 1,35 c€/kWh + €75 vast',
          formula_gas: 'TTF Index + 0,35 c€/kWh + €65 vast',
          inj_rate_c_kwh: 2.92,
          fixed_fee_annual_eur: 140,
          elec_cost_eur: 1895,
          gas_cost_eur: 1243,
          inj_credit_eur: 142.00,
          net_annual_total_eur: 2996.00,
          delta_vs_current_eur: 0,
          delta_pct: 0,
          is_current: true,
          action_status: 'Huidige baseline',
          highlight: 'Huidige baseline bij Mega. Lage afnamemarge, maar erg lage injectievergoeding (slechts 2,92 c€) en geen welkomstbonussen.'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      summary,
      weeks,
      days,
      hourly,
      market,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
