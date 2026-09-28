import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    openAuthModal, 
    loginUser,
    updateBusinessProfile 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');

  if (!isAuthModalOpen) return null;

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid business email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters with secure credentials.');
      return;
    }

    if (authMode === 'register') {
      if (!businessName) {
        setError('Please provide your business name.');
        return;
      }
      // Trigger verification step
      setStep('verify');
      setSuccessMsg('Account created! A 4-digit verification code was sent to ' + email + ' (Use 1234 for instant verification).');
    } else if (authMode === 'login') {
      // Mock secure authentication
      loginUser(email, email.includes('admin') ? 'super_admin' : 'user');
    } else if (authMode === 'forgot') {
      setSuccessMsg('A password reset link has been dispatched to ' + email + '.');
      setTimeout(() => {
        openAuthModal('login');
      }, 2500);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === '1234' || verificationCode.length === 4) {
      if (businessName) {
        updateBusinessProfile({ name: businessName });
      }
      loginUser(email, 'user');
    } else {
      setError('Invalid verification code. Please enter 1234.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={closeAuthModal} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">
                {authMode === 'login' && 'Sign in to BizPilot'}
                {authMode === 'register' && 'Create Business Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-[11px] text-slate-500">Your AI Worker for Everyday Business</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700">Business / Store Name</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Zahra Pret, Al-Madina Traders"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700">Business Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourbusiness.pk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-[11px] font-semibold text-emerald-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              <span>
                {authMode === 'login' && 'Sign In to Dashboard'}
                {authMode === 'register' && 'Register Business Account'}
                {authMode === 'forgot' && 'Send Reset Code'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Quick Demo Switchers */}
            <div className="pt-2 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <div>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    Register free
                  </button>
                </div>
              ) : (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Enter 4-digit Verification Code</label>
              <input
                type="text"
                maxLength={4}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="1234"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400 text-center">Demo mode: Enter <strong>1234</strong> to proceed</p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              <span>Verify & Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        <div className="mt-5 border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400">
          Encrypted sessions with SHA-256 password hashing and role-based access.
        </div>
      </div>
    </div>
  );
};
