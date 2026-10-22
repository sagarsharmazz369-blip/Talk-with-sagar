import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';
import {
  CardRef,
  KNOWLEDGE_BASE,
  ProjectItem,
  SkillGroup,
} from '../data/knowledgeBase';

interface ProjectCardProps {
  project: ProjectItem;
  defaultExpanded?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const validLinks = project.links.filter(
    (l) => l.url && l.url.startsWith('http') && !l.url.includes('[ADD]')
  );

  return (
    <article className="border border-[#14161A]/12 dark:border-[#F2F0EA]/14 rounded-[12px] bg-[#FAF8F4] dark:bg-[#16181C] p-5 transition-colors">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="font-serif-editorial text-[19px] font-medium leading-snug text-[#14161A] dark:text-[#F2F0EA]">
            {project.title}
          </h3>
          <span
            aria-hidden="true"
            className="text-xs text-[#14161A]/40 dark:text-[#F2F0EA]/40"
          >
            ·
          </span>
          <span className="text-xs font-medium text-[#14161A]/65 dark:text-[#F2F0EA]/65">
            {project.status}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{expanded ? 'Hide details' : 'Details'}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <p
        className={`mt-2.5 text-[14.5px] leading-[1.6] text-[#14161A]/85 dark:text-[#F2F0EA]/85 ${
          expanded ? '' : 'line-clamp-2'
        }`}
      >
        {expanded ? project.description : project.summary}
      </p>

      {expanded && validLinks.length === 0 && (
        <p className="mt-2.5 text-xs leading-relaxed text-[#14161A]/60 dark:text-[#F2F0EA]/60">
          Public project link not published yet.{' '}
          <a
            href={`mailto:${KNOWLEDGE_BASE.contact.email}?subject=${encodeURIComponent(
              `Question about ${project.title}`
            )}`}
            className="text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E]"
          >
            Email Sagar
          </a>{' '}
          for a walkthrough or code details.
        </p>
      )}

      <div className="mt-3.5 pt-3 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-y-1 text-xs text-[#14161A]/60 dark:text-[#F2F0EA]/60"
          aria-label="Technology stack"
        >
          {project.stack.map((tech, idx) => (
            <React.Fragment key={tech}>
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-1.5 text-[#14161A]/35 dark:text-[#F2F0EA]/35"
                >
                  ·
                </span>
              )}
              <span>{tech}</span>
            </React.Fragment>
          ))}
        </div>

