/**
 * Retro-futuristic Cyberpunk Landing Screen.
 * Features glowing "PRESS START" button, sound toggle (default OFF),
 * loading indicator until 3D scene is ready, and "Skip to Classic View" link.
 */
import React from 'react';
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../store';
import { PORTFOLIO_CONTENT } from '../content';
import { soundManager } from '../audio';

export const LandingScreen: React.FC = () => {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const sceneReady = useGameStore((s) => s.sceneReady);
  const isMuted = useGameStore((s) => s.isMuted);
  const setGameStarted = useGameStore((s) => s.setGameStarted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const setViewMode = useGameStore((s) => s.setViewMode);

  if (gameStarted) return null;

  const handleStart = () => {
    if (!sceneReady) return;
    // Focus window so keyboard input works immediately in preview iframes
    try {
      window.focus();
    } catch {}
    soundManager.playInteract();
    setGameStarted();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#07070d]/95 backdrop-blur-md select-none text-slate-100 font-sans">
      {/* Top Header Row */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="font-pixel text-[11px] sm:text-xs text-[#00f0ff] tracking-wider">
            SYSTEM ONLINE // V2.6
          </span>
        </div>

        {/* Audio Toggle (Default OFF) */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Sound Off - click to enable' : 'Sound On - click to mute'}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors cursor-pointer text-xs"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="font-pixel text-[10px] text-slate-400">AUDIO OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#00f0ff]" />
              <span className="font-pixel text-[10px] text-[#00f0ff]">AUDIO ON</span>
            </>
          )}
        </button>
      </div>

      {/* Main Hero & Press Start Button */}
      <div className="flex flex-col items-center text-center max-w-2xl my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff2bd6]/40 bg-[#ff2bd6]/10 text-[#ff2bd6] font-pixel text-[10px] mb-6">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>3D CYBERPUNK EXPERIENCE</span>
        </div>

        <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight uppercase neon-text-cyan">
          {PORTFOLIO_CONTENT.name}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
          {PORTFOLIO_CONTENT.title}
        </p>

        <p className="mt-2 text-xs text-slate-500 max-w-md">
          Drive a low-poly neon car across the floating cyber island to explore projects, skills, and interactive stations.
        </p>

        {/* Start Game Action Button */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            disabled={!sceneReady}
            className={`px-8 sm:px-12 py-4 rounded-xl font-pixel text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              sceneReady
                ? 'bg-[#00f0ff] text-[#07070d] font-bold shadow-[0_0_24px_rgba(0,240,255,0.7)] hover:bg-[#ff2bd6] hover:text-white hover:shadow-[0_0_30px_rgba(255,43,214,0.8)] active:scale-95 animate-pulse-glow'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {sceneReady ? '▶ PRESS START' : 'INITIALIZING 3D WORLD...'}
          </button>

          {!sceneReady && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="w-3 h-3 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
              <span>Building procedural WebGL geometry...</span>
            </div>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-pixel text-[10px] text-slate-200">
              WASD
            </kbd>
            <span>/</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-pixel text-[10px] text-slate-200">
              ARROWS
            </kbd>
            <span>to drive</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-pixel text-[10px] text-slate-200">
              E
            </kbd>
            <span>to interact</span>
          </span>
        </div>
      </div>

      {/* Footer: Skip to Classic View */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
          <span>Zero external model / texture downloads • Instant procedural WebGL</span>
        </div>

        {/* Skip to Classic View Link */}
        <button
          type="button"
          onClick={() => setViewMode('classic')}
          className="inline-flex items-center gap-1.5 font-medium text-slate-300 hover:text-[#00f0ff] underline decoration-slate-600 hover:decoration-[#00f0ff] underline-offset-4 transition-colors cursor-pointer"
        >
          <span>Skip to Classic View (Plain Portfolio)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
