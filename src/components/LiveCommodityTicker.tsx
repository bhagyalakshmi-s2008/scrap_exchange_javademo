import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { CommodityPrice } from '../types/scrap';

interface LiveCommodityTickerProps {
  tickers: CommodityPrice[];
  onSelectTicker?: (ticker: CommodityPrice) => void;
}

export const LiveCommodityTicker: React.FC<LiveCommodityTickerProps> = ({ tickers, onSelectTicker }) => {
  return (
    <div className="w-full border-b border-slate-800 bg-slate-900/60 py-2.5 px-4 overflow-hidden">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Activity className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Live Indian Benchmark Mandi & MCX Indices</span>
          <span className="hidden sm:inline text-slate-500">· Real-Time Feed</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
          {tickers.map((item) => {
            const isPositive = item.change24h >= 0;
            return (
              <button
                key={item.symbol}
                onClick={() => onSelectTicker && onSelectTicker(item)}
                className="flex items-center gap-2 text-left group hover:bg-slate-800/80 px-2 py-1 rounded transition-colors whitespace-nowrap"
              >
                <span className="font-medium text-slate-300 group-hover:text-amber-400 transition-colors">
                  {item.symbol.replace('-MCX', '')}
                </span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  ₹{item.price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center text-[11px] font-mono tabular-nums ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="mr-0.5 h-3 w-3 inline" />
                  ) : (
                    <TrendingDown className="mr-0.5 h-3 w-3 inline" />
                  )}
                  {isPositive ? '+' : ''}
                  {item.change24h}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
