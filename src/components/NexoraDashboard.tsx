import React, { useState } from 'react';
import {
  ArrowRight,
  Landmark,
  Building2,
  Lock,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  PhoneCall,
} from 'lucide-react';
import {
  BankAccount,
  Transaction,
  SpendingCategory,
  CreditScoreData,
  UserSession,
} from '../types';
import { QuickActionsGrid, QuickActionType } from './dashboard/QuickActionsGrid';
import { SpendingDonutChart } from './dashboard/SpendingDonutChart';
import { CreditScoreGauge } from './dashboard/CreditScoreGauge';

interface NexoraDashboardProps {
  user: UserSession;
  accounts: BankAccount[];
  transactions: Transaction[];
  spendingCategories: SpendingCategory[];
  creditData: CreditScoreData;
  onOpenActionModal: (actionType: string) => void;
  onSelectNavTab: (tab: any) => void;
  onOpenAssistant: () => void;
  onSelectAccount?: (account: BankAccount) => void;
}

export const NexoraDashboard: React.FC<NexoraDashboardProps> = ({
  user,
  accounts,
  transactions,
  spendingCategories,
  creditData,
  onOpenActionModal,
  onSelectNavTab,
  onOpenAssistant,
  onSelectAccount,
}) => {
  // Determine greeting based on current local hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.split(' ')[0] || 'Ananya';

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Helper for transaction merchant icon/avatar
  const renderTxnAvatar = (txn: Transaction) => {
    if (txn.iconType === 'amazon') {
      return (
        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-200 shrink-0">
          a
        </div>
      );
    }
    if (txn.iconType === 'salary') {
      return (
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
      );
    }
    if (txn.iconType === 'swiggy') {
      return (
        <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-700 font-bold flex items-center justify-center border border-orange-200 shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V11c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5.5zm0-8c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
          </svg>
        </div>
      );
    }
    if (txn.iconType === 'electricity') {
      return (
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shrink-0">
          <Zap className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
        <Landmark className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] min-h-[calc(100vh-61px)] text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        {/* ============================================================ */}
        {/* LEFT & CENTER COLUMN (Span 8 on XL)                          */}
        {/* ============================================================ */}
        <div className="xl:col-span-8 space-y-6 sm:space-y-7">
          {/* Greeting Headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{greeting},</span>
              <span className="text-indigo-600">{firstName}</span>
              <span className="text-2xl sm:text-3xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Here's what's happening with your accounts today.
            </p>
          </div>

          {/* Exclusive Offer Banner matching screenshot */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#100732] via-[#1E1156] to-[#3B1E91] text-white p-6 sm:p-7 border border-indigo-900/40">
            {/* Subtle light mesh accent */}
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-md space-y-3">
                <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-indigo-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                  Exclusive offer for you
                </span>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                  Get up to 6.75% p.a. on your Fixed Deposit.
                </h2>

                <div className="pt-1">
                  <button
                    onClick={() => onOpenActionModal('open-fd')}
                    className="px-4 py-2 rounded-md border border-white/80 text-white text-xs sm:text-sm font-semibold hover:bg-white hover:text-[#1E1156] transition-colors cursor-pointer"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Piggy bank visual */}
              <div className="relative w-36 h-32 sm:w-44 sm:h-40 shrink-0 self-center sm:self-auto flex items-center justify-center">
                <img
                  src="./assets/piggy_bank.jpg"
                  alt="Fixed Deposit Offer"
                  className="w-full h-full object-contain drop-shadow-md hover:scale-102 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grievance & Dispute Redressal Desk Card */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Customer Grievance &amp; Dispute Redressal Desk
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                    &lt; 24h Resolution
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Lodge official service inquiries, cheque book dispatch disputes, or tax statements with guaranteed turnaround under 24 hours directly with our specialized desk.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectNavTab('complaints')}
              className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Lodge Grievance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* Section: Accounts at a glance                                */}
          {/* ============================================================ */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                Accounts at a glance
              </h3>
              <button
                onClick={() => onSelectNavTab('accounts')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                View all accounts
              </button>
            </div>

            {/* 3 Account Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Savings Account */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Savings Account
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 1234
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl font-bold text-slate-900 tracking-tight block">
                      ₹1,24,560.50
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Available Balance
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('accounts')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Current Account */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Current Account
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 5678
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl font-bold text-slate-900 tracking-tight block">
                      ₹8,75,000.00
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Available Balance
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('accounts')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Fixed Deposit */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Fixed Deposit
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 9101
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl font-bold text-slate-900 tracking-tight block">
                      ₹5,00,000.00
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Matures on 12 Sep 2026
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('investments')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Section: Recent transactions                                */}
          {/* ============================================================ */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                Recent transactions
              </h3>
              <button
                onClick={() => onSelectNavTab('accounts')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-xs divide-y divide-slate-100">
              {transactions.slice(0, 4).map((txn) => {
                const isCredit = txn.type === 'credit';
                return (
                  <div
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="p-2.5 sm:p-3 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                  >
                    {/* Left: Icon & Merchant / Category */}
                    <div className="flex items-center gap-3">
                      {renderTxnAvatar(txn)}
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {txn.merchant}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {txn.category}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount, Date, Chevron */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={`text-xs sm:text-sm font-bold tracking-tight block ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isCredit ? '+ ' : '- '}₹
                          {txn.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {txn.date}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (Span 4 on XL)                                  */}
        {/* ============================================================ */}
        <div className="xl:col-span-4 space-y-6">
          {/* 1. Quick actions grid */}
          <QuickActionsGrid
            onActionClick={(action) => {
              if (action === 'more') {
                onSelectNavTab('services');
              } else {
                onOpenActionModal(action);
              }
            }}
          />

          {/* 2. Spending insights Donut Chart */}
          <SpendingDonutChart categories={spendingCategories} />

          {/* 3. Your credit score Speedometer Gauge */}
          <CreditScoreGauge
            creditData={creditData}
            onViewReport={() => onOpenActionModal('credit-report')}
          />

          {/* 4. Need help? Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  Ask Zora
                </h4>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                  24x7 AI
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Cards, FDs, loans &amp; banking questions
              </p>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                Instant smart answers &amp; guide
              </span>
            </div>

            <button
              onClick={onOpenAssistant}
              className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer shrink-0 shadow-xs"
              aria-label="Chat with Zora"
              title="Chat with Zora"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Drawer Modal (Optional drill-down) */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl border border-slate-200 p-5 text-left relative">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Transaction Details
              </span>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 border border-indigo-100">
                {renderTxnAvatar(selectedTxn)}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedTxn.merchant}
              </h4>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {selectedTxn.type === 'credit' ? '+ ' : '- '}₹
                {selectedTxn.amount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200">
                {selectedTxn.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-slate-800">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span className="font-semibold text-slate-800">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Reference ID:</span>
                <span className="font-mono text-slate-800">{selectedTxn.reference}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="mt-4 w-full py-2 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
