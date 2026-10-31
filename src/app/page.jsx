'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
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
  Clock 
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
  CartesianGrid 
} from 'recharts';

export default function CFODashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedWeek, setSelectedWeek] = useState(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">HEMS CFO Analytics Laden...</h2>
        <p className="text-sm text-slate-400 mt-1">Verbinding maken met Neon Serverless PostgreSQL</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl max-w-md">
          <h2 className="text-lg font-bold text-red-200">Verbindingsfout</h2>
          <p className="text-sm text-red-300 mt-2">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition"
          >
            Opnieuw Proberen
          </button>
        </div>
      </div>
    );
  }

  const { summary, weeks, days, hourly } = data;
  const chartWeeks = [...weeks].reverse(); // Oldest to newest for charts
  const chartDays = [...days].reverse();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">HEMS Executive CFO Analytics</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Duffel, België · Live Neon PostgreSQL Telemetrie & Financiële Drill-down
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ververs Data
          </button>
          <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
            ● Live Sync
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Totale Energiekosten (30 Weken)</span>
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              €{summary.total_cost_eur?.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-0.5 text-blue-400 font-semibold">
              <Zap className="w-3 h-3" /> €{Math.round(summary.total_elec_cost_eur)}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400 font-semibold">
              <Flame className="w-3 h-3" /> €{Math.round(summary.total_gas_cost_eur)}
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Arbitrage Winst (HEMS)</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              €{summary.total_arbitrage_eur?.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Besparing door Daalderop gasselectie vs piekstroom
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Zonne-Autarkie (Opbrengst)</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><Sun className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {Math.round(summary.total_solar_kwh || 0)} <span className="text-lg text-slate-400 font-normal">kWh</span>
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Totaal lokaal opgewekte zonne-energie
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Fluvius Kwartierpiek</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl"><ShieldCheck className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.current_peak_kw} <span className="text-lg text-slate-400 font-normal">kW</span>
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Capaciteitstarief maandpiek (2,5 kW grens)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'weekly'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Wekelijkse Drill-Down ({weeks.length} Weken)</span>
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'daily'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Dagelijkse Trends (30 Dagen)</span>
        </button>
        <button
          onClick={() => setActiveTab('hourly')}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'hourly'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 24-Uurs Telemetrie</span>
        </button>
      </div>

      {/* Tab 1: Weekly */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          {/* Main Chart: Cost Breakdown per Week */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Wekelijkse Energiekosten (€ Stroom vs € Gas)</h3>
                <p className="text-xs text-slate-400">Verloop over alle geregistreerde weken sinds april 2026</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartWeeks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year_week" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="€" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} 
                    formatter={(val) => [`€${val}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="electricity_cost_eur" name="Stroom (€)" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="gas_cost_eur" name="Aardgas (€)" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart: Solar vs Grid Import */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-white mb-1">Zonne-Productie vs. Netimport (kWh)</h3>
            <p className="text-xs text-slate-400 mb-4">Seizoensverloop van zonne-autarkie en netafhankelijkheid</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartWeeks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year_week" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kWh" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="total_solar_kwh" name="Zon (kWh)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="total_import_kwh" name="Netimport (kWh)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Drill-down Table */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <h3 className="text-base font-bold text-white mb-1">Volledige Wekelijkse CFO Tabel (30 Weken)</h3>
            <p className="text-xs text-slate-400 mb-4">Gedetailleerde uitsplitsing per kalenderweek</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Week</th>
                    <th className="py-3 px-3">Periode</th>
                    <th className="py-3 px-3 text-right">Totale Kost</th>
                    <th className="py-3 px-3 text-right">Stroom</th>
                    <th className="py-3 px-3 text-right">Gas</th>
                    <th className="py-3 px-3 text-right">Zon (kWh)</th>
                    <th className="py-3 px-3 text-right">Import (kWh)</th>
                    <th className="py-3 px-3 text-right">Zelfverbruik</th>
                    <th className="py-3 px-3 text-right">Graaddagen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {weeks.map((w) => (
                    <tr key={w.year_week} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-white">{w.year_week}</td>
                      <td className="py-3 px-3 text-slate-400">{w.start_date} t/m {w.end_date}</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-400">€{w.total_energy_cost_eur.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-blue-400">€{w.electricity_cost_eur.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-amber-400">€{w.gas_cost_eur.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">{w.total_solar_kwh.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right">{w.total_import_kwh.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right font-medium">{w.solar_self_consumption_pct}%</td>
                      <td className="py-3 px-3 text-right text-slate-400">{w.weekly_hdd} HDD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-white mb-1">Dagelijkse Energiekost (Laatste 30 Dagen)</h3>
            <p className="text-xs text-slate-400 mb-4">Uitsplitsing per dag in stroom en gas</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="€" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} />
                  <Legend />
                  <Bar dataKey="electricity_cost_eur" name="Stroom (€)" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="gas_cost_eur" name="Gas (€)" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-white mb-1">Aardgas vs. Graaddagen (HDD)</h3>
            <p className="text-xs text-slate-400 mb-4">Thermodynamische efficiëntie & condensatie-opvolging</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" stroke="#f59e0b" tick={{ fontSize: 11 }} unit="€" />
                  <YAxis yAxisId="right" orientation="right" stroke="#a855f7" tick={{ fontSize: 11 }} unit=" HDD" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="gas_cost_eur" name="Gaskost (€)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="heating_degree_days" name="Graaddagen (HDD)" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hourly */}
      {activeTab === 'hourly' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-white mb-1">24-Uurs Stroomprijs vs. Netbelasting</h3>
            <p className="text-xs text-slate-400 mb-4">Dynamische Mega-uurprijs (€/kWh) tegenover het piekvermogen</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour_time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 11 }} unit="€" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} unit=" W" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} />
                  <Legend />
                  <Line yAxisId="left" type="stepAfter" dataKey="electricity_price_eur_kwh" name="Mega Stroomprijs (€/kWh)" stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="quarter_peak_power_w" name="Piekvermogen (W)" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
