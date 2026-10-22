/**
 * Plain Semantic Classic View for Recruiters, Clients, and Developers.
 * Normal scrollable HTML page with exact same content from src/content.ts.
 * Reachable in under 60 seconds from Landing Screen or Quick-Nav.
 */
import React, { useState } from 'react';
import {
  Gamepad2,
  Download,
  ExternalLink,
  Github,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Youtube,
  Linkedin,
  Twitter,
  Award,
  Loader2,
} from 'lucide-react';
import { PORTFOLIO_CONTENT } from '../content';
import { useGameStore } from '../store';
import { trackEvent } from '../analytics';
import { soundManager } from '../audio';

export const ClassicView: React.FC = () => {
  const setViewMode = useGameStore((s) => s.setViewMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'unconfigured'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formId = PORTFOLIO_CONTENT.formspreeFormId;
  const isFormPlaceholder = !formId || formId === 'YOUR_FORM_ID' || formId.includes('YOUR_');

  const handleSwitchTo3D = () => {
    soundManager.playInteract();
    setViewMode('game');
  };

  const handleResumeDownload = () => {
    trackEvent('resume_downloaded', { url: PORTFOLIO_CONTENT.resumeUrl });
    soundManager.playUiClick();
  };

  const handleProjectLink = (projectId: string, type: 'demo' | 'github') => {
    trackEvent('project_link_clicked', { project: projectId, type });
    soundManager.playUiClick();
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (gotcha) {
      setStatus('success');
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    if (isFormPlaceholder) {
      setStatus('unconfigured');
      trackEvent('contact_submitted', { status: 'unconfigured' });
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          _gotcha: gotcha,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deliver transmission.');
      }

      setStatus('success');
      trackEvent('contact_submitted', { status: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transmission failed.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-200 font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-[#00f0ff]">
      {/* Sticky Top Bar with 3D Mode Switcher */}
      <nav className="sticky top-0 z-40 bg-[#090b14]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-xs text-[#00f0ff] uppercase tracking-wider">
              {PORTFOLIO_CONTENT.name}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">| Classic Mode</span>
          </div>

          <button
            type="button"
            onClick={handleSwitchTo3D}
            className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#07070d] font-pixel text-[10px] tracking-wider uppercase font-bold hover:bg-[#ff2bd6] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>PLAY IN 3D WORLD</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        {/* HERO SECTION */}
        <header className="space-y-4 border-b border-slate-800 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono">
            <span>● AVAILABLE FOR WORK & COLLABORATION</span>
          </div>

          <h1 className="font-pixel text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight">
            {PORTFOLIO_CONTENT.name}
          </h1>

          <p className="text-lg text-slate-300 font-medium max-w-2xl">
            {PORTFOLIO_CONTENT.title}
          </p>

          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {PORTFOLIO_CONTENT.tagline}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-lg bg-[#00f0ff] text-[#07070d] font-pixel text-[10px] font-bold tracking-wider uppercase hover:bg-[#ff2bd6] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              SEND MESSAGE
            </a>

            <a
              href={PORTFOLIO_CONTENT.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResumeDownload}
              className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-pixel text-[10px] font-bold tracking-wider uppercase hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
          </div>
        </header>

        {/* SECTION 1: ABOUT ME */}
        <section id="about" className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-[#00f0ff]">// 01</span>
            <h2 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
              BIOGRAPHY & BACKGROUND
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            {PORTFOLIO_CONTENT.bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* SECTION 2: EXPERIENCE TIMELINE */}
        <section id="experience" className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-[#ff2bd6]">// 02</span>
            <h2 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
              PROFESSIONAL EXPERIENCE
            </h2>
          </div>

          <div className="space-y-6">
            {PORTFOLIO_CONTENT.experience.map((exp, idx) => (
              <article
                key={idx}
                className="p-5 rounded-2xl bg-[#090b14] border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#ff2bd6]" />
                    <span>{exp.role}</span>
                  </h3>
                  <span className="font-pixel text-[10px] text-[#ff2bd6] px-2 py-0.5 rounded bg-[#ff2bd6]/10 border border-[#ff2bd6]/30">
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

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#00f0ff] font-bold">›</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 3: FEATURED PROJECTS */}
        <section id="projects" className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-[#00f0ff]">// 03</span>
            <h2 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
              FEATURED PROJECTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_CONTENT.projects.map((proj) => (
              <article
                key={proj.id}
                className="p-6 rounded-2xl bg-[#090b14] border border-slate-800 hover:border-[#00f0ff]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-pixel text-[9px] px-2 py-0.5 rounded bg-black/60 border uppercase"
                      style={{ color: proj.accentColor, borderColor: `${proj.accentColor}66` }}
                    >
                      {proj.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{proj.subtitle}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techTags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 flex items-center gap-3">
                  <a
                    href={proj.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleProjectLink(proj.id, 'demo')}
                    className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#07070d] font-pixel text-[9px] font-bold tracking-wider uppercase hover:bg-[#ff2bd6] hover:text-white transition-all inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>DEMO</span>
                  </a>

                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleProjectLink(proj.id, 'github')}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-pixel text-[9px] font-bold tracking-wider uppercase hover:bg-slate-800 transition-all inline-flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>CODE</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 4: SKILL VAULT */}
        <section id="skills" className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-[#ffe600]">// 04</span>
            <h2 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
              TECHNICAL SKILL SET
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_CONTENT.skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#090b14] border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ffe600]" />
                    <span>{cat.name}</span>
                  </h3>
                  <span className="font-pixel text-[9px] text-[#ffe600] px-2 py-0.5 rounded bg-[#ffe600]/10 border border-[#ffe600]/30">
                    {cat.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400">{cat.description}</p>

                <div className="space-y-3 pt-1">
                  {cat.skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200">{s.name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{s.level}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.level}%`,
                            backgroundColor: cat.accentColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CONTACT */}
        <section id="contact" className="space-y-6 border-t border-slate-800 pt-12">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-[#00ff88]">// 05</span>
            <h2 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
              GET IN TOUCH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information & Socials */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Direct Communications</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whether you have an upcoming project, engineering opportunity, or wish to collaborate on WebGL and AI applications, feel free to reach out.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href={`mailto:${PORTFOLIO_CONTENT.socials.email}`}
                  className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-[#00f0ff] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#00ff88]" />
                  <span>{PORTFOLIO_CONTENT.socials.email}</span>
                </a>
                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{PORTFOLIO_CONTENT.location}</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 space-y-2">
                <span className="text-[10px] font-pixel text-slate-500 uppercase block">
                  SOCIAL NETWORKS
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={PORTFOLIO_CONTENT.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-300 hover:text-red-400 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={PORTFOLIO_CONTENT.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={PORTFOLIO_CONTENT.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00f0ff] text-slate-300 hover:text-[#00f0ff] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={PORTFOLIO_CONTENT.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-400 text-slate-300 hover:text-white transition-colors"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              {status === 'success' ? (
                <div className="p-6 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#00ff88] mx-auto" />
                  <h4 className="font-pixel text-xs text-white uppercase">
                    MESSAGE SENT SUCCESSFULLY
                  </h4>
                  <p className="text-xs text-slate-300">
                    Thank you, {name}. Your transmission was received and I will reply to {email} promptly.
                  </p>
                </div>
              ) : status === 'unconfigured' ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                  <span className="font-pixel text-[10px] text-amber-400 block uppercase">
                    FORM NOT CONFIGURED
                  </span>
                  <p className="text-slate-300">
                    The Formspree ID is currently the default placeholder in <code className="font-mono text-amber-300">src/content.ts</code>.
                  </p>
                  <p className="text-slate-400">
                    Please email directly at:{' '}
                    <a href={`mailto:${PORTFOLIO_CONTENT.socials.email}`} className="text-[#00f0ff] underline font-medium">
                      {PORTFOLIO_CONTENT.socials.email}
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="_gotcha"
                      value={gotcha}
                      onChange={(e) => setGotcha(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="classic-name" className="block text-xs font-medium text-slate-300 mb-1">
                        Name <span className="text-[#00ff88]">*</span>
                      </label>
                      <input
                        id="classic-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090b14] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00ff88]"
                      />
                    </div>
                    <div>
                      <label htmlFor="classic-email" className="block text-xs font-medium text-slate-300 mb-1">
                        Email <span className="text-[#00ff88]">*</span>
                      </label>
                      <input
                        id="classic-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090b14] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00ff88]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="classic-message" className="block text-xs font-medium text-slate-300 mb-1">
                      Message <span className="text-[#00ff88]">*</span>
                    </label>
                    <textarea
                      id="classic-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry or proposal..."
                      required
                      maxLength={1000}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#090b14] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00ff88] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 rounded-lg bg-[#00ff88] text-[#07070d] font-pixel text-xs tracking-wider uppercase font-bold hover:bg-[#00f0ff] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer with return to 3D */}
        <footer className="border-t border-slate-800 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {PORTFOLIO_CONTENT.name}. Built with React 18, TypeScript & Three.js.</p>
          <button
            type="button"
            onClick={handleSwitchTo3D}
            className="text-[#00f0ff] hover:underline inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Return to 3D Interactive World</span>
          </button>
        </footer>
      </main>
    </div>
  );
};
