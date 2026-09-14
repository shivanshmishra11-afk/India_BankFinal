import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { BANK_OFFERS } from '../../data/mockData';

export const OffersView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Exclusive Offers</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Handpicked deals, dining privileges, and travel discounts exclusively for India Bank customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BANK_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {offer.category}
                </span>
                <span className="text-[11px] text-slate-400">{offer.expiry}</span>
              </div>

              <h3 className="font-semibold text-slate-900 text-sm">{offer.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{offer.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                <span>{offer.code || 'CLAIMNOW'}</span>
              </div>

              <button
                onClick={() => handleCopy(offer.code || 'CLAIMNOW')}
                className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === (offer.code || 'CLAIMNOW') ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCode === (offer.code || 'CLAIMNOW') ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
