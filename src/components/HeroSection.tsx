import React from 'react';
import { ArrowRight, Search, Zap, CheckCircle2, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface HeroSectionProps {
  onExploreMarketplace: () => void;
  onOpenMatchmaker: () => void;
  onOpenPricing: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMarketplace,
  onOpenMatchmaker,
  onOpenPricing,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 pt-10 pb-16 lg:py-16">
      {/* Subtle industrial background glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mission, Title & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
              <span>Project Assignment Report</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>MSME Hackathon</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Circular Industrial Economy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI Scrap Exchanger
            </h1>

            <p className="text-lg sm:text-xl font-medium text-amber-300/90 italic">
              "One man’s trash is another man’s treasure."
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              An AI-powered real-time marketplace converting Indian MSME industrial scrap into verified raw materials. We connect factories holding surplus scrap with manufacturers seeking affordable inputs—eliminating broker markups, establishing live commodity-indexed pricing, and lowering carbon footprint.
            </p>

            {/* Quick Interactive Search & Filter Bar */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search scrap grade (e.g. Copper Berry, Alum 6063, HMS 1, HDPE)..."
                    className="w-full rounded-lg bg-slate-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={onExploreMarketplace}
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-semibold text-slate-950 transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Explore Lots</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quick filter keywords */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400 no-scrollbar pt-1">
                <span className="text-slate-500 font-medium">Quick Grader:</span>
                {['All Grades', 'Copper Berry', 'Aluminium 6063', 'HMS 1/2 Steel', 'HDPE Regrind'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchQuery(cat === 'All Grades' ? '' : cat);
                      onExploreMarketplace();
                    }}
                    className="hover:text-amber-300 transition-colors text-slate-400 hover:underline px-1 py-0.5 whitespace-nowrap"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Stats Grid with Tabular Numerals */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-900">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                  ~30%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Input Cost Savings</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400">
                  50M MT
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Annual Indian Metal Scrap</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
                  62M+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Target MSME Enterprises</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={onOpenMatchmaker}
                className="flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Run AI Matchmaking Engine</span>
              </button>
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                <Scale className="h-3.5 w-3.5 text-emerald-400" />
                <span>Test Real-Time Pricing Calculator</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_industrial_circular_1791197195719.jpg"
                alt="AI Scrap Exchanger Industrial Facility"
                className="h-80 sm:h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Overlay card details */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Indian Manufacturing Symbiosis</span>
                  <span className="text-amber-400 font-mono">CPCB Verified</span>
                </div>
                <p className="text-xs font-semibold text-white">
                  Direct Buyer-Seller Pairing · No Kabadiwala Opaque Margins
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Live Commodity MCX Linked
                  </span>
                  <span>Automated Freight & E-Way Bill</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
