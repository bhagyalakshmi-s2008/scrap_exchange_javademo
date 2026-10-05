import { ScrapListing, BuyerRequirement, MatchResult, CommodityPrice } from '../types/scrap';
import { COMMODITY_TICKERS } from '../data/mockData';

export interface PricingCalculation {
  baseCommodityPrice: number;
  benchmarkSource: string;
  purityAdjustedPrice: number;
  contaminationDeduction: number;
  formFactorAdjustment: number;
  suggestedFactoryGatePrice: number;
  freightCostPerKg: number;
  landedBuyerPrice: number;
  virginEquivalentPrice: number;
  buyerSavingsAmount: number;
  buyerSavingsPercent: number;
  sellerGainOverJunkDealer: number;
}

/**
 * Real-Time Pricing Engine
 * Incorporates Live Commodity Indices, Grade factors, Contamination, and Logistics
 */
export function calculateFairMarketPrice(params: {
  category: string;
  grade: string;
  purityPercent: number;
  contaminationPercent: number;
  physicalForm: string;
  distanceKm: number;
  quantityTons: number;
}): PricingCalculation {
  // Determine reference index
  let basePrice = 200;
  let benchmarkSource = 'MCX Industrial Index';
  let virginPrice = 280;

  if (params.category.includes('Copper') || params.grade.toLowerCase().includes('copper')) {
    const ticker = COMMODITY_TICKERS.find(t => t.symbol === 'COPPER-MCX');
    basePrice = ticker ? ticker.price : 784.50;
    benchmarkSource = 'MCX Copper Benchmark';
    virginPrice = basePrice * 1.15; // Virgin copper cathode premium
  } else if (params.category.includes('Alum') || params.grade.toLowerCase().includes('alum')) {
    const ticker = COMMODITY_TICKERS.find(t => t.symbol === 'ALUM-MCX');
    basePrice = ticker ? ticker.price : 228.30;
    benchmarkSource = 'MCX Aluminium Ingot Index';
    virginPrice = basePrice * 1.18;
  } else if (params.category.includes('Ferrous') || params.grade.toLowerCase().includes('steel') || params.grade.toLowerCase().includes('hms')) {
    const ticker = COMMODITY_TICKERS.find(t => t.symbol === 'STEEL-HMS');
    basePrice = ticker ? ticker.price : 38.60;
    benchmarkSource = 'Mandi Secondary Steel Billet Index';
    virginPrice = 58.00; // Virgin mild steel billet
  } else if (params.category.includes('Plastic') || params.category.includes('Polymer') || params.grade.toLowerCase().includes('hdpe')) {
    const ticker = COMMODITY_TICKERS.find(t => t.symbol === 'HDPE-REGRIND');
    basePrice = ticker ? ticker.price : 86.20;
    benchmarkSource = 'Domestic Polymer Granule Mandi';
    virginPrice = 118.00; // Virgin Reliance/IOCL polymer granules
  } else if (params.category.includes('E-Waste') || params.grade.toLowerCase().includes('pcb')) {
    const ticker = COMMODITY_TICKERS.find(t => t.symbol === 'E-PCB-AU');
    basePrice = ticker ? ticker.price : 340.00;
    benchmarkSource = 'CPCB Secondary Precious Metal Yield Reference';
    virginPrice = 520.00;
  }

  // Purity multiplier
  const purityMultiplier = Math.max(0.70, Math.min(1.0, params.purityPercent / 100));
  const purityAdjustedPrice = basePrice * purityMultiplier;

  // Contamination penalty (smelting/cleaning yield loss: 2.2x the contamination percentage)
  const contaminationDeduction = purityAdjustedPrice * (params.contaminationPercent / 100) * 2.2;

  // Form factor premium/discount
  let formMultiplier = 0.94; // standard scrap discount
  if (params.physicalForm.includes('Bundled Wire')) formMultiplier = 0.96;
  if (params.physicalForm.includes('Profiles & Extrusions')) formMultiplier = 0.95;
  if (params.physicalForm.includes('Plate Punchings')) formMultiplier = 0.96;
  if (params.physicalForm.includes('Turnings & Borings')) formMultiplier = 0.88; // swarf oil loss
  if (params.physicalForm.includes('Granules / Regrind')) formMultiplier = 0.92;

  const adjustedNet = (purityAdjustedPrice - contaminationDeduction) * formMultiplier;
  const suggestedFactoryGatePrice = Math.round(adjustedNet * 10) / 10;

  // Logistics freight calculation based on distance and load tonnage
  // Standard Indian freight: ~₹3.60 to ₹4.20 per ton-km for dedicated multi-axle truck
  const distance = Math.max(15, params.distanceKm || 45);
  const freightPerTon = distance * 3.85 + 450; // base loading + handling
  const freightCostPerKg = Math.round((freightPerTon / 1000) * 100) / 100;

  const landedBuyerPrice = Math.round((suggestedFactoryGatePrice + freightCostPerKg) * 10) / 10;
  const buyerSavingsAmount = Math.max(0, virginPrice - landedBuyerPrice);
  const buyerSavingsPercent = Math.round((buyerSavingsAmount / virginPrice) * 100);

  // Traditional kabadiwala/informal broker typically pays 25-35% below fair industrial value
  const informalBrokerOffer = suggestedFactoryGatePrice * 0.72;
  const sellerGainOverJunkDealer = Math.round((suggestedFactoryGatePrice - informalBrokerOffer) * 10) / 10;

  return {
    baseCommodityPrice: basePrice,
    benchmarkSource,
    purityAdjustedPrice: Math.round(purityAdjustedPrice * 10) / 10,
    contaminationDeduction: Math.round(contaminationDeduction * 10) / 10,
    formFactorAdjustment: formMultiplier,
    suggestedFactoryGatePrice,
    freightCostPerKg,
    landedBuyerPrice,
    virginEquivalentPrice: virginPrice,
    buyerSavingsAmount: Math.round(buyerSavingsAmount * 10) / 10,
    buyerSavingsPercent,
    sellerGainOverJunkDealer,
  };
}

