'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ExternalLink, 
  Zap, 
  Flame, 
  TrendingDown, 
  FileText, 
  Calendar,
  Lock,
  HeartHandshake,
  DollarSign,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export default function BommaTessenderloView({ data }) {
  const { site_info, profile, market, monthly_history, action_plan, historical_invoices, two_year_comparison } = data;
  const currentContract = market?.current_contract;
  const proposedRenewal = market?.proposed_renewal;
  const contracts = market?.contracts || [];
  const audit = market?.mijnenergie_audit;

  return (
    <div className="space-y-6">

      {/* 1. HERO SITE BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-indigo-950/60 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Building2 className="w-4 h-4 text-amber-400" />
              Locatieprofiel: Bomma Tessenderlo (Jacqueline Macours, 88j)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Vismarkt 18 bus 2, 3980 Tessenderlo-Ham
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Appartement met individuele HR-gasketel en digitale elektriciteits- en gasmeters bij <strong>Fluvius Limburg</strong>. 
              Jaarverbruik: <strong className="text-white">1.535 kWh stroom</strong> (822 dag / 713 nacht) en <strong className="text-white">5.613 kWh gas</strong> (~492 m³). Geen zonnepanelen, capaciteitspiek stabiel rond <strong className="text-white">2,96 kW</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 font-mono">
                EAN Stroom: 541449206002948378
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 font-mono">
                EAN Gas: 541449206007458049
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60">
                Klantnr Luminus: 12-11014-66
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60">
                Rekening: BE63 7330 5004 9808
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center gap-2 min-w-[240px] shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Huidig Voorschot</span>
            <div className="text-4xl font-black text-amber-400">
              €92,- <span className="text-lg font-normal text-slate-400">/ mnd</span>
            </div>
            <span className="text-xs text-slate-300">
              (€47 stroom + €45 gas bij Luminus)
            </span>
            <div className="mt-2 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
              Vorige Afrekening: €73,30 tegoed ontvangen
            </div>
          </div>
        </div>
      </div>

      {/* 2. LUMINUS WIJZIGING 11.01.2027 ALARM */}
      <div className="rounded-2xl bg-rose-950/30 border border-rose-600/40 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-800/40">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Aangekondigde Wijziging Luminus per 11.01.2027: Risico voor Senior
            </h3>
            <p className="text-xs text-rose-200">
              Luminus zet het huidige contract van onbepaalde duur eenzijdig om naar een 2-jarig vastgeketend contract (bepaalde duur tot 11.01.2029).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              100% Digitaal Product
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Geen telefonisch contact mogelijk.</strong> Jacqueline (88j) kan bij vragen of problemen niet bellen en moet alles via MyLuminus regelen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <Lock className="w-4 h-4 text-rose-400" />
              2 Jaar Vastgeketend
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Het contract wordt omgezet naar <strong>bepaalde duur tot 11.01.2029</strong>. Zonder tijdige opzegging zit ze 24 maanden vast aan hun voorwaarden.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Vaste Vergoeding Stijgt
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vaste beheerskost stijgt van €21,20 naar <strong>€25,00/jr</strong> (+18%) voor stroom en van €15,90 naar <strong>€20,00/jr</strong> (+26%) voor gas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <Flame className="w-4 h-4 text-rose-400" />
              Variabel Marktrisico
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nieuwe formule (Belpex M / TTF) volgt maandelijkse marktprijzen. Piekstroom stijgt direct naar <strong>€0,268/kWh</strong> (+12,4%).
            </p>
          </div>
        </div>
      </div>

      {/* 3. SENIOREN KEUZEMATRIX */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">
                HEMS Keuzematrix voor Jacqueline (88j)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Aanbevolen Strategie
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vergelijking op basis van budgetzekerheid, prijsgarantie en beschikbaarheid van een telefonische klantendienst.
            </p>
          </div>
          <Link
            href="/advies"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shrink-0"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Open Senior Wizard (Grote Letters)</span>
          </Link>
        </div>

        {/* Contract Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contracts.map((c) => {
            const isTop = c.is_recommended;
            return (
              <div 
                key={c.id}
                className={`rounded-2xl p-6 transition relative flex flex-col justify-between ${
                  isTop 
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-950 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40' 
                    : 'bg-slate-950/60 border border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      isTop 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {c.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {c.type}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-white mb-1">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Leverancier: <strong className="text-slate-200">{c.provider}</strong>
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-4 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">Netto Jaarkost:</span>
                      <span className={`text-2xl font-black ${isTop ? 'text-emerald-400' : 'text-slate-100'}`}>
                        €{c.net_annual_total_eur}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-400">Netto per Maand:</span>
                      <strong className="text-slate-200">
                        ~€{Math.round(c.net_annual_total_eur / 12)} / mnd
                      </strong>
                    </div>
                    {c.delta_vs_current_eur > 0 && (
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-emerald-400">
                        <span>Besparing vs Luminus:</span>
                        <span>+€{c.delta_vs_current_eur}/jaar</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-6">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{c.formula_elec}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{c.formula_gas}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
                      {c.highlight}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className={`block text-center text-xs font-bold py-2 rounded-xl border ${
                    isTop 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 cursor-pointer shadow-lg shadow-emerald-950/40' 
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}>
                    {c.action_status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. REALITY CHECK: €114 VS €70 VOORSCHOT VERKLARING */}
        <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-sm font-bold text-indigo-200">
              Belangrijke Geruststelling voor Jacqueline: Waarom toont de ENGIE simulatie € 114 / maand?
            </h4>
            <p>
              In het gedownloade voorstel van ENGIE staat een voorschot van <strong>€ 114,02 per maand</strong>. 
              Dit kan schrikken zijn omdat ze nu € 92 betaalt. Maar: ENGIE hanteert een conservatieve veiligheidsbuffer en verrekent de welkomstkorting van <strong>- € 356,95 pas op de jaarafrekening</strong>.
            </p>
            <p className="text-indigo-300">
              👉 <strong>Netto werkelijkheid:</strong> Over het hele jaar kost ENGIE haar slechts <strong>~€ 70 per maand</strong>. Het verschil van € 44/mnd krijgt ze na 1 jaar in één keer teruggestort op haar rekening.
            </p>
          </div>
        </div>
      </div>

      {/* 5. MAANDELIJKSE FACTUURHISTORIEK GRAFIEK */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Werkelijk Verbruik per Maand (Luminus Afrekening 2025 - 2026)
              </h3>
              <p className="text-xs text-slate-400">
                12 maanden officiële meteropnames van meter 1SAG1100790045 (stroom) en 7FLO2123132985 (gas)
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Totaal: 1.535 kWh stroom · 5.613 kWh gas
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val, name) => [
                  `${val} ${name === 'Aardgas (kWh)' ? 'kWh' : name === 'Elektriciteit (kWh)' ? 'kWh' : 'kW'}`, 
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="elec_kwh" name="Elektriciteit (kWh)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="gas_kwh" name="Aardgas (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Piek Elektriciteit</span>
            <span className="text-lg font-black text-indigo-400">822 kWh</span>
            <span className="text-[10px] text-slate-500 block">Dagtarief</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Dal Elektriciteit</span>
            <span className="text-lg font-black text-indigo-400">713 kWh</span>
            <span className="text-[10px] text-slate-500 block">Nacht/Weekend</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Aardgas Totaal</span>
            <span className="text-lg font-black text-amber-400">5.613 kWh</span>
            <span className="text-[10px] text-slate-500 block">492,12 m³ (factor 11,4)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Capaciteitspiek</span>
            <span className="text-lg font-black text-emerald-400">2,96 kW</span>
            <span className="text-[10px] text-slate-500 block">Dichtbij minimum 2,5 kW</span>
          </div>
        </div>

        {/* 2-Year Jaarafsluiting Vergelijking */}
        {two_year_comparison && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              2-Jarige Jaarafrekeningen Vergelijking (2024-2025 vs 2025-2026)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold block">Jaar 1 (01.06.2024 - 31.05.2025)</span>
                <div className="text-slate-300">Stroom: <strong>{two_year_comparison.year_2024_2025.elec_kwh} kWh</strong></div>
                <div className="text-slate-300">Aardgas: <strong>{two_year_comparison.year_2024_2025.gas_kwh} kWh</strong></div>
                <div className="text-slate-300">Totale Jaarkost: <strong>€{two_year_comparison.year_2024_2025.total_cost_eur}</strong></div>
                <div className="text-emerald-400 font-bold">Creditnota: €{Math.abs(two_year_comparison.year_2024_2025.settlement_eur)} tegoed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">Jaar 2 (01.06.2025 - 31.05.2026)</span>
                <div className="text-slate-300">Stroom: <strong>{two_year_comparison.year_2025_2026.elec_kwh} kWh</strong></div>
                <div className="text-slate-300">Aardgas: <strong>{two_year_comparison.year_2025_2026.gas_kwh} kWh</strong></div>
                <div className="text-slate-300">Totale Jaarkost: <strong>€{two_year_comparison.year_2025_2026.total_cost_eur}</strong></div>
                <div className="text-emerald-400 font-bold">Creditnota: €{Math.abs(two_year_comparison.year_2025_2026.settlement_eur)} tegoed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                <span className="text-white font-bold block">2-Jarig Gemiddeld Referentieprofiel</span>
                <div className="text-slate-300">Gem. Stroom: <strong className="text-white">{two_year_comparison.average.elec_kwh} kWh/jr</strong></div>
                <div className="text-slate-300">Gem. Aardgas: <strong className="text-white">{two_year_comparison.average.gas_kwh} kWh/jr</strong></div>
                <div className="text-slate-300">Gem. Jaarkost: <strong className="text-emerald-300">€{two_year_comparison.average.total_cost_eur}/jr</strong></div>
                <div className="text-slate-400 text-[11px] pt-1">Zeer stabiel seniorenverbruik (verschil &lt; 1% op stroom)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. VOLLEDIGE FACTURENHISTORIEK & VOORSCHOTTEN REGISTER (18 FACTUREN) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Facturen- & Voorschottenregister (18 Geverifieerde Luminus Documenten)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Volledig overzicht van alle voorschotfacturen en jaarafrekeningen uit het archief (2024 - 2026).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            18 Facturen Geverifieerd
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Datum</th>
                <th className="py-2.5 px-3">Type Document</th>
                <th className="py-2.5 px-3">Factuurnummer</th>
                <th className="py-2.5 px-3">Periode</th>
                <th className="py-2.5 px-3 text-right">Stroom (excl)</th>
                <th className="py-2.5 px-3 text-right">Gas (excl)</th>
                <th className="py-2.5 px-3 text-right">Totaal (incl. BTW)</th>
                <th className="py-2.5 px-3">Toelichting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {historical_invoices?.map((inv) => (
                <tr 
                  key={inv.number + inv.date} 
                  className={`hover:bg-slate-800/40 transition ${inv.is_credit ? 'bg-emerald-950/20 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 text-slate-200">{inv.date}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                      inv.is_credit 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{inv.number}</td>
                  <td className="py-2 px-3 font-sans text-slate-300">{inv.period}</td>
                  <td className="py-2 px-3 text-right">€{inv.elec_excl}</td>
                  <td className="py-2 px-3 text-right">€{inv.gas_excl}</td>
                  <td className={`py-2 px-3 text-right font-bold ${
                    inv.is_credit ? 'text-emerald-400 text-sm' : 'text-white'
                  }`}>
                    {inv.total_incl} €
                  </td>
                  <td className="py-2 px-3 font-sans text-[11px] text-slate-400">{inv.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. ACTIEPLAN & MANDAAT */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Stappenplan & Administratieve Taken
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {action_plan?.map((a) => (
            <div key={a.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {a.step}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {a.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {a.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
