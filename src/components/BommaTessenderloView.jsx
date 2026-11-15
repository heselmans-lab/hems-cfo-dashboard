'use client';

import React, { useState } from 'react';
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
  Info,
  Crown,
  Copy,
  Check
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

  const [copied, setCopied] = useState(false);

  const handleCopyFamilySummary = () => {
    const text = `*Energieadvies Bomma (Jacqueline Macours - Tessenderlo)*
Weblink: https://bomma.heselmans.com

1. *PRIORITEIT #1: SOCIAAL TARIEF (Besparing > €740/jaar)*
Ontvangt Jacqueline IGO, GRAPA of een verhoogde tegemoetkoming (BIM)? Dan zakt haar totale jaarkost van ~€1.500 naar *slechts ± €745 all-in*!
👉 Actie: Controleer haar recentste pensioenfiche. Staat het niet op haar Luminus-factuur, bezorg dan het attest van de pensioendienst/OCMW aan Luminus.

2. *LUMINUS WIJZIGING (11.01.2027) & JURIDISCHE GERUSTSTELLING*
- Geen paniek: Hoewel Luminus spreekt over een contract van 2 jaar en weigering voor 6 december, is een particulier in België *wettelijk NOOIT vastgeketend*. Ze kan op elk moment kosteloos opzeggen met 3 weken termijn (art. 4.3).
- BasicFlex Online heeft *géén telefonische helpdesk*. Voor Jacqueline (88j) is dat onveilig als wij het niet digitaal beheren.

3. *VOORSCHOT WAARSCHUWING (€92 vs €125)*
Het huidig voorschot van €92/mnd stamt uit de periode met lage beursprijzen. De beursindex is verdubbeld. Blijven op €92/mnd betekent in juni 2027 een *schokfactuur van ~€400 nabetaling*.
👉 Actie indien bij Luminus: Voorschot per direct optrekken naar €125/mnd!

4. *COMMERCIËLE KEUZE (indien geen Sociaal Tarief)*
*ENGIE Easy Vast (12m)*: Vaste prijsgarantie + telefonische klantendienst.
- Mét eDeal welkomstkorting: ~€1.368/jr (goedkoper dan Luminus!).
- Zonder korting: ~€1.616/jr (~€10/mnd verzekeringspremie tegen winterpieken).

Bekijk het volledige dossier en meterhistoriek op: https://bomma.heselmans.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

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
            <div className="mt-2 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/40">
              ⚠️ Reële energiekost nu ~€125/mnd!
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR VOOR DE BROERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>Familiedossier Jacqueline Macours voor Kristof, Alain en Francis</span>
        </div>
        <button
          onClick={handleCopyFamilySummary}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Samenvatting Gekopieerd!' : 'Kopieer Familiebericht voor WhatsApp'}</span>
        </button>
      </div>

      {/* PRIORITEIT #1: SOCIAAL TARIEF CHECK */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-amber-950/40 border-2 border-amber-500/60 p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Prioriteit #1 voor de Familie: Controleer het Sociaal Tarief
              </h3>
              <p className="text-xs text-amber-200">
                Mogelijke besparing van ruim <strong className="text-white font-bold">&gt; € 740 per jaar</strong> (jaarkost zakt naar ± € 745 all-in voor stroom én gas).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
            Hoogste Besparingshefboom
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-1.5">
            <span className="font-bold text-amber-300 block">1. Wie Heeft Recht?</span>
            <p className="text-slate-300 leading-relaxed">
              Senioren die een <strong>IGO</strong> (Inkomensgarantie voor Ouderen), <strong>GRAPA</strong> of een <strong>Verhoogde Tegemoetkoming (BIM)</strong> ontvangen via de Federale Pensioendienst of het ziekenfonds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-1.5">
            <span className="font-bold text-amber-300 block">2. Hoe Controleren (Alain / Francis / Kristof)?</span>
            <p className="text-slate-300 leading-relaxed">
              Kijk Jacqueline haar recentste <strong>pensioenfiche</strong> of bankrekening na op de vermelding &apos;IGO&apos;, &apos;GRAPA&apos; of een specifieke toeslag. Kijk ook of er op de huidige Luminus-factuur al &apos;Sociaal Tarief&apos; vermeld staat.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-1.5">
            <span className="font-bold text-amber-300 block">3. Hoe Activeren?</span>
            <p className="text-slate-300 leading-relaxed">
              Staat het niet op de factuur maar geniet ze wel een statuut? Vraag het attest op via <em>MyPension.be</em> of het OCMW/Pensioendienst en bezorg het aan Luminus. Toekenning gebeurt per kwartaal.
            </p>
          </div>
        </div>
      </div>

      {/* 2. LUMINUS WIJZIGING 11.01.2027 REALITY CHECK */}
      <div className="rounded-2xl bg-rose-950/30 border border-rose-600/40 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-800/40">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Aangekondigde Wijziging Luminus per 11.01.2027: Feiten &amp; Geruststelling
            </h3>
            <p className="text-xs text-rose-200">
              Luminus kondigt een omzetting naar 2 jaar aan. Hier zijn de feiten, de risico&apos;s en de wettelijke consumentenbescherming.
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
              <strong>Geen telefonisch contact mogelijk.</strong> Jacqueline (88j) kan bij vragen of problemen niet bellen en moet alles via MyLuminus regelen. Onveilig zonder familiebeheer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Wettelijk Géén Lock-in!
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Luminus spreekt over &apos;2 jaar vast&apos;, maar de wet beschermt consumenten: zij kan op <strong>elk moment kosteloos vertrekken met 3 weken opzegtermijn</strong> (art. 4.3). Geen paniek voor 6 december!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Voorschot-Valkuil: Opleg Dreigt
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Door de gestegen gas/stroombeurs kost het contract nu ~€1.485/jr. Blijven op €92/mnd stuurt aan op <strong>~€400 nabetaling in juni 2027</strong>! Verhoog direct naar €125/mnd.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <Flame className="w-4 h-4 text-rose-400" />
              Variabel Beurstarief
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nieuwe formule volgt Belpex M / TTF. Piekstroom stijgt naar <strong>€0,268/kWh</strong>. Risico op fors hogere facturen bij strenge vrieskoude.
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
            const isAmber = c.badge_color === 'amber';
            const isEmerald = c.badge_color === 'emerald';
            const isRose = c.badge_color === 'rose';

            let cardBg = 'bg-slate-950/60 border border-slate-800';
            let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
            let buttonBg = 'bg-slate-800/80 text-slate-400 border-slate-700';

            if (isAmber) {
              cardBg = 'bg-gradient-to-b from-amber-950/60 to-slate-950 border-2 border-amber-500/70 shadow-2xl shadow-amber-950/40';
              badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
              buttonBg = 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 cursor-pointer shadow-lg shadow-amber-950/40';
            } else if (isEmerald) {
              cardBg = 'bg-gradient-to-b from-emerald-950/60 to-slate-950 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40';
              badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              buttonBg = 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 cursor-pointer shadow-lg shadow-emerald-950/40';
            } else if (isRose) {
              cardBg = 'bg-slate-950/60 border border-rose-900/60';
              badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              buttonBg = 'bg-slate-800 text-amber-300 border-amber-500/40';
            }

            return (
              <div 
                key={c.id}
                className={`rounded-2xl p-6 transition relative flex flex-col justify-between ${cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
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
                      <span className={`text-2xl font-black ${isAmber ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-slate-100'}`}>
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
                  <span className={`block text-center text-xs font-bold py-2 rounded-xl border ${buttonBg}`}>
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
              Belangrijke Geruststelling voor Jacqueline &amp; Familie: De Voorschotten bij ENGIE
            </h4>
            <p>
              In het gedownloade voorstel van ENGIE staat een voorschot van <strong>€ 114,02 per maand</strong>. 
              Dit kan schrikken zijn omdat ze nu € 92 betaalt. Maar: ENGIE hanteert een conservatieve veiligheidsbuffer en verrekent de eDeal welkomstkorting van <strong>- € 248 pas op de jaarafrekening</strong>.
            </p>
            <p className="text-indigo-300">
              👉 <strong>Netto werkelijkheid:</strong> Met welkomstkorting kost ENGIE haar circa <strong>€ 1.368/jaar</strong> (goedkoper dan Luminus). Zonder welkomstkorting is het € 1.616/jaar (~€ 10/mnd meer dan Luminus, maar als veilige verzekering met telefonische helpdesk).
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