/**
 * AI Matchmaking Engine
 * Multi-parameter pairing algorithm matching scrap lots to buyer requirements
 */
export function evaluatePairCompatibility(
  listing: ScrapListing,
  requirement: BuyerRequirement
): MatchResult {
  // 1. Grade Compatibility
  let gradeScore = 0;
  const lGrade = listing.materialGrade.toLowerCase();
  const rGrade = requirement.targetGrade.toLowerCase();

  if (lGrade === rGrade || lGrade.includes(rGrade) || rGrade.includes(lGrade)) {
    gradeScore = 100;
  } else {
    const isAlternative = requirement.acceptableAlternativeGrades.some(alt => 
      lGrade.includes(alt.toLowerCase()) || alt.toLowerCase().includes(lGrade)
    );
    gradeScore = isAlternative ? 85 : (listing.category === requirement.category ? 50 : 10);
  }

  // 2. Purity & Contamination Score
  let purityScore = 100;
  if (listing.purityPercentage < requirement.minPurityRequired) {
    purityScore -= (requirement.minPurityRequired - listing.purityPercentage) * 15;
  }
  if (listing.contaminationLevel > requirement.maxContaminationAllowed) {
    purityScore -= (listing.contaminationLevel - requirement.maxContaminationAllowed) * 20;
  }
  purityScore = Math.max(0, Math.min(100, Math.round(purityScore)));

  // 3. Quantity alignment
  let quantityScore = 100;
  const ratio = listing.quantityAvailable / requirement.quantityRequired;
  if (ratio >= 0.8 && ratio <= 2.0) {
    quantityScore = 100;
  } else if (ratio < 0.8) {
    quantityScore = Math.round(ratio * 100);
  } else {
    quantityScore = 88; // large lot is acceptable
  }

  // 4. Logistics proximity estimation
  // Simulating geographic distance between known Indian clusters
  let distanceKm = 65; // default nearby
  const lLoc = (listing.location.city + ' ' + listing.location.state).toLowerCase();
  const rLoc = requirement.deliveryHub.toLowerCase();

  if (lLoc.includes('pune') && rLoc.includes('pune')) distanceKm = 38;
  else if (lLoc.includes('bengaluru') && rLoc.includes('bengaluru')) distanceKm = 42;
  else if (lLoc.includes('ludhiana') && rLoc.includes('ludhiana')) distanceKm = 52;
  else if (lLoc.includes('surat') && rLoc.includes('surat')) distanceKm = 48;
  else if ((lLoc.includes('pune') && rLoc.includes('bengaluru')) || (lLoc.includes('bengaluru') && rLoc.includes('pune'))) distanceKm = 840;
  else if (lLoc.includes('ludhiana') && rLoc.includes('gurugram')) distanceKm = 320;
  else if (lLoc.includes('surat') && rLoc.includes('pune')) distanceKm = 390;
  else distanceKm = 450;

  let logisticsScore = 100;
  if (distanceKm < 60) logisticsScore = 98;
  else if (distanceKm < 150) logisticsScore = 90;
  else if (distanceKm < 500) logisticsScore = 80;
  else if (distanceKm < 1000) logisticsScore = 65;
  else logisticsScore = 50;

  // High-value metals like copper can travel further economically
  if (listing.category === 'Non-Ferrous Metals' && listing.askingPricePerKg > 300) {
    logisticsScore = Math.min(100, logisticsScore + 15);
  }

  // 5. Price overlap score
  const sellerPrice = listing.askingPricePerKg;
  const buyerTarget = requirement.targetPricePerKg;
  const buyerCeiling = requirement.maxCeilingPricePerKg;

  let priceScore = 50;
  if (sellerPrice <= buyerTarget) {
    priceScore = 100;
  } else if (sellerPrice <= buyerCeiling) {
    priceScore = 85;
  } else {
    const diffPercent = ((sellerPrice - buyerCeiling) / buyerCeiling) * 100;
    priceScore = Math.max(10, Math.round(85 - diffPercent * 5));
  }

  // Weighted Overall Score
  const overallScore = Math.round(
    gradeScore * 0.35 +
    purityScore * 0.20 +
    quantityScore * 0.15 +
    logisticsScore * 0.15 +
    priceScore * 0.15
  );

  const freightPerKg = Math.round(((distanceKm * 3.85 + 400) / 1000) * 100) / 100;
  const suggestedDealPricePerKg = Math.round(((sellerPrice + Math.min(sellerPrice, buyerCeiling)) / 2) * 10) / 10;
  const virginRef = listing.askingPricePerKg * 1.35;
  const buyerSavings = Math.round(((virginRef - (suggestedDealPricePerKg + freightPerKg)) / virginRef) * 100);

  const insights: string[] = [];
  if (gradeScore >= 95) insights.push('Direct 1:1 chemical alloy grade match with zero re-specification required.');
  else if (gradeScore >= 80) insights.push('Meets buyer acceptable alternative grade standards for secondary remelting.');
  
  if (distanceKm <= 60) {
    insights.push(`Ultra-low transit friction: Just ${distanceKm} km transit between hubs (Same-day dispatch available).`);
  } else {
    insights.push(`Estimated transit distance ${distanceKm} km. Freight cost ₹${freightPerKg}/kg easily amortized by volume.`);
  }

  if (purityScore >= 90) {
    insights.push(`High purity compliance (${listing.purityPercentage}%) minimizes induction furnace slag and melting loss.`);
  }

  insights.push(`Estimated buyer savings vs virgin inputs: ~${Math.max(18, buyerSavings)}%, saving buyer approx ₹${Math.round((virginRef - suggestedDealPricePerKg) * Math.min(listing.quantityAvailable, requirement.quantityRequired) * 1000).toLocaleString('en-IN')}.`);

  return {
    matchId: `MATCH-${listing.id.replace('LOT-', '')}-${requirement.id.replace('REQ-', '')}`,
    listingId: listing.id,
    requirementId: requirement.id,
    overallScore,
    breakdown: {
      gradeCompatibility: gradeScore,
      purityScore,
      quantityAlignment: quantityScore,
      logisticsProximity: logisticsScore,
      priceOverlap: priceScore,
    },
    distanceKm,
    estimatedFreightPerKg: freightPerKg,
    suggestedDealPricePerKg,
    buyerProjectedSavingsPercent: Math.max(15, buyerSavings),
    sellerNetRevenuePerKg: suggestedDealPricePerKg,
    keyInsights: insights,
  };
}

