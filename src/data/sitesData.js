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
    status_note: 'Luminus heeft contractwijziging aangekondigd per 11.01.2027. Huidig voorschot van €92/mnd is te laag voor de huidige winterbeurs.'
  },
  proposed_renewal: {
    provider: 'Luminus',
    name: 'BasicFlex Online (Nieuw Voorstel)',
    type: 'Variabel (Formeel 2 jaar, maar wettelijk altijd opzegbaar met 3 wkn)',
    effective_date: '11.01.2027',
    lock_period: 'Geen lock-in: wettelijk op elk moment kosteloos opzegbaar met 3 weken termijn',
    elec_fixed_eur: 25.00, // +18%
    gas_fixed_eur: 20.00,  // +26%
    elec_day_formula: '0,0012353 * Belpex M + 0,0387312 (~€0,26789/kWh)',
    elec_night_formula: '0,0009653 * Belpex M + 0,0324576 (~€0,21166/kWh)',
    projected_annual_total_eur: 1485.00,
    projected_monthly_advance_eur: 125.00,
    warnings: [
      '100% Digitale Dienstverlening: GEEN telefonische helpdesk mogelijk (ongeschikt voor Jacqueline)',
      'Huidig voorschot (€92/mnd) stuurt aan op een nabetaling van ~€400 in juni 2027: dringend verhogen naar €125/mnd',
      'Variabel markttarief (Belpex M / TTF): risico op forse pieken tijdens koude wintermaanden',
      'Wettelijke geruststelling: 6 december is geen fatale datum. Particulieren kunnen in België te allen tijde gratis overstappen met 3 weken opzegtermijn'
    ]
  },
  market_audit: {
    title: "Senioren Energie Audit: Bomma Tessenderlo",
    verdict: "De aanbevolen commerciële keuze is ENGIE Easy Vast: 12 maanden vaste prijszekerheid en telefonische ondersteuning voor Jacqueline (88j). Luminus BasicFlex is variabel en sluit telefonisch contact uit. Wel is het verstandig haar pensioenfiche 1x na te kijken om een eventueel sociaal tarief (IGO/BIM) formeel uit te sluiten.",
    mechanics: [
      {
        title: "1. Aanbevolen Keuze: ENGIE Easy Vast (12 Maanden)",
        icon: "ShieldCheck",
        desc: "Met 5.613 kWh gas en 1.535 kWh stroom biedt ENGIE Easy Vast de ideale gemoedsrust voor Jacqueline: 100% vaste prijs voor 12 maanden (geen winterprijsschokken) én een volwaardige telefonische klantendienst."
      },
      {
        title: "2. Geen Lock-in: Opzegbaar op Elk Moment met 3 Weken",
        icon: "ShieldCheck",
        desc: "Hoewel Luminus spreekt over een 'contract van 2 jaar' en een bedenktijd van 1 maand tot 6 december, is een particuliere consument in België NOOIT vastgeketend. Je kan wettelijk op elk moment kosteloos vertrekken met 3 weken opzegtermijn."
      },
      {
        title: "3. Voorschotten-Valkuil: Verhoog naar €125 / maand",
        icon: "AlertTriangle",
        desc: "Door de gestegen groothandelsprijzen kost haar verbruik bij Luminus nu circa €1.485/jaar. Huidig voorschot van €92/mnd (€1.104/jr) zorgt voor een schokfactuur van ~€400 in juni 2027 indien dit niet naar €125/mnd wordt aangepast."
      },
      {
        title: "4. Snelle Sanity Check: Pensioenfiche Nakijken",
        icon: "HeartHandshake",
        desc: "De kans is waarschijnlijk klein dat Jacqueline recht heeft op het sociaal tarief, maar het is verstandig om haar recentste pensioenfiche even te scannen op IGO, GRAPA of Verhoogde Tegemoetkoming (BIM) om dit formeel uit te sluiten."
      }
    ],
    benchmark_table: [
      {
        rank: 1,
        name: "ENGIE Easy Vast (12 Maanden)",
        category: "🏆 Aanbevolen Keuze voor Jacqueline",
        source: "Mijnenergie.be / ENGIE",
        annual_cost_eur: 1368.00,
        monthly_cost_eur: 114.00,
        saving_vs_luminus: 117.00,
        welcome_bonus_eur: 248.00,
        fixed_price: true,
        phone_support: true,
        senior_score: "9.8 / 10",
        details: "100% vaste prijs voor 12 maanden + telefonische helpdesk. Met welkomstkorting €1.368/jr (goedkoper dan Luminus); zonder korting €1.616/jr (~€10/mnd meer dan Luminus als veilige verzekering). Gerekend met echte piek van 2,96 kW."
      },
      {
        rank: 2,
        name: "Luminus BasicFlex Online (Voorstel 11.01.2027)",
        category: "⚠️ Huidig Voorstel Luminus (Niet Aangeraden)",
        source: "Luminus E-mail 06.11.2026",
        annual_cost_eur: 1485.00,
        monthly_cost_eur: 123.75,
        saving_vs_luminus: 0,
        welcome_bonus_eur: 0,
        fixed_price: false,
        phone_support: false,
        senior_score: "4.5 / 10",
        details: "Variabel beurstarief zonder telefonische helpdesk. Voorschot moet direct naar €125/mnd. Wel op elk moment kosteloos opzegbaar met 3 weken termijn."
      },
      {
        rank: 3,
        name: "Sociaal Tarief (CreG / Federale Overheid)",
        category: "🔍 Te Verifiëren via Pensioenfiche",
        source: "Federale Prijsregulering Q4",
        annual_cost_eur: 745.00,
        monthly_cost_eur: 62.08,
        saving_vs_luminus: 740.00,
        welcome_bonus_eur: 0,
        fixed_price: true,
        phone_support: true,
        senior_score: "10 / 10",
        details: "Wettelijk geplafonneerd tarief. Enkel van toepassing indien Jacqueline IGO/GRAPA/BIM ontvangt. Even controleren op haar pensioenfiche om uit te sluiten."
      }
    ]
  },
  contracts: [
    {
      id: 'engie_easy_vast_bomma',
      provider: 'ENGIE',
      name: 'ENGIE Easy Vast (12m)',
      badge: '🏆 Aanbevolen Keuze',
      badge_color: 'emerald',
      type: 'Vast Tarief (1 Jaar)',
      formula_elec: 'Vaste prijs 12m + telefonische support',
      formula_gas: 'Vaste prijs 12m (met welkomstbonus)',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 70,
      elec_cost_eur: 650,
      gas_cost_eur: 718,
      inj_credit_eur: 0,
      net_annual_total_eur: 1368.00,
      delta_vs_current_eur: 117.00,
      delta_pct: 7.9,
      is_recommended: true,
      action_status: 'Aanbevolen Switch (Senioren Vriendelijk)',
      highlight: '100% vaste prijs voor 12 maanden en telefonische helpdesk voor Bomma. €1.368/jr mét eDeal welkomstkorting; €1.616/jr zonder korting (exact berekend op 2,96 kW piek).'
    },
    {
      id: 'luminus_basicflex_proposed',
      provider: 'Luminus',
      name: 'BasicFlex Online (Voorstel 11.01.2027)',
      badge: '⚠️ Huidig Voorstel',
      badge_color: 'rose',
      type: 'Variabel (Altijd 3 wkn opzegbaar)',
      formula_elec: '0,0012353 * Belpex M + 0,03873 (€0,268/kWh)',
      formula_gas: 'TTF variabel + €20 vast',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 45,
      elec_cost_eur: 735,
      gas_cost_eur: 750,
      inj_credit_eur: 0,
      net_annual_total_eur: 1485.00,
      delta_vs_current_eur: 0,
      delta_pct: 0,
      is_current: true,
      action_status: 'Voorschot naar €125/mnd!',
      highlight: 'Geen telefonische helpdesk. Reële jaarkost schommelt rond €1.485. Voorschot moet direct naar €125/mnd om €400 opleg in juni 2027 te vermijden. Geen 2-jaars lock-in: altijd opzegbaar met 3 wkn.'
    },
    {
      id: 'sociaal_tarief_bomma',
      provider: 'Federale Overheid / CREG',
      name: 'Sociaal Tarief (Indien IGO / BIM)',
      badge: '🔍 Check Pensioenfiche',
      badge_color: 'amber',
      type: 'Geplafonneerd Tarief',
      formula_elec: '25,66 - 26,85 c€/kWh (€0 nettarieven)',
      formula_gas: '6,08 c€/kWh (geen toeslagen)',
      inj_rate_c_kwh: 0,
      fixed_fee_annual_eur: 0,
      elec_cost_eur: 405,
      gas_cost_eur: 340,
      inj_credit_eur: 0,
      net_annual_total_eur: 745.00,
      delta_vs_current_eur: 740.00,
      delta_pct: 49.8,
      is_recommended: false,
      action_status: 'Sanity Check: Check Fiche',
      highlight: 'Kans is waarschijnlijk klein, maar als Jacqueline IGO, GRAPA of BIM geniet, zakt haar kost naar €745/jr. Even 1x checken op haar pensioenfiche om uit te sluiten.'
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
      title: "Controleer Sociaal Tarief (IGO/GRAPA/BIM)",
      status: "Prioriteit #1",
      desc: "Kijk Jacqueline haar pensioenfiche of bankrekening na: ontvangt zij IGO, GRAPA of Verhoogde Tegemoetkoming? Zo ja: bezorg het attest aan Luminus (besparing: > €740/jaar, jaarkost wordt €745)."
    },
    {
      step: 2,
      title: "Kies ENGIE Easy Vast (indien geen Sociaal Tarief)",
      status: "Aanbevolen Switch",
      desc: "Biedt vaste prijszekerheid en telefonische ondersteuning voor senior. Vraag telefonisch of via Mijnenergie/Aanbieders.be naar de welkomstkorting (-€248) voor een jaarkost van €1.368."
    },
    {
      step: 3,
      title: "Bij Luminus Blijven? Voorschot naar €125/mnd",
      status: "Onmiddellijke Actie",
      desc: "Huidig voorschot van €92/mnd dekt de huidige marktprijzen niet. Verhoog direct via MyLuminus of telefonisch naar €125/mnd om €400 schokfactuur in juni 2027 te vermijden."
    },
    {
      step: 4,
      title: "Fluvius Mandaat & Naamscorrectie",
      status: "Administratie",
      desc: "Zet Kristof/broers als gemachtigde via mijn.fluvius.be voor EAN 541449206002948378 en 541449206007458049, en corrigeer aanspreektitel naar Mevr. Jacqueline Macours."
    }
  ],
  two_year_comparison: {
    year_2024_2025: {
      period: "01.06.2024 - 31.05.2025",
      elec_kwh: 1519.49,
      gas_kwh: 6105.07,
      total_cost_eur: 1100.12,
      advances_paid_eur: 1144.00,
      settlement_eur: -43.88
    },
    year_2025_2026: {
      period: "01.06.2025 - 31.05.2026",
      elec_kwh: 1535.00,
      gas_kwh: 5613.00,
      total_cost_eur: 1024.70,
      advances_paid_eur: 1098.00,
      settlement_eur: -73.30
    },
    average: {
      elec_kwh: 1527,
      gas_kwh: 5859,
      total_cost_eur: 1062.41
    }
  },
  historical_invoices: [
    { number: "9594167237", date: "09.06.2025", type: "Jaarafrekening", period: "01.06.2024 - 31.05.2025", elec_excl: "511,07", gas_excl: "526,78", total_incl: "−43,88", note: "Verbruikskost €1.100,12 min €1.144 voorschotten = creditnota", is_credit: true },
    { number: "3154123202", date: "28.06.2025", type: "Voorschot", period: "jun 2025", elec_excl: "44,34", gas_excl: "43,40", total_incl: "93,00", note: "Maandvoorschot", is_credit: false },
    { number: "4274187530", date: "28.07.2025", type: "Voorschot", period: "jul 2025", elec_excl: "37,74", gas_excl: "34,91", total_incl: "77,00", note: "Zomervoorschot verlaagd", is_credit: false },
    { number: "6087978774", date: "28.08.2025", type: "Voorschot", period: "aug 2025", elec_excl: "48,11", gas_excl: "44,34", total_incl: "98,00", note: "Maandvoorschot", is_credit: false },
    { number: "3288076118", date: "28.09.2025", type: "Voorschot", period: "sep 2025", elec_excl: "48,11", gas_excl: "44,34", total_incl: "98,00", note: "Maandvoorschot", is_credit: false },
    { number: "4274297932", date: "28.10.2025", type: "Voorschot", period: "okt 2025", elec_excl: "48,11", gas_excl: "44,34", total_incl: "98,00", note: "Maandvoorschot", is_credit: false },
    { number: "4408053995", date: "28.11.2025", type: "Voorschot", period: "nov 2025", elec_excl: "48,11", gas_excl: "44,34", total_incl: "98,00", note: "Maandvoorschot", is_credit: false },
    { number: "8194402167", date: "28.01.2026", type: "Voorschot", period: "jan 2026", elec_excl: "48,11", gas_excl: "44,34", total_incl: "98,00", note: "Wintervoorschot", is_credit: false },
    { number: "3288229298", date: "01.03.2026", type: "Voorschot", period: "feb 2026", elec_excl: "47,17", gas_excl: "33,02", total_incl: "85,00", note: "Voorschot bijgesteld", is_credit: false },
    { number: "8048231045", date: "28.03.2026", type: "Voorschot", period: "mrt 2026", elec_excl: "47,17", gas_excl: "33,02", total_incl: "85,00", note: "Voorschot bijgesteld", is_credit: false },
    { number: "4274482804", date: "28.04.2026", type: "Voorschot", period: "apr 2026", elec_excl: "47,17", gas_excl: "33,02", total_incl: "85,00", note: "Voorschot bijgesteld", is_credit: false },
    { number: "3714451847", date: "28.05.2026", type: "Voorschot", period: "mei 2026", elec_excl: "47,17", gas_excl: "33,02", total_incl: "85,00", note: "Laatste voorschot facturatiejaar", is_credit: false },
    { number: "4688193089", date: "08.06.2026", type: "Jaarafrekening", period: "01.06.2025 - 31.05.2026", elec_excl: "529,26", gas_excl: "437,44", total_incl: "−73,30", note: "Verbruikskost €1.024,70 min €1.098 voorschotten = creditnota", is_credit: true },
    { number: "8754514429", date: "28.06.2026", type: "Voorschot", period: "jun 2026", elec_excl: "44,34", gas_excl: "42,45", total_incl: "92,00", note: "Nieuw voorschot 2026-2027", is_credit: false },
    { number: "7208318486", date: "28.07.2026", type: "Voorschot", period: "jul 2026", elec_excl: "44,34", gas_excl: "42,45", total_incl: "92,00", note: "Voorschot 2026-2027", is_credit: false },
    { number: "4688274939", date: "28.08.2026", type: "Voorschot", period: "aug 2026", elec_excl: "44,34", gas_excl: "42,45", total_incl: "92,00", note: "Voorschot 2026-2027", is_credit: false },
    { number: "8328522443", date: "28.09.2026", type: "Voorschot", period: "sep 2026", elec_excl: "44,34", gas_excl: "42,45", total_incl: "92,00", note: "Voorschot 2026-2027", is_credit: false },
    { number: "4274666658", date: "28.10.2026", type: "Voorschot", period: "okt 2026", elec_excl: "44,34", gas_excl: "42,45", total_incl: "92,00", note: "Meest recent aangerekende voorschot", is_credit: false }
  ]
};
