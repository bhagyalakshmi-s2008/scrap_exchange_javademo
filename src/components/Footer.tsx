import React from 'react';
import { ShieldCheck, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-900">
          
          <div className="md:col-span-5 space-y-3">
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
              <span>AI Scrap Exchanger</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An AI-powered real-time marketplace converting Indian industrial scrap into verified raw materials. Project Assignment Report — MSME Hackathon. Guided by the principle: <em>"One man’s trash is another man’s treasure."</em>
            </p>
            <div className="text-[11px] text-slate-500">
              Scoped to Indian MSME manufacturing clusters: Pune MIDC, Ludhiana Forging Belt, Peenya Bengaluru, Surat GIDC, Manesar Auto Hub.
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="font-semibold text-white block uppercase tracking-wider text-[11px]">
              Institutional & Regulatory References
            </span>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>Ministry of MSME, Govt. of India (msme.gov.in)</li>
              <li>National Steel Scrap Recycling Policy (2019)</li>
              <li>Central Pollution Control Board (CPCB) Guidelines</li>
              <li>NITI Aayog Strategy on Resource Efficiency & Circularity</li>
              <li>Metal Recycling Association of India (MRAI)</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="font-semibold text-white block uppercase tracking-wider text-[11px]">
              Four-Step Architecture
            </span>
            <div className="space-y-1 text-slate-400 text-xs font-mono">
              <div>01. Register & Post Specifications</div>
              <div>02. AI Multi-Factor Matchmaking</div>
              <div>03. Real-Time Mandi & MCX Pricing</div>
              <div>04. AI-Assisted Deal Negotiation</div>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AI Scrap Exchanger. Designed for Indian MSME Circular Manufacturing Symbiosis.
          </div>
          <div className="flex items-center gap-4">
            <span>Udyam Registered</span>
            <span>·</span>
            <span>GSTIN Compliant</span>
            <span>·</span>
            <span>CPCB Circular Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
