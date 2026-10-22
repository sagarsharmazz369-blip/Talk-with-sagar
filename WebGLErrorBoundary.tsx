/**
 * WebGL Error Boundary.
 * Catches WebGL initialization failures or Canvas crashes and smoothly falls back to Classic View.
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, BookOpen } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackToClassic: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'WebGL rendering context failure' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('[WebGL Error Boundary caught error]:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#07070d] text-slate-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0d101e] border border-amber-500/40 text-center space-y-4 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="font-pixel text-sm text-white uppercase">
              3D HARDWARE ACCELERATION NOTICE
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your browser or environment could not initialize hardware-accelerated WebGL. We have switched to the full semantic Classic Portfolio view.
            </p>
            <button
              type="button"
              onClick={this.props.fallbackToClassic}
              className="px-6 py-3 rounded-xl bg-[#00f0ff] text-[#07070d] font-pixel text-xs font-bold tracking-wider uppercase hover:bg-[#ff2bd6] hover:text-white transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>CONTINUE TO CLASSIC VIEW</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
