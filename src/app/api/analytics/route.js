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
        COALESCE(SUM(arbitrage_savings_eur), 0)::float as total_arbitrage_eur,
        COALESCE(MAX(capacity_peak_max_kw), 4.94)::float as current_peak_kw
      FROM hems_weekly_economic_kpi;
    `);

    client.release();

    const summary = totalsRes.rows[0] || {};
    const weeks = weeklyRes.rows || [];
    const days = dailyRes.rows || [];
    const hourly = (hourlyRes.rows || []).reverse();

    return NextResponse.json({
      success: true,
      summary,
      weeks,
      days,
      hourly,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
