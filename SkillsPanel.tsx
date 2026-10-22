/**
 * Skill Vault Station: Technical Capabilities Panel.
 * Features 4 floating energy orb categories (Frontend, Backend, AI Tools, Graphic Design)
 * with animated proficiency meters, badges, and skill notes.
 */
import React, { useState } from 'react';
import { Layout, Server, Cpu, Palette, Award } from 'lucide-react';
import { PORTFOLIO_CONTENT } from '../../content';
import { useGameStore } from '../../store';
import { soundManager } from '../../audio';

export const SkillsPanel: React.FC = () => {
  const initialCategory = useGameStore((s) => s.activeSkillCategory);
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategory || PORTFOLIO_CONTENT.skillCategories[0].id
  );

  const categories = PORTFOLIO_CONTENT.skillCategories;
  const current = categories.find((c) => c.id === selectedCatId) || categories[0];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const handleSelect = (id: string) => {
    soundManager.playUiClick();
    setSelectedCatId(id);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Category Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-800/90 text-white border-[#ffe600] shadow-[0_0_12px_rgba(255,230,0,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span style={{ color: cat.accentColor }}>{getCategoryIcon(cat.iconName)}</span>
                <span className="font-pixel text-[8px] px-1.5 py-0.5 rounded bg-black/40 border border-slate-700">
                  {cat.badge}
                </span>
              </div>
              <span className="text-xs font-semibold">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Active Category Details */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span style={{ color: current.accentColor }}>{getCategoryIcon(current.iconName)}</span>
              <span>{current.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">{current.description}</p>
          </div>
          <span
            className="font-pixel text-[9px] px-2 py-1 rounded bg-black/60 border uppercase"
            style={{ color: current.accentColor, borderColor: `${current.accentColor}66` }}
          >
            {current.badge}
          </span>
        </div>

        {/* 3. Skills Proficiency Meters */}
        <div className="space-y-3.5 pt-1">
          {current.skills.map((skill, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{skill.name}</span>
                <span className="font-mono text-[11px] text-[#ffe600]">{skill.level}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: current.accentColor,
                    boxShadow: `0 0 8px ${current.accentColor}88`,
                  }}
                />
              </div>

              {/* Skill note / context */}
              <span className="text-[11px] text-slate-400 block font-mono">
                ↳ {skill.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mastery Badge Callout */}
      <div className="p-3.5 rounded-xl bg-[#090d18] border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <Award className="w-5 h-5 text-[#ffe600] shrink-0" />
        <span>
          Proficiencies backed by shipped production products, open-source toolkits, and real-world system deployments.
        </span>
      </div>
    </div>
  );
};
