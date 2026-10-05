import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FORECAST_TRENDS } from '../data/mockData';

export const ForecastingModule: React.FC = () => {
  const [plannerCategory, setPlannerCategory] = useState('Copper');
  const [monthlyTonnage, setMonthlyTonnage] = useState<number>(15);
  const [targetMonth, setTargetMonth] = useState('Next 30 Days');

  // Pricing multipliers
  const baseRate = plannerCategory === 'Copper' ? 722.5 : plannerCategory === 'Aluminium' ? 194.2 : plannerCategory === 'Steel' ? 37.8 : 75.4;
  const projectedRate = plannerCategory === 'Copper' ? 745.0 : plannerCategory === 'Aluminium' ? 192.0 : plannerCategory === 'Steel' ? 39.2 : 73.8;
  const currentBudget = Math.round(baseRate * monthlyTonnage * 1000);
  const projectedBudget = Math.round(projectedRate * monthlyTonnage * 1000);
  const difference = projectedBudget - currentBudget;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span>Forward Intelligence Layer · Section 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Supply & Demand Price Forecasting
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Empowers MSME manufacturers to anticipate future industrial scrap availability and price volatility ahead of market swings.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Updated with MCX, LME & Mandi Historical Spreads
        </div>
      </div>

      {/* 4 Commodity Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {FORECAST_TRENDS.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-white">{item.category}</span>
                <span className={`flex items-center text-[11px] font-bold ${
                  item.direction === 'up' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {item.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1 inline" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 inline" />
                  )}
                  {item.trend}
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Average:</span>
                  <span className="font-mono font-bold text-white">{item.currentAvg}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">30-Day Projected:</span>
                  <span className={`font-mono font-bold ${item.direction === 'up' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.projected30d}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                  <span>Forecast Confidence:</span>
                  <span className="text-slate-300 font-medium">{item.confidence}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                <strong className="text-slate-200">Market Driver:</strong> {item.driver}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
              <strong>Recommendation:</strong> {item.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive MSME Forward Procurement Planner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-850">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Procurement Budget Hedging Calculator</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Forward Procurement Impact Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculate the financial benefit of locking scrap contracts today vs waiting for price movements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Scrap Raw Material</label>
              <select
                value={plannerCategory}
                onChange={(e) => setPlannerCategory(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Copper">Copper Millberry Scrap</option>
                <option value="Aluminium">Aluminium 6063 Profiles</option>
                <option value="Steel">Heavy Melting Steel (HMS 1/2)</option>
                <option value="HDPE">HDPE Polymer Regrind</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Monthly Procurement Requirement (MT)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={monthlyTonnage}
                  onChange={(e) => setMonthlyTonnage(parseFloat(e.target.value) || 1)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-400">Metric Tonnes</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Procurement Window</label>
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Immediate Spot">Immediate Spot Booking (Today)</option>
                <option value="Next 30 Days">Next 30 Days Horizon</option>
                <option value="Next 60-90 Days">Quarterly Hedging (60-90 Days)</option>
              </select>
            </div>
          </div>

          {/* Results Projection */}
          <div className="lg:col-span-6 rounded-xl bg-slate-900/90 p-5 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Current Spot Outlay:</span>
                <span className="font-mono text-base font-bold text-white">
                  ₹{currentBudget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Forecasted Outlay ({targetMonth}):</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  ₹{projectedBudget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Variance from Waiting:</span>
                  <span className="text-xs text-slate-300">
                    {difference > 0 ? 'Projected Price Increase' : 'Projected Price Softening'}
                  </span>
                </div>
                <span className={`font-mono text-lg font-bold ${difference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {difference > 0 ? '+' : ''}₹{Math.abs(difference).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <strong className="text-amber-400">AI Strategy Note:</strong>{' '}
              {difference > 0
                ? `Locking contracts immediately protects ₹${Math.abs(difference).toLocaleString('en-IN')} in input margin against forecasted domestic commodity inflation.`
                : `Delay bulk commitments or stagger purchases in 10-day tranches to capture an estimated ₹${Math.abs(difference).toLocaleString('en-IN')} in softening commodity prices.`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
