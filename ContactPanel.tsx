/**
 * Postal Pod Station: Contact & Communications Panel.
 * Form with name, email, message, honeypot (_gotcha), validation,
 * Formspree submission with placeholder fallback, and social links.
 */
import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, Youtube, Github, Linkedin, Twitter, Loader2 } from 'lucide-react';
import { PORTFOLIO_CONTENT } from '../../content';
import { trackEvent } from '../../analytics';
import { soundManager } from '../../audio';

export const ContactPanel: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState(''); // Honeypot field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'unconfigured'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formId = PORTFOLIO_CONTENT.formspreeFormId;
  const isFormPlaceholder = !formId || formId === 'YOUR_FORM_ID' || formId.includes('YOUR_');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (gotcha) {
      setStatus('success');
      return;
    }

    // Client-side validations
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name or callsign.');
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    if (!trimmedMessage) {
      setErrorMessage('Please enter your transmission message.');
      setStatus('error');
      return;
    }

    if (trimmedMessage.length > 1000) {
      setErrorMessage('Please keep transmission under 1,000 characters.');
      setStatus('error');
      return;
    }

    // Check if Formspree form ID is placeholder
    if (isFormPlaceholder) {
      setStatus('unconfigured');
      trackEvent('contact_submitted', { status: 'unconfigured' });
      soundManager.playBump();
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
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to deliver transmission.');
      }

      setStatus('success');
      trackEvent('contact_submitted', { status: 'success' });
      soundManager.playCollect();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transmission failed to deliver.';
      setErrorMessage(msg);
      setStatus('error');
      soundManager.playBump();
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Subtitle & Introduction */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#00ff88]" />
          <span>Postal Communications Hub</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Send a direct transmission or connect across external network channels.
        </p>
      </div>

      {/* 2. Form States */}
      {status === 'success' ? (
        <div className="p-6 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto" />
          <h4 className="font-pixel text-sm text-white uppercase">
            TRANSMISSION CONFIRMED!
          </h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{name}</strong>. Your message was successfully dispatched into Sagar&apos;s communications queue.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setMessage('');
              setName('');
              setEmail('');
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
          >
            Send Another Transmission
          </button>
        </div>
      ) : status === 'unconfigured' ? (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-pixel text-xs uppercase">FORM NOT CONFIGURED YET</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Formspree ID is currently the default placeholder (<code className="font-mono text-amber-300">FORMSPREE_FORM_ID = &quot;YOUR_FORM_ID&quot;</code> in <code className="font-mono text-amber-300">src/content.ts</code>).
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please connect directly via email at:{' '}
            <a
              href={`mailto:${PORTFOLIO_CONTENT.socials.email}?subject=Inquiry%20from%20Portfolio`}
              className="text-[#00f0ff] font-medium underline"
            >
              {PORTFOLIO_CONTENT.socials.email}
            </a>
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-xs text-slate-400 underline hover:text-white cursor-pointer"
          >
            ← Back to form
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field for bot suppression (hidden) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="_gotcha">Leave this empty</label>
            <input
              id="_gotcha"
              type="text"
              name="_gotcha"
              value={gotcha}
              onChange={(e) => setGotcha(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Error Message Alert */}
          {status === 'error' && errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1">
              Your Name / Callsign <span className="text-[#00ff88]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Chen"
              maxLength={100}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1">
              Your Return Email <span className="text-[#00ff88]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya@example.com"
              maxLength={120}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          {/* Message Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="contact-message" className="text-xs font-medium text-slate-300">
                Transmission Details <span className="text-[#00ff88]">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {message.length} / 1000
              </span>
            </div>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Let's build something extraordinary together..."
              maxLength={1000}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#070912] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-lg bg-[#00ff88] text-[#07070d] font-pixel text-xs tracking-wider uppercase font-bold hover:bg-[#00f0ff] transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DISPATCHING...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SEND TRANSMISSION</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* 3. External Social Networks */}
      <div className="pt-3 border-t border-slate-800">
        <span className="text-[11px] font-pixel text-slate-400 uppercase block mb-3">
          FREQUENCY CHANNELS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a
            href={PORTFOLIO_CONTENT.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#0c101e] border border-slate-800 hover:border-red-500 hover:text-red-400 text-slate-300 text-xs flex items-center gap-2 transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>YouTube</span>
          </a>

          <a
            href={PORTFOLIO_CONTENT.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#0c101e] border border-slate-800 hover:border-slate-500 hover:text-white text-slate-300 text-xs flex items-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href={PORTFOLIO_CONTENT.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#0c101e] border border-slate-800 hover:border-[#00f0ff] hover:text-[#00f0ff] text-slate-300 text-xs flex items-center gap-2 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[#00f0ff]" />
            <span>LinkedIn</span>
          </a>

          <a
            href={PORTFOLIO_CONTENT.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#0c101e] border border-slate-800 hover:border-slate-400 hover:text-white text-slate-300 text-xs flex items-center gap-2 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>X (Twitter)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
