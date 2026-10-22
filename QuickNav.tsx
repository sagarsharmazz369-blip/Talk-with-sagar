/**
 * Quick-Nav fast travel menu (Key N).
 * Lists all 4 zones plus Classic View.
 * Selecting a zone moves the car next to it and opens its panel.
 */
import React, { useEffect, useRef } from 'react';
import { X, Navigation, Terminal, Gamepad2, Cpu, Mail, BookOpen } from 'lucide-react';
import { useGameStore } from '../store';
import { ZONES, ZoneId } from '../config/zones';

export const QuickNav: React.FC = () => {
  const isQuickNavOpen = useGameStore((s) => s.isQuickNavOpen);
  const toggleQuickNav = useGameStore((s) => s.toggleQuickNav);
  const fastTravelToZone = useGameStore((s) => s.fastTravelToZone);
  const setViewMode = useGameStore((s) => s.setViewMode);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isQuickNavOpen) return;
    menuRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleQuickNav();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickNavOpen, toggleQuickNav]);

  if (!isQuickNavOpen) return null;

  const getZoneIcon = (id: ZoneId) => {
    switch (id) {
      case 'about':
        return <Terminal className="w-4 h-4 text-[#00f0ff]" />;
      case 'projects':
        return <Gamepad2 className="w-4 h-4 text-[#ff2bd6]" />;
      case 'skills':
        return <Cpu className="w-4 h-4 text-[#ffe600]" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-[#00ff88]" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick Navigation Menu"
      tabIndex={-1}
      ref={menuRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm outline-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleQuickNav();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#090b14] border border-[#00f0ff]/40 shadow-2xl p-5 text-slate-200 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="font-pixel text-xs text-white uppercase tracking-wider">
              FAST-TRAVEL DOCK
            </h3>
          </div>
          <button
            type="button"
            onClick={toggleQuickNav}
            aria-label="Close fast travel"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-2.5 mb-4">
          Select a destination to warp your cyber car and open the station panel immediately.
        </p>

        {/* 4 Stations */}
        <div className="space-y-2">
          {(Object.keys(ZONES) as ZoneId[]).map((zId) => {
            const z = ZONES[zId];
            return (
              <button
                key={zId}
                type="button"
                onClick={() => fastTravelToZone(zId)}
                className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#00f0ff] hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-700">
                    {getZoneIcon(zId)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                      {z.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {z.subtitle}
                    </span>
                  </div>
                </div>

                <span className="font-pixel text-[9px] px-2 py-1 rounded bg-black/50 border border-slate-700 text-slate-300">
                  WARP
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider & Classic View option */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('classic')}
            className="w-full p-3 rounded-xl bg-[#ff2bd6]/10 border border-[#ff2bd6]/40 hover:bg-[#ff2bd6]/20 transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-black/40 border border-[#ff2bd6]/40">
                <BookOpen className="w-4 h-4 text-[#ff2bd6]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Classic Portfolio View</h4>
                <span className="text-[11px] text-slate-300 block">
                  Switch to standard semantic scrollable page
                </span>
              </div>
            </div>

            <span className="font-pixel text-[9px] px-2 py-1 rounded bg-[#ff2bd6]/20 text-[#ff2bd6]">
              READ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