        {validLinks.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            {validLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] whitespace-nowrap shrink-0"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

interface SkillsCardProps {
  skillId?: string;
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skillId = 'all' }) => {
  const groups: SkillGroup[] =
    skillId && skillId !== 'all'
      ? KNOWLEDGE_BASE.skills.filter((g) => g.id === skillId)
      : KNOWLEDGE_BASE.skills;

  const displayGroups = groups.length > 0 ? groups : KNOWLEDGE_BASE.skills;

  return (
    <article className="border border-[#14161A]/12 dark:border-[#F2F0EA]/14 rounded-[12px] bg-[#FAF8F4] dark:bg-[#16181C] p-5">
      <h3 className="font-serif-editorial text-[19px] font-medium leading-snug text-[#14161A] dark:text-[#F2F0EA]">
        Technical stack and tools
      </h3>
      <p className="mt-1 text-xs text-[#14161A]/60 dark:text-[#F2F0EA]/60">
        Tools and technologies Sagar builds and creates with
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayGroups.map((group) => (
          <div
            key={group.id}
            className="border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10 pt-3"
          >
            <h4 className="text-xs font-semibold text-[#14161A] dark:text-[#F2F0EA]">
              {group.category}
            </h4>
            <ul className="mt-1.5 space-y-1 text-[13.5px] leading-relaxed text-[#14161A]/80 dark:text-[#F2F0EA]/80">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
};

export const AboutCard: React.FC = () => {
  return (
    <article className="border border-[#14161A]/12 dark:border-[#F2F0EA]/14 rounded-[12px] bg-[#FAF8F4] dark:bg-[#16181C] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif-editorial text-[19px] font-medium leading-snug text-[#14161A] dark:text-[#F2F0EA]">
          About {KNOWLEDGE_BASE.name}
        </h3>
        <span className="text-xs text-[#14161A]/60 dark:text-[#F2F0EA]/60">
          {KNOWLEDGE_BASE.location}
        </span>
      </div>

      <p className="mt-2.5 text-[14.5px] leading-[1.65] text-[#14161A]/85 dark:text-[#F2F0EA]/85">
        {KNOWLEDGE_BASE.about}
      </p>

      <dl className="mt-4 pt-3 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-[#14161A]/55 dark:text-[#F2F0EA]/55">Education</dt>
          <dd className="mt-0.5 font-medium text-[#14161A] dark:text-[#F2F0EA]">
            {KNOWLEDGE_BASE.education}
          </dd>
        </div>
        <div>
          <dt className="text-[#14161A]/55 dark:text-[#F2F0EA]/55">
            YouTube channel
          </dt>
          <dd className="mt-0.5">
            <a
              href={KNOWLEDGE_BASE.contact.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E]"
            >
              <span>{KNOWLEDGE_BASE.contact.youtube.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
};

export const ContactCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(KNOWLEDGE_BASE.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
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
      setErrorMessage('Please write a message for Sagar.');
      setStatus('error');
      return;
    }
    if (trimmedMessage.length > 1000) {
      setErrorMessage('Please keep your message under 1,000 characters.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          honeypot: honeypot.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message.');
      }

      setStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send message right now.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  // Only show links that have a real, non-empty, non-[ADD] URL
  const candidateLinks: Array<{ name: string; value: string; url: string }> = [
    {
      name: 'YouTube',
      value: KNOWLEDGE_BASE.contact.youtube.label,
      url: KNOWLEDGE_BASE.contact.youtube.url,
    },
  ];

  const github = KNOWLEDGE_BASE.contact.github;
  if (github && github.url && !github.url.includes('[ADD]')) {
    candidateLinks.push({
      name: 'GitHub',
      value: github.label,
      url: github.url,
    });
  }

  const linkedin = KNOWLEDGE_BASE.contact.linkedin;
  if (linkedin && linkedin.url && !linkedin.url.includes('[ADD]')) {
    candidateLinks.push({
      name: 'LinkedIn',
      value: linkedin.label,
      url: linkedin.url,
    });
  }

  const xLink = KNOWLEDGE_BASE.contact.x;
  if (xLink && xLink.url && !xLink.url.includes('[ADD]')) {
    candidateLinks.push({
      name: 'X',
      value: xLink.label,
      url: xLink.url,
    });
  }

  return (
    <article className="border border-[#14161A]/12 dark:border-[#F2F0EA]/14 rounded-[12px] bg-[#FAF8F4] dark:bg-[#16181C] p-5 shadow-sm transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif-editorial text-[19px] font-medium leading-snug text-[#14161A] dark:text-[#F2F0EA]">
            Contact Sagar
          </h3>
          <p className="mt-0.5 text-xs text-[#14161A]/60 dark:text-[#F2F0EA]/60">
            Direct email or send a message straight to his inbox
          </p>
        </div>
        <a
          href={`mailto:${KNOWLEDGE_BASE.contact.email}`}
          className="text-xs font-medium text-[#C8102E] hover:underline inline-flex items-center gap-1 shrink-0 pt-0.5"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email directly</span>
        </a>
      </div>

      {/* Quick Direct Email Row */}
      <div className="mt-3 pt-3 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="block text-[11px] text-[#14161A]/55 dark:text-[#F2F0EA]/55">
            Sagar&apos;s email
          </span>
          <a
            href={`mailto:${KNOWLEDGE_BASE.contact.email}`}
            className="mt-0.5 font-medium text-[#C8102E] hover:underline"
          >
            {KNOWLEDGE_BASE.contact.email}
          </a>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border border-[#14161A]/14 dark:border-[#F2F0EA]/16 text-[11.5px] font-medium text-[#14161A] dark:text-[#F2F0EA] hover:border-[#C8102E] hover:text-[#C8102E] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#C8102E]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Compact "Send Sagar a message" form */}
      <div className="mt-3.5 pt-3 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-[#14161A] dark:text-[#F2F0EA] flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Send a message</span>
          </span>
          <span className="text-[10.5px] text-[#14161A]/45 dark:text-[#F2F0EA]/45">
            Delivered to his inbox
          </span>
        </div>

        {status === 'success' ? (
          <div className="p-3.5 rounded-[10px] bg-[#C8102E]/6 border border-[#C8102E]/20 space-y-2 animate-fade-up">
            <div className="flex items-center gap-2 text-[#C8102E]">
              <Check className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">Message delivered to Sagar!</span>
            </div>
            <p className="text-xs text-[#14161A]/85 dark:text-[#F2F0EA]/85 leading-relaxed">
              Thank you, <strong className="font-medium text-[#14161A] dark:text-[#F2F0EA]">{name}</strong>. Your message was forwarded directly to{' '}
              <span className="font-mono text-[11px] text-[#C8102E]">{KNOWLEDGE_BASE.contact.email}</span>. Sagar will reply to <span className="underline">{email}</span>.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                  setErrorMessage(null);
                }}
                className="text-xs text-[#C8102E] font-medium hover:underline cursor-pointer"
              >
                Send another message
              </button>
              <span className="text-[10.5px] text-[#14161A]/40 dark:text-[#F2F0EA]/40">3 messages / IP / day</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Honeypot field for spam bots (hidden off-screen) */}
            <div
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                height: 0,
                width: 0,
                overflow: 'hidden',
              }}
              aria-hidden="true"
            >
              <label htmlFor="contact-hp-field">Leave this empty</label>
              <input
                id="contact-hp-field"
                type="text"
                name="_hp_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Error banner with email fallback */}
            {status === 'error' && errorMessage && (
              <div className="p-3 rounded-[8px] bg-[#C8102E]/10 border border-[#C8102E]/20 text-xs text-[#14161A]/90 dark:text-[#F2F0EA]/90 space-y-1.5 animate-fade-up">
                <div className="flex items-start gap-1.5 text-[#C8102E] font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
                <p className="text-[11.5px] text-[#14161A]/70 dark:text-[#F2F0EA]/70">
                  Fallback:{' '}
                  <a
                    href={`mailto:${KNOWLEDGE_BASE.contact.email}?subject=${encodeURIComponent(
                      `Message from ${name || 'Portfolio Visitor'}`
                    )}&body=${encodeURIComponent(message)}`}
                    className="font-medium text-[#C8102E] underline"
                  >
                    Email Sagar directly ({KNOWLEDGE_BASE.contact.email})
                  </a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-[11px] font-medium text-[#14161A]/60 dark:text-[#F2F0EA]/60 mb-0.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Your name"
                  maxLength={100}
                  disabled={status === 'submitting'}
                  className="w-full px-2.5 py-1.5 text-xs rounded-[7px] border border-[#14161A]/14 dark:border-[#F2F0EA]/16 bg-[#F6F4EF] dark:bg-[#111215] text-[#14161A] dark:text-[#F2F0EA] placeholder:text-[#14161A]/35 dark:placeholder:text-[#F2F0EA]/35 focus:outline-none focus:border-[#C8102E] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[11px] font-medium text-[#14161A]/60 dark:text-[#F2F0EA]/60 mb-0.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="you@example.com"
                  maxLength={120}
                  disabled={status === 'submitting'}
                  className="w-full px-2.5 py-1.5 text-xs rounded-[7px] border border-[#14161A]/14 dark:border-[#F2F0EA]/16 bg-[#F6F4EF] dark:bg-[#111215] text-[#14161A] dark:text-[#F2F0EA] placeholder:text-[#14161A]/35 dark:placeholder:text-[#F2F0EA]/35 focus:outline-none focus:border-[#C8102E] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label
                  htmlFor="contact-msg"
                  className="text-[11px] font-medium text-[#14161A]/60 dark:text-[#F2F0EA]/60"
                >
                  Message
                </label>
                <span
                  className={`text-[10px] tabular-nums ${
                    message.length >= 1000
                      ? 'text-[#C8102E] font-medium'
                      : 'text-[#14161A]/40 dark:text-[#F2F0EA]/40'
                  }`}
                >
                  {message.length}/1000
                </span>
              </div>
              <textarea
                id="contact-msg"
                rows={3}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Write about a project, hiring, internship, or question..."
                maxLength={1000}
                disabled={status === 'submitting'}
                className="w-full px-2.5 py-1.5 text-xs rounded-[7px] border border-[#14161A]/14 dark:border-[#F2F0EA]/16 bg-[#F6F4EF] dark:bg-[#111215] text-[#14161A] dark:text-[#F2F0EA] placeholder:text-[#14161A]/35 dark:placeholder:text-[#F2F0EA]/35 focus:outline-none focus:border-[#C8102E] resize-none leading-relaxed transition-colors"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-0.5">
              <span className="text-[10.5px] text-[#14161A]/45 dark:text-[#F2F0EA]/45">
                Max 3 messages / IP / day
              </span>

              <button
                type="submit"
                disabled={status === 'submitting' || !name.trim() || !email.trim() || !message.trim()}
                className="px-3.5 py-1.5 rounded-[7px] bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Send message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Real links only: YouTube (@JustSagarX) */}
      <div className="mt-3.5 pt-3 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10 space-y-2">
        {candidateLinks.map((item) => (
          <div key={item.name} className="flex items-baseline justify-between gap-2 text-xs">
            <span className="text-[#14161A]/55 dark:text-[#F2F0EA]/55">
              {item.name}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] truncate"
            >
              <span className="truncate">{item.value}</span>
              <ArrowUpRight className="w-3 h-3 shrink-0" />
            </a>
          </div>
        ))}
      </div>
    </article>
  );
};

export const CardRenderer: React.FC<{ card: CardRef }> = ({ card }) => {
  if (card.type === 'project') {
    const project = KNOWLEDGE_BASE.projects.find((p) => p.id === card.id);
    if (!project) return null;
    return <ProjectCard project={project} />;
  }
  if (card.type === 'skills') {
    return <SkillsCard skillId={card.id} />;
  }
  if (card.type === 'about') {
    return <AboutCard />;
  }
  if (card.type === 'contact' || card.type === 'message-form') {
    return <ContactCard />;
  }
  return null;
};
