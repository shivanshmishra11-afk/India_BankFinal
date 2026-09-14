import React from 'react';
import {
  Home,
  Building2,
  CreditCard,
  Send,
  ArrowLeftRight,
  TrendingUp,
  Coins,
  Tag,
  Grid,
  ArrowUpRight,
  PhoneCall,
} from 'lucide-react';
import { NavTab } from '../types';

interface NexoraSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReferEarn?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const NexoraSidebar: React.FC<NexoraSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenReferEarn,
  isMobile,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'complaints', label: 'Grievance and Dispute', icon: PhoneCall },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'payments', label: 'Payments', icon: Send },
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'loans', label: 'Loans', icon: Coins },
    { id: 'offers', label: 'Offers', icon: Tag, badge: 'New' },
    { id: 'services', label: 'Services', icon: Grid },
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between py-5 px-4 bg-[#FAFBFD] border-r border-slate-100 min-h-[calc(100vh-61px)] select-none">
      {/* Navigation Links */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Refer & Earn Card at bottom */}
      <div className="mt-8 pt-4">
        <div
          onClick={onOpenReferEarn}
          className="group relative overflow-hidden bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-slate-300 transition-colors text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">
                Refer &amp; Earn
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">
                Invite colleagues &amp; earn up to
              </p>
              <p className="text-base font-bold text-slate-900 mt-1">
                ₹500
              </p>
            </div>

            {/* Gift box icon/image */}
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
              <img
                src="./assets/gift_box.jpg"
                alt="Refer and Earn Gift"
                className="w-9 h-9 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[10px] font-medium text-indigo-700">
              Get referral code
            </span>
            <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
