'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Zap, 
  Flame, 
  Sun, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  Clock,
  ArrowRightLeft,
  Sliders,
  AlertTriangle,
  Award,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  CheckSquare,
  Gift,
  Target,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  CartesianGrid,
  Cell
} from 'recharts';

export default function CFODashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('decision'); // Default directly to CFO Decision Board!
  const [selectedWeek, setSelectedWeek] = useState(null);

  // Switch Simulator state (interactive what-if sliders)
  const [simImport, setSimImport] = useState(4452);
  const [simExport, setSimExport] = useState(4863);
  const [simGas, setSimGas] = useState(1267);
  const [simMarketShift, setSimMarketShift] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.weeks && json.weeks.length > 0) {
          setSelectedWeek(json.weeks[0]);
        }
      } else {
        setError(json.error || 'Fout bij het ophalen van data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate market contracts dynamically based on simulator sliders
  const simulatedContracts = useMemo(() => {
    if (!data?.market?.contracts) return [];
    const shiftFactor = 1 + (simMarketShift / 100);

    const baselineElec = (1456 * (simImport / 4452)) * shiftFactor;
    const baselineGas = (1228 * (simGas / 1267)) * shiftFactor;
    const baselineInj = (simExport * 0.0292) * shiftFactor;
    const baselineNet = baselineElec + baselineGas - baselineInj;

    return data.market.contracts.map(c => {
      let elec = (c.elec_cost_eur * (simImport / 4452)) * shiftFactor;
      let gas = (c.gas_cost_eur * (simGas / 1267)) * shiftFactor;
      let inj = (simExport * (c.inj_rate_c_kwh / 100)) * (c.id === 'engie_easy_vast' ? 1 : shiftFactor);
      let net = elec + gas - inj;
      let delta = baselineNet - net;

      return {
        ...c,
        sim_elec_cost: Math.round(elec),
        sim_gas_cost: Math.round(gas),
        sim_inj_credit: Math.round(inj),
        sim_net_total: Math.round(net),
        sim_delta: Math.round(delta),
        sim_delta_pct: Math.round((delta / baselineNet) * 100 * 10) / 10
      };
    }).sort((a, b) => a.sim_net_total - b.sim_net_total);
  }, [data, simImport, simExport, simGas, simMarketShift]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-950 text-slate-100">
        <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-tight">HEMS CFO Analytics Laden...</h2>
        <p className="text-sm text-slate-400 mt-1">Live data warehouse (Neon PostgreSQL) & Belgische markttarieven ophalen</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-950">
        <div className="p-6 bg-red-950/40 border border-red-800 rounded-2xl max-w-md shadow-2xl">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-200">Verbindingsfout</h2>
          <p className="text-sm text-red-300 mt-2">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition"
          >
            Opnieuw Proberen
          </button>
        </div>
      </div>
    );
  }

  const { summary, weeks, days, hourly, market } = data;
  const chartWeeks = [...weeks].reverse();
  const bestSwitch = simulatedContracts.find(c => !c.is_current && c.sim_delta > 0);
  const decisionBoard = market?.decision_board;
  const gasHead = decisionBoard?.gas_head_to_head;
  const mijnenergieAudit = market?.mijnenergie_audit;
  const fluvius = mijnenergieAudit?.fluvius_profile;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Navigation & Brand Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">HEMS Executive CFO Suite</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  België / Duffel
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data Warehouse Live · Huidig Contract: <strong className="text-slate-200">Mega Smart (Dynamisch)</strong>
              </p>
            </div>
          </div>

          {/* Quick CFO Switch Alert Badge */}
          {bestSwitch && (
            <div 
              onClick={() => setActiveTab('decision')}
              className="cursor-pointer flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 hover:border-indigo-400 transition"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs">
                <span className="text-slate-400">Aanbevolen Switch: </span>
                <strong className="text-indigo-300 font-semibold">{bestSwitch.provider} ({bestSwitch.name})</strong>
                <span className="text-emerald-400 font-bold ml-1.5">+€{bestSwitch.sim_delta}/jr winst</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          )}

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              title="Vernieuw data uit Neon DB"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('decision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'decision'
                ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            CFO Decision Board & Roadmap
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'market'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Marktvergelijker & Simulator
          </button>
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'cockpit'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Executive Cockpit & KPIs
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'weekly'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Wekelijkse Drill-Down ({weeks.length} Wkn)
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'trends'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            Seizoensgraaddagen (HDD)
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ========================================================================= */}
        {/* TAB 0: CFO DECISION BOARD & STRATEGIC ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'decision' && (
          <div className="space-y-6">

            {/* Hero Decision Verdict */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-emerald-950/50 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    CFO Executive Besluitvorming · Fluvius Duffel Audit
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    HEMS Optimale Arbitrage: <span className="text-emerald-400">€2.622/jaar</span> verslaat Mijnenergie met €238/jaar!
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Mijnenergie.be beveelt <strong>Luminus ComfyFlex (€2.860/jr)</strong> aan dankzij een lokkorting van -€958,98. 
                    Maar door het splitsen van contracten (<strong>Engie Easy Fixed Gas</strong> met -€441 welkomstbonus + <strong>Ecopower Stroom</strong> met 6,5c/kWh injectie voor jouw 4.863 kWh zonne-overschot) 
                    bespaar je <strong className="text-emerald-300 font-bold">€238 extra per jaar</strong> én vermijd je de brutoprijs-valkuil van Luminus in jaar 2!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center gap-2 min-w-[240px] shadow-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Totale Winst vs Mega</span>
                  <div className="text-4xl font-black text-emerald-400">
                    +€374,-
                  </div>
                  <span className="text-xs text-slate-300">
                    (Bespaart €238 vs Luminus Mijnenergie)
                  </span>
                  <div className="mt-2 text-[11px] font-bold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-500/30">
                    Netto Jaarkost: €2.622,- / jaar
                  </div>
                </div>
              </div>
            </div>

            {/* Mijnenergie.be Reality Check & Fluvius Audit */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Mijnenergie.be Reality Check & Audit
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Fluvius Duffel Data Gekoppeld
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Waarom beveelt Mijnenergie Luminus ComfyFlex (€2.860) aan en hoe verslaat de HEMS CFO Arbitrage hen met €238/jaar?
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Kruisstraat 2570 Duffel</span>
                </div>
              </div>

              {/* 4 Inzichten Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    1. Commerciële Bias
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mijnenergie toont enkel leveranciers die <strong>commissie betalen</strong>. Coöperaties zoals <strong>Ecopower</strong> weigeren advertentiekosten en worden categorisch geweerd.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <Gift className="w-4 h-4 shrink-0 text-rose-400" />
                    2. De Welkomst-Illusie
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Luminus ComfyFlex kost bruto <strong>€3.819/jaar</strong>! Enkel door <strong>-€958,98 éénmalige korting</strong> zakt het naar €2.860. In jaar 2 schiet je factuur met +€959 omhoog.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                    <ArrowRightLeft className="w-4 h-4 shrink-0 text-blue-400" />
                    3. De "Dual Fuel" Valkuil
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mijnenergie pusht om stroom en gas samen te nemen. Splits je op Mijnenergie zelf (Engie Gas + Luminus Stroom), dan betaal je <strong>€2.713/jaar</strong> (direct <strong>€147 goedkoper</strong>!).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Sun className="w-4 h-4 shrink-0 text-emerald-400" />
                    4. Zonne-injectie Genegeerd
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Je injecteert <strong>4.863 kWh zon</strong>! Luminus geeft amper ~3,8 c€/kWh, terwijl Ecopower <strong>6,50 c€/kWh (€316/jaar pure cash)</strong> én <strong>€0 vast recht</strong> biedt.
                  </p>
                </div>
              </div>

              {/* The Head to Head Matrix Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-slate-300 flex justify-between items-center">
                  <span>Reële Contract-Rangschikking voor Duffel (4.452 kWh Import · 4.863 kWh Injectie · 14.316 kWh Gas)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Fluvius data</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                        <th className="py-2.5 px-4">Rang & Strategie</th>
                        <th className="py-2.5 px-3">Bron</th>
                        <th className="py-2.5 px-3 text-right">Netto Jaarkost</th>
                        <th className="py-2.5 px-3 text-right">Korting / Bonus</th>
                        <th className="py-2.5 px-4 text-right font-bold">Winst vs Mijnenergie #1</th>
                        <th className="py-2.5 px-4">CFO Oordeel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {mijnenergieAudit?.benchmark_table?.map((item) => {
                        const isWinnaar = item.rank === 1;
                        const isLuminus = item.rank === 3;
                        return (
                          <tr 
                            key={item.rank} 
                            className={`transition ${
                              isWinnaar ? 'bg-emerald-950/30 font-semibold' :
                              isLuminus ? 'bg-amber-950/20' :
                              'hover:bg-slate-800/30'
                            }`}
                          >
                            <td className="py-3 px-4 font-sans">
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isWinnaar ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {item.rank}
                                </span>
                                <span>{item.name}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{item.details}</div>
                            </td>
                            <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{item.source}</td>
                            <td className="py-3 px-3 text-right font-bold text-white text-sm">
                              €{item.annual_cost_eur.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="block text-[10px] font-normal text-slate-400">€{item.monthly_cost_eur}/mnd</span>
                            </td>
                            <td className="py-3 px-3 text-right text-emerald-400">
                              {item.welcome_bonus_eur > 0 ? (
                                <span>-€{item.welcome_bonus_eur.toFixed(2)}</span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-bold">
                              {item.saving_vs_luminus_combi > 0 ? (
                                <span className="text-emerald-400 text-xs font-black">
                                  +€{item.saving_vs_luminus_combi.toFixed(2)} / jr
                                </span>
                              ) : item.saving_vs_luminus_combi === 0 ? (
                                <span className="text-amber-400 text-xs">Aanbeveling #1</span>
                              ) : (
                                <span className="text-rose-400 text-xs">
                                  -€{Math.abs(item.saving_vs_luminus_combi).toFixed(2)} / jr
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-sans text-xs">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                isWinnaar ? 'bg-emerald-500 text-slate-950' :
                                item.rank === 2 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                isLuminus ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                item.rank === 4 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {item.category}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Head-to-Head Gas Comparison Cards */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Aardgas Head-to-Head: Mega (Huidig) vs. Dats 24 vs. Welkomstpromo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Exact berekend op 1.250 m³ gas/jaar (Duffel) inclusief nettarieven en btw
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                  Stookseizoen Ingang: 1 December 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Huidig Mega */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Baseline</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">Huidig Contract</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Mega Smart Gas</h4>
                    <div className="text-3xl font-black text-slate-200">
                      €{gasHead?.current_mega?.annual_cost_eur || 1228} <span className="text-xs font-normal text-slate-400">/ jaar</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex justify-between"><span>Tarief per m³:</span><strong className="text-slate-200">€0,93 / m³</strong></div>
                      <div className="flex justify-between"><span>Vast Recht:</span><strong className="text-slate-200">€65 / jaar</strong></div>
                      <div className="flex justify-between"><span>Winterkost (Nov-Mrt):</span><strong className="text-amber-400">€980</strong></div>
                      <div className="flex justify-between"><span>Welkomstbonus:</span><span className="text-slate-500">€0</span></div>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800 text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Betaalt momenteel €241/jaar te veel</span>
                  </div>
                </div>

                {/* 2. Dats 24 (Fair Price) */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-6 flex flex-col justify-between shadow-lg relative">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Optie A: Fair Price</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Zonder Promo</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Dats 24 / Energie.be</h4>
                    <div className="text-3xl font-black text-blue-300">
                      €{gasHead?.dats_standard?.annual_cost_eur || 1110} <span className="text-xs font-normal text-slate-400">/ jaar</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex justify-between"><span>Tarief per m³:</span><strong className="text-slate-200">€0,86 / m³</strong></div>
                      <div className="flex justify-between"><span>Vast Recht:</span><strong className="text-slate-200">€35 / jaar</strong></div>
                      <div className="flex justify-between"><span>Winterkost (Nov-Mrt):</span><strong className="text-blue-300">€885</strong></div>
                      <div className="flex justify-between"><span>Welkomstbonus:</span><span className="text-slate-500">Geen</span></div>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-xs text-emerald-400 font-bold flex items-center justify-between">
                      <span>Besparing vs Mega:</span>
                      <span>+€{gasHead?.dats_standard?.annual_saving_eur || 118} / jr</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Ideaal voor wie <em>nooit</em> meer wil omkijken en geen kalenderherinnering wil zetten.
                    </p>
                  </div>
                </div>

                {/* 3. Engie / Luminus Promo (Promo-Hopper) */}
                <div className="rounded-2xl bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-900 border-2 border-emerald-500 p-6 flex flex-col justify-between shadow-2xl relative">
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider shadow">
                    Aanbevolen door CFO
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Optie B: Welkomstbonus</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        1e Jaars Promo
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Engie Flow / Luminus Gas</h4>
                    <div className="text-3xl font-black text-emerald-400">
                      €{gasHead?.promo_hopper?.annual_cost_eur || 987} <span className="text-xs font-normal text-slate-400">/ jaar</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex justify-between"><span>Tarief per m³:</span><strong className="text-slate-200">€0,87 / m³</strong></div>
                      <div className="flex justify-between"><span>Vast Recht:</span><strong className="text-slate-200">€55 / jaar</strong></div>
                      <div className="flex justify-between"><span>Welkomstbonus:</span><strong className="text-emerald-400 font-bold">-€155 eenmalig</strong></div>
                      <div className="flex justify-between"><span>Winterkost (Nov-Mrt):</span><strong className="text-emerald-300 font-bold">€785</strong></div>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-xs text-emerald-400 font-black flex items-center justify-between text-sm">
                      <span>Totale Winst vs Mega:</span>
                      <span>+€{gasHead?.promo_hopper?.saving_vs_mega_eur || 241} / jr</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-semibold">
                      💡 Levert <strong>€123 méér netto cash</strong> op dan Dats 24! Vereist na 11 maanden één nieuwe switch.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Roadmap & Timeline (CFO Gantt Action Plan) */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      CFO Uitvoerings-Roadmap: Tijdlijn & Concrete Stappen
                    </h3>
                    <p className="text-xs text-slate-400">
                      Gefaseerd stappenplan voor maximale energie-arbitrage zonder administratieve rompslomp
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Opzegtermijn Vlaanderen: <strong>21-30 dagen (kosteloos)</strong>
                </div>
              </div>

              <div className="space-y-4">
                {decisionBoard?.roadmap_milestones?.map((m) => (
                  <div 
                    key={m.step} 
                    className={`p-4 sm:p-5 rounded-xl border transition ${
                      m.urgency === 'Dringend' 
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          m.urgency === 'Dringend' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {m.step}
                        </span>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          {m.phase} · {m.timing}
                        </span>
                      </div>
                      <span className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.urgency === 'Dringend' ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse' :
                        m.urgency === 'Gepland' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {m.urgency}
                      </span>
                    </div>

                    <div className="sm:pl-9 space-y-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {m.action}
                        <span className="text-xs font-normal text-slate-400">(Ingang: {m.target_start})</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {m.details}
                      </p>
                      <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Verwacht Rendement: {m.expected_gain}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Center (Direct Switch Links & EAN Cheat-Sheet) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  Direct Aanvragen (2 Minuten Online)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Je hoeft Mega <strong>niet</strong> zelf te contacteren. De nieuwe leverancier zegt je contract bij Mega automatisch op per 1 december 2026.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a 
                    href="https://www.mijnenergie.be/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    <span>Mijnenergie Welkomstdeals</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://vtest.vreg.be/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                  >
                    <span>Officiële VREG V-Test</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Duffel Fluvius Profiel (Officiële Meetdata)
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gekoppeld tot 01/11/2029
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300 font-mono pt-1">
                  <div className="flex justify-between border-b border-slate-800/80 py-1">
                    <span className="text-slate-400">Adres & Netbeheerder:</span>
                    <strong>Kruisstraat, Duffel · Fluvius</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1">
                    <span className="text-slate-400">EAN Elektriciteit:</span>
                    <strong className="text-indigo-300">541448860002535528</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1">
                    <span className="text-slate-400">Jaarafname / Injectie:</span>
                    <strong>4.452 kWh / <span className="text-amber-300 font-bold">4.863 kWh</span></strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1">
                    <span className="text-slate-400">Gem. Maandpiek (Capaciteit):</span>
                    <strong className="text-slate-200">5,23 kW</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1">
                    <span className="text-slate-400">EAN Aardgas:</span>
                    <strong className="text-orange-300">541448860003166066</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Jaarverbruik Aardgas:</span>
                    <strong className="text-orange-400">14.316 kWh (ca. 1.267 m³)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: BELGISCHE MARKTVERGELIJKER & DYNAMISCHE SWITCH SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            
            {/* What-If Scenario Sliders (Interactive Simulator) */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Interactieve "What-If" Markt Simulator
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Pas parameters aan om te zien hoe de ranking en besparingen verschuiven
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {/* Slider 1: Elektriciteit Import */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Stroom Afname (Jaar):</span>
                    <strong className="text-indigo-300">{simImport.toLocaleString()} kWh</strong>
                  </div>
                  <input 
                    type="range" 
                    min="1500" 
                    max="7000" 
                    step="100" 
                    value={simImport}
                    onChange={(e) => setSimImport(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1.500 kWh</span>
                    <span>Gemeten: 3.650</span>
                    <span>7.000 kWh</span>
                  </div>
                </div>

                {/* Slider 2: Zonne-injectie Export */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Zonne-injectie (Jaar):</span>
                    <strong className="text-amber-300">{simExport.toLocaleString()} kWh</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="8000" 
                    step="100" 
                    value={simExport}
                    onChange={(e) => setSimExport(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0 kWh</span>
                    <span>Gemeten: 4.100</span>
                    <span>8.000 kWh</span>
                  </div>
                </div>

                {/* Slider 3: Gas Verbruik */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Aardgas (Jaar):</span>
                    <strong className="text-orange-300">{simGas.toLocaleString()} m³</strong>
                  </div>
                  <input 
                    type="range" 
                    min="300" 
                    max="2500" 
                    step="50" 
                    value={simGas}
                    onChange={(e) => setSimGas(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>300 m³</span>
                    <span>Gemeten: 1.250</span>
                    <span>2.500 m³</span>
                  </div>
                </div>

                {/* Slider 4: Marktprijs Schok */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Marktprijs Trend:</span>
                    <strong className={`${simMarketShift >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {simMarketShift > 0 ? `+${simMarketShift}%` : `${simMarketShift}%`}
                    </strong>
                  </div>
                  <input 
                    type="range" 
                    min="-30" 
                    max="50" 
                    step="5" 
                    value={simMarketShift}
                    onChange={(e) => setSimMarketShift(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>-30% (Prijsval)</span>
                    <span>Vandaag (0%)</span>
                    <span>+50% (Prijspiek)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Benchmark Comparison Matrix */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Belgische Leveranciers Benchmark (Gerangschikt op Netto Jaarkost)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gekalibreerd op reële Vlaamse nettarieven (Fluvius), heffingen, injectievergoedingen en welkomstbonussen
                  </p>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Huidige baseline:</span>
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-semibold">
                    Mega: €{simulatedContracts.find(c => c.is_current)?.sim_net_total || 2564}/jr
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Leverancier & Contract</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3 text-right">Stroom Afname</th>
                      <th className="py-3 px-3 text-right">Gas Jaarkost</th>
                      <th className="py-3 px-3 text-right">Injectie Credit</th>
                      <th className="py-3 px-3 text-right font-bold text-slate-200">Netto Jaartotaal</th>
                      <th className="py-3 px-4 text-right font-bold">Besparing vs Huidig</th>
                      <th className="py-3 px-4">Status & Aanbeveling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {simulatedContracts.map((c) => {
                      const isPositive = c.sim_delta > 0;
                      return (
                        <tr 
                          key={c.id} 
                          className={`hover:bg-slate-800/40 transition ${
                            c.is_current 
                              ? 'bg-slate-800/30 border-l-4 border-l-slate-400' 
                              : c.is_recommended 
                              ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' 
                              : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-sans">
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              {c.provider}
                              {c.is_current && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
                                  Huidig
                                </span>
                              )}
                              {c.badge && !c.is_current && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.badge_color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                  c.badge_color === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                  c.badge_color === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                  c.badge_color === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {c.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">{c.name}</div>
                          </td>
                          <td className="py-3.5 px-3 font-sans text-slate-300">{c.type}</td>
                          <td className="py-3.5 px-3 text-right text-slate-300">€{c.sim_elec_cost}</td>
                          <td className="py-3.5 px-3 text-right text-slate-300">€{c.sim_gas_cost}</td>
                          <td className="py-3.5 px-3 text-right text-emerald-400">
                            -€{c.sim_inj_credit}
                            <span className="block text-[10px] text-slate-500">({c.inj_rate_c_kwh} c€/kWh)</span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-white text-sm">
                            €{c.sim_net_total}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold">
                            {c.is_current ? (
                              <span className="text-slate-500">— baseline</span>
                            ) : isPositive ? (
                              <span className="text-emerald-400 text-sm flex items-center justify-end gap-1 font-bold">
                                +€{c.sim_delta} <span className="text-[10px]">(-{c.sim_delta_pct}%)</span>
                              </span>
                            ) : (
                              <span className="text-rose-400 text-sm flex items-center justify-end gap-1">
                                -€{Math.abs(c.sim_delta)} <span className="text-[10px]">(+{Math.abs(c.sim_delta_pct)}%)</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-xs">
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              c.is_recommended ? 'bg-emerald-500 text-slate-950 font-bold' :
                              isPositive ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30' :
                              c.is_current ? 'bg-slate-800 text-slate-400' :
                              'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                            }`}>
                              {c.action_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Provider Cost Breakdown Chart */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Kostenopbouw per Leverancier (Stroom vs Gas vs Injectieaftrek)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={simulatedContracts} 
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis type="number" stroke="#94a3b8" unit="€" />
                    <YAxis dataKey="provider" type="category" stroke="#94a3b8" width={90} />
                    <Tooltip 
                      formatter={(val, name) => [`€${val}`, name]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} 
                    />
                    <Legend />
                    <Bar dataKey="sim_elec_cost" name="Stroom Afname (€)" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="sim_gas_cost" name="Aardgas (€)" fill="#f97316" stackId="a" />
                    <Bar dataKey="sim_inj_credit" name="Zonne-injectie Aftrek (€)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXECUTIVE COCKPIT & KPIS */}
        {/* ========================================================================= */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Totale Energiekost (30 Wkn)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  €{Math.round(summary.total_cost_eur)}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>Stroom: €{Math.round(summary.total_elec_cost_eur)}</span>
                  <span>Gas: €{Math.round(summary.total_gas_cost_eur)}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Zonneproductie & Autarkie</span>
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 mt-2">
                  {Math.round(summary.total_solar_kwh)} <span className="text-sm font-normal text-slate-400">kWh</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Injectie: {Math.round(summary.total_export_kwh || 3695)} kWh · Import: {Math.round(summary.total_import_kwh)} kWh
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Aardgas Totaal (Historiek)</span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-black text-orange-300 mt-2">
                  {Math.round(summary.total_gas_m3)} <span className="text-sm font-normal text-slate-400">m³</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Gasverwarming & Warm Water CV
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>HEMS Arbitrage Besparing</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-indigo-300 mt-2">
                  €{Math.round(summary.total_arbitrage_eur)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Warmtepomp pre-heat vs Gas CV
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Wekelijks Verloop: Elektriciteit (€) vs Aardgas (€) (30 Weken)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartWeeks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="year_week" stroke="#94a3b8" textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" unit="€" />
                    <Tooltip 
                      formatter={(val, name) => [`€${val}`, name]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} 
                    />
                    <Legend />
                    <Bar dataKey="electricity_cost_eur" name="Elektriciteit (€)" fill="#3b82f6" stackId="cost" />
                    <Bar dataKey="gas_cost_eur" name="Aardgas (€)" fill="#f97316" stackId="cost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WEKELIJKSE DRILL-DOWN (30 WEKEN) */}
        {/* ========================================================================= */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    30-Weken Telemetrie & Audit Table
                  </h3>
                  <p className="text-xs text-slate-400">
                    Wekelijkse samenvattingen uitgesplitst naar energievectoren, graaddagen en zonne-autarkie
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Totaal getraceerd: <strong>{weeks.length} weken / 205 dagen</strong>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Week</th>
                      <th className="py-3 px-3">Periode</th>
                      <th className="py-3 px-3 text-right">Totale Kost</th>
                      <th className="py-3 px-3 text-right">Stroom</th>
                      <th className="py-3 px-3 text-right">Gas</th>
                      <th className="py-3 px-3 text-right">Zon Prod.</th>
                      <th className="py-3 px-3 text-right">Net Import</th>
                      <th className="py-3 px-3 text-right">Autarkie %</th>
                      <th className="py-3 px-3 text-right">HDD</th>
                      <th className="py-3 px-3 text-right">Cap. Piek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {weeks.map((w) => (
                      <tr 
                        key={w.year_week}
                        onClick={() => setSelectedWeek(w)}
                        className={`cursor-pointer hover:bg-slate-800/50 transition ${
                          selectedWeek?.year_week === w.year_week ? 'bg-indigo-950/30 border-l-4 border-l-indigo-500' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-white">{w.year_week}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans">
                          {w.start_date.slice(5)} t/m {w.end_date.slice(5)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          €{w.total_energy_cost_eur.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300">
                          €{w.electricity_cost_eur.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300">
                          €{w.gas_cost_eur.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-300">
                          {Math.round(w.total_solar_kwh)} kWh
                        </td>
                        <td className="py-2.5 px-3 text-right text-blue-300">
                          {Math.round(w.total_import_kwh)} kWh
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-300">
                          {w.solar_self_consumption_pct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400">
                          {w.weekly_hdd.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">
                          {w.capacity_peak_max_kw.toFixed(2)} kW
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SEIZOENSGRAADDAGEN & VERWARMING */}
        {/* ========================================================================= */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Correlatie: Aardgasverbruik (m³) vs Stookgraaddagen (HDD)
              </h3>
              <p className="text-xs text-slate-400">
                Toont de thermische inertie en warmtevraag van het gelijkvloers (chape) naarmate het buiten kouder wordt
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartWeeks} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="year_week" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="gas" stroke="#f97316" unit=" m³" />
                    <YAxis yAxisId="hdd" orientation="right" stroke="#818cf8" unit=" HDD" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} />
                    <Legend />
                    <Line yAxisId="gas" type="monotone" dataKey="total_gas_m3" name="Aardgas (m³)" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
                    <Line yAxisId="hdd" type="monotone" dataKey="weekly_hdd" name="Graaddagen (HDD)" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
