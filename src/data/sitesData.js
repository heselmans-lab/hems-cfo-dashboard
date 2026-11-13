// Configuration & Data Profiles for Multi-Site HEMS
// Strictly segregated: Kruisstraat (Duffel) vs. Bomma (Tessenderlo)

export const SITES = [
  {
    id: 'kruisstraat',
    name: 'Kruisstraat 131, Duffel',
    short_name: 'Kruisstraat (Duffel)',
    badge: 'HEMS Lab · Kruisstraat',
    badge_color: 'indigo',
    address: 'Kruisstraat 131, 2570 Duffel',
    resident: 'Kristof Heselmans & Karin',
    type: 'Eengezinswoning (Vrijstaand)',
    features: 'SolarEdge PV (4,86 kWp), Thuisbatterij, Warmtepomp, Loxone HEMS',
    grid_operator: 'Fluvius Antwerpen / Iverlek',
    ean_elec: '541448860002535528',
    ean_gas: '541448860003166066',
    meter_status: 'Gekoppeld via Fluvius tot 01/11/2029',
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
    }
  },
  {
    id: 'bomma_tessenderlo',
    name: 'Bomma Tessenderlo',
    short_name: 'Bomma (Tessenderlo)',
    badge: 'Appartement 88j · Tessenderlo',
    badge_color: 'amber',
    address: 'Vismarkt 18 bus 2, 3980 Tessenderlo-Ham',
    resident: 'Mevr. Jacqueline Macours',
    resident_age: '88 jaar',
    type: 'Appartement (1 bewoner, 88j)',
    features: 'Individuele gasketel, Digitale meters, Geen PV, Geen batterij',
    grid_operator: 'Fluvius Limburg',
    customer_number: '12-11014-66',
    bank_account: 'BE63 7330 5004 9808',
    ean_elec: '541449206002948378',
    meter_elec: '1SAG1100790045 (Digitale meter)',
    ean_gas: '541449206007458049',
    meter_gas: '7FLO2123132985 (Digitale meter)',
    meter_status: 'Fluvius Limburg (Actief)',
    profile: {
      annual_import_kwh: 1535,
      annual_export_kwh: 0,
      annual_gas_kwh: 5613,
      annual_gas_m3: 492,
      capacity_peak_kw: 2.96,
      fluvius_peak_tariff_annual_eur: 110,
      current_belpex_spot_eur_kwh: 0.115,
      ean_elec: '541449206002948378',
      ean_gas: '541449206007458049',
      meter_status: 'Fluvius Limburg (Gevalideerd)',
      elec_day_kwh: 822,
      elec_night_kwh: 713
    }
  }
];

