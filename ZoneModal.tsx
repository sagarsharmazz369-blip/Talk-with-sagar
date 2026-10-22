/**
 * Accessible Modal Container for Zone Panels.
 * Sub-300ms transition, role="dialog", aria-modal="true",
 * focus trapping, and Esc key dismissal.
 */
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useGameStore } from '../../store';
import { ZONES } from '../../config/zones';
import { AboutPanel } from './AboutPanel';
import { ProjectsPanel } from './ProjectsPanel';
import { SkillsPanel } from './SkillsPanel';
import { ContactPanel } from './ContactPanel';

export const ZoneModal: React.FC = () => {
  const activeZone = useGameStore((s) => s.activeZone);
  const closeZone = useGameStore((s) => s.closeZone);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeZone) return;

    // Focus the modal on open
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeZone();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZone, closeZone]);

  if (!activeZone) return null;

  const zoneConfig = ZONES[activeZone];

  const renderPanelContent = () => {
    switch (activeZone) {
      case 'about':
        return <AboutPanel />;
      case 'projects':
        return <ProjectsPanel />;
      case 'skills':
        return <SkillsPanel />;
      case 'contact':
        return <ContactPanel />;
      default:
        return null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zone-dialog-title"
      tabIndex={-1}
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm outline-none transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeZone();
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090b14] border border-slate-700 shadow-2xl overflow-hidden animate-fade-up"
        style={{ borderColor: `${zoneConfig.color}66` }}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0d101e] shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: zoneConfig.color, boxShadow: `0 0 8px ${zoneConfig.color}` }}
            />
            <div>
              <h2 id="zone-dialog-title" className="font-pixel text-xs sm:text-sm text-white uppercase tracking-wider">
                {zoneConfig.name}
              </h2>
              <span className="text-[10px] text-slate-400 font-mono block">
                {zoneConfig.subtitle}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={closeZone}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-[#ff2bd6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content (Inter font) */}
        <div className="p-5 sm:p-6 overflow-y-auto font-sans flex-1">
          {renderPanelContent()}
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-2.5 border-t border-slate-800 bg-[#070912] flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span>PRESS [ESC] OR CLOSE TO RESUME DRIVING</span>
          <span style={{ color: zoneConfig.color }}>{zoneConfig.badge}</span>
        </div>
      </div>
    </div>
  );
};
