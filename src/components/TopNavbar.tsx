import React from 'react';
import { RefreshCw, Plus, ShieldCheck, UserCheck } from 'lucide-react';

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'buyer' | 'seller';
  setUserRole: (role: 'buyer' | 'seller') => void;
  onOpenPostModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenPostModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setActiveTab('marketplace'); }}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
          AI Scrap Exchanger
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'marketplace' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'matchmaker' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            AI Matchmaker
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'pricing' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Real-Time Pricing
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'negotiation' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Negotiation Desk
          </button>
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'forecasting' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Forecasts
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'impact' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Circular Impact
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Interactive Role Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setUserRole('buyer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                userRole === 'buyer' 
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Buyer View
            </button>
            <button
              onClick={() => setUserRole('seller')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                userRole === 'seller' 
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Seller View
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenPostModal}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{userRole === 'seller' ? 'Post Scrap Lot' : 'Post Requirement'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 gap-4 text-xs font-medium text-slate-300 no-scrollbar">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`whitespace-nowrap ${activeTab === 'marketplace' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('matchmaker')}
          className={`whitespace-nowrap ${activeTab === 'matchmaker' ? 'text-amber-400 font-semibold' : ''}`}
        >
          AI Matchmaker
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`whitespace-nowrap ${activeTab === 'pricing' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Pricing
        </button>
        <button
          onClick={() => setActiveTab('negotiation')}
          className={`whitespace-nowrap ${activeTab === 'negotiation' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Negotiation
        </button>
        <button
          onClick={() => setActiveTab('forecasting')}
          className={`whitespace-nowrap ${activeTab === 'forecasting' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Forecasts
        </button>
        <button
          onClick={() => setActiveTab('impact')}
          className={`whitespace-nowrap ${activeTab === 'impact' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Circular Impact
        </button>
      </div>
    </header>
  );
};
