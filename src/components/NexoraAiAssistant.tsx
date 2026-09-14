import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Minus,
  MessageSquare,
  HelpCircle,
  CreditCard,
  PiggyBank,
  Home,
  FileText,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { BankAccount, UserSession } from '../types';
import { ZORA_CATEGORIES, ZoraQuestionItem, searchZoraKnowledge } from '../data/zoraKnowledge';

interface ZoraAiAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  user?: UserSession | null;
  accounts?: BankAccount[];
  onOpenGrievance?: () => void;
  onQuickAction?: (action: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; action: string; type?: string }[];
  suggestedQuestions?: string[];
}

export const NexoraAiAssistant: React.FC<ZoraAiAssistantProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onToggle,
  user,
  accounts = [],
  onOpenGrievance,
  onQuickAction,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  const [input, setInput] = useState('');
  const [showQuestionDirectory, setShowQuestionDirectory] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${userName}! 👋 I'm **Zora**, your 24x7 India Bank AI Banking Assistant.\n\nI can answer questions about banking products, explain how to apply for debit or credit cards, check FD interest rates, guide you through loans, or help lodge service requests. What would you like to know today?`,
      time: 'Just now',
      quickActions: [
        { label: 'Apply for Debit Card 💳', action: 'ask:How can I apply for a new Debit Card?' },
        { label: 'Apply for Credit Card ✨', action: 'ask:How can I apply for an India Bank Credit Card?' },
        { label: 'FD Interest Rates 📈', action: 'ask:What are the current Fixed Deposit (FD) interest rates?' },
        { label: 'Request Cheque Book 📑', action: 'ask:How can I request a new Cheque Book?' },
        { label: 'Lodge Grievance (<24h)', action: 'grievance' },
        { label: 'Browse Questions List 📖', action: 'open_directory' },
      ],
      suggestedQuestions: [
        'How can I apply for a new Debit Card?',
        'How can I apply for an India Bank Credit Card?',
        'What are the current Fixed Deposit (FD) interest rates?',
        'How can I request a new Cheque Book?',
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !showQuestionDirectory) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showQuestionDirectory]);

  // Handle sending a user question
  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    setShowQuestionDirectory(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      // Look up answer from Zora knowledge base
      const result = searchZoraKnowledge(text);

      const replyActions: { label: string; action: string }[] = [];

      if (result.matchedQuestion?.actionType) {
        if (result.matchedQuestion.actionType === 'grievance') {
          replyActions.push({ label: 'Open Grievance Portal', action: 'grievance' });
        } else if (result.matchedQuestion.actionType === 'cards') {
          replyActions.push({ label: 'Manage Cards & Limits', action: 'cards' });
        } else if (result.matchedQuestion.actionType === 'apply_credit') {
          replyActions.push({ label: 'Check Credit Card Offers', action: 'cards' });
        } else if (result.matchedQuestion.actionType === 'open_fd') {
          replyActions.push({ label: 'Book Fixed Deposit', action: 'open_fd' });
        } else if (result.matchedQuestion.actionType === 'transfer') {
          replyActions.push({ label: 'Go to Fund Transfer', action: 'transfer' });
        } else if (result.matchedQuestion.actionType === 'statement') {
          replyActions.push({ label: 'Download Account Statement', action: 'statement' });
        }
      }

      // Always offer directory and grievance shortcut
      replyActions.push({ label: 'Ask Another Question 📖', action: 'open_directory' });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: result.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: replyActions,
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleActionClick = (action: string) => {
    if (action.startsWith('ask:')) {
      const q = action.replace('ask:', '');
      handleSend(q);
      return;
    }

    if (action === 'open_directory') {
      setShowQuestionDirectory(true);
      return;
    }

    if (action === 'grievance') {
      if (onOpenGrievance) onOpenGrievance();
      handleClose();
    } else if (action === 'cards') {
      if (onQuickAction) onQuickAction('cards');
      handleClose();
    } else if (action === 'open_fd') {
      if (onQuickAction) onQuickAction('open_fd');
      handleClose();
    } else if (action === 'transfer') {
      if (onQuickAction) onQuickAction('transfer');
      handleClose();
    } else if (action === 'statement') {
      if (onQuickAction) onQuickAction('statement');
      handleClose();
    } else if (onQuickAction) {
      onQuickAction(action);
      handleClose();
    }
  };

  // Filter questions in the Directory
  const filteredQuestions = ZORA_CATEGORIES.flatMap((c) =>
    activeCategoryTab === 'all' || activeCategoryTab === c.id ? c.questions : []
  ).filter((q) => {
    if (!directorySearch.trim()) return true;
    const query = directorySearch.toLowerCase();
    return (
      q.question.toLowerCase().includes(query) ||
      q.category.toLowerCase().includes(query) ||
      q.answer.toLowerCase().includes(query) ||
      q.shortLabel.toLowerCase().includes(query)
    );
  });

  // When closed, display the dynamic bottom-right floating trigger button
  if (!isOpen) {
    return (
      <button
        id="btn-zora-assistant-launcher"
        onClick={handleOpen}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-indigo-900 hover:bg-indigo-950 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl border border-indigo-700/80 transition-all duration-200 cursor-pointer group hover:scale-[1.03]"
        title="Chat with Zora - 24x7 Banking Assistant"
        aria-label="Open Zora 24x7 Banking Assistant"
      >
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 border border-indigo-400/50 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-indigo-900"></span>
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight text-white flex items-center gap-1">
            Ask Zora
            <span className="text-[10px] font-semibold bg-indigo-800 text-indigo-200 px-1.5 py-0.2 rounded">
              24x7
            </span>
          </span>
          <span className="text-[10px] text-indigo-200 font-medium leading-none mt-0.5">
            Banking Questions &amp; Support
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      id="modal-zora-assistant"
      className="fixed bottom-5 right-5 z-50 w-[420px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] animate-in slide-in-from-bottom-5 duration-200 text-left"
    >
      {/* Header */}
      <div className="bg-indigo-950 border-b border-indigo-900 p-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 border border-indigo-300/40 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-indigo-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-tight">Zora</h3>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Online • 24x7
              </span>
            </div>
            <p className="text-[11px] text-indigo-200">India Bank Smart Banking Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Questions Guide Directory */}
          <button
            onClick={() => setShowQuestionDirectory(!showQuestionDirectory)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showQuestionDirectory
                ? 'bg-amber-400 text-indigo-950 border-amber-300'
                : 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800 border-indigo-700'
            }`}
            title="Browse all questions you can ask Zora"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Questions Guide</span>
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-indigo-900 text-indigo-300 hover:text-white transition-colors cursor-pointer"
            title="Minimize Assistant"
            aria-label="Minimize Assistant"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-indigo-900 text-indigo-300 hover:text-white transition-colors cursor-pointer"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW A: QUESTIONS DIRECTORY ("What questions can I ask Zora?") */}
      {showQuestionDirectory ? (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <div className="p-3 bg-white border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  What Can I Ask Zora?
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tap any question to ask instantly, or search by topic.
                </p>
              </div>
              <button
                onClick={() => setShowQuestionDirectory(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                &larr; Back to Chat
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="Search questions (e.g. debit card, credit card, FD, loan)..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Category Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              <button
                onClick={() => setActiveCategoryTab('all')}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategoryTab === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Topics ({ZORA_CATEGORIES.reduce((acc, c) => acc + c.questions.length, 0)})
              </button>
              {ZORA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeCategoryTab === cat.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({cat.questions.length})
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredQuestions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No questions matched "{directorySearch}".</p>
                <button
                  onClick={() => {
                    setDirectorySearch('');
                    setActiveCategoryTab('all');
                  }}
                  className="text-xs font-semibold text-indigo-600 underline cursor-pointer"
                >
                  Reset search filter
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleSend(q.question)}
                  className="p-3 bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all shadow-2xs group flex items-start justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                        {q.category}
                      </span>
                      {q.badge && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {q.badge}
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-950 leading-snug">
                      {q.question}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {q.answer.split('\n')[0].replace(/[*#]/g, '')}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* VIEW B: ACTIVE CHAT CONVERSATION */
        <>
          {/* Quick Helper Banner */}
          <div className="px-3.5 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-[11px] text-indigo-900">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Ask anything about cards, FDs, loans, or transfers
            </span>
            <button
              onClick={() => setShowQuestionDirectory(true)}
              className="font-bold text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
            >
              See all questions &rarr;
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>

                {/* Quick action chips attached to reply */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(qa.action)}
                        className="text-[11px] font-semibold bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-950 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <span>{qa.label}</span>
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-indigo-600 text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg w-fit shadow-2xs">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span className="text-[11px] font-semibold">Zora is answering...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Zora about debit card, credit card, FD rates..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
