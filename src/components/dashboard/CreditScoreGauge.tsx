import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CreditScoreData } from '../../types';

interface CreditScoreGaugeProps {
  creditData: CreditScoreData;
  onViewReport: () => void;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  creditData,
  onViewReport,
}) => {
  // 300 to 900 scale normalized to 0 to 180 degrees
  // 782 on a 300-900 scale = (782 - 300) / 600 = 482 / 600 = ~80.3%
  const percentage = Math.min(
    1,
    Math.max(0, (creditData.score - 300) / (creditData.maxScore - 300))
  );
  // Angle for the needle: 0 deg (left/poor) to 180 deg (right/excellent)
  const angle = percentage * 180;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-left">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase">
          Your credit score
        </h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          {creditData.rating}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        {/* Left Score Metrics */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {creditData.score}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {creditData.maxScore}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Updated on {creditData.updatedDate}
          </p>
        </div>

        {/* Right Gauge Arc */}
        <div className="relative w-28 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 120 70" className="w-28 h-16">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 15 60 A 45 45 0 0 1 105 60"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Active Colored Arc */}
            <path
              d="M 15 60 A 45 45 0 0 1 105 60"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Needle Pivot & Line */}
            <g transform={`rotate(${angle - 90} 60 60)`}>
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="22"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="60" cy="60" r="4.5" fill="#1E293B" />
              <circle cx="60" cy="60" r="2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={onViewReport}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>View full report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          CIBIL TransUnion
        </span>
      </div>
    </div>
  );
};
