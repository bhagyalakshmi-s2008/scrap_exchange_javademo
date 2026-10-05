import React from 'react';
import { Leaf, Award, Recycle, ShieldCheck, Download, BarChart3, Globe, Factory } from 'lucide-react';

export const ESGSustainabilityReport: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5" />
            <span>Circular Economy & ESG Accounting · Section 9</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Environmental & MSME Economic Impact
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Quantifying virgin mining displacement, carbon reduction, and industrial landfill diversion across Indian manufacturing clusters.
          </p>
        </div>

        <button
          onClick={() => alert('ESG BRSR Circular Economy Report downloaded.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export BRSR Compliance Report</span>
        </button>
      </div>

      {/* 4 Big Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Landfill Waste Diverted</span>
            <Recycle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-white">
            18,450 <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-xs text-slate-400">
            Industrial metal & polymer by-products returned to the supply loop
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net CO₂e Emissions Avoided</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-emerald-400">
            42,800 <span className="text-sm font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-xs text-slate-400">
            Reduced open-pit mining, smelting, and virgin extraction energy
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MSME Sourcing Capital Saved</span>
            <Factory className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-amber-400">
            ₹38.4 <span className="text-sm font-normal text-slate-400">Cr</span>
          </div>
          <div className="text-xs text-slate-400">
            Direct input material savings delivered to buyer manufacturing units (~30%)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Factory Disposal Costs Eliminated</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-white">
            100%
          </div>
          <div className="text-xs text-slate-400">
            Turned negative storage & hauling liabilities into positive cashflow
          </div>
        </div>
      </div>

      {/* Macro Policy Alignment (Ministry of Steel, CPCB, NITI Aayog) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-amber-400" />
          <span>Alignment with National Circular Economy Policies & References</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850 space-y-2">
            <span className="font-semibold text-white block">
              National Steel Scrap Recycling Policy (2019)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Mandates 70 standard circular scrap aggregation centers across India to reduce high-cost import dependency on foreign scrap and secondary metallics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850 space-y-2">
            <span className="font-semibold text-white block">
              NITI Aayog Resource Efficiency Roadmap
            </span>
            <p className="text-slate-400 leading-relaxed">
              Targeting 30% reduction in virgin raw-material consumption through industrial symbiosis—converting factory floor by-products into nearby input feedstocks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850 space-y-2">
            <span className="font-semibold text-white block">
              CPCB Hazardous & Non-Hazardous E-Waste Framework
            </span>
            <p className="text-slate-400 leading-relaxed">
              Provides digital chain-of-custody, preventing illegal informal dumping while preserving valuable metals (copper, gold, nickel) in formal manufacturing loops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