export const BOMMA_TESSENDERLO_DATA = {
  site: {
    id: 'bomma_tessenderlo',
    name: 'Bomma Tessenderlo',
    address: 'Vismarkt 18 bus 2, 3980 Tessenderlo-Ham',
    resident: 'Mevr. Jacqueline Macours',
    resident_age: '88 jaar',
    customer_number: '12-11014-66',
    bank_account: 'BE63 7330 5004 9808',
    type: 'Appartement (1 bewoner, 88j)',
    grid_operator: 'Fluvius Limburg',
    ean_elec: '541449206002948378',
    meter_elec: '1SAG1100790045',
    ean_gas: '541449206007458049',
    meter_gas: '7FLO2123132985'
  },
  profile: {
    annual_import_kwh: 1535,
    annual_export_kwh: 0,
    annual_gas_kwh: 5613,
    annual_gas_m3: 492,
    capacity_peak_kw: 2.96,
    fluvius_peak_tariff_annual_eur: 110,
    current_belpex_spot_eur_kwh: 0.115,
    ean_elec: '541449206002948378',
    ean_gas: '541449206007458049',
    meter_status: 'Gekoppeld via Fluvius Limburg',
    elec_day_kwh: 822,
    elec_night_kwh: 713
  },
  current_contract: {
    provider: 'Luminus',
    name: 'BasicFlex Online (Huidig)',
    type: 'Variabel (Onbepaalde duur)',
    elec_fixed_eur: 21.20,
    gas_fixed_eur: 15.90,
    monthly_advance_eur: 92.00,
    monthly_elec_eur: 47.00,
    monthly_gas_eur: 45.00,
    net_annual_total_eur: 1024.70,
    settlement_credit_eur: -73.30,
    elec_cost_eur: 529.26,
    gas_cost_eur: 437.44,
    status_note: 'Luminus heeft eenzijdige contractwijziging aangekondigd per 11.01.2027'
  },
  proposed_renewal: {
    provider: 'Luminus',
    name: 'BasicFlex Online (Nieuw Voorstel)',
    type: 'Variabel (Bepaalde duur 2 JAAR VAST)',
    effective_date: '11.01.2027',
    lock_period: '2 jaar (11.01.2027 tot 11.01.2029)',
    elec_fixed_eur: 25.00, // +18%
    gas_fixed_eur: 20.00,  // +26%
    elec_day_formula: '0,0012353 * Belpex M + 0,0387312 (~€0,26789/kWh)',
    elec_night_formula: '0,0009653 * Belpex M + 0,0324576 (~€0,21166/kWh)',
    projected_annual_total_eur: 1120.00,
    projected_monthly_advance_eur: 93.30,
    warnings: [
      '100% Digitale Dienstverlening: GEEN telefonische helpdesk mogelijk (ongeschikt voor Jacqueline)',
      'Contractuele binding van 2 jaar (bepaalde duur): zit 24 maanden vast',
      'Variabel tarief: risico op prijspieken tijdens strenge wintermaanden',
      'Vaste jaarvergoedingen stijgen (+18% elektriciteit, +26% aardgas)'
    ]
  },
  market_audit: {
    title: "Senioren Energie Audit: Bomma Tessenderlo",
    verdict: "Het Luminus-voorstel per 11.01.2027 is 100% digitaal zonder telefonische support en bindt Jacqueline 2 jaar vast aan volatiele marktprijzen. ENGIE Easy Vast biedt voor haar maximale gemoedsrust met vaste prijzen en telefonische helpdesk.",
    mechanics: [
      {
        title: "1. Telefonische Bereikbaarheid (Senior Factor)",
        icon: "PhoneCall",
        desc: "Jacqueline (88j) heeft niets aan een webportal of smartphone-app. Luminus BasicFlex Online sluit telefonisch contact expliciet uit. ENGIE Easy Vast behoudt een volwaardige telefonische klantendienst."
      },
      {
        title: "2. Geen Winterprijsschokken (Vast vs Variabel)",
        icon: "ShieldCheck",
        desc: "Met een gasverbruik van 5.613 kWh en 1.535 kWh stroom is een vaste prijsformule ideaal: haar maandkost blijft 12 maanden exact gelijk, ongeacht geopolitieke of gasmarktcrisissen."
      },
      {
        title: "3. De Voorschottenverwarring (€114 vs €70)",
        icon: "Info",
        desc: "Op de website van ENGIE staat een voorlopig voorschot van €114/mnd. Dit komt omdat ENGIE de welkomstkorting (-€356) pas verrekent op de jaarafrekening. Netto kost het contract haar ~€70 à €72/mnd."
      },
      {
        title: "4. Minimale Capaciteitspiek (Geen Zorgen)",
        icon: "Zap",
        desc: "Haar werkelijke maandpiek schommelt rond 2,66 - 2,96 kW. Ze zit praktisch op de Vlaamse minimumdrempel van 2,5 kW. Geen nood aan complexe batterij- of sturingssystemen."
      }
    ],
    benchmark_table: [
      {
        rank: 1,
        name: "ENGIE Easy Vast (12 Maanden)",
        category: "🏆 HEMS Senioren Keuze #1 (Vast + Telefoon)",
        source: "Mijnenergie.be eDeal Actie",
        annual_cost_eur: 845.00,
        monthly_cost_eur: 70.42,
        saving_vs_luminus: 275.00,
        welcome_bonus_eur: 356.95,
        fixed_price: true,
        phone_support: true,
        senior_score: "9.8 / 10",
        details: "100% vaste prijs voor 12 maanden + telefonische helpdesk. Netto €70/mnd na korting. Bruto voorschot op factuur is €114/mnd met teruggave op jaarafrekening."
      },
      {
        rank: 2,
        name: "TotalEnergies Pixel Vast (12 Maanden)",
        category: "🥈 Alternatief Vast Contract",
        source: "Vergelijker eDeal",
        annual_cost_eur: 882.00,
        monthly_cost_eur: 73.50,
        saving_vs_luminus: 238.00,
        welcome_bonus_eur: 280.00,
        fixed_price: true,
        phone_support: true,
        senior_score: "9.0 / 10",
        details: "Vaste prijsgarantie en telefonische helpdesk. Iets minder korting dan ENGIE maar stabiele en betrouwbare service."
      },
      {
        rank: 3,
        name: "Luminus BasicFlex Online (Voorstel 11.01.2027)",
        category: "⚠️ Huidig Voorstel Luminus (Niet Aangeraden)",
        source: "Luminus E-mail 06.11.2026",
        annual_cost_eur: 1120.00,
        monthly_cost_eur: 93.33,
        saving_vs_luminus: 0,
        welcome_bonus_eur: 0,
        fixed_price: false,
        phone_support: false,
        senior_score: "4.5 / 10",
        details: "2 jaar vastgeketend, variabel markttarief, stijgende vaste vergoeding en GEEN telefonische helpdesk."
      }
    ]
  },
  contracts: [
    {
      id: 'engie_easy_vast_bomma',
      provider: 'ENGIE',
      name: 'ENGIE Easy Vast (12m)',
      badge: '🏆 #1 Senioren Keuze',
      badge_color: 'emerald',
      type: 'Vast Tarief (1 Jaar)',
      formula_elec: 'Vaste prijs 12m + telefonische support',
      formula_gas: 'Vaste prijs 12m (-€356 Mijnenergie korting)',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 70,
      elec_cost_eur: 395,
      gas_cost_eur: 450,
      inj_credit_eur: 0,
      net_annual_total_eur: 845.00,
      delta_vs_current_eur: 275.00,
      delta_pct: 24.5,
      is_recommended: true,
      action_status: 'Aanbevolen Switch (Senioren Vriendelijk)',
      highlight: 'Vaste prijszekerheid, telefonische support en netto besparing van €275 t.o.v. het nieuwe Luminus voorstel!'
    },
    {
      id: 'total_pixel_vast_bomma',
      provider: 'TotalEnergies',
      name: 'Pixel Vast (12m)',
      badge: '🥈 Veilig Alternatief',
      badge_color: 'blue',
      type: 'Vast Tarief (1 Jaar)',
      formula_elec: 'Pixel Vast 12m met telefoon',
      formula_gas: 'Pixel Vast Gas met telefoon',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 75,
      elec_cost_eur: 412,
      gas_cost_eur: 470,
      inj_credit_eur: 0,
      net_annual_total_eur: 882.00,
      delta_vs_current_eur: 238.00,
      delta_pct: 21.2,
      is_recommended: false,
      action_status: 'Goed Alternatief',
      highlight: 'Vaste prijs voor 12 maanden met telefonische bereikbaarheid voor senioren.'
    },
    {
      id: 'luminus_basicflex_proposed',
      provider: 'Luminus',
      name: 'BasicFlex Online (Voorstel)',
      badge: '⚠️ Huidig Voorstel 11.01.2027',
      badge_color: 'amber',
      type: 'Variabel (2 Jaar Vastgeketend)',
      formula_elec: '0,0012353 * Belpex M + 0,03873 (€0,268/kWh)',
      formula_gas: 'TTF variabel + €20 vast',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 45,
      elec_cost_eur: 580,
      gas_cost_eur: 540,
      inj_credit_eur: 0,
      net_annual_total_eur: 1120.00,
      delta_vs_current_eur: 0,
      delta_pct: 0,
      is_current: true,
      action_status: 'Niet Aangeraden',
      highlight: 'Geen telefonische helpdesk mogelijk en 2 jaar vastgepind op variabele marktprijzen.'
    }
  ],
  monthly_breakdown: [
    { month: 'Jun 25', elec_kwh: 56.32, gas_kwh: 32.90, peak_kw: 2.66, cost_eur: 32.40 },
    { month: 'Jul 25', elec_kwh: 66.57, gas_kwh: 31.14, peak_kw: 2.70, cost_eur: 34.20 },
    { month: 'Aug 25', elec_kwh: 55.31, gas_kwh: 28.22, peak_kw: 2.68, cost_eur: 31.80 },
    { month: 'Sep 25', elec_kwh: 57.40, gas_kwh: 73.81, peak_kw: 2.72, cost_eur: 38.50 },
    { month: 'Okt 25', elec_kwh: 65.98, gas_kwh: 550.77, peak_kw: 2.85, cost_eur: 78.10 },
    { month: 'Nov 25', elec_kwh: 67.67, gas_kwh: 851.76, peak_kw: 2.92, cost_eur: 112.40 },
    { month: 'Dec 25', elec_kwh: 91.22, gas_kwh: 993.87, peak_kw: 2.96, cost_eur: 135.80 },
    { month: 'Jan 26', elec_kwh: 93.83, gas_kwh: 1267.55, peak_kw: 2.95, cost_eur: 168.20 },
    { month: 'Feb 26', elec_kwh: 81.61, gas_kwh: 826.57, peak_kw: 2.88, cost_eur: 116.30 },
    { month: 'Mrt 26', elec_kwh: 64.38, gas_kwh: 618.81, peak_kw: 2.78, cost_eur: 88.60 },
    { month: 'Apr 26', elec_kwh: 69.02, gas_kwh: 211.72, peak_kw: 2.74, cost_eur: 54.30 },
    { month: 'Mei 26', elec_kwh: 53.01, gas_kwh: 125.69, peak_kw: 2.69, cost_eur: 42.10 }
  ],
  action_plan: [
    {
      step: 1,
      title: "Mandaat Fluvius Koppelen",
      status: "Actie Kristof",
      desc: "Log in op mijn.fluvius.be en vraag digitaal mandaat / toegang aan voor EAN 541449206002948378 (stroom) en 541449206007458049 (gas)."
    },
    {
      step: 2,
      title: "Kies ENGIE Easy Vast (1 Jaar)",
      status: "Aanbeveling",
      desc: "Schakel over vóór medio december 2026 zodat de switch naadloos ingaat vóór de Luminus 2-jaars lock-in op 11.01.2027."
    },
    {
      step: 3,
      title: "Naamscorrectie & Contactpersoon",
      status: "Administratie",
      desc: "Luminus adresseert momenteel verkeerd aan 'heer Macours'. Zet Kristof Heselmans als gemachtigd contactpersoon of zet de tenaamstelling correct op 'Mevr. Jacqueline Macours'."
    }
  ]
};
