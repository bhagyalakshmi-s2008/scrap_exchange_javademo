import React, { useState } from 'react';
import { UserPlus, Sparkles, Scale, Handshake, ArrowRight, ShieldCheck } from 'lucide-react';

interface OperationalFlowStepperProps {
  onStepSelect: (stepIndex: number) => void;
}

export const OperationalFlowStepper: React.FC<OperationalFlowStepperProps> = ({ onStepSelect }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Register & Post',
      shortDesc: 'Udyam verified onboarding and catalog specifications.',
      fullDescription: 'Enterprises sign up with GSTIN / Udyam registration verification. Sellers post surplus factory scrap with alloy grades, purity, and photos; buyers post exact raw-material input requirements.',
      actionLabel: 'Post Scrap or Requirement',
      targetTab: 'marketplace',
      highlights: [
        'GSTIN & MSME Udyam Business Verification',
        'Physical form specification (Wire, Offcuts, Turnings, Regrind)',
        'Contamination, purity, and pickup lot dimensions'
      ]
    },
    {
      num: '02',
      title: 'AI Matches',
      shortDesc: 'Automated pairing by grade, quantity, region & timing.',
      fullDescription: 'The matching engine computes a multi-parameter compatibility score factoring in chemical alloy equivalents, MOQ thresholds, geographic freight radius, and delivery windows.',
      actionLabel: 'Launch Matchmaker Engine',
      targetTab: 'matchmaker',
      highlights: [
        'Chemical and mechanical grade parity matrix',
        'Intra-cluster proximity optimization (e.g. Pune MIDC, Peenya)',
        'Match compatibility score (0-100%) with actionable insights'
      ]
    },
    {
      num: '03',
      title: 'Real-Time Pricing',
      shortDesc: 'Commodity indexed valuation adjusted for purity & freight.',
      fullDescription: 'AI anchors lot valuation to real-time MCX & Mandi indices, deducting calculated contamination smelting costs and adding precise per-ton-km logistics freight estimates.',
      actionLabel: 'Calculate Dynamic Pricing',
      targetTab: 'pricing',
      highlights: [
        'Live MCX Copper, Aluminium, and Mandi HMS Steel benchmarks',
        'Yield penalty deduction for oil, moisture, and impurities',
        'Guaranteed ~30% buyer discount vs virgin primary inputs'
      ]
    },
    {
      num: '04',
      title: 'Negotiate & Deal',
      shortDesc: 'AI-assisted counter-offers, walk-away limits & locked transit.',
      fullDescription: 'Eliminates broker-driven manipulation. The AI negotiation assistant calculates optimal counter-offers, walk-away thresholds, locks terms in digital proforma, and schedules logistics.',
      actionLabel: 'Open Negotiation Desk',
      targetTab: 'negotiation',
      highlights: [
        'Evidence-backed counter-offer suggestions based on market trends',
        'Seller & Buyer walk-away threshold governance',
        'Instant deal closure, CPCB transit manifest, and logistics hand-off'
      ]
    }
  ];

  return (
    <div className="w-full border-b border-slate-800 bg-slate-900/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              Methodology & Four-Step Operational Flow
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How AI Scrap Exchanger Works
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              From idle scrap on the factory floor to verified input raw material in days rather than months.
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Standardized Process Specified in MSME Project Report</span>
          </div>
        </div>

        {/* Step Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => {
                  setActiveStep(idx);
                }}
                className={`text-left p-5 rounded-xl border transition-all relative ${
                  isActive
                    ? 'bg-slate-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-sm font-bold ${isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                    Step {step.num}
                  </span>
                  {idx === 0 && <UserPlus className="h-4 w-4 text-slate-400" />}
                  {idx === 1 && <Sparkles className="h-4 w-4 text-slate-400" />}
                  {idx === 2 && <Scale className="h-4 w-4 text-slate-400" />}
                  {idx === 3 && <Handshake className="h-4 w-4 text-slate-400" />}
                </div>
                <div className="text-base font-semibold text-white mb-1.5">
                  {step.title}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.shortDesc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Panel */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Stage {steps[activeStep].num} Deep Dive
                </span>
                <h3 className="text-xl font-bold text-white">
                  {steps[activeStep].title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {steps[activeStep].fullDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {steps[activeStep].highlights.map((item, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center sm:items-end">
              <button
                onClick={() => onStepSelect(activeStep)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 text-xs font-bold transition-colors shadow-md"
              >
                <span>{steps[activeStep].actionLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-[11px] text-slate-500 mt-2 text-center sm:text-right">
                Jump to active interactive module
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
