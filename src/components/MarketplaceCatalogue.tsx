import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, CheckCircle2, ShieldCheck, Scale, 
  Handshake, Sparkles, FileText, ArrowUpRight, Building2, Truck
} from 'lucide-react';
import { ScrapListing, BuyerRequirement, ScrapCategory } from '../types/scrap';
import { INDUSTRIAL_HUBS } from '../data/mockData';

interface MarketplaceCatalogueProps {
  listings: ScrapListing[];
  requirements: BuyerRequirement[];
  userRole: 'buyer' | 'seller';
  onSelectListingForMatch: (listing: ScrapListing) => void;
  onSelectListingForPricing: (listing: ScrapListing) => void;
  onSelectListingForNegotiate: (listing: ScrapListing) => void;
  onViewInspectionCertificate: (listing: ScrapListing) => void;
  onSelectRequirementForMatch: (req: BuyerRequirement) => void;
  onOpenPostModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const MarketplaceCatalogue: React.FC<MarketplaceCatalogueProps> = ({
  listings,
  requirements,
  userRole,
  onSelectListingForMatch,
  onSelectListingForPricing,
  onSelectListingForNegotiate,
  onViewInspectionCertificate,
  onSelectRequirementForMatch,
  onOpenPostModal,
  searchQuery,
  setSearchQuery,
}) => {
  const [activeView, setActiveView] = useState<'listings' | 'requirements'>('listings');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHub, setSelectedHub] = useState<string>('All');
  const [minPurity, setMinPurity] = useState<number>(0);

  const categories: (string | ScrapCategory)[] = [
    'All',
    'Non-Ferrous Metals',
    'Ferrous Metals',
    'Polymers & Plastics',
    'E-Waste & Electronics'
  ];

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materialGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesHub = selectedHub === 'All' || item.location.city.toLowerCase().includes(selectedHub.toLowerCase());
    const matchesPurity = item.purityPercentage >= minPurity;

    return matchesSearch && matchesCat && matchesHub && matchesPurity;
  });

  // Filter requirements
  const filteredRequirements = requirements.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deliveryHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesHub = selectedHub === 'All' || item.deliveryHub.toLowerCase().includes(selectedHub.toLowerCase());

    return matchesSearch && matchesCat && matchesHub;
  });

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            Two-Sided Industrial Exchange
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Scrap & Raw-Material Marketplace
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Verified Indian manufacturing lots with instant chemical purity ratings, live commodity benchmarking, and logistics transparency.
          </p>
        </div>

        {/* View Switcher Tabs (Buttons with click handlers per skill rule) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveView('listings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeView === 'listings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Scrap Lots ({filteredListings.length})
          </button>
          <button
            onClick={() => setActiveView('requirements')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeView === 'requirements'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buyer Input Demands ({filteredRequirements.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
            {/* Hub Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                aria-label="Filter by Industrial Hub"
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Industrial Hubs</option>
                <option value="pune">Pune Industrial Cluster (MIDC)</option>
                <option value="bengaluru">Bengaluru (Peenya / Bommasandra)</option>
                <option value="ludhiana">Ludhiana (Focal Point)</option>
                <option value="surat">Surat (Sachin GIDC)</option>
                <option value="gurugram">Gurugram / Manesar Auto Belt</option>
              </select>
            </div>

            {/* Clear Filter button if modified */}
            {(selectedCategory !== 'All' || selectedHub !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedHub('All');
                  setSearchQuery('');
                  setMinPurity(0);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View 1: Available Scrap Lots */}
      {activeView === 'listings' && (
        <>
          {filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center">
              <p className="text-slate-400 text-sm">No scrap lots found matching your filter criteria.</p>
              <button
                onClick={onOpenPostModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
              >
                Post New Scrap Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((lot) => (
                <div
                  key={lot.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col overflow-hidden group shadow-md"
                >
                  {/* Card Lead Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    
                    {/* Unboxed clean text metadata overlay */}
                    <div className="absolute top-3 left-3 text-[11px] font-mono text-white/90 bg-slate-950/80 px-2.5 py-1 rounded backdrop-blur-xs border border-slate-800">
                      <span>{lot.id}</span>
                      <span className="mx-1.5 text-slate-500">·</span>
                      <span>{lot.category}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 text-xs text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{lot.location.city}, {lot.location.state}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Quiet 1-line kicker (anti-slop rule) */}
                      <div className="text-[11px] font-medium text-amber-400 mb-1 flex items-center justify-between">
                        <span>{lot.materialGrade}</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {lot.purityPercentage}% Purity
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {lot.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {lot.description}
                      </p>

                      {/* Clean Unboxed Metadata Line with typographic separators */}
                      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                        <span className="font-semibold text-white font-mono tabular-nums">{lot.quantityAvailable} MT Available</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>MOQ {lot.minOrderQuantity} MT</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">{lot.physicalForm}</span>
                      </div>

                      {/* Price Section */}
                      <div className="mt-3 bg-slate-950/80 rounded-lg p-3 border border-slate-850 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-slate-400">Asking Price</div>
                          <div className="text-base font-bold font-mono tabular-nums text-white">
                            ₹{lot.askingPricePerKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ kg</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">AI Fair Market Price</div>
                          <div className="text-sm font-semibold font-mono tabular-nums text-amber-400">
                            ₹{lot.aiSuggestedPricePerKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Seller Verification Marker */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[190px] font-medium text-slate-300" title={lot.seller.companyName}>
                          {lot.seller.companyName}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Udyam Verified
                        </span>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => onSelectListingForMatch(lot)}
                        className="flex-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Match</span>
                      </button>

                      <button
                        onClick={() => onSelectListingForNegotiate(lot)}
                        className="flex-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Handshake className="h-3.5 w-3.5" />
                        <span>Negotiate</span>
                      </button>

                      <button
                        onClick={() => onViewInspectionCertificate(lot)}
                        title="View MRAI / CPCB Quality Certificate"
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 text-xs transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View 2: Buyer Input Demands */}
      {activeView === 'requirements' && (
        <>
          {filteredRequirements.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center">
              <p className="text-slate-400 text-sm">No buyer requirements match this filter.</p>
              <button
                onClick={onOpenPostModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
              >
                Post Raw Material Requirement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequirements.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-mono text-amber-400 font-bold">{req.id}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-300 font-medium">{req.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-emerald-400">{req.urgency}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {req.title}
                    </h3>

                    <p className="text-xs text-slate-300">
                      <span className="text-slate-400">Intended Application:</span> {req.intendedApplication}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="text-slate-300">
                        <strong className="text-white">Target Grade:</strong> {req.targetGrade}
                      </span>
                      <span>
                        <strong className="text-white font-mono tabular-nums">{req.quantityRequired} MT</strong> Required
                      </span>
                      <span>
                        Min Purity: <strong className="text-emerald-400 font-mono tabular-nums">{req.minPurityRequired}%</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {req.deliveryHub}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Alternative acceptable grades: <span className="text-slate-300">{req.acceptableAlternativeGrades.join(', ')}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-400">Target Purchase Price</div>
                      <div className="text-lg font-bold font-mono tabular-nums text-white">
                        ₹{req.targetPricePerKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ kg</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ceiling: ₹{req.maxCeilingPricePerKg.toFixed(1)} / kg
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRequirementForMatch(req)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-colors shadow-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Find AI Scrap Matches</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </section>
  );
};
