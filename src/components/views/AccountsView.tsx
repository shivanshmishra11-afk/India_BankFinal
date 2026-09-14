import React, { useState } from 'react';
import {
  Landmark,
  Building2,
  Lock,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';

interface AccountsViewProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  onOpenActionModal: (action: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  transactions,
  onOpenActionModal,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || txn.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Shopping', 'Salary', 'Food & Dining', 'Bills & Utilities', 'Investments'];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Accounts &amp; Statements</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Overview of your operating accounts, balances, and verified transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenActionModal('statement')}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download Statement</span>
          </button>
          <button
            onClick={() => onOpenActionModal('send-money')}
            className="px-3.5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer text-left ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {acc.type}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {acc.status}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{acc.maskedNumber}</span>
                <span>IFSC: {acc.routingNumber}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tight">Statement History</h3>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 px-2.5 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <div key={txn.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    isCredit ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900">{txn.merchant}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{txn.category} • Ref: {txn.reference}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs sm:text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isCredit ? '+ ' : '- '}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{txn.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
