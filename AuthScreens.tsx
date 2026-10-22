import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Lock, Mail, User as UserIcon, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';

export const AuthScreens: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatFirebaseError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'Incorrect email or password. Please verify your credentials and try again.';
        case 'auth/email-already-in-use':
          return 'This email address is already registered. Please log in instead.';
        case 'auth/weak-password':
          return 'Password is too weak. Please use at least 8 characters with letters and numbers.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection and try again.';
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please wait a moment and try again.';
        case 'auth/operation-not-allowed':
          return 'Email/Password authentication is not enabled yet in your Firebase Console. Please turn on the Email/Password provider under Authentication > Sign-in method.';
        default:
          return (error as { message?: string }).message || 'An error occurred during authentication.';
      }
    }
    return error instanceof Error ? error.message : 'Authentication failed.';
  };

  const handleSwitchMode = (targetMode: 'login' | 'signup') => {
    setMode(targetMode);
    setErrorMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    // Client-side validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!trimmedName) {
        setErrorMessage('Please enter your name.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify both fields.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        if (trimmedName && userCred.user) {
          try {
            await updateProfile(userCred.user, { displayName: trimmedName });
          } catch {
            // Profile name update is non-fatal
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }
    } catch (err: unknown) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#07070d] text-slate-200 font-sans select-none relative overflow-hidden">
      {/* Background ambient cyberpunk glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#ff2bd6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Card */}
      <div className="w-full max-w-md rounded-2xl bg-[#090b14]/95 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 transition-all">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-pixel text-[10px] text-[#00f0ff] tracking-wider uppercase">
              SECURITY ACCESS GATE
            </span>
          </div>
          <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {mode === 'login' ? 'SIGN IN' : 'NEW OPERATOR'}
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide uppercase leading-tight neon-text-cyan">
            {mode === 'login' ? 'OPERATOR LOGIN' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {mode === 'login'
              ? 'Enter your credentials to access the 3D portfolio experience.'
              : 'Sign up to initialize your verified operator profile.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400 leading-relaxed animate-fade-up">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-[#00f0ff]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  maxLength={100}
                  required={mode === 'signup'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address <span className="text-[#00f0ff]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@domain.com"
                maxLength={120}
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium text-slate-300 mb-1.5">
              Password <span className="text-[#00f0ff]">*</span>
              <span className="text-[10px] text-slate-500 font-normal ml-1">(min 8 chars)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-confirm-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm Password <span className="text-[#00f0ff]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  required={mode === 'signup'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#00f0ff] text-[#07070d] font-pixel text-xs tracking-wider uppercase font-bold hover:bg-[#ff2bd6] hover:text-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'ENTER SYSTEM' : 'INITIALIZE OPERATOR'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch Mode Link */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className="text-[#00f0ff] font-medium hover:underline hover:text-[#ff2bd6] transition-colors cursor-pointer ml-1"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an operator account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-[#00f0ff] font-medium hover:underline hover:text-[#ff2bd6] transition-colors cursor-pointer ml-1"
              >
                Log in here
              </button>
            </p>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>Secured with Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
};
