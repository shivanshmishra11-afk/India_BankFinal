import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SpendingCategory } from '../../types';

interface SpendingDonutChartProps {
  categories: SpendingCategory[];
}

export const SpendingDonutChart: React.FC<SpendingDonutChartProps> = ({ categories }) => {
  const [timeRange, setTimeRange] = useState<'This month' | 'Last month' | 'This year'>('This month');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<SpendingCategory | null>(null);

  // Compute total spent
  const multiplier = timeRange === 'This month' ? 1 : timeRange === 'Last month' ? 0.92 : 4.8;
  const currentCategories = categories.map((c) => ({
    ...c,
    amount: Math.round(c.amount * multiplier),
  }));

  const totalSpent = currentCategories.reduce((acc, curr) => acc + curr.amount, 0);

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-left">
      {/* Header with Title & Filter Dropdown */}
      <div className="flex items-center justify-between relative mb-4">
        <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase">
          Spending insights
        </h3>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-md border border-slate-200 py-1 z-20">
              {(['This month', 'Last month', 'This year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                    timeRange === range
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart & Center Metric */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {currentCategories.map((cat) => {
              const slicePercent = cat.amount / totalSpent;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slicePercent;

              const isHovered = hoveredCategory?.id === cat.id;

              return (
                <circle
                  key={cat.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {hoveredCategory
                ? `₹${hoveredCategory.amount.toLocaleString('en-IN')}`
                : `₹${totalSpent.toLocaleString('en-IN')}`}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {hoveredCategory ? hoveredCategory.name : 'Total Spent'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full flex-1 space-y-2.5">
          {currentCategories.map((cat) => {
            const isHovered = hoveredCategory?.id === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-50 font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-600 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-800">
                  ₹{cat.amount.toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
