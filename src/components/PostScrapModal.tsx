import React, { useState } from 'react';
import { X, Plus, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrapListing, BuyerRequirement, ScrapCategory } from '../types/scrap';
import { calculateFairMarketPrice } from '../services/aiService';

interface PostScrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'scrap' | 'requirement';
  onAddListing: (listing: ScrapListing) => void;
  onAddRequirement: (req: BuyerRequirement) => void;
}

export const PostScrapModal: React.FC<PostScrapModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'scrap',
  onAddListing,
  onAddRequirement,
}) => {
  const [postType, setPostType] = useState<'scrap' | 'requirement'>(defaultType);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScrapCategory>('Non-Ferrous Metals');
  const [grade, setGrade] = useState('');
  const [purity, setPurity] = useState<number>(98.5);
  const [contamination, setContamination] = useState<number>(0.5);
  const [quantity, setQuantity] = useState<number>(10);
  const [pricePerKg, setPricePerKg] = useState<number>(210);
  const [city, setCity] = useState('Pune');
  const [industrialArea, setIndustrialArea] = useState('Bhosari MIDC');
  const [companyName, setCompanyName] = useState('Precision Alloys MSME');
  const [udyamNo, setUdyamNo] = useState('UDYAM-MH-26-0091823');
  const [gstin, setGstin] = useState('27AAECP1029K1Z4');
  const [physicalForm, setPhysicalForm] = useState<ScrapListing['physicalForm']>('Profiles & Extrusions');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  // AI Instant Fair Valuation recommendation
  const handleRunAiPriceEstimation = () => {
    const calc = calculateFairMarketPrice({
      category,
      grade: grade || 'Standard Commercial Grade',
      purityPercent: purity,
      contaminationPercent: contamination,
      physicalForm,
      distanceKm: 50,
      quantityTons: quantity,
    });
    setPricePerKg(calc.suggestedFactoryGatePrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (postType === 'scrap') {
      const newListing: ScrapListing = {
        id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title || `${grade || 'Industrial Scrap'} (${purity}% Pure)`,
        category,
        materialGrade: grade || 'Commercial Secondary Grade',
        purityPercentage: purity,
        contaminationLevel: contamination,
        quantityAvailable: quantity,
        minOrderQuantity: Math.max(1, Math.round(quantity * 0.2)),
        askingPricePerKg: pricePerKg,
        aiSuggestedPricePerKg: pricePerKg * 0.98,
        location: {
          city,
          state: 'Maharashtra',
          industrialArea,
          lat: 18.5204,
          lng: 73.8567,
        },
        seller: {
          companyName,
          udyamRegNo: udyamNo,
          gstin,
          verified: true,
          rating: 4.8,
          dealsClosed: 4,
        },
        physicalForm,
        description: description || `Verified surplus scrap lot available from ${companyName} in ${city}. Moisture tested, magnet-checked. Ready for prompt loading.`,
        image: category === 'Non-Ferrous Metals' 
          ? '/src/assets/images/scrap_aluminum_profiles_1791197235328.jpg'
          : category === 'Ferrous Metals'
          ? '/src/assets/images/scrap_heavy_steel_1791197250246.jpg'
          : '/src/assets/images/scrap_polymer_granules_1791197264302.jpg',
        certifiedQuality: true,
        availableFrom: 'Ready for Immediate Dispatch',
        environmentalBenefit: {
          co2SavedKgPerTon: 3500,
          virginMaterialOffsetPercent: 90,
        }
      };
      onAddListing(newListing);
    } else {
      const newReq: BuyerRequirement = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title || `Requirement for ${grade || 'Industrial Grade Raw Material'}`,
        category,
        targetGrade: grade || 'Commercial Grade Raw Material',
        acceptableAlternativeGrades: ['Alternative secondary melt grade'],
        minPurityRequired: purity,
        maxContaminationAllowed: contamination,
        quantityRequired: quantity,
        targetPricePerKg: pricePerKg,
        maxCeilingPricePerKg: pricePerKg * 1.06,
        buyer: {
          companyName,
          industrySector: 'Manufacturing MSME',
          location: `${city}, Maharashtra`,
          gstin,
          verified: true,
        },
        urgency: 'Immediate (Within 48h)',
        deliveryHub: `${city}, Maharashtra`,
        intendedApplication: description || 'Secondary raw-material substitute for production batch casting.'
      };
      onAddRequirement(newReq);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-850">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-0.5">
              Section 7 Operational Flow · Step 01
            </div>
            <h3 className="text-xl font-bold text-white">
              {postType === 'scrap' ? 'Post Surplus Factory Scrap Lot' : 'Post Raw-Material Requirement'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-900 text-xs">
          <button
            type="button"
            onClick={() => setPostType('scrap')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              postType === 'scrap'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Seller: Surplus Scrap Lot
          </button>
          <button
            type="button"
            onClick={() => setPostType('requirement')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              postType === 'requirement'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Buyer: Raw Material Input Demand
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Listing Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={postType === 'scrap' ? 'e.g. Clean 6063 Aluminum Extrusion Offcuts' : 'e.g. Copper Berry Wire for Induction Furnace'}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScrapCategory)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Non-Ferrous Metals">Non-Ferrous Metals (Copper, Alum, Brass)</option>
                <option value="Ferrous Metals">Ferrous Metals (Steel, HMS, Iron)</option>
                <option value="Polymers & Plastics">Polymers & Plastics (HDPE, PP, ABS)</option>
                <option value="E-Waste & Electronics">E-Waste & Electronics (PCB boards)</option>
                <option value="Industrial By-products">Industrial By-products & Slag</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Material Alloy Grade / Specification</label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Copper Millberry 99.8% or HMS-1 IS 2062"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Purity (%)</label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="100"
                value={purity}
                onChange={(e) => setPurity(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Contamination (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={contamination}
                onChange={(e) => setContamination(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Quantity (MT)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Price with AI auto calculation button */}
          <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">
                {postType === 'scrap' ? 'Asking Price (₹ / kg)' : 'Target Purchase Price (₹ / kg)'}
              </label>
              <button
                type="button"
                onClick={handleRunAiPriceEstimation}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fetch AI Mandi Benchmark</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white font-mono font-bold"
              />
              <span className="text-slate-400 whitespace-nowrap">₹ / kg</span>
            </div>
          </div>

          {/* Location & MSME Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Industrial Hub / Area</label>
              <input
                type="text"
                value={industrialArea}
                onChange={(e) => setIndustrialArea(e.target.value)}
                placeholder="e.g. Bhosari MIDC, Chakan"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune, Bengaluru, Ludhiana"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Enterprise Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">MSME Udyam Registration Number</label>
              <input
                type="text"
                value={udyamNo}
                onChange={(e) => setUdyamNo(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Description & Quality Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail physical condition, packaging (baled, loose, drums), loading facilities..."
              className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-850 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{postType === 'scrap' ? 'Publish Scrap Listing' : 'Publish Buyer Demand'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
