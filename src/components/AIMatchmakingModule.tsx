import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, MapPin, 
  Scale, Truck, Zap, Handshake, Filter, ChevronRight
} from 'lucide-react';
import { ScrapListing, BuyerRequirement, MatchResult } from '../types/scrap';
import { evaluatePairCompatibility } from '../services/aiService';

interface AIMatchmakingModuleProps {
  listings: ScrapListing[];
  requirements: BuyerRequirement[];
  onStartNegotiation: (listing: ScrapListing, requirement?: BuyerRequirement) => void;
  onOpenPricingCalculator: (listing: ScrapListing) => void;
  initialSelectedListing?: ScrapListing | null;
  initialSelectedRequirement?: BuyerRequirement | null;
}

export const AIMatchmakingModule: React.FC<AIMatchmakingModuleProps> = ({
  listings,
  requirements,
  onStartNegotiation,
  onOpenPricingCalculator,
  initialSelectedListing,
  initialSelectedRequirement,
}) => {
  const [selectedListingId, setSelectedListingId] = useState<string>(
    initialSelectedListing ? initialSelectedListing.id : listings[0]?.id || ''
  );
  const [selectedReqId, setSelectedReqId] = useState<string>(
    initialSelectedRequirement ? initialSelectedRequirement.id : requirements[0]?.id || ''
  );

  const selectedListing = listings.find((l) => l.id === selectedListingId) || listings[0];
  const selectedReq = requirements.find((r) => r.id === selectedReqId) || requirements[0];

  // Evaluate current pair match
  const matchResult: MatchResult = selectedListing && selectedReq
    ? evaluatePairCompatibility(selectedListing, selectedReq)
    : {
        matchId: 'NONE',
        listingId: '',
        requirementId: '',
        overallScore: 0,
        breakdown: { gradeCompatibility: 0, purityScore: 0, quantityAlignment: 0, logisticsProximity: 0, priceOverlap: 0 },
        distanceKm: 0,
        estimatedFreightPerKg: 0,
        suggestedDealPricePerKg: 0,
        buyerProjectedSavingsPercent: 0,
        sellerNetRevenuePerKg: 0,
        keyInsights: [],
      };

  // Find all matches for the selected listing ranked by score
  const allMatchesForListing = requirements.map((req) => ({
    req,
    match: evaluatePairCompatibility(selectedListing, req),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Intelligence Layer · Section 7 Step 02</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Automated Matchmaking Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pairs surplus scrap lots with manufacturer raw-material demands based on chemical grade parity, volume, geographic distance, and timing windows.
          </p>
        </div>
      </div>

      {/* Selector Panels: Left = Scrap Lot, Right = Buyer Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left: Select Scrap Lot */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">1. Available Scrap Lot (Seller Side)</span>
            <span className="text-xs font-mono text-amber-400">{selectedListing.id}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Choose Scrap Lot to match:</label>
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} - {l.title} ({l.quantityAvailable} MT @ {l.location.city})
                </option>
              ))}
            </select>
          </div>

          {/* Mini Detail Card */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-850 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedListing.title}</h4>
                <div className="text-xs text-amber-400 mt-0.5">{selectedListing.materialGrade}</div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono tabular-nums text-white">
                  ₹{selectedListing.askingPricePerKg}
                </span>
                <span className="text-[11px] text-slate-400 block">/ kg asking</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-900 pt-2.5">
              <span>Qty: <strong className="text-white font-mono tabular-nums">{selectedListing.quantityAvailable} MT</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Purity: <strong className="text-emerald-400 font-mono tabular-nums">{selectedListing.purityPercentage}%</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="h-3 w-3 text-slate-400" />
                {selectedListing.location.industrialArea}, {selectedListing.location.city}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Select Buyer Requirement */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">2. Raw-Material Requirement (Buyer Side)</span>
            <span className="text-xs font-mono text-amber-400">{selectedReq.id}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Choose Target Buyer Demand:</label>
            <select
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {requirements.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.title} ({r.quantityRequired} MT @ {r.deliveryHub})
                </option>
              ))}
            </select>
          </div>

          {/* Mini Detail Card */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-850 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedReq.title}</h4>
                <div className="text-xs text-slate-300 mt-0.5">{selectedReq.buyer.companyName}</div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono tabular-nums text-white">
                  ₹{selectedReq.targetPricePerKg}
                </span>
                <span className="text-[11px] text-slate-400 block">/ kg target</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-900 pt-2.5">
              <span>Required: <strong className="text-white font-mono tabular-nums">{selectedReq.quantityRequired} MT</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Min Purity: <strong className="text-emerald-400 font-mono tabular-nums">{selectedReq.minPurityRequired}%</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="h-3 w-3 text-slate-400" />
                {selectedReq.deliveryHub}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Compatibility Evaluation Engine Result Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-850">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Multi-Factor Compatibility Analysis
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-3">
              <span>Match Result:</span>
              <span className={`font-mono text-2xl font-black ${
                matchResult.overallScore >= 80 ? 'text-emerald-400' : matchResult.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {matchResult.overallScore}%
              </span>
              <span className="text-xs font-normal text-slate-400">
                {matchResult.overallScore >= 80 ? 'High Synergy Pair' : matchResult.overallScore >= 60 ? 'Viable Secondary Match' : 'Sub-Optimal Match'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartNegotiation(selectedListing, selectedReq)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-colors shadow-sm"
            >
              <Handshake className="h-4 w-4" />
              <span>Launch AI Negotiation</span>
            </button>
            <button
              onClick={() => onOpenPricingCalculator(selectedListing)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-2.5 text-xs font-semibold transition-colors"
            >
              <Scale className="h-4 w-4 text-emerald-400" />
              <span>Pricing Breakdown</span>
            </button>
          </div>
        </div>

        {/* 5-Factor Score Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-850">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Grade Compatibility</span>
              <span className="font-mono font-bold text-white">{matchResult.breakdown.gradeCompatibility}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${matchResult.breakdown.gradeCompatibility}%` }} 
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {matchResult.breakdown.gradeCompatibility === 100 ? 'Direct alloy parity' : 'Alternative melt grade'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-850">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Purity Standard</span>
              <span className="font-mono font-bold text-white">{matchResult.breakdown.purityScore}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${matchResult.breakdown.purityScore}%` }} 
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Purity: {selectedListing.purityPercentage}% vs Min {selectedReq.minPurityRequired}%
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-850">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Quantity Fit</span>
              <span className="font-mono font-bold text-white">{matchResult.breakdown.quantityAlignment}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                style={{ width: `${matchResult.breakdown.quantityAlignment}%` }} 
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {selectedListing.quantityAvailable} MT of {selectedReq.quantityRequired} MT req
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-850">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Transit Proximity</span>
              <span className="font-mono font-bold text-white">{matchResult.breakdown.logisticsProximity}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${matchResult.breakdown.logisticsProximity}%` }} 
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {matchResult.distanceKm} km · ₹{matchResult.estimatedFreightPerKg}/kg freight
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-850">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Price Overlap</span>
              <span className="font-mono font-bold text-white">{matchResult.breakdown.priceOverlap}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${matchResult.breakdown.priceOverlap}%` }} 
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Ask ₹{selectedListing.askingPricePerKg} vs Max ₹{selectedReq.maxCeilingPricePerKg}
            </span>
          </div>

        </div>

        {/* AI Key Insights Box */}
        <div className="rounded-xl bg-slate-900/60 p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>AI Automated Match Recommendations & Economics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchResult.keyInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>

          {/* Economic win-win highlights */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Recommended Fair Settlement:</span>
              <span className="text-amber-400 font-bold font-mono tabular-nums text-sm">
                ₹{matchResult.suggestedDealPricePerKg.toFixed(1)} / kg
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Buyer Savings vs Virgin Material:</span>
              <span className="text-emerald-400 font-bold font-mono tabular-nums text-sm">
                ~{matchResult.buyerProjectedSavingsPercent}% Cost Reduction
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Seller Premium over Scrap Kabadiwala:</span>
              <span className="text-amber-300 font-bold font-mono tabular-nums text-sm">
                +28% Net Yield
              </span>
            </div>
          </div>
        </div>

        {/* Other Active Buyer Matches for this lot */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            All Compatible Buyer Demands for {selectedListing.id} ({allMatchesForListing.length})
          </h4>
          <div className="space-y-2">
            {allMatchesForListing.map(({ req, match }) => (
              <div
                key={req.id}
                onClick={() => setSelectedReqId(req.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  req.id === selectedReq.id
                    ? 'bg-slate-900 border-amber-500/60 shadow-xs'
                    : 'bg-slate-950 hover:bg-slate-900/50 border-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${
                    match.overallScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {match.overallScore}%
                  </span>
                  <span className="text-white font-medium">{req.buyer.companyName}</span>
                  <span className="text-slate-400 hidden sm:inline">({req.targetGrade})</span>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <span className="font-mono tabular-nums">{req.quantityRequired} MT</span>
                  <span>{req.deliveryHub}</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
