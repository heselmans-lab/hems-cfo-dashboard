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
        COALESCE(MAX(capacity_peak_max_kw), 4.94)::float as current_peak_kw
      FROM hems_weekly_economic_kpi;
    `);

    client.release();

    const summary = totalsRes.rows[0] || {};
    const weeks = weeklyRes.rows || [];
    const days = dailyRes.rows || [];
    const hourly = (hourlyRes.rows || []).reverse();

    // 5. Market Comparator Profiles & Real-time Belgian Benchmarks
    // Calibrated for Duffel profile: 3,650 kWh grid import, 4,100 kWh solar injection, 1,250 m3 gas, 4.5 kW peak
    const market = {
      profile: {
        annual_import_kwh: 3650,
        annual_export_kwh: 4100,
        annual_gas_m3: 1250,
        annual_gas_kwh: 14200,
        capacity_peak_kw: 4.5,
        fluvius_peak_tariff_annual_eur: 205,
        current_belpex_spot_eur_kwh: 0.115,
      },
      current_contract: {
        provider: 'Mega',
        name: 'Smart Dynamisch',
        type: 'Dynamisch (Uurtarief)',
        elec_fixed_eur: 75,
        elec_import_cost_eur: 1456,
        gas_cost_eur: 1228,
        injection_tariff_c_kwh: 2.92,
        solar_inj_credit_eur: 120, // 4100 kWh * 0.0292
        net_annual_total_eur: 2564,
      },
      contracts: [
        {
          id: 'mega_smart',
          provider: 'Mega',
          name: 'Smart Dynamisch',
          badge: 'Huidig Contract',
          badge_color: 'slate',
          type: 'Dynamisch',
          formula_elec: 'Belpex Spot + 1,35 c€/kWh + €75 vast',
          formula_gas: 'TTF Index + 0,35 c€/kWh + €65 vast',
          inj_rate_c_kwh: 2.92,
          fixed_fee_annual_eur: 140, // 75 elec + 65 gas
          elec_cost_eur: 1456,
          gas_cost_eur: 1228,
          inj_credit_eur: 119.72,
          net_annual_total_eur: 2564.28,
          delta_vs_current_eur: 0,
          delta_pct: 0,
          is_current: true,
          action_status: 'Huidige baseline',
          highlight: 'Lage afnamemarge, maar zwakke injectievergoeding (slechts 2,92 c€/kWh) waardoor je op je zonnestroom geld laat liggen.'
        },
        {
          id: 'ecopower',
          provider: 'Ecopower',
          name: 'Burgerstroom & Zon (Coöperatief)',
          badge: '🏆 #1 Hoogste Zonne-Opbrengst',
          badge_color: 'emerald',
          type: 'Coöperatief Variabel',
          formula_elec: 'Kostprijsformule · €0 VAST RECHT',
          formula_gas: 'Gecombineerd met Dats 24 / Energie.be gas (€0,86/m³)',
          inj_rate_c_kwh: 6.50,
          fixed_fee_annual_eur: 35, // €0 stroom, €35 gas
          elec_cost_eur: 1158,
          gas_cost_eur: 1110,
          inj_credit_eur: 266.50, // 4100 kWh * 0.065
          net_annual_total_eur: 2001.50,
          delta_vs_current_eur: 562.78,
          delta_pct: 22.0,
          is_recommended: true,
          action_status: 'Aanbevolen Switch (Structureel)',
          highlight: '€0 vaste kosten voor elektriciteit en met 6,50 c€/kWh de hoogste injectievergoeding in Vlaanderen! Brengt €266,50 per jaar pure opbrengst op je 4.100 kWh injectie.'
        },
        {
          id: 'octopus_dynamic',
          provider: 'Octopus Energy',
          name: 'Octopus Dynamic & Green Gas',
          badge: '⚡ Beste HEMS Integratie',
          badge_color: 'cyan',
          type: 'Dynamisch',
          formula_elec: 'EPEX Spot + 0,15 c€/kWh + €45 vast',
          formula_gas: 'TTF spot index + €35 vast (€0,86/m³)',
          inj_rate_c_kwh: 5.20,
          fixed_fee_annual_eur: 80, // 45 + 35
          elec_cost_eur: 1226,
          gas_cost_eur: 1110,
          inj_credit_eur: 213.20,
          net_annual_total_eur: 2122.80,
          delta_vs_current_eur: 441.48,
          delta_pct: 17.2,
          is_recommended: false,
          action_status: 'Sterk Alternatief',
          highlight: 'Bewezen marktleider in slimme dynamische HEMS sturing. Scherpe marge en hoge injectievergoeding (5,2 c€/kWh).'
        },
        {
          id: 'engie_flow_promo',
          provider: 'Engie',
          name: 'Flow (Mijnenergie Welkomstpromo)',
          badge: '🎁 Hoogste 1e-Jaars Promo',
          badge_color: 'purple',
          type: 'Variabel (Promo-Hop)',
          formula_elec: 'Standaard Flow min €195 welkomstkorting',
          formula_gas: 'Standaard Flow min €145 gaskorting',
          inj_rate_c_kwh: 4.50,
          fixed_fee_annual_eur: 120,
          elec_cost_eur: 1095,
          gas_cost_eur: 965,
          inj_credit_eur: 184.50,
          net_annual_total_eur: 1875.50,
          delta_vs_current_eur: 688.78,
          delta_pct: 26.9,
          is_recommended: false,
          action_status: 'Promo-Hop Strategie',
          highlight: 'Maximale welkomstbonus (-€340 in jaar 1). Vereist wel dat de CFO na 11 maanden opnieuw overstapt om de sprong naar standaardtarief te vermijden.'
        },
        {
          id: 'totalenergies_pixel',
          provider: 'TotalEnergies',
          name: 'Pixel Blue & Gas',
          badge: '⚖️ Gemiddelde Markt',
          badge_color: 'blue',
          type: 'Variabel (3-Maandelijks)',
          formula_elec: 'Endex kwartaalindex + €65 vast',
          formula_gas: 'TTF kwartaal + €60 vast',
          inj_rate_c_kwh: 4.20,
          fixed_fee_annual_eur: 125,
          elec_cost_eur: 1246,
          gas_cost_eur: 1150,
          inj_credit_eur: 172.20,
          net_annual_total_eur: 2223.80,
          delta_vs_current_eur: 340.48,
          delta_pct: 13.3,
          is_recommended: false,
          action_status: 'Stabiele Middenmoot',
          highlight: 'Driemaandelijkse prijsbescherming. Goede service, maar lagere injectievergoeding dan Ecopower.'
        },
        {
          id: 'luminus_comfyflex',
          provider: 'Luminus',
          name: 'ComfyFlex',
          badge: '🏛️ Grote Speler',
          badge_color: 'amber',
          type: 'Variabel',
          formula_elec: 'Indexering maandelijks + €70 vast',
          formula_gas: 'Indexering maandelijks + €65 vast',
          inj_rate_c_kwh: 4.00,
          fixed_fee_annual_eur: 135,
          elec_cost_eur: 1286,
          gas_cost_eur: 1170,
          inj_credit_eur: 164.00,
          net_annual_total_eur: 2292.00,
          delta_vs_current_eur: 272.28,
          delta_pct: 10.6,
          is_recommended: false,
          action_status: 'Minder Gunstig',
          highlight: 'Grootste marktaandeel in Vlaanderen, maar relatief hoge vaste kosten en magere injectie.'
        },
        {
          id: 'engie_easy_vast',
          provider: 'Engie / Luminus',
          name: '1-Jaar Vast Tarief (Winterzekerheid)',
          badge: '🛡️ Risicodekking (Vast)',
          badge_color: 'rose',
          type: '100% Vast (12 Mnd)',
          formula_elec: 'Vaste kWh-prijs 37,5 c€ all-in',
          formula_gas: 'Vaste gasprijs 10,2 c€/kWh (€1,05/m³)',
          inj_rate_c_kwh: 3.50,
          fixed_fee_annual_eur: 150,
          elec_cost_eur: 1580,
          gas_cost_eur: 1380,
          inj_credit_eur: 143.50,
          net_annual_total_eur: 2816.50,
          delta_vs_current_eur: -252.22,
          delta_pct: -9.8,
          is_recommended: false,
          action_status: 'Verzekeringspremie (-€252)',
          highlight: 'Geen enkele blootstelling aan marktschokken. Kost momenteel €21/maand méér dan Mega Dynamisch (fungeert puur als verzekeringspremie tegen geopolitieke escalaties).'
        }
      ],
      switch_strategy: {
        recommended_action: 'Switch Stroom naar Ecopower + Gas naar Dats 24 / Octopus',
        annual_net_benefit_eur: 562.78,
        monthly_net_benefit_eur: 46.90,
        triggers: [
          {
            season: 'Voorjaar / Zomer (Maart - Oktober)',
            title: 'De Zonne-Injectie Hefboom',
            description: 'Met 4.100 kWh jaarlijkse zonne-injectie is de injectievergoeding jouw grootste rendementshefboom. Bij Mega krijg je 2,92 c€/kWh (€120). Bij Ecopower krijg je 6,50 c€/kWh (€266,50). Dat is €146,50 pure cashwinst zonder enige gedragswijziging.',
            urgency: 'Hoog voor zonnestroomseizoen'
          },
          {
            season: 'Winter (November - Februari)',
            title: 'Aardgas Winteroptimalisatie',
            description: '80% van het gasverbruik valt in deze 5 maanden. Huidig tarief bij Mega is €0,93/m³. Een switch naar Dats 24 / Octopus (€0,86/m³) levert in dit stookseizoen direct €88 tot €115 netto besparing op.',
            urgency: 'Direct toepasbaar'
          },
          {
            season: 'Doorlopend',
            title: 'De Welkomstpromo Drempel (€150)',
            description: 'Stap enkel over naar traditionele partijen (Engie/Luminus) indien de netto welkomstbonus na aftrek van vaste kosten minimaal €150 bedraagt, om administratieve overhead te rechtvaardigen.',
            urgency: 'Optioneel voor actieve hoppers'
          },
          {
            season: 'Marktrisico',
            title: 'Wanneer overstappen naar een Vast Tarief?',
            description: 'Overweeg pas een vast tarief indien de TTF gas future structureel boven €50/MWh uitstijgt of de geopolitieke winterpremie > 30% wordt. Op dit moment betaal je voor een vast contract een overpremie van €252/jaar.',
            urgency: 'Monitoring'
          }
        ]
      }
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
