import React, { useState } from 'react';
import { 
  Handshake, Sparkles, CheckCircle2, AlertCircle, ArrowRight, 
  Send, ShieldCheck, Truck, Lock, FileCheck, RefreshCw 
} from 'lucide-react';
import { ScrapListing, BuyerRequirement } from '../types/scrap';
import { generateNegotiationInsight } from '../services/aiService';

interface NegotiationDealRoomProps {
  listing?: ScrapListing | null;
  requirement?: BuyerRequirement | null;
  allListings: ScrapListing[];
  onLockDeal: (dealData: {
    listing: ScrapListing;
    finalPricePerKg: number;
    totalAmount: number;
    quantity: number;
    freightCost: number;
  }) => void;
}

export const NegotiationDealRoom: React.FC<NegotiationDealRoomProps> = ({
  listing,
  requirement,
  allListings,
  onLockDeal,
}) => {
  const [currentListingId, setCurrentListingId] = useState<string>(
    listing ? listing.id : allListings[0]?.id || ''
  );

  const activeListing = allListings.find((l) => l.id === currentListingId) || allListings[0];
  
  const [buyerBid, setBuyerBid] = useState<number>(
    requirement ? requirement.targetPricePerKg : Math.round(activeListing.askingPricePerKg * 0.94 * 10) / 10
  );
  const [quantity, setQuantity] = useState<number>(
    activeListing.quantityAvailable
  );

  const [dealHistory, setDealHistory] = useState<Array<{
    sender: 'buyer' | 'seller' | 'ai';
    price: number;
    note: string;
    timestamp: string;
  }>>([
    {
      sender: 'seller',
      price: activeListing.askingPricePerKg,
      note: `Initial Listing Post: ₹${activeListing.askingPricePerKg}/kg for ${activeListing.quantityAvailable} MT of ${activeListing.materialGrade}.`,
      timestamp: '10:00 AM',
    },
    {
      sender: 'buyer',
      price: Math.round(activeListing.askingPricePerKg * 0.92 * 10) / 10,
      note: 'Initial Procurement Bid based on secondary remelt budget.',
      timestamp: '10:15 AM',
    }
  ]);

  const [customNote, setCustomNote] = useState('');
  const [dealLocked, setDealLocked] = useState(false);

  // Compute AI Negotiation advice
  const aiAdvice = generateNegotiationInsight(activeListing, buyerBid, dealHistory.length);

  const handleApplyAiCounter = () => {
    setBuyerBid(aiAdvice.suggestedCounterPrice);
    const newEntry = {
      sender: 'ai' as const,
      price: aiAdvice.suggestedCounterPrice,
      note: `AI Mediated Proposal: Set bid at ₹${aiAdvice.suggestedCounterPrice}/kg. ${aiAdvice.justification}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDealHistory([...dealHistory, newEntry]);
  };

  const handleSendCustomOffer = () => {
    if (!buyerBid) return;
    const newEntry = {
      sender: 'buyer' as const,
      price: buyerBid,
      note: customNote || `Revised counter-bid submitted at ₹${buyerBid}/kg.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDealHistory([...dealHistory, newEntry]);
    setCustomNote('');
  };

  const handleSellerAccept = () => {
    setDealLocked(true);
    const freightRate = 1.85; // ₹/kg standard cluster freight
    const totalAmount = Math.round(buyerBid * quantity * 1000);
    const totalFreight = Math.round(freightRate * quantity * 1000);

    onLockDeal({
      listing: activeListing,
      finalPricePerKg: buyerBid,
      totalAmount,
      quantity,
      freightCost: totalFreight,
    });
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1.5">
            <Handshake className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Negotiation Desk · Section 7 Step 04</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Evidence-Based AI Negotiation & Deal Closure
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Neutral AI mediation eliminates broker manipulation by recommending counter-offers, protecting walk-away thresholds, and locking legally verified dispatch terms.
          </p>
        </div>

        {/* Lot Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Negotiating Lot:</span>
          <select
            value={currentListingId}
            onChange={(e) => {
              setCurrentListingId(e.target.value);
              setDealLocked(false);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {allListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} - {l.title} (Ask: ₹{l.askingPricePerKg}/kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Negotiation Context & AI Walk-Away Protection */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Lot Brief */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold">{activeListing.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeListing.title}</h3>
                <div className="text-xs text-slate-400 mt-1">{activeListing.materialGrade}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Seller Asking</span>
                <span className="text-lg font-bold font-mono text-white">₹{activeListing.askingPricePerKg}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Lot: <strong className="text-white font-mono">{activeListing.quantityAvailable} MT</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Purity: <strong className="text-emerald-400 font-mono">{activeListing.purityPercentage}%</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{activeListing.location.city}</span>
            </div>
          </div>

          {/* AI Walk-Away & Fair Band Gauges */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                AI Walk-Away Thresholds
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Evidence-Based</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Buyer Walk-Away Ceiling</span>
                  <span className="text-slate-300">Above this, virgin material is preferred</span>
                </div>
                <span className="text-base font-bold font-mono text-rose-400">
                  ₹{aiAdvice.buyerWalkAwayPrice}/kg
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Seller Walk-Away Floor</span>
                  <span className="text-slate-300">Below this, local scrap yard is equal</span>
                </div>
                <span className="text-base font-bold font-mono text-amber-400">
                  ₹{aiAdvice.sellerWalkAwayPrice}/kg
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 block font-semibold text-[11px]">Fair Market Settlement Band</span>
                  <span className="text-slate-300">Equitable win-win range</span>
                </div>
                <span className="text-base font-bold font-mono text-emerald-300">
                  ₹{aiAdvice.fairMarketBand[0]} – ₹{aiAdvice.fairMarketBand[1]}/kg
                </span>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold">Suggested Optimal Counter:</span>
                <span className="font-mono text-base font-bold text-white">
                  ₹{aiAdvice.suggestedCounterPrice.toFixed(1)} / kg
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {aiAdvice.justification}
              </p>

              <button
                onClick={handleApplyAiCounter}
                disabled={dealLocked}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-2 text-xs font-bold transition-colors shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Apply AI Recommended Counter-Offer</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Arbitration Settlement Likelihood:</span>
              <span className="text-emerald-400 font-semibold">{aiAdvice.arbitrationProbability}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Negotiation Rounds & Contract Locking */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider">Negotiation Timeline</span>
                <span className="text-slate-500">· {dealHistory.length} Rounds</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Audit Trail Recorded
              </span>
            </div>

            {/* Scrollable Deal History */}
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {dealHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    item.sender === 'seller'
                      ? 'bg-slate-950 border-slate-850'
                      : item.sender === 'buyer'
                      ? 'bg-slate-900 border-amber-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold capitalize ${
                      item.sender === 'seller'
                        ? 'text-slate-300'
                        : item.sender === 'buyer'
                        ? 'text-amber-400'
                        : 'text-amber-300 font-bold flex items-center gap-1'
                    }`}>
                      {item.sender === 'ai' && <Sparkles className="h-3 w-3" />}
                      {item.sender === 'seller' ? `Seller (${activeListing.seller.companyName})` : item.sender === 'buyer' ? 'Buyer Offer' : 'AI Mediation'}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">{item.timestamp}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{item.note}</p>

                  <div className="text-[11px] font-mono text-white pt-1">
                    Offered Rate: <strong className="text-amber-400 font-bold">₹{item.price.toFixed(1)} / kg</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Offer Action Bar or Locked State */}
          {!dealLocked ? (
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Proposed Price (₹/kg)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={buyerBid}
                      onChange={(e) => setBuyerBid(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">₹ / kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Contract Quantity (MT)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">MT</span>
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Optional terms note (e.g., prompt pickup within 48h, payment against weighing bridge)..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSendCustomOffer}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 text-xs font-semibold transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Counter-Bid</span>
                </button>

                <button
                  onClick={handleSellerAccept}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-colors shadow-md"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Terms & Close Deal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-950/40 p-5 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>Deal Formally Closed & Locked in Platform</span>
              </div>
              <p className="text-xs text-slate-300">
                Purchase terms locked at <strong>₹{buyerBid}/kg</strong> for <strong>{quantity} MT</strong> of {activeListing.materialGrade}. Proforma manifest and E-Way transit order generated.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDealLocked(false)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Modify or Reopen Negotiation
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
