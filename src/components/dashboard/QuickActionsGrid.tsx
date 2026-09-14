import React from 'react';
import {
  Send,
  Receipt,
  Smartphone,
  FileText,
  UserPlus,
  QrCode,
  Landmark,
  MoreHorizontal,
} from 'lucide-react';

export type QuickActionType =
  | 'send-money'
  | 'pay-bills'
  | 'recharge'
  | 'statement'
  | 'add-payee'
  | 'scan-pay'
  | 'open-fd'
  | 'more';

interface QuickActionsGridProps {
  onActionClick: (action: QuickActionType) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionClick }) => {
  const actions: { id: QuickActionType; label: string; icon: React.ElementType }[] = [
    { id: 'send-money', label: 'Send Money', icon: Send },
    { id: 'pay-bills', label: 'Pay Bills', icon: Receipt },
    { id: 'recharge', label: 'Recharge', icon: Smartphone },
    { id: 'statement', label: 'Statement', icon: FileText },
    { id: 'add-payee', label: 'Add Payee', icon: UserPlus },
    { id: 'scan-pay', label: 'Scan & Pay', icon: QrCode },
    { id: 'open-fd', label: 'Open FD', icon: Landmark },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-left">
      <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase mb-4">
        Quick actions
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.id)}
              className="group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 mt-1.5 text-center leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
