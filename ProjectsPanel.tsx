/**
 * Arcade Arena Station: Projects Showcase Panel.
 * Features 4 arcade machines with live demo links, github repo buttons,
 * procedural CRT screenshots, and tech tags.
 */
import React, { useState } from 'react';
import { ExternalLink, Github, Gamepad2, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { PORTFOLIO_CONTENT } from '../../content';
import { useGameStore } from '../../store';
import { trackEvent } from '../../analytics';
import { soundManager } from '../../audio';

export const ProjectsPanel: React.FC = () => {
  const initialIndex = useGameStore((s) => s.activeProjectIndex);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex || 0);

  const projects = PORTFOLIO_CONTENT.projects;
  const current = projects[selectedIndex] || projects[0];

  const handleSelect = (idx: number) => {
    soundManager.playUiClick();
    setSelectedIndex(idx);
  };

  const handleLinkClick = (type: 'demo' | 'github') => {
    trackEvent('project_link_clicked', { project: current.id, type });
    soundManager.playUiClick();
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Arcade Machine Selector Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {projects.map((p, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-[#ff2bd6] shadow-[0_0_12px_rgba(255,43,214,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.accentColor }}
                />
                <span>M{idx + 1}: {p.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Previous / Next buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect((selectedIndex - 1 + projects.length) % projects.length)}
            aria-label="Previous project"
            className="p-1.5 rounded-md border border-slate-700 bg-slate-900 hover:border-[#ff2bd6] text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleSelect((selectedIndex + 1) % projects.length)}
            aria-label="Next project"
            className="p-1.5 rounded-md border border-slate-700 bg-slate-900 hover:border-[#ff2bd6] text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Project Card */}
      <div className="space-y-4">
        {/* Procedural CRT Screen Graphic */}
        <div
          className="w-full h-44 sm:h-52 rounded-xl border border-slate-700 bg-[#070912] p-4 flex flex-col justify-between relative overflow-hidden cyber-scanlines"
          style={{ borderColor: `${current.accentColor}55` }}
        >
          {/* Top Marquee Bar */}
          <div className="flex items-center justify-between text-xs font-pixel">
            <span
              className="px-2 py-0.5 rounded bg-black/60 text-[9px] border"
              style={{ color: current.accentColor, borderColor: `${current.accentColor}66` }}
            >
              CABINET // {current.badge}
            </span>
            <span className="text-slate-400 text-[10px]">60 FPS // READY</span>
          </div>

          {/* Central Holographic CRT Graphic */}
          <div className="my-auto flex flex-col items-center text-center">
            <Gamepad2 className="w-10 h-10 mb-2 opacity-80" style={{ color: current.accentColor }} />
            <h4 className="font-pixel text-base sm:text-lg text-white uppercase tracking-wider">
              {current.title}
            </h4>
            <span className="text-xs text-slate-400 mt-1">{current.subtitle}</span>
          </div>

          {/* Bottom Live Status line */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
            <span>INSERT COIN TO INITIALIZE</span>
            <span className="text-[#00ff88]">STATUS: ONLINE</span>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{current.title}</span>
            <span className="text-xs font-normal text-slate-400">({current.subtitle})</span>
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Key Architectural Highlights */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Key Engineering Highlights</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {current.fullDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#ff2bd6] font-bold">›</span>
                <span className="leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Tags */}
        <div>
          <span className="text-[11px] font-pixel text-slate-400 uppercase block mb-2">
            STACK ARCHITECTURE
          </span>
          <div className="flex flex-wrap gap-2">
            {current.techTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-[#0e1222] border border-slate-700 text-xs text-slate-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: Live Demo & GitHub */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={current.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('demo')}
            className="px-5 py-2.5 rounded-lg bg-[#00f0ff] text-[#07070d] font-pixel text-[10px] tracking-wider uppercase font-bold hover:bg-[#ff2bd6] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] inline-flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>PLAY DEMO</span>
          </a>

          <a
            href={current.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('github')}
            className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-pixel text-[10px] tracking-wider uppercase font-bold hover:border-slate-500 hover:bg-slate-800 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>VIEW SOURCE</span>
          </a>
        </div>
      </div>
    </div>
  );
};
