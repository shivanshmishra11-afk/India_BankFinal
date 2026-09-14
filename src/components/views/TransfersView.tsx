import React, { useState } from 'react';
import {
  Send,
  UserPlus,
  ArrowLeftRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  QrCode,
} from 'lucide-react';
import { BankAccount, QuickPayee } from '../../types';
import { QUICK_PAYEES } from '../../data/mockData';

interface TransfersViewProps {
  accounts: BankAccount[];
  onTransferCompleted?: (amount: number, desc: string, payee: string) => void;
  onOpenScanPay: () => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  accounts,
  onTransferCompleted,
  onOpenScanPay,
}) => {
  const [payees, setPayees] = useState<QuickPayee[]>(QUICK_PAYEES);
  const [selectedPayeeId, setSelectedPayeeId] = useState<string>(payees[0]?.id || 'p1');
  const [amount, setAmount] = useState('');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'UPI'>('IMPS');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAddPayee, setShowAddPayee] = useState(false);

  // New Payee Form
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('NXRA0004521');

  const selectedPayee = payees.find((p) => p.id === selectedPayeeId) || payees[0];

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    if (onTransferCompleted) {
      onTransferCompleted(val, note || `Transfer to ${selectedPayee.name}`, selectedPayee.name);
    }
    setIsSuccess(true);
  };

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName.trim()) return;
    const newP: QuickPayee = {
      id: `p-${Date.now()}`,
      name: newPayeeName,
      accountNumber: newPayeeAcc || 'XXXX 8899',
      bankName: 'Indian Bank',
      avatar: newPayeeName.charAt(0).toUpperCase(),
    };
    setPayees((prev) => [...prev, newP]);
    setSelectedPayeeId(newP.id);
    setShowAddPayee(false);
    setNewPayeeName('');
    setNewPayeeAcc('');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transfers &amp; Remittance</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Send money across India via 24x7 IMPS, UPI, NEFT, and RTGS without charges.
          </p>
        </div>

        <button
          onClick={onOpenScanPay}
          className="px-3.5 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Any QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Payees & Transfer Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase">Select Beneficiary</h3>
              <button
                onClick={() => setShowAddPayee(!showAddPayee)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Payee</span>
              </button>
            </div>

            {/* Add Payee Collapsible Form */}
            {showAddPayee && (
              <form onSubmit={handleAddPayee} className="p-3.5 bg-slate-50 rounded-lg mb-3 space-y-3 border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-800">Add New Beneficiary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newPayeeName}
                    onChange={(e) => setNewPayeeName(e.target.value)}
                    required
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Account / UPI ID"
                    value={newPayeeAcc}
                    onChange={(e) => setNewPayeeAcc(e.target.value)}
                    required
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPayee(false)}
                    className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Payee
                  </button>
                </div>
              </form>
            )}

            {/* Payee Avatars Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {payees.map((p) => {
                const isSelected = p.id === selectedPayeeId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPayeeId(p.id)}
                    className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer flex flex-col items-center ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-1">
                      {p.avatar}
                    </div>
                    <span className="text-xs font-semibold text-slate-900 truncate w-full">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.accountNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Transfer Details Form */}
            {isSuccess ? (
              <div className="mt-5 py-5 text-center space-y-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Transfer Completed!</h4>
                <p className="text-xs text-slate-600">
                  ₹{parseFloat(amount).toLocaleString('en-IN')} successfully sent to {selectedPayee.name}.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setAmount('');
                    setNote('');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Make Another Transfer
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="mt-5 space-y-3.5 pt-3.5 border-t border-slate-100">
                {/* Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Payment Network
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['IMPS', 'UPI', 'NEFT', 'RTGS'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTransferMode(m)}
                        className={`py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                          transferMode === m
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-bold text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Description / Purpose
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Monthly Rent, Invoice Clearance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send ₹{amount || '0'} to {selectedPayee.name}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Security & Limits Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tight">Payment Protocols &amp; Limits</h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">IMPS / UPI 24x7</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Instant real-time fund settlement up to ₹5,00,000 per transaction available round the clock.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">RBI Positive Pay System</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    High value transactions above ₹50,000 are encrypted and cross-verified against recipient details.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Zero Convenience Charges</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    All digital transfers across NEFT, RTGS, IMPS, and UPI are 100% free of processing fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