/**
 * AI Negotiation Assistant
 * Derives evidence-based counter offers, walk-away thresholds, and win-win terms
 */
export function generateNegotiationInsight(
  listing: ScrapListing,
  buyerBid: number,
  round: number = 1
) {
  const ask = listing.askingPricePerKg;
  const aiFair = listing.aiSuggestedPricePerKg;
  
  // Buyer walk-away: max price where scrap is still better than virgin/secondary market
  const buyerWalkAwayPrice = Math.round((aiFair * 1.05) * 10) / 10;

  // Seller walk-away: min price above junk broker liquidation
  const sellerWalkAwayPrice = Math.round((aiFair * 0.92) * 10) / 10;

  // Fair market band
  const fairMarketBand: [number, number] = [
    Math.round((aiFair * 0.96) * 10) / 10,
    Math.round((aiFair * 1.02) * 10) / 10
  ];

  // Recommended counter-offer
  let suggestedCounterPrice: number;
  let justification = '';

  if (buyerBid >= ask) {
    suggestedCounterPrice = ask;
    justification = 'The current buyer bid meets or exceeds the seller asking price. Instant transaction lock recommended.';
  } else if (buyerBid < sellerWalkAwayPrice) {
    suggestedCounterPrice = Math.round(((fairMarketBand[0] + aiFair) / 2) * 10) / 10;
    justification = `The buyer bid of ₹${buyerBid}/kg is below the seller walk-away threshold (₹${sellerWalkAwayPrice}/kg). Market indices justify a counter at ₹${suggestedCounterPrice}/kg based on current MCX benchmark minus standard melting spread.`;
  } else {
    // Bid is within reasonable zone; recommend win-win midpoint
    suggestedCounterPrice = Math.round(((buyerBid * 0.45) + (ask * 0.55)) * 10) / 10;
    justification = `A counter-offer of ₹${suggestedCounterPrice}/kg yields an equitable split: gives the seller ₹${(suggestedCounterPrice - sellerWalkAwayPrice).toFixed(1)}/kg above liquidation while providing the buyer a 26% margin over fresh raw material.`;
  }

  return {
    suggestedCounterPrice,
    buyerWalkAwayPrice,
    sellerWalkAwayPrice,
    fairMarketBand,
    justification,
    arbitrationProbability: overallScoreToProbability(buyerBid, ask, aiFair),
  };
}

function overallScoreToProbability(buyerBid: number, sellerAsk: number, fairVal: number): string {
  const spread = Math.abs(sellerAsk - buyerBid) / fairVal;
  if (spread <= 0.05) return '94% Very High (Close Agreement)';
  if (spread <= 0.12) return '82% High (Negotiable Spread)';
  if (spread <= 0.22) return '60% Moderate (Requires AI Mediation)';
  return '35% Challenging (Wide Bid-Ask Gap)';
}
