/**
 * Cyber Desk Station: About Me & Experience Panel.
 * Terminal-style design with typed text animation (skippable),
 * bio, career timeline, and Download Resume action.
 */
import React, { useState, useEffect } from 'react';
import { FileText, Download, Briefcase, MapPin, Terminal, FastForward } from 'lucide-react';
import { PORTFOLIO_CONTENT } from '../../content';
import { trackEvent } from '../../analytics';
import { soundManager } from '../../audio';

export const AboutPanel: React.FC = () => {
  const [typedChars, setTypedChars] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullIntro = PORTFOLIO_CONTENT.introTerminal;

  // Typing effect
  useEffect(() => {
    if (isTypingComplete) return;

    const interval = setInterval(() => {
      setTypedChars((prev) => {
        if (prev >= fullIntro.length) {
          setIsTypingComplete(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [fullIntro, isTypingComplete]);

  const handleSkipTyping = () => {
    setTypedChars(fullIntro.length);
    setIsTypingComplete(true);
    soundManager.playUiClick();
  };

  const handleResumeDownload = () => {
    trackEvent('resume_downloaded', { url: PORTFOLIO_CONTENT.resumeUrl });
    soundManager.playUiClick();
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Terminal Header Box */}
      <div
        className="p-4 rounded-xl bg-[#090b14] border border-[#00f0ff]/30 font-mono text-xs text-[#00f0ff] relative overflow-hidden cursor-pointer"
        onClick={handleSkipTyping}
        title="Click to skip typing animation"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>OPERATOR_TERMINAL_V2.6</span>
          </div>
          {!isTypingComplete && (
            <button
              type="button"
              onClick={handleSkipTyping}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-[#00f0ff] cursor-pointer"
            >
              <FastForward className="w-3 h-3" />
              <span>SKIP</span>
            </button>
          )}
        </div>

        <pre className="mt-2.5 whitespace-pre-wrap leading-relaxed text-[#00f0ff] font-mono text-[11px] sm:text-xs">
          {fullIntro.slice(0, typedChars)}
          {!isTypingComplete && <span className="inline-block w-2 h-4 bg-[#00f0ff] ml-1 animate-pulse" />}
        </pre>
      </div>

      {/* 2. Personal Bio */}
      <div className="space-y-3">
        <h3 className="font-pixel text-xs text-white uppercase flex items-center gap-2">
          <span className="text-[#00f0ff]">//</span>
          <span>BIOGRAPHICAL PROFILE</span>
        </h3>
        {PORTFOLIO_CONTENT.bioParagraphs.map((para, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* 3. Resume Download Button */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#00f0ff]" />
            <span>Official Curriculum Vitae (PDF)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete technical history, achievements, and educational qualifications.
          </p>
        </div>

        <a
          href={PORTFOLIO_CONTENT.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleResumeDownload}
          className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#07070d] font-pixel text-[10px] tracking-wider uppercase font-bold hover:bg-[#ff2bd6] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>GET RESUME</span>
        </a>
      </div>

      {/* 4. Experience Timeline */}
      <div className="space-y-4 pt-2">
        <h3 className="font-pixel text-xs text-white uppercase flex items-center gap-2">
          <span className="text-[#ff2bd6]">//</span>
          <span>SYSTEM EXPERIENCE TIMELINE</span>
        </h3>

        <div className="space-y-4">
          {PORTFOLIO_CONTENT.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0b0e1a]/90 border border-slate-800 hover:border-[#00f0ff]/50 transition-colors"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>{exp.role}</span>
                </h4>
                <span className="font-pixel text-[9px] text-[#ff2bd6] px-2 py-0.5 rounded bg-[#ff2bd6]/10 border border-[#ff2bd6]/30">
                  {exp.period}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="font-medium text-slate-300">{exp.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{exp.location}</span>
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00f0ff] font-bold mt-0.5">›</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
