import React, { useState } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { LiveCommodityTicker } from './components/LiveCommodityTicker';
import { HeroSection } from './components/HeroSection';
import { OperationalFlowStepper } from './components/OperationalFlowStepper';
import { MarketplaceCatalogue } from './components/MarketplaceCatalogue';
import { AIMatchmakingModule } from './components/AIMatchmakingModule';
import { RealTimePricingEngine } from './components/RealTimePricingEngine';
import { NegotiationDealRoom } from './components/NegotiationDealRoom';
import { ForecastingModule } from './components/ForecastingModule';
import { ESGSustainabilityReport } from './components/ESGSustainabilityReport';
import { InspectionAndLogisticsModal } from './components/InspectionAndLogisticsModal';
import { PostScrapModal } from './components/PostScrapModal';
import { Footer } from './components/Footer';

import { 
  COMMODITY_TICKERS, 
  INITIAL_SCRAP_LISTINGS, 
  INITIAL_BUYER_REQUIREMENTS 
} from './data/mockData';
import { ScrapListing, BuyerRequirement, CommodityPrice } from './types/scrap';
import { CheckCircle2, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  
  // Data State
  const [listings, setListings] = useState<ScrapListing[]>(INITIAL_SCRAP_LISTINGS);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(INITIAL_BUYER_REQUIREMENTS);
  const [tickers, setTickers] = useState<CommodityPrice[]>(COMMODITY_TICKERS);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive Focus State for AI Modules
  const [selectedListingForPricing, setSelectedListingForPricing] = useState<ScrapListing | null>(null);
  const [selectedListingForMatch, setSelectedListingForMatch] = useState<ScrapListing | null>(null);
  const [selectedReqForMatch, setSelectedReqForMatch] = useState<BuyerRequirement | null>(null);
  
  const [negotiatingListing, setNegotiatingListing] = useState<ScrapListing | null>(null);
  const [negotiatingReq, setNegotiatingReq] = useState<BuyerRequirement | null>(null);

  const [inspectedListing, setInspectedListing] = useState<ScrapListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // Quick notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Step selector from operational flow
  const handleFlowStepSelect = (stepIndex: number) => {
    if (stepIndex === 0) {
      setIsPostModalOpen(true);
    } else if (stepIndex === 1) {
      setActiveTab('matchmaker');
    } else if (stepIndex === 2) {
      setActiveTab('pricing');
    } else if (stepIndex === 3) {
      setActiveTab('negotiation');
    }
  };

  const handleSelectListingForMatch = (listing: ScrapListing) => {
    setSelectedListingForMatch(listing);
    setActiveTab('matchmaker');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectRequirementForMatch = (req: BuyerRequirement) => {
    setSelectedReqForMatch(req);
    setActiveTab('matchmaker');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectListingForPricing = (listing: ScrapListing) => {
    setSelectedListingForPricing(listing);
    setActiveTab('pricing');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectListingForNegotiate = (listing: ScrapListing) => {
    setNegotiatingListing(listing);
    setActiveTab('negotiation');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleStartNegotiationFromMatch = (listing: ScrapListing, requirement?: BuyerRequirement) => {
    setNegotiatingListing(listing);
    if (requirement) setNegotiatingReq(requirement);
    setActiveTab('negotiation');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleLockDeal = (dealData: {
    listing: ScrapListing;
    finalPricePerKg: number;
    totalAmount: number;
    quantity: number;
    freightCost: number;
  }) => {
    showToast(
      `Deal closed at ₹${dealData.finalPricePerKg}/kg for ${dealData.quantity} MT of ${dealData.listing.materialGrade}. Total ₹${dealData.totalAmount.toLocaleString('en-IN')}. E-Way transit generated.`
    );
  };

  const handleAddListing = (newListing: ScrapListing) => {
    setListings([newListing, ...listings]);
    showToast(`New scrap listing "${newListing.title}" published with AI valuation.`);
    setActiveTab('marketplace');
  };

  const handleAddRequirement = (newReq: BuyerRequirement) => {
    setRequirements([newReq, ...requirements]);
    showToast(`New raw material requirement "${newReq.title}" posted. Matching with active lots.`);
    setActiveTab('marketplace');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* 2. Live Indian Benchmark Commodity Ticker */}
      <LiveCommodityTicker
        tickers={tickers}
        onSelectTicker={(ticker) => {
          setActiveTab('pricing');
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="sticky top-20 z-50 mx-auto max-w-xl px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="flex-1 font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreMarketplace={() => {
                const el = document.getElementById('marketplace-listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMatchmaker={() => setActiveTab('matchmaker')}
              onOpenPricing={() => setActiveTab('pricing')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* 4-Step Operational Flow Interactive Stepper */}
            <OperationalFlowStepper onStepSelect={handleFlowStepSelect} />

            {/* Live 2-Sided Catalogue */}
            <div id="marketplace-listings">
              <MarketplaceCatalogue
                listings={listings}
                requirements={requirements}
                userRole={userRole}
                onSelectListingForMatch={handleSelectListingForMatch}
                onSelectListingForPricing={handleSelectListingForPricing}
                onSelectListingForNegotiate={handleSelectListingForNegotiate}
                onViewInspectionCertificate={(lot) => setInspectedListing(lot)}
                onSelectRequirementForMatch={handleSelectRequirementForMatch}
                onOpenPostModal={() => setIsPostModalOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Circular Economy Impact Summary Section */}
            <ESGSustainabilityReport />
          </>
        )}

        {activeTab === 'matchmaker' && (
          <div className="pt-4">
            <AIMatchmakingModule
              listings={listings}
              requirements={requirements}
              onStartNegotiation={handleStartNegotiationFromMatch}
              onOpenPricingCalculator={handleSelectListingForPricing}
              initialSelectedListing={selectedListingForMatch}
              initialSelectedRequirement={selectedReqForMatch}
            />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="pt-4">
            <RealTimePricingEngine
              initialListing={selectedListingForPricing}
              onApplyValuationToPost={(price) => {
                setIsPostModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div className="pt-4">
            <NegotiationDealRoom
              listing={negotiatingListing}
              requirement={negotiatingReq}
              allListings={listings}
              onLockDeal={handleLockDeal}
            />
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="pt-4">
            <ForecastingModule />
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="pt-4">
            <ESGSustainabilityReport />
          </div>
        )}
      </main>

      {/* Quality Inspection & Partner Logistics Modal */}
      {inspectedListing && (
        <InspectionAndLogisticsModal
          listing={inspectedListing}
          onClose={() => setInspectedListing(null)}
          onBookLogistics={(booking) => {
            showToast(`Logistics pickup assigned to ${booking.carrier} for ${booking.lot.id}.`);
          }}
        />
      )}

      {/* Post Scrap or Requirement Modal */}
      <PostScrapModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        defaultType={userRole === 'seller' ? 'scrap' : 'requirement'}
        onAddListing={handleAddListing}
        onAddRequirement={handleAddRequirement}
      />

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
