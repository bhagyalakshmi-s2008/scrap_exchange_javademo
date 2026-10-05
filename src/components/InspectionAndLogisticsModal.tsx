import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, FileText, Download, Printer, QrCode, Building2 } from 'lucide-react';
import { ScrapListing } from '../types/scrap';

interface InspectionAndLogisticsModalProps {
  listing: ScrapListing | null;
  onClose: () => void;
  onBookLogistics?: (bookingData: any) => void;
}

export const InspectionAndLogisticsModal: React.FC<InspectionAndLogisticsModalProps> = ({
  listing,
  onClose,
  onBookLogistics,
}) => {
  const [activeTab, setActiveTab] = useState<'inspection' | 'logistics'>('inspection');
  const [carrier, setCarrier] = useState('Tata Motors FleetLink MSME Logistics');
  const [scheduledDate, setScheduledDate] = useState('2026-10-08');
  const [transitConfirmed, setTransitConfirmed] = useState(false);

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-850">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-0.5">
              Value-Added Services & Compliance
            </div>
            <h3 className="text-xl font-bold text-white">
              {activeTab === 'inspection' ? 'Certified Quality Inspection Certificate' : 'Logistics Partner Dispatch Hand-Off'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'inspection'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>MRAI / CPCB Quality Certificate</span>
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'logistics'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Dispatch Logistics & E-Way Transit</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-5">
          {activeTab === 'inspection' ? (
            <div className="space-y-6">
              {/* Certificate Container */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 text-xs">
                
                {/* Header of Certificate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                      Accredited Metallurgical & Chemical Testing Laboratory
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Certificate of Analysis (COA) - Industrial Scrap Lot
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      National Accreditation Board for Testing Laboratories (NABL) & MRAI Standard
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-slate-400 text-[11px] block">Certificate Ref:</span>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      COA-2026-{listing.id}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Verified Optical Spectrometry</span>
                  </div>
                </div>

                {/* Lot & Material Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Material Lot</span>
                    <span className="text-white font-semibold">{listing.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Material Grade</span>
                    <span className="text-white font-semibold">{listing.materialGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Certified Purity</span>
                    <span className="text-emerald-400 font-bold font-mono">{listing.purityPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contamination Level</span>
                    <span className="text-amber-400 font-bold font-mono">{listing.contaminationLevel}%</span>
                  </div>
                </div>

                {/* Spectrometry Alloy Assay Breakdown */}
                <div>
                  <h5 className="font-semibold text-slate-300 mb-2">
                    Chemical Composition Assay (Optical Emission Spectrometry):
                  </h5>
                  <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <table className="w-full text-left font-mono">
                      <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Element / Parameter</th>
                          <th className="p-2.5">Assay Reading</th>
                          <th className="p-2.5">ISRI / IS Specification Limit</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300">
                        <tr>
                          <td className="p-2.5 text-white font-medium">Primary Base Metal</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{listing.purityPercentage}%</td>
                          <td className="p-2.5">&gt; 97.00% Required</td>
                          <td className="p-2.5 text-emerald-400">Pass (Grade A)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-medium">Moisture & Volatile Matter</td>
                          <td className="p-2.5">&lt; 0.08%</td>
                          <td className="p-2.5">&lt; 0.50% Max</td>
                          <td className="p-2.5 text-emerald-400">Compliant</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-medium">Surface Oxides / Oils</td>
                          <td className="p-2.5">{listing.contaminationLevel}%</td>
                          <td className="p-2.5">&lt; 1.50% Max</td>
                          <td className="p-2.5 text-emerald-400">Compliant</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-medium">Radioactivity (Bq/g)</td>
                          <td className="p-2.5">0.00 Bq/g (Background)</td>
                          <td className="p-2.5">Zero tolerance</td>
                          <td className="p-2.5 text-emerald-400">Certified Free</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compliance Statement */}
                <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-white">CPCB Circular Compliance:</strong> This material meets the statutory secondary raw-material reuse criteria specified under the National Steel Scrap Policy (2019) and Central Pollution Control Board non-hazardous industrial reclamation guidelines.
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Digitally signed by Chief Metallurgist, MSME Testing Facility
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Certificate COA-2026-${listing.id} downloaded successfully as PDF.`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('logistics')}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    <span>Proceed to Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Logistics & Freight Booking</h4>
                    <p className="text-slate-400 text-[11px]">
                      Integrated partner multi-axle freight and digital E-Way bill generation.
                    </p>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold text-xs">
                    Verified Transport Network
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Select Transport Logistics Partner</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tata Motors FleetLink MSME Logistics">Tata Motors FleetLink Dedicated Freight</option>
                      <option value="Blue Dart Heavy Surface Cargo">Blue Dart Heavy Surface Cargo</option>
                      <option value="Spot Mandi Multi-Axle Fleet">Spot Mandi Dedicated Multi-Axle Fleet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Scheduled Factory Dispatch Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Route Summary */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup Location:</span>
                    <span className="text-white font-medium">{listing.location.industrialArea}, {listing.location.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Load Weight:</span>
                    <span className="font-mono font-bold text-white">{listing.quantityAvailable} Metric Tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle Type Required:</span>
                    <span className="text-slate-200">24-Foot Heavy Multi-Axle Open Flatbed</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-900 font-semibold">
                    <span className="text-slate-300">Estimated Freight Charge:</span>
                    <span className="font-mono text-amber-400 text-sm">
                      ₹{Math.round(listing.quantityAvailable * 1850).toLocaleString('en-IN')} (All inclusive)
                    </span>
                  </div>
                </div>

                {/* Green Manifest Compliance */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">CPCB Form 6 Green Transit Pass</span>
                    <span className="text-[11px] text-slate-400 block">
                      Automated non-hazardous scrap movement authorization with QR barcode.
                    </span>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                </div>
              </div>

              {!transitConfirmed ? (
                <button
                  onClick={() => {
                    setTransitConfirmed(true);
                    if (onBookLogistics) onBookLogistics({ carrier, scheduledDate, lot: listing });
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Truck className="h-4 w-4" />
                  <span>Confirm Freight Partner Booking & Generate E-Way Pass</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Freight Assigned: {carrier}</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Dispatch vehicle locked for {scheduledDate}. Driver and weighing bridge link dispatched via SMS/WhatsApp.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
