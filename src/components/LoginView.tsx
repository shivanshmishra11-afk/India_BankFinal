import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { safeStorage } from '../utils/storage';

interface LoginViewProps {
  onLogin: (email: string) => void;
  savedEmail?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, savedEmail = '' }) => {
  // Step state: 'credentials' or 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Credentials state
  const [email, setEmail] = useState(savedEmail || 'ananya.sharma@indiabank.com');
  const [password, setPassword] = useState('IndiaBank@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 6-digit OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [resendNotification, setResendNotification] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-decrement OTP resend timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  // Focus the first OTP input when switching to 'otp' step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle Step 1: Submit Credentials
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please provide your corporate or personal bank email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address format (e.g. name@intellectbank.com).');
      return;
    }

    setIsSubmitting(true);

    // Save to safeStorage
    if (rememberMe) {
      safeStorage.setItem('intellect_bank_remember_email', trimmedEmail);
    } else {
      safeStorage.removeItem('intellect_bank_remember_email');
    }

    // Move to Step 2: 6-Digit OTP Verification
    setTimeout(() => {
      setIsSubmitting(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setResendCountdown(30);
      setStep('otp');
    }, 400);
  };

  // Handle individual OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = newDigit;
    setOtp(newOtp);
    setOtpError('');

    // If a digit was entered, auto-focus next input box
    if (newDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, auto-trigger validation with slight tactile delay
    if (newDigit && index === 5 && newOtp.every((d) => d !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  // Handle backspace navigation in OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting full 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    setOtpError('');

    // Focus last filled box or submit if complete
    const targetIdx = Math.min(pastedData.length, 5);
    inputRefs.current[targetIdx]?.focus();

    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  // Step 2 Verification - Accepts ANY 6-digit number as requested
  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    // Save session email to safeStorage
    safeStorage.setItem('intellect_bank_user_email', email.trim());

    // Tactile verification delay for authentic banking experience
    setTimeout(() => {
      setIsVerifyingOtp(false);
      onLogin(email.trim());
    }, 500);
  };

  // Fill dummy test OTP code (123456)
  const handleQuickFillOtp = () => {
    const testCode = ['1', '2', '3', '4', '5', '6'];
    setOtp(testCode);
    setOtpError('');
    inputRefs.current[5]?.focus();
  };

  // Resend OTP trigger
  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    setResendNotification('New 6-digit passcode dispatched to your email.');
    setTimeout(() => setResendNotification(''), 4000);
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••••••');
    setError('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Institutional NetBanking Overview (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Scheduled Commercial Banking Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              India Bank NetBanking &amp; Customer Desk
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Access your digital savings account, manage pre-approved loans, execute real-time RTGS/NEFT/IMPS transfers, and submit direct priority grievances to our specialized redressal officers.
            </p>
          </div>

          {/* Core Institutional Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-xs">Direct Support Desk</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Direct integration with India Bank customer grievance redressal desk with &lt; 24h turnaround.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 text-xs">Pre-Approved Credit</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Instant collateral-free personal loans and credit solutions with zero physical paperwork.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-xs">256-Bit Protection</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Multi-factor biometric and OTP authentication compliant with RBI cybersecurity guidelines.
              </p>
            </div>
          </div>

          {/* Quick Demo Test Profiles Panel */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                Select Demo Customer Account
              </span>
              <span className="text-[11px] text-slate-400">Click to autofill credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('ananya.sharma@indiabank.com')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  email === 'ananya.sharma@indiabank.com'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="text-xs font-bold truncate">Ananya Sharma</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">ananya.sharma@indiabank.com</div>
                <span className="mt-2 inline-block text-[10px] font-semibold text-indigo-600 uppercase">Primary Savings</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('shivansh.mishra@intellectdesign.com')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  email === 'shivansh.mishra@intellectdesign.com'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="text-xs font-bold truncate">Shivansh Mishra</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">shivansh.mishra@intellectdesign.com</div>
                <span className="mt-2 inline-block text-[10px] font-semibold text-slate-600 uppercase">Corporate Desk</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('customer.support@intellectbank.com')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  email === 'customer.support@intellectbank.com'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="text-xs font-bold truncate">Customer Support</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">customer.support@intellectbank.com</div>
                <span className="mt-2 inline-block text-[10px] font-semibold text-slate-600 uppercase">Support Liaison</span>
              </button>
            </div>
          </div>

          {/* Statutory & DICGC Insurance Notice */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              DICGC Deposit Insurance Guaranteed (Up to ₹5 Lakhs per depositor)
            </span>
            <span>&bull;</span>
            <span>CIN: L65110MH1994PLC080801</span>
            <span>&bull;</span>
            <span>RBI License No: B-1209/94</span>
          </div>
        </div>

        {/* Right Column: Sign In Card (Cols 8-12) */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-6 sm:p-8 text-slate-900">
            {step === 'credentials' ? (
              /* ================= STEP 1: CREDENTIALS ================= */
              <div>
                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                      <line x1="12" y1="22" x2="12" y2="15.5" />
                      <polyline points="22 8.5 12 15.5 2 8.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      NetBanking Sign In
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Enter credentials or select a demo profile
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                    <span className="font-bold text-red-800">Notice:</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email or NetBanking ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@indiabank.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remember credentials</span>
                    </label>
                    <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Gateway Ready
                    </span>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to OTP Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */
              <div className="space-y-5 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to credentials</span>
                </button>

                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                      Two-Factor Authentication
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[240px]">
                      Code sent to {email}
                    </p>
                  </div>
                </div>

                {/* Notification Banner */}
                {resendNotification && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resendNotification}</span>
                  </div>
                )}

                {/* Error Banner */}
                {otpError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
                    <span className="font-bold text-red-800">Notice:</span>
                    <span>{otpError}</span>
                  </div>
                )}

                {/* 6 Digit Input Boxes */}
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 text-center">
                    Enter 6-Digit OTP Code
                  </label>

                  <div className="flex items-center justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        className={`w-11 h-12 text-center text-xl font-mono font-bold rounded-lg border transition-all ${
                          digit
                            ? 'border-indigo-600 bg-indigo-50/20 text-slate-900 ring-1 ring-indigo-600'
                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-sans">
                    Testing sandbox &bull; Any 6 digits will be accepted.
                  </p>
                </div>

                {/* Quick Fill Button & Resend */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleQuickFillOtp}
                    className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Auto-fill Demo Code (123456)</span>
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Didn't receive code?</span>
                    {resendCountdown > 0 ? (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Verify & Proceed Button */}
                <button
                  id="verify-otp-submit-btn"
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isVerifyingOtp || otp.join('').length !== 6}
                  className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Continue to NetBanking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
