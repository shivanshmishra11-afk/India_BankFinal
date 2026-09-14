import React, { useState } from 'react';
import { UserSession, ComplaintTicket, BankAccount, Transaction, NavTab } from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  SPENDING_INSIGHTS,
  CREDIT_SCORE,
} from '../data/mockData';
import { NexoraHeader } from './NexoraHeader';
import { NexoraSidebar } from './NexoraSidebar';
import { NexoraDashboard } from './NexoraDashboard';
import { AccountsView } from './views/AccountsView';
import { CardsView } from './views/CardsView';
import { TransfersView } from './views/TransfersView';
import { InvestmentsView } from './views/InvestmentsView';
import { LoansView } from './views/LoansView';
import { OffersView } from './views/OffersView';
import { ServicesView } from './views/ServicesView';
import { ComplaintView } from './ComplaintView';
import { QuickActionModals } from './modals/QuickActionModals';

interface DashboardViewProps {
  user: UserSession;
  onNavigateToComplaint: () => void;
  recentTickets: ComplaintTicket[];
  onLogout: () => void;
  onTicketCreated?: (ticket: ComplaintTicket) => void;
  onNavigateToLogin?: () => void;
  onOpenAssistant?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigateToComplaint,
  recentTickets,
  onLogout,
  onTicketCreated,
  onNavigateToLogin,
  onOpenAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Live state for accounts & transactions
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Transfer Handler
  const handleTransferCompleted = (amount: number, description: string, payee: string) => {
    // 1. Deduct from savings account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === 'Savings'
          ? { ...acc, balance: Math.max(0, acc.balance - amount) }
          : acc
      )
    );

    // 2. Prepend transaction
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      merchant: payee,
      category: 'Transfers',
      amount: amount,
      type: 'debit',
      date: 'Today, Just now',
      status: 'Completed',
      reference: `UPI/NXRA/${Date.now().toString().slice(-6)}`,
      iconType: 'transfer',
      description: description,
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col font-sans">
      {/* Top Nexora NetBanking Header */}
      <NexoraHeader
        user={user}
        onLogout={onLogout}
        onOpenHelp={() => onOpenAssistant && onOpenAssistant()}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigateToComplaints={() => setActiveTab('complaints')}
        onNavigateToLogin={onNavigateToLogin}
        ticketCount={recentTickets.length}
      />

      {/* Main Content Layout with Fixed Sidebar + Fluid View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <NexoraSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenReferEarn={() => setActiveModal('refer-earn')}
          />
        </div>

        {/* Mobile Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 bg-white shadow-2xl flex flex-col">
              <NexoraSidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                onOpenReferEarn={() => {
                  setActiveModal('refer-earn');
                  setIsMobileMenuOpen(false);
                }}
                isMobile
                onCloseMobile={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Active View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <NexoraDashboard
              user={user}
              accounts={accounts}
              transactions={transactions}
              spendingCategories={SPENDING_INSIGHTS}
              creditData={CREDIT_SCORE}
              onOpenActionModal={(action) => setActiveModal(action)}
              onSelectNavTab={(tab) => setActiveTab(tab)}
              onOpenAssistant={() => onOpenAssistant && onOpenAssistant()}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              transactions={transactions}
              onOpenActionModal={(action) => setActiveModal(action)}
            />
          )}

          {activeTab === 'complaints' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <ComplaintView
                user={user}
                onReturnToDashboard={() => setActiveTab('home')}
                onTicketCreated={(ticket) => {
                  onTicketCreated?.(ticket);
                }}
              />
            </div>
          )}

          {activeTab === 'cards' && <CardsView />}

          {(activeTab === 'transfers' || activeTab === 'payments') && (
            <TransfersView
              accounts={accounts}
              onTransferCompleted={handleTransferCompleted}
              onOpenScanPay={() => setActiveModal('scan-pay')}
            />
          )}

          {activeTab === 'investments' && (
            <InvestmentsView onOpenFdModal={() => setActiveModal('open-fd')} />
          )}

          {activeTab === 'loans' && <LoansView />}

          {activeTab === 'offers' && <OffersView />}

          {activeTab === 'services' && (
            <ServicesView onOpenGrievance={onNavigateToComplaint} />
          )}
        </main>
      </div>

      {/* Quick Action Modals (Send Money, Scan & Pay, Open FD, Statement, Credit Report, Refer & Earn) */}
      <QuickActionModals
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
        accounts={accounts}
        creditData={CREDIT_SCORE}
        onTransferSuccess={handleTransferCompleted}
        onOpenGrievance={onNavigateToComplaint}
      />
    </div>
  );
};
