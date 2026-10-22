import React, { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthScreens } from './AuthScreens';

interface AuthGateProps {
  children: ReactNode;
}

const AuthGateInner: React.FC<AuthGateProps> = ({ children }) => {
  const { user, loading, logout } = useAuth();

  // 1. Initial Auth Loading State
  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#07070d] text-[#00f0ff] font-pixel text-xs select-none">
        <div className="flex flex-col items-center gap-3">
          <span className="w-7 h-7 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
          <span className="tracking-widest">VERIFYING SECURITY CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show Login / Sign Up Screen Only
  if (!user) {
    return <AuthScreens />;
  }

  // 3. Authenticated: Render Existing App with Unobtrusive Log Out Button
  return (
    <>
      {children}

      {/* Small unobtrusive Log out button fixed in corner without shifting existing layout */}
      <div className="fixed bottom-3 right-3 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={logout}
          aria-label="Log out of application"
          title={`Signed in as ${user.displayName || user.email || 'Operator'}. Click to log out.`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090b14]/80 hover:bg-slate-900 border border-slate-700/60 hover:border-red-500/60 text-slate-400 hover:text-red-400 backdrop-blur-md transition-all shadow-lg text-[10px] font-mono cursor-pointer active:scale-95 group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:text-red-400 transition-colors" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </>
  );
};

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthGateInner>{children}</AuthGateInner>
    </AuthProvider>
  );
};
