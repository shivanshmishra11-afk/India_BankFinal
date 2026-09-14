import React, { useState } from 'react';
import {
  TrendingUp,
  Landmark,
  Shield,
  Coins,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface InvestmentsViewProps {
  onOpenFdModal: () => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({ onOpenFdModal }) => {
  const [calcAmount, setCalcAmount] = useState('200000');
  const [calcTenure, setCalcTenure] = useState(24);

  const principal = parseFloat(calcAmount) || 0;
  const rate = 0.0675; // 6.75%
  const years = calcTenure / 12;
  const maturity = Math.round(principal * Math.pow(1 + rate / 4, 4 * years));
  const interest = maturity - principal;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Investments &amp; Wealth</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Grow your wealth with assured returns, government sovereign bonds, and wealth portfolios.
          </p>
        </div>

        <button
          onClick={onOpenFdModal}
          className="px-3.5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Book Fixed Deposit</span>
        </button>
      </div>

      {/* Hero Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
              High Yield FD
            </span>
            <h3 className="text-base font-bold mt-2.5">Fixed Deposits</h3>
            <p className="text-2xl font-bold text-amber-400 mt-1">6.75% p.a.</p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">DICGC Insured up to ₹5 Lakhs per depositor.</p>
          </div>
          <button
            onClick={onOpenFdModal}
            className="mt-4 px-3 py-1.5 rounded-md bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer self-start"
          >
            Open Instant FD →
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Government Backed
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2.5">Sovereign Gold Bonds</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">2.50% annual coupon interest plus gold price appreciation.</p>
          </div>
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
            <span className="font-semibold text-emerald-600 text-[11px]">Series 2026-IV Open</span>
            <button className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Apply Now →</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Direct Mutual Funds
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2.5">Zero-Commission SIP</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Start SIPs starting ₹500/month with zero upfront commission charges.</p>
          </div>
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
            <span className="font-medium text-slate-600 text-[11px]">1,200+ Schemes</span>
            <button className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Explore Funds →</button>
          </div>
        </div>
      </div>

      {/* FD Returns Calculator */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tight">Fixed Deposit Calculator</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Investment Amount</label>
                <span className="text-sm font-bold text-indigo-700">₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Tenure: {calcTenure} Months</label>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">6.75% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={calcTenure}
                onChange={(e) => setCalcTenure(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>6 Months</span>
                <span>24 Months</span>
                <span>60 Months</span>
              </div>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-600 pb-2.5 border-b border-slate-200">
              <span>Total Principal Invested:</span>
              <span className="font-semibold text-slate-900">₹{principal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 pb-2.5 border-b border-slate-200">
              <span>Estimated Interest Earned:</span>
              <span className="font-semibold text-emerald-600">+ ₹{interest.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-semibold text-slate-900">Total Maturity Value:</span>
              <span className="text-xl font-bold text-indigo-700">₹{maturity.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={onOpenFdModal}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Book FD for ₹{principal.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
