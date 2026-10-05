import React, { useState } from 'react';
import { Scale, TrendingUp, Truck, ShieldCheck, ArrowRight, Info, Sparkles, RefreshCw } from 'lucide-react';
import { COMMODITY_TICKERS } from '../data/mockData';
import { calculateFairMarketPrice } from '../services/aiService';
import { ScrapListing } from '../types/scrap';

interface RealTimePricingEngineProps {
  initialListing?: ScrapListing | null;
  onApplyValuationToPost?: (price: number) => void;
}

export const RealTimePricingEngine: React.FC<RealTimePricingEngineProps> = ({
  initialListing,
  onApplyValuationToPost,
}) => {
  const [category, setCategory] = useState<string>(initialListing?.category || 'Non-Ferrous Metals');
  const [grade, setGrade] = useState<string>(initialListing?.materialGrade || 'Copper Berry / Millberry');
  const [purity, setPurity] = useState<number>(initialListing?.purityPercentage || 99.5);
  const [contamination, setContamination] = useState<number>(initialListing?.contaminationLevel || 0.4);
  const [physicalForm, setPhysicalForm] = useState<string>(initialListing?.physicalForm || 'Bundled Wire');
  const [distanceKm, setDistanceKm] = useState<number>(65);
  const [quantityTons, setQuantityTons] = useState<number>(initialListing?.quantityAvailable || 10);

  // Quick preset loader
  const loadPreset = (presetType: 'copper' | 'aluminum' | 'steel' | 'hdpe') => {
    if (presetType === 'copper') {
      setCategory('Non-Ferrous Metals');
      setGrade('Copper Berry / Millberry ISRI standard');
      setPurity(99.8);
      setContamination(0.2);
      setPhysicalForm('Bundled Wire');
      setDistanceKm(55);
      setQuantityTons(12);
    } else if (presetType === 'aluminum') {
      setCategory('Non-Ferrous Metals');
      setGrade('Alloy 6063 Architectural Scrap');
      setPurity(98.5);
      setContamination(0.8);
      setPhysicalForm('Profiles & Extrusions');
      setDistanceKm(80);
      setQuantityTons(25);
    } else if (presetType === 'steel') {
      setCategory('Ferrous Metals');
      setGrade('IS 2062 Grade E250 / HMS-1');
      setPurity(97.2);
      setContamination(1.5);
      setPhysicalForm('Plate Punchings / Offcuts');
      setDistanceKm(120);
      setQuantityTons(50);
    } else if (presetType === 'hdpe') {
      setCategory('Polymers & Plastics');
      setGrade('HDPE Blow/Extrusion Regrind');
      setPurity(99.0);
      setContamination(0.5);
      setPhysicalForm('Granules / Regrind');
      setDistanceKm(45);
      setQuantityTons(15);
    }
  };

  const pricing = calculateFairMarketPrice({
    category,
    grade,
    purityPercent: purity,
    contaminationPercent: contamination,
    physicalForm,
    distanceKm,
    quantityTons,
  });

  const totalLotValue = Math.round(pricing.suggestedFactoryGatePrice * quantityTons * 1000);
  const totalBuyerSavings = Math.round(pricing.buyerSavingsAmount * quantityTons * 1000);
  const totalSellerGain = Math.round(pricing.sellerGainOverJunkDealer * quantityTons * 1000);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Pricing Engine · Live Commodity Indexing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Real-Time Fair Market Valuation
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Calculates transparent factory-gate and landed prices adjusted for chemical purity, contamination smelting yield loss, and road transit freight.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-medium">Test Presets:</span>
          <button
            onClick={() => loadPreset('copper')}
            className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 whitespace-nowrap transition-colors"
          >
            Copper Millberry
          </button>
          <button
            onClick={() => loadPreset('aluminum')}
            className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 whitespace-nowrap transition-colors"
          >
            Aluminium 6063
          </button>
          <button
            onClick={() => loadPreset('steel')}
            className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 whitespace-nowrap transition-colors"
          >
            Steel HMS-1
          </button>
          <button
            onClick={() => loadPreset('hdpe')}
            className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 whitespace-nowrap transition-colors"
          >
            HDPE Regrind
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Param Controls */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Lot Specifications & Logistics Input</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              Benchmark: {pricing.benchmarkSource}
            </span>
          </h3>

          {/* Category & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Scrap Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Non-Ferrous Metals">Non-Ferrous Metals (Copper, Alum, Brass)</option>
                <option value="Ferrous Metals">Ferrous Metals (Steel, Cast Iron, HMS)</option>
                <option value="Polymers & Plastics">Polymers & Plastics (HDPE, PP, ABS)</option>
                <option value="E-Waste & Electronics">E-Waste & Electronics (PCB, Gold/Cu)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Material Alloy Grade</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Copper Berry 99.8%"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Physical Form Factor */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Physical Form Factor</label>
            <select
              value={physicalForm}
              onChange={(e) => setPhysicalForm(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Bundled Wire">Bundled Wire (Minimal melting loss)</option>
              <option value="Profiles & Extrusions">Profiles & Extrusions (Clean solid cuts)</option>
              <option value="Plate Punchings / Offcuts">Plate Punchings / Offcuts (Heavy dense)</option>
              <option value="Turnings & Borings">Turnings & Borings (Swarf / Machining fines)</option>
              <option value="Granules / Regrind">Granules / Regrind (Washed polymer)</option>
            </select>
          </div>

          {/* Purity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Chemical Purity</span>
              <span className="font-mono font-bold text-emerald-400">{purity.toFixed(1)}% Pure</span>
            </div>
            <input
              type="range"
              min="75"
              max="99.9"
              step="0.1"
              value={purity}
              onChange={(e) => setPurity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>75% (Secondary alloy)</span>
              <span>95% (Commercial)</span>
              <span>99.9% (Virgin equivalent)</span>
            </div>
          </div>

          {/* Contamination Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Contamination Level (Moisture, Oil, Slag)</span>
              <span className="font-mono font-bold text-amber-400">{contamination.toFixed(1)}% Contaminants</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={contamination}
              onChange={(e) => setContamination(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Laboratory clean)</span>
              <span>2.5% (Typical machining scrap)</span>
              <span>5.0% (Requires heavy wash)</span>
            </div>
          </div>

          {/* Transit Distance & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-850">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Transit Route Distance (km)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="2500"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value) || 10)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-400">km</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Lot Quantity Available</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={quantityTons}
                  onChange={(e) => setQuantityTons(parseFloat(e.target.value) || 1)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-400">MT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Valuation Output & Economics Breakdown */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase font-semibold tracking-wider text-amber-400">
                AI Valuation Calculation
              </span>
              <span className="font-mono text-emerald-400">Live Indian Mandi Linked</span>
            </div>

            {/* Primary Suggested Price Badge */}
            <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Recommended Factory-Gate Scrap Price:</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-white">
                  ₹{pricing.suggestedFactoryGatePrice.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-slate-400">/ kg</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Total Lot Valuation ({quantityTons} MT):</span>
                <span className="font-bold font-mono text-amber-400 text-sm">
                  ₹{totalLotValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Step-by-Step Waterfall Breakdown */}
            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                <span>Base Commodity Benchmark ({pricing.benchmarkSource}):</span>
                <span className="font-mono tabular-nums text-white">₹{pricing.baseCommodityPrice.toFixed(2)}/kg</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                <span>Purity Adjusted Baseline ({purity.toFixed(1)}%):</span>
                <span className="font-mono tabular-nums text-white">₹{pricing.purityAdjustedPrice.toFixed(2)}/kg</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900 text-rose-300">
                <span>Contamination Smelting Penalty (-{contamination}%):</span>
                <span className="font-mono tabular-nums">-₹{pricing.contaminationDeduction.toFixed(2)}/kg</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                <span>Estimated Freight ({distanceKm} km transit):</span>
                <span className="font-mono tabular-nums text-amber-300">+₹{pricing.freightCostPerKg.toFixed(2)}/kg</span>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-800 font-semibold text-white">
                <span>Landed Factory-Gate Price to Buyer:</span>
                <span className="font-mono tabular-nums text-emerald-400 text-sm">
                  ₹{pricing.landedBuyerPrice.toFixed(2)}/kg
                </span>
              </div>
            </div>
          </div>

          {/* Macro Impact: Circular Symbiosis Gains */}
          <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Two-Sided Economic Advantage</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[11px]">Buyer Savings vs Virgin</span>
                <span className="text-lg font-bold font-mono text-emerald-400 block mt-0.5">
                  ~{pricing.buyerSavingsPercent}% Discount
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Saves ₹{totalBuyerSavings.toLocaleString('en-IN')} vs virgin input
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[11px]">Seller Gain vs Junk Dealer</span>
                <span className="text-lg font-bold font-mono text-amber-400 block mt-0.5">
                  +₹{pricing.sellerGainOverJunkDealer.toFixed(1)} / kg
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Recovers ₹{totalSellerGain.toLocaleString('en-IN')} extra revenue
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
