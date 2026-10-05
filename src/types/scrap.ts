export type ScrapCategory = 
  | 'Ferrous Metals'
  | 'Non-Ferrous Metals'
  | 'Polymers & Plastics'
  | 'E-Waste & Electronics'
  | 'Industrial By-products';

export interface CommodityPrice {
  symbol: string;
  name: string;
  category: ScrapCategory;
  market: 'MCX' | 'LME' | 'Mandi Benchmark';
  price: number;
  unit: string;
  change24h: number;
  sparkline: number[];
  lastUpdated: string;
}

export interface ScrapListing {
  id: string;
  title: string;
  category: ScrapCategory;
  materialGrade: string;
  purityPercentage: number;
  contaminationLevel: number; // in percentage
  quantityAvailable: number; // in metric tonnes
  minOrderQuantity: number;
  askingPricePerKg: number;
  aiSuggestedPricePerKg: number;
  location: {
    city: string;
    state: string;
    industrialArea: string;
    lat: number;
    lng: number;
  };
  seller: {
    companyName: string;
    udyamRegNo: string;
    gstin: string;
    verified: boolean;
    rating: number;
    dealsClosed: number;
  };
  physicalForm: 'Bundled Wire' | 'Profiles & Extrusions' | 'Turnings & Borings' | 'Plate Punchings / Offcuts' | 'Granules / Regrind' | 'Shredded Boards';
  description: string;
  image: string;
  certifiedQuality: boolean;
  availableFrom: string;
  inspectionReportUrl?: string;
  environmentalBenefit: {
    co2SavedKgPerTon: number;
    virginMaterialOffsetPercent: number;
  };
}

export interface BuyerRequirement {
  id: string;
  title: string;
  category: ScrapCategory;
  targetGrade: string;
  acceptableAlternativeGrades: string[];
  minPurityRequired: number;
  maxContaminationAllowed: number;
  quantityRequired: number; // MT
  targetPricePerKg: number;
  maxCeilingPricePerKg: number;
  buyer: {
    companyName: string;
    industrySector: string;
    location: string;
    gstin: string;
    verified: boolean;
  };
  urgency: 'Immediate (Within 48h)' | 'Next 10 Days' | 'Monthly Recurring';
  deliveryHub: string;
  intendedApplication: string;
}

export interface MatchResult {
  matchId: string;
  listingId: string;
  requirementId: string;
  overallScore: number; // 0 - 100%
  breakdown: {
    gradeCompatibility: number;
    purityScore: number;
    quantityAlignment: number;
    logisticsProximity: number;
    priceOverlap: number;
  };
  distanceKm: number;
  estimatedFreightPerKg: number;
  suggestedDealPricePerKg: number;
  buyerProjectedSavingsPercent: number;
  sellerNetRevenuePerKg: number;
  keyInsights: string[];
}

export interface NegotiationState {
  dealId: string;
  listing: ScrapListing;
  buyerRequirement?: BuyerRequirement;
  buyerProposedPrice: number;
  sellerAskingPrice: number;
  currentRound: number;
  logisticsRatePerKg: number;
  aiRecommendation: {
    suggestedCounterPrice: number;
    buyerWalkAwayPrice: number;
    sellerWalkAwayPrice: number;
    fairMarketBand: [number, number];
    justification: string;
    arbitrationProbability: string;
  };
  history: Array<{
    sender: 'buyer' | 'seller' | 'ai';
    price: number;
    note: string;
    timestamp: string;
  }>;
  status: 'In Progress' | 'Accepted' | 'Locked in Transit' | 'Declined';
}

export interface InspectionData {
  certificateId: string;
  lotId: string;
  materialName: string;
  date: string;
  inspector: string;
  labAgency: string;
  spectrometryAssay: {
    primaryElement: string;
    purity: number;
    traceElements: { element: string; percentage: number }[];
  };
  moistureContent: number;
  oilSlagImpurities: number;
  densityGPerCm3: number;
  complianceRating: 'A+ Grade (Prime Recyclable)' | 'A Grade (Commercial)' | 'B Grade (Secondary Melt)';
  cpcbCompliance: boolean;
}
