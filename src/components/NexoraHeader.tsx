import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Mail,
  HelpCircle,
  ChevronDown,
  LogOut,
  ShieldCheck,
  User,
  Settings,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  KeyRound
} from 'lucide-react';
import { UserSession } from '../types';

interface NexoraHeaderProps {
  user: UserSession | null;
  onLogout?: () => void;
  onOpenHelp?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onNavigateToComplaints?: () => void;
  onNavigateToLogin?: () => void;
  ticketCount?: number;
}

export const NexoraHeader: React.FC<NexoraHeaderProps> = ({
  user,
  onLogout,
  onOpenHelp,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onNavigateToComplaints,
  onNavigateToLogin,
  ticketCount = 0,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationsList = [
    {
      id: 'n1',
      title: 'Salary Credited',
      desc: '₹75,000.00 credited via NEFT from ABC Corp',
      time: '15 May 2026',
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      id: 'n2',
      title: 'FD Maturity Alert',
      desc: 'FD XXXX 9101 matures on 12 Sep 2026. High yield reinvestment available.',
      time: '12 May 2026',
      icon: AlertCircle,
      color: 'text-amber-500',
    },
    {
      id: 'n3',
      title: 'Security Notice',
      desc: 'NetBanking login verified successfully from trusted browser.',
      time: 'Today',
      icon: ShieldCheck,
      color: 'text-indigo-500',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          {/* Nexora Geometric 3D Diamond / Facet Logo */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              className="w-8 h-8 drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 2L32 10.5V25.5L18 34L4 25.5V10.5L18 2Z"
                fill="url(#nexoraGrad1)"
              />
              <path
                d="M18 2L32 10.5L18 19L4 10.5L18 2Z"
                fill="#7C3AED"
                fillOpacity="0.85"
              />
              <path
                d="M18 19L32 10.5V25.5L18 34V19Z"
                fill="#4F46E5"
              />
              <path
                d="M18 19L4 10.5V25.5L18 34V19Z"
                fill="#6366F1"
                fillOpacity="0.9"
              />
              <defs>
                <linearGradient
                  id="nexoraGrad1"
                  x1="4"
                  y1="2"
                  x2="32"
                  y2="34"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366F1" />
                  <stop offset="0.5" stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#312E81" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                India Bank
              </span>
              <span className="text-[10px] tracking-wider font-bold uppercase bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                NETBANKING
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-medium tracking-wide">
              Official Digital Banking &amp; Grievance Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Grievance Desk, Notifications, Messages, Help, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Direct Link to Complaints & Grievance Desk */}
        {onNavigateToComplaints && (
          <button
            onClick={onNavigateToComplaints}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
            title="Lodge Grievance, Cheque Inquiries & Dispute Redressal"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="hidden sm:inline">Grievance and Dispute</span>
            <span className="sm:hidden">Support</span>
            {ticketCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[10px] font-bold leading-none flex items-center justify-center ml-0.5">
                {ticketCount}
              </span>
            )}
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
              setShowProfileMenu(false);
              setUnreadNotifications(0);
            }}
            className="p-2 sm:p-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-md border border-slate-200 p-3.5 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-xs">Notifications</h3>
                <span className="text-[11px] font-medium text-indigo-600 cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                {notificationsList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50 px-2 rounded-md transition-colors cursor-pointer">
                      <div className={`p-1.5 rounded-md bg-slate-100 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Messages / Mail */}
        {user && (
          <div className="relative" ref={msgRef}>
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="p-2 sm:p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Messages"
            >
              <Mail className="w-5 h-5" />
            </button>

            {showMessages && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-md border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-sm">Banking Messages</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">1 New</span>
                </div>
                <div className="py-3 text-left">
                  <p className="text-xs font-semibold text-slate-900">E-Statement Q1 FY26-27</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Your digitally signed account statement has been generated and archived safely.</p>
                  <span className="text-[10px] text-indigo-600 font-medium mt-2 inline-block hover:underline cursor-pointer">Download Statement PDF →</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Care Hotline (Visible in logged out & small screens) */}
        {!user && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            <span>24x7 Care: <strong>1800 202 6161</strong></span>
          </div>
        )}

        {!user && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        )}

        {/* Help Circle Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 sm:p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Help and Support"
          title="24x7 Customer Support & FAQ"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile Avatar Pill */}
        {user ? (
          <div className="relative ml-1 sm:ml-2" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowMessages(false);
              }}
              className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-indigo-200 shadow-xs flex items-center justify-center bg-indigo-600 text-white font-semibold text-xs sm:text-sm">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                )}
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-slate-800">
                {user.name}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-md border border-slate-200 p-3 z-50 text-left">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      KYC Verified • Tier 1
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & KYC Details</span>
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Security & 2FA Settings</span>
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Limits & Biometric Lock</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {onNavigateToLogin && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigateToLogin();
                      }}
                      className="w-full px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <span>Go to Login Page / Switch User</span>
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Secure Logout</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : onNavigateToLogin && (
          <button
            onClick={onNavigateToLogin}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            NetBanking Login
          </button>
        )}
      </div>
    </header>
  );
};
