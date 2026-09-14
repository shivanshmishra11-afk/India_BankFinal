import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  Wifi,
  Globe,
  Plus,
  ArrowUpRight,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { BankCard } from '../../types';
import { MOCK_CARDS } from '../../data/mockData';

export const CardsView: React.FC = () => {
  const [cards, setCards] = useState<BankCard[]>(MOCK_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0].id);
  const [showCvv, setShowCvv] = useState(false);
  const [domesticLimit, setDomesticLimit] = useState(250000);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const toggleFreeze = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' } : c
      )
    );
  };

  const toggleInternational = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, internationalEnabled: !c.internationalEnabled } : c
      )
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cards &amp; Digital Wallets</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your India Bank credit and debit cards, limits, and instant security controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Card Display and Selector */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card Visual with Metallic Gradient */}
          <div
            className={`relative h-56 sm:h-60 rounded-xl p-6 text-white shadow-md bg-gradient-to-br ${currentCard.gradient} flex flex-col justify-between overflow-hidden border border-white/10`}
          >
            {/* Top row: Brand & Wifi */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight">India Bank</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-white/80">
                  {currentCard.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-white/80 rotate-90" />
                {currentCard.status === 'Frozen' && (
                  <span className="text-[10px] font-bold bg-red-600 px-2 py-0.5 rounded">
                    FROZEN
                  </span>
                )}
              </div>
            </div>

            {/* Middle: EMV Chip & Contactless */}
            <div className="relative z-10 my-auto">
              <div className="w-11 h-8 rounded bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/40 mb-3 flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-600/40 rounded-xs grid grid-cols-2" />
              </div>
              <div className="font-mono text-xl sm:text-2xl tracking-widest text-white/95 font-medium drop-shadow-sm">
                {currentCard.cardNumber}
              </div>
            </div>

            {/* Bottom: Cardholder, Expiry, Network */}
            <div className="flex items-end justify-between relative z-10 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/60 block">Card Holder</span>
                <span className="font-semibold tracking-wide">{currentCard.cardHolder}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expires</span>
                <span className="font-mono font-semibold">{currentCard.expiry}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold italic tracking-tight text-white">
                  {currentCard.network}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Switcher Tabs */}
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedCardId === card.id
                    ? 'bg-white border-indigo-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{card.cardName}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                    card.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {card.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{card.maskedNumber}</p>
              </button>
            ))}
          </div>

          {/* Reward Points Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800">Reward Points</span>
                <p className="text-base font-bold text-indigo-700">
                  {currentCard.rewardPoints.toLocaleString('en-IN')} pts
                </p>
              </div>
            </div>
            <button className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 px-3 py-1.5 rounded-md bg-white border border-slate-200 transition-colors cursor-pointer">
              Redeem (₹{Math.round(currentCard.rewardPoints * 0.25)})
            </button>
          </div>
        </div>

        {/* Right: Security & Limits Settings */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase">Instant Card Controls</h3>

            {/* CVV Reveal */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Security CVV</span>
                <span className="text-[11px] text-slate-500">Never share your CVV with anyone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {showCvv ? currentCard.cvv : '•••'}
                </span>
                <button
                  onClick={() => setShowCvv(!showCvv)}
                  className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lock / Freeze Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded ${currentCard.status === 'Frozen' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {currentCard.status === 'Frozen' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Freeze Card</span>
                  <span className="text-[11px] text-slate-500">Instantly block all outgoing card transactions</span>
                </div>
              </div>
              <button
                onClick={() => toggleFreeze(currentCard.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  currentCard.status === 'Frozen'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {currentCard.status === 'Frozen' ? 'Unfreeze' : 'Freeze Card'}
              </button>
            </div>

            {/* International Transactions */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-blue-100 text-blue-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">International Usage</span>
                  <span className="text-[11px] text-slate-500">Allow overseas merchants &amp; forex transactions</span>
                </div>
              </div>
              <button
                onClick={() => toggleInternational(currentCard.id)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  currentCard.internationalEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
              </button>
            </div>

            {/* Domestic Limit Slider */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Daily Domestic Limit</span>
                <span className="font-mono font-bold text-indigo-700">
                  ₹{domesticLimit.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={domesticLimit}
                onChange={(e) => setDomesticLimit(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
