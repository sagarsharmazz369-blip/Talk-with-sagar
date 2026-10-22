/**
 * Cyberpunk HUD & On-Screen Controls.
 * Top-left controls hint (fades after moving, reopenable via help icon),
 * Top-right sound toggle, quick-nav, collectible counter (x/3),
 * Near-zone interact prompt / mobile interact button,
 * and mobile virtual joystick.
 */
import React, { useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  HelpCircle,
  Star,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useGameStore } from '../store';
import { ZONES } from '../config/zones';
import { VirtualJoystick } from './VirtualJoystick';
import { soundManager } from '../audio';

export const HUD: React.FC = () => {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const toggleQuickNav = useGameStore((s) => s.toggleQuickNav);
  const nearZone = useGameStore((s) => s.nearZone);
  const activeZone = useGameStore((s) => s.activeZone);
  const openZone = useGameStore((s) => s.openZone);
  const collectiblesFound = useGameStore((s) => s.collectiblesFound);
  const hasMoved = useGameStore((s) => s.hasMoved);
  const isHelpOpen = useGameStore((s) => s.isHelpOpen);
  const toggleHelp = useGameStore((s) => s.toggleHelp);
  const isTouchDevice = useGameStore((s) => s.isTouchDevice);
  const setIsTouchDevice = useGameStore((s) => s.setIsTouchDevice);
  const setViewMode = useGameStore((s) => s.setViewMode);

  // Detect touch capability
  useEffect(() => {
    try {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    } catch {}
  }, [setIsTouchDevice]);

  if (!gameStarted) return null;

  const foundCount = collectiblesFound.filter(Boolean).length;
  const currentNearConfig = nearZone ? ZONES[nearZone] : null;

  const handleInteract = () => {
    if (nearZone && !activeZone) {
      soundManager.playInteract();
      openZone(nearZone);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 font-sans flex flex-col justify-between p-3 sm:p-6">
      {/* 1. TOP HEADER ROW */}
      <header className="w-full flex items-start justify-between gap-3 pointer-events-auto">
        {/* Top-Left: Controls Hint (fades after moving, with help button) */}
        <div className="flex items-center gap-2">
          {/* Fading Hint */}
          <div
            className={`px-3 py-2 rounded-xl bg-[#090b14]/85 border border-slate-700/80 backdrop-blur-md shadow-lg transition-all duration-700 flex items-center gap-2.5 ${
              hasMoved ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-pixel text-[9px] text-[#00f0ff]">
                W
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-pixel text-[9px] text-[#00f0ff]">
                A
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-pixel text-[9px] text-[#00f0ff]">
                S
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-pixel text-[9px] text-[#00f0ff]">
                D
              </kbd>
            </div>
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">Drive</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-pixel text-[9px] text-[#ff2bd6]">
              E
            </kbd>
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">Interact</span>
          </div>

          {/* Help Button (always available to re-open instructions) */}
          <button
            type="button"
            onClick={toggleHelp}
            aria-label="Controls guide and help"
            className="p-2 rounded-xl bg-[#090b14]/85 border border-slate-700/80 hover:border-[#00f0ff] hover:text-[#00f0ff] text-slate-300 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Top-Right: Sound toggle, Quick-Nav menu, and Collectibles counter */}
        <div className="flex items-center gap-2">
          {/* Collectibles Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090b14]/85 border border-slate-700/80 backdrop-blur-md shadow-lg">
            <Star
              className={`w-3.5 h-3.5 ${
                foundCount > 0 ? 'text-[#ffe600] fill-current animate-pulse' : 'text-slate-600'
              }`}
            />
            <span className="font-pixel text-[10px] text-slate-200">
              {foundCount}/3
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">STARS</span>
          </div>

          {/* Sound Toggle (Key M) */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound (Key M)' : 'Mute sound (Key M)'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090b14]/85 border border-slate-700/80 hover:border-[#00f0ff] text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer shadow-lg text-xs"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="font-pixel text-[9px] text-slate-400 hidden sm:inline">[M] OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-pixel text-[9px] text-[#00f0ff] hidden sm:inline">[M] ON</span>
              </>
            )}
          </button>

          {/* Quick-Nav Button (Key N) */}
          <button
            type="button"
            onClick={toggleQuickNav}
            aria-label="Quick Navigation (Key N)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090b14]/85 border border-slate-700/80 hover:border-[#ff2bd6] text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer shadow-lg text-xs"
          >
            <Compass className="w-4 h-4 text-[#ff2bd6]" />
            <span className="font-pixel text-[9px] text-slate-200 hidden sm:inline">WARP [N]</span>
          </button>

          {/* Classic View Quick Button */}
          <button
            type="button"
            onClick={() => setViewMode('classic')}
            aria-label="Switch to classic portfolio view"
            className="p-2 rounded-xl bg-[#090b14]/85 border border-slate-700/80 hover:border-slate-400 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer shadow-lg"
            title="Switch to Classic View"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. CENTER / NEAR-ZONE INTERACTION PROMPT */}
      {currentNearConfig && !activeZone && (
        <div className="mx-auto pointer-events-auto animate-bounce mb-4 sm:mb-8">
          <button
            type="button"
            onClick={handleInteract}
            className="px-6 py-3 rounded-2xl bg-[#090b14]/95 border-2 shadow-2xl backdrop-blur-md transition-all flex items-center gap-3 cursor-pointer group hover:scale-105 active:scale-95"
            style={{
              borderColor: currentNearConfig.color,
              boxShadow: `0 0 25px ${currentNearConfig.color}66`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: currentNearConfig.color }} />
            <div className="text-left">
              <span className="font-pixel text-[9px] text-slate-400 block">
                STATION DETECTED
              </span>
              <span className="font-bold text-xs sm:text-sm text-white group-hover:underline">
                PRESS [E] OR TAP TO ENTER {currentNearConfig.name.toUpperCase()}
              </span>
            </div>
            <kbd
              className="px-2 py-1 rounded bg-black/60 border font-pixel text-xs"
              style={{ color: currentNearConfig.color, borderColor: currentNearConfig.color }}
            >
              E
            </kbd>
          </button>
        </div>
      )}

      {/* 3. MOBILE TOUCH CONTROLS (Only visible on touch devices) */}
      {isTouchDevice && (
        <div className="w-full flex items-end justify-between pointer-events-auto pt-4 pb-2 px-1">
          {/* Virtual Joystick (Left) */}
          <VirtualJoystick />

          {/* Mobile Interact Action Button (Right, min 44px) */}
          <button
            type="button"
            onClick={handleInteract}
            disabled={!nearZone || activeZone !== null}
            aria-label="Interact with station"
            className={`w-20 h-20 rounded-full font-pixel text-[10px] tracking-wider uppercase border-2 flex flex-col items-center justify-center gap-1 transition-all select-none shadow-xl active:scale-95 ${
              nearZone && !activeZone
                ? 'bg-[#00f0ff] text-[#07070d] font-bold border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.7)] animate-pulse'
                : 'bg-slate-900/60 text-slate-600 border-slate-800'
            }`}
          >
            <span>ACTION</span>
            <span className="text-[8px] font-mono">[ E ]</span>
          </button>
        </div>
      )}

      {/* 4. HELP MODAL POPUP */}
      {isHelpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Controls Guide"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto"
          onClick={toggleHelp}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#090b14] border border-[#00f0ff]/50 p-5 text-slate-200 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-pixel text-xs text-white uppercase tracking-wider">
                HOW TO PLAY
              </h3>
              <button
                type="button"
                onClick={toggleHelp}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70">
                <span>Steer & Drive Car</span>
                <span className="font-pixel text-[9px] text-[#00f0ff]">WASD / ARROWS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70">
                <span>Enter Station</span>
                <span className="font-pixel text-[9px] text-[#ff2bd6]">E / ENTER</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70">
                <span>Close Panel</span>
                <span className="font-pixel text-[9px] text-slate-400">ESC</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70">
                <span>Fast-Travel Warp</span>
                <span className="font-pixel text-[9px] text-[#ffe600]">N</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70">
                <span>Toggle Sound</span>
                <span className="font-pixel text-[9px] text-[#00ff88]">M</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Tip: Explore the island edges to find 3 hidden glowing stars. Reach all 4 stations to inspect About Me, Projects, Skills, and Contact.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
