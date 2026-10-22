import React from 'react';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { AboutCard, ContactCard, ProjectCard, SkillsCard } from './RichCards';

interface QuickViewProps {
  onSwitchToChat: (prefillPrompt?: string) => void;
}

export const QuickView: React.FC<QuickViewProps> = ({ onSwitchToChat }) => {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-fade-up">
      <header className="border-b border-[#14161A]/10 dark:border-[#F2F0EA]/12 pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#14161A] dark:text-[#F2F0EA]">
              {KNOWLEDGE_BASE.name}
            </h1>
            <p className="mt-1.5 text-base text-[#14161A]/75 dark:text-[#F2F0EA]/75">
              {KNOWLEDGE_BASE.role} · {KNOWLEDGE_BASE.location}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchToChat()}
            className="text-xs font-medium text-[#C8102E] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Return to AI chat →
          </button>
        </div>
      </header>

      <section aria-labelledby="quickview-about">
        <h2
          id="quickview-about"
          className="font-serif-editorial text-xl font-medium text-[#14161A] dark:text-[#F2F0EA] mb-3"
        >
          01. About
        </h2>
        <AboutCard />
      </section>

      <section aria-labelledby="quickview-projects">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2
            id="quickview-projects"
            className="font-serif-editorial text-xl font-medium text-[#14161A] dark:text-[#F2F0EA]"
          >
            02. Projects
          </h2>
          <span className="text-xs text-[#14161A]/55 dark:text-[#F2F0EA]/55 tabular-nums">
            {KNOWLEDGE_BASE.projects.length} selected works
          </span>
        </div>
        <div className="space-y-3.5">
          {KNOWLEDGE_BASE.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              defaultExpanded={true}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="quickview-skills">
        <h2
          id="quickview-skills"
          className="font-serif-editorial text-xl font-medium text-[#14161A] dark:text-[#F2F0EA] mb-3"
        >
          03. Skills
        </h2>
        <SkillsCard skillId="all" />
      </section>

      <section aria-labelledby="quickview-contact" className="pb-8">
        <h2
          id="quickview-contact"
          className="font-serif-editorial text-xl font-medium text-[#14161A] dark:text-[#F2F0EA] mb-3"
        >
          04. Contact
        </h2>
        <ContactCard />
      </section>
    </div>
  );
};
