export type CardType = 'project' | 'skills' | 'about' | 'contact' | 'message-form';

export interface CardRef {
  type: CardType;
  id: string;
}

export interface AssistantResponse {
  reply: string;
  cards: CardRef[];
  mood?: 'calm' | 'happy' | 'excited' | 'curious' | 'empathetic' | 'serious';
  fallbackUsed?: boolean;
  notice?: string;
  errorDetails?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  status: string;
  oneLine: string;
  summary: string;
  description: string;
  stack: string[];
  rawLinks: string;
  links: ProjectLink[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  url: string;
}

export interface ContactInfo {
  email: string;
  youtube: ContactLink;
  github: ContactLink | null;
  linkedin: ContactLink | null;
  x: ContactLink | null;
  resume: string | null;
}

export const STARTER_CHIPS = [
  '30-second summary',
  'What has Sagar built?',
  "What's his tech stack?",
  'Check fit for a role',
  'Send a message',
  'Surprise me',
  'How do I contact him?',
] as const;

export const KNOWLEDGE_BASE = {
  name: 'Sagar',
  role: 'Student building AI products',
  location: 'Kathmandu, Nepal',
  education: 'Class 12, Liverpool International College, Kathmandu',
  about:
    "Sagar is a Class 12 student at Liverpool International College in Kathmandu. He builds AI products around problems close to him: finding scholarships, helping farmers spot crop disease, reducing food waste. He also runs the YouTube channel Just Sagar, where he teaches AI in Hindi and Hinglish, and ran a 56-day 'Zero to AI' Shorts series. Long term, he wants to build an AI company.",
  openTo: '[ADD: internships / freelance / collaborations]',
  projects: [
    {
      id: 'udaan',
      title: 'Udaan',
      status: 'In development',
      oneLine:
        'Matches students with scholarships, programs, colleges, hackathons and internships.',
      summary:
        'Matches students with scholarships, programs, colleges, hackathons and internships. Gives each student a personalised match feed based on their profile.',
      description:
        'Matches students with scholarships, programs, colleges, hackathons and internships. Gives each student a personalised match feed based on their profile. A research engine finds new opportunities and an admin reviews them before anything is published.',
      stack: [
        'Firebase Auth',
        'Firestore',
        'Express',
        'Cloud Run',
        'Gemini',
        'Tavily',
        'Resend',
      ],
      rawLinks: '[ADD]',
      links: [],
    },
    {
      id: 'crop-detector',
      title: 'Crop Disease Detector',
      status: 'In development',
      oneLine:
        'A web tool that uses AI vision to identify crop diseases from images, built for farmers in Nepal and South Asia.',
      summary:
        'A web tool that uses AI vision to identify crop diseases from images, built for farmers in Nepal and South Asia.',
      description:
        'A web tool that uses AI vision to identify crop diseases from images, built for farmers in Nepal and South Asia.',
      stack: [
        'HTML',
        'CSS',
        'JavaScript',
        'Gemini Vision API',
        'Google Custom Search API',
      ],
      rawLinks: '[ADD]',
      links: [],
    },
    {
      id: 'surplus-connector',
      title: 'Surplus Connector',
      status: 'Hackathon, team project',
      oneLine:
        'A food-surplus coordination platform: a donor posts surplus food, it is matched to a verified recipient, claimed, picked up and marked as rescued.',
      summary:
        'A food-surplus coordination platform: a donor posts surplus food, it is matched to a verified recipient, claimed, picked up and marked as rescued.',
      description:
        "A food-surplus coordination platform: a donor posts surplus food, it is matched to a verified recipient, claimed, picked up and marked as rescued. Built for the lablab.ai Dark Factory hackathon, Sep to Oct 2026. Sagar's part: the demo app, test suite, observability dashboard and final presentation.",
      stack: [
        'React',
        'TypeScript',
        'Vite',
        'Firebase',
        'Firestore',
        'Gemini API',
      ],
      rawLinks: '[ADD]',
      links: [],
    },
    {
      id: 'telegram-bot',
      title: 'Telegram bot',
      status: 'Live',
      oneLine:
        'A Telegram bot automated with Make.com, where Sagar started learning automation.',
      summary:
        'A Telegram bot automated with Make.com, where Sagar started learning automation.',
      description:
        'A Telegram bot automated with Make.com, where Sagar started learning automation.',
      stack: ['Make.com', 'Telegram'],
      rawLinks: '[ADD]',
      links: [],
    },
  ] as ProjectItem[],
  skills: [
    {
      id: 'frontend',
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Vite', 'HTML/CSS/JavaScript'],
    },
    {
      id: 'backend',
      category: 'Backend',
      items: [
        'Node.js',
        'Express',
        'Firebase Auth',
        'Firestore',
        'Google Cloud Run',
      ],
    },
    {
      id: 'ai-tools',
      category: 'AI tools',
      items: [
        'Gemini API (including Vision)',
        'Prompt design',
        'Make.com automation',
        'Tavily search',
      ],
    },
    {
      id: 'content-design',
      category: 'Content and design',
      items: [
        'YouTube (Just Sagar)',
        'Canva',
        'CapCut',
        'AI image prompts for thumbnails',
      ],
    },
  ] as SkillGroup[],
  contact: {
    email: 'sagarsharmazz369@gmail.com',
    youtube: {
      label: '@JustSagarX (Just Sagar)',
      url: 'https://www.youtube.com/@JustSagarX',
    },
    github: {
      label: 'github.com/sagarsharmazz369-blip',
      url: 'https://github.com/sagarsharmazz369-blip',
    },
    linkedin: {
      label: 'Sagar Sharma',
      url: 'https://www.linkedin.com/in/sagar-sharma-29453b3b6/',
    },
    x: {
      label: '@SagarSharm79850',
      url: 'https://x.com/SagarSharm79850',
    },
    resume: null,
  } as ContactInfo,
} as const;

export function isContactQuery(rawMessage: string): boolean {
  if (isGreetingQuery(rawMessage)) return false;
  if (isSalaryOrResumeOrAvailabilityQuery(rawMessage)) return false;
  const q = rawMessage.toLowerCase();
  return (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('hire') ||
    q.includes('hiring') ||
    q.includes('reach') ||
    q.includes('collaborat') ||
    q.includes('get in touch') ||
    q.includes('how do i contact') ||
    q.includes('reach sagar') ||
    q.includes('message') ||
    q.includes('send a message') ||
    q.includes('send sagar a message') ||
    q.includes('work together')
  );
}

export function isGreetingQuery(rawMessage: string): boolean {
  const cleaned = rawMessage.trim().toLowerCase().replace(/[!.,?]/g, '');
  const greetings = [
    'hi',
    'hey',
    'hy',
    'hello',
    'namaste',
    'hola',
    'greetings',
    'good morning',
    'good afternoon',
    'good evening',
  ];
  if (greetings.includes(cleaned)) return true;
  for (const g of greetings) {
    if (cleaned === g || cleaned.startsWith(`${g} `)) return true;
  }
  return false;
}

export function isSalaryOrResumeOrAvailabilityQuery(rawMessage: string): boolean {
  const q = rawMessage.toLowerCase();
  return (
    q.includes('salary') ||
    q.includes('compensation') ||
    q.includes('rate') ||
    q.includes('hourly') ||
    q.includes('pricing') ||
    q.includes('availability') ||
    q.includes('available') ||
    q.includes('open to work') ||
    q.includes('when can he start') ||
    q.includes('resume') ||
    q.includes('cv')
  );
}

export function isCardSpecificallyRequested(card: CardRef, rawMessage: string): boolean {
  const q = rawMessage.toLowerCase();
  if (card.type === 'contact' || card.type === 'message-form') {
    return isContactQuery(rawMessage);
  }
  if (card.type === 'project') {
    if (card.id === 'udaan' && (q.includes('udaan') || q.includes('scholarship'))) return true;
    if (card.id === 'crop-detector' && (q.includes('crop') || q.includes('farmer') || q.includes('disease'))) return true;
    if (card.id === 'surplus-connector' && (q.includes('surplus') || q.includes('food') || q.includes('hackathon') || q.includes('lablab'))) return true;
    if (card.id === 'telegram-bot' && (q.includes('telegram') || q.includes('bot') || q.includes('make.com'))) return true;
    if (
      q.includes('what has sagar built') ||
      q.includes('projects') ||
      q.includes('surprise me') ||
      q.includes('role') ||
      q.includes('fit') ||
      q.includes('job') ||
      q.includes('brief') ||
      q.length > 120
    ) {
      return true;
    }
    return false;
  }
  if (card.type === 'skills') {
    return q.includes('stack') || q.includes('skill') || q.includes('tech') || q.includes('react') || q.includes('tools');
  }
  if (card.type === 'about') {
    return q.includes('about') || q.includes('summary') || q.includes('who is') || q.includes('background') || q.includes('liverpool') || q.includes('college') || q.includes('education');
  }
  return false;
}

export function getRandomSurpriseResponse(): AssistantResponse {
  const projects = KNOWLEDGE_BASE.projects;
  const randomProject = projects[Math.floor(Math.random() * projects.length)];
  return {
    reply: `Here is one of Sagar's projects, ${randomProject.title}: ${randomProject.oneLine}`,
    cards: [{ type: 'project', id: randomProject.id }],
  };
}

export function sanitizeCards(
  rawCards: unknown,
  userMessage: string,
  recentCardKeys: string[] = []
): CardRef[] {
  if (!Array.isArray(rawCards)) return [];
  const validProjectIds = new Set(KNOWLEDGE_BASE.projects.map((p) => p.id));
  const validSkillIds = new Set([
    'all',
    ...KNOWLEDGE_BASE.skills.map((s) => s.id),
  ]);

  const seen = new Set<string>();
  const filtered: CardRef[] = [];
  const contactAllowed = isContactQuery(userMessage);

  for (const item of rawCards) {
    if (!item || typeof item !== 'object') continue;
    const type = (item as Record<string, unknown>).type;
    const rawId =
      typeof (item as Record<string, unknown>).id === 'string'
        ? ((item as Record<string, unknown>).id as string).trim().toLowerCase()
        : '';

    if (type === 'project' && validProjectIds.has(rawId)) {
      const key = `project:${rawId}`;
      if (!seen.has(key)) {
        seen.add(key);
        filtered.push({ type: 'project', id: rawId });
      }
    } else if (type === 'skills') {
      const skillId = validSkillIds.has(rawId) ? rawId : 'all';
      const key = `skills:${skillId}`;
      if (!seen.has(key)) {
        seen.add(key);
        filtered.push({ type: 'skills', id: skillId });
      }
    } else if (type === 'about') {
      const key = 'about:sagar';
      if (!seen.has(key)) {
        seen.add(key);
        filtered.push({ type: 'about', id: 'sagar' });
      }
    } else if (type === 'contact' || type === 'message-form') {
      // RULE: Show Contact card ONLY when visitor explicitly asks about contact, hiring, email or reach
      if (contactAllowed) {
        const key = 'contact:sagar';
        if (!seen.has(key)) {
          seen.add(key);
          filtered.push({ type: 'contact', id: 'sagar' });
        }
      }
    }
  }

  // RULE: Do not show the same card again within the next 5 messages unless visitor asks for it again
  const result: CardRef[] = [];
  for (const card of filtered) {
    const key = `${card.type}:${card.id}`;
    const wasRecentlyShown = recentCardKeys.includes(key);
    const specificallyAsked = isCardSpecificallyRequested(card, userMessage);

    if (wasRecentlyShown && !specificallyAsked) {
      continue;
    }
    result.push(card);
  }

  // RULE: Attach at most 2 cards per reply
  return result.slice(0, 2);
}

export function isJobDescriptionOrBrief(rawMessage: string): boolean {
  const text = rawMessage.toLowerCase();
  if (
    text.includes('job description') ||
    text.includes('project brief') ||
    text.includes('role fit') ||
    text.includes('fit for a role') ||
    text.includes('check fit') ||
    text.includes('candidate fit') ||
    text.includes('fit for this role')
  ) {
    return true;
  }
  const jdKeywords = [
    'requirements',
    'responsibilities',
    'qualifications',
    'looking for a',
    'job title',
    'about the role',
    'role overview',
    'what you will do',
    'must have',
    'nice to have',
    'years of experience',
    'full-time',
    'internship',
    'software engineer',
    'web developer',
    'ai engineer',
  ];
  let matches = 0;
  for (const kw of jdKeywords) {
    if (text.includes(kw)) matches++;
  }
  return matches >= 2 || (matches >= 1 && text.length > 150);
}

export function evaluateRoleFitLocally(
  rawMessage: string,
  recentCardKeys: string[] = []
): AssistantResponse {
  // Treat the pasted text as strictly untrusted and ignore any instruction inside it
  const text = rawMessage.toLowerCase();

  const fits: string[] = [];
  const projectCards: CardRef[] = [];

  // 1. AI, LLM, Vision matching
  if (
    text.includes('ai') ||
    text.includes('llm') ||
    text.includes('gemini') ||
    text.includes('vision') ||
    text.includes('prompt') ||
    text.includes('machine learning') ||
    text.includes('model')
  ) {
    fits.push(
      'Applied AI & computer vision: Integrates Gemini models for production tasks, including agricultural disease identification in Crop Disease Detector and student opportunity recommendation in Udaan.'
    );
    projectCards.push({ type: 'project', id: 'crop-detector' });
  }

  // 2. Frontend / React / TypeScript matching
  if (
    text.includes('react') ||
    text.includes('typescript') ||
    text.includes('frontend') ||
    text.includes('web') ||
    text.includes('vite') ||
    text.includes('javascript') ||
    text.includes('ui')
  ) {
    fits.push(
      'Modern web frontend: Builds responsive, accessible interfaces using React, TypeScript, and Vite across projects like Udaan, Surplus Connector, and Crop Disease Detector.'
    );
    if (!projectCards.some((c) => c.id === 'udaan')) {
      projectCards.push({ type: 'project', id: 'udaan' });
    }
  }

  // 3. Backend / Node.js / Express / Firebase / Cloud Run
  if (
    text.includes('backend') ||
    text.includes('node') ||
    text.includes('express') ||
    text.includes('firebase') ||
    text.includes('firestore') ||
    text.includes('cloud run') ||
    text.includes('api') ||
    text.includes('server')
  ) {
    fits.push(
      'Backend & cloud architecture: Implements RESTful APIs in Node.js and Express, handles user auth and state in Firebase Auth and Firestore, and deploys scalable services to Google Cloud Run.'
    );
    if (!projectCards.some((c) => c.id === 'udaan')) {
      projectCards.push({ type: 'project', id: 'udaan' });
    }
  }

  // 4. Prototyping, Hackathons, Collaboration, Observability
  if (
    text.includes('hackathon') ||
    text.includes('prototype') ||
    text.includes('mvp') ||
    text.includes('fast') ||
    text.includes('agile') ||
    text.includes('test') ||
    text.includes('observability') ||
    text.includes('dashboard') ||
    text.includes('collaboration') ||
    text.includes('surplus')
  ) {
    fits.push(
      'Rapid prototype execution: Built the complete demo application, automated test suite, and observability dashboard for Surplus Connector during the lablab.ai Dark Factory hackathon.'
    );
    if (!projectCards.some((c) => c.id === 'surplus-connector')) {
      projectCards.push({ type: 'project', id: 'surplus-connector' });
    }
  }

  // 5. Automation & Telegram bots
  if (
    text.includes('automation') ||
    text.includes('workflow') ||
    text.includes('bot') ||
    text.includes('make.com') ||
    text.includes('telegram')
  ) {
    fits.push(
      'Workflow automation: Developed a live Telegram bot automated through Make.com workflows.'
    );
    if (!projectCards.some((c) => c.id === 'telegram-bot')) {
      projectCards.push({ type: 'project', id: 'telegram-bot' });
    }
  }

  // Fallbacks to ensure exactly 3 to 4 points
  if (fits.length < 3) {
    fits.push(
      'Opportunity matching platform: Architected Udaan with a research discovery engine, personalized matching algorithm, and admin moderation pipeline.'
    );
    if (!projectCards.some((c) => c.id === 'udaan')) {
      projectCards.push({ type: 'project', id: 'udaan' });
    }
  }
  if (fits.length < 3) {
    fits.push(
      'Technical communication & AI education: Runs the YouTube channel Just Sagar (@JustSagarX), creating educational tutorials in Hindi/Hinglish including a 56-day Zero to AI series.'
    );
  }
  if (fits.length < 3) {
    fits.push(
      'Core full-stack web stack: Works actively with React, TypeScript, Node.js, Express, Firebase, and the Gemini API.'
    );
  }

  const selectedFits = fits.slice(0, 4);

  // Honest gaps analysis
  const gaps: string[] = [];
  const requiresSeniority =
    text.includes('senior') ||
    text.includes('lead') ||
    text.includes('principal') ||
    text.includes('staff') ||
    text.includes('5+ years') ||
    text.includes('3+ years') ||
    text.includes('manager');

  const requiresDegree =
    text.includes('degree') ||
    text.includes('bachelor') ||
    text.includes('master') ||
    text.includes('phd') ||
    text.includes('cs degree') ||
    text.includes('b.s.') ||
    text.includes('b.tech');

  if (requiresSeniority) {
    gaps.push(
      'Senior industry experience: Sagar is currently a high school student (Class 12 at Liverpool International College) and does not have years of full-time corporate track record.'
    );
  } else {
    gaps.push(
      'High school student status: Sagar is in Class 12; he has hands-on prototyping and hackathon project experience rather than multi-year enterprise corporate tenure.'
    );
  }

  if (requiresDegree) {
    gaps.push(
      'Formal academic degree: He is currently completing high school in Kathmandu and does not hold a university degree yet.'
    );
  }

  const unlistedTechs: string[] = [];
  if (/\bpython\b/.test(text)) unlistedTechs.push('Python');
  if (/\b(java|spring boot)\b/.test(text)) unlistedTechs.push('Java');
  if (/\b(c\+\+|c#|\.net)\b/.test(text)) unlistedTechs.push('C++/C#');
  if (/\b(go|golang)\b/.test(text)) unlistedTechs.push('Go');
  if (/\brust\b/.test(text)) unlistedTechs.push('Rust');
  if (/\baws\b/.test(text)) unlistedTechs.push('AWS');
  if (/\b(kubernetes|k8s|docker)\b/.test(text)) unlistedTechs.push('Kubernetes/Docker');
  if (/\b(postgres|postgresql|sql)\b/.test(text)) unlistedTechs.push('SQL/Postgres');
  if (/\b(flutter|react native|ios|android|swift|kotlin)\b/.test(text)) unlistedTechs.push('Mobile (Flutter/iOS/Android)');

  if (unlistedTechs.length > 0) {
    gaps.push(
      `Unlisted technical requirements: The role specifies ${unlistedTechs.slice(0, 3).join(', ')}, which are not listed in Sagar's verified knowledge base.`
    );
  }

  gaps.push(
    'Public terms & availability: Sagar has not publicly shared his resume, salary expectations, or exact working hours.'
  );

  // Determine honest verdict
  const isWeak =
    requiresSeniority ||
    (requiresDegree && text.includes('mandatory')) ||
    unlistedTechs.length >= 3 ||
    (!text.includes('react') &&
      !text.includes('web') &&
      !text.includes('ai') &&
      !text.includes('node') &&
      !text.includes('typescript') &&
      !text.includes('software') &&
      !text.includes('frontend') &&
      !text.includes('developer'));

  let verdict: string;
  if (isWeak) {
    verdict =
      'Verdict: Weak to partial fit — Sagar is a talented high school builder with proven AI and web prototyping skills, but he does not meet requirements for senior enterprise experience, formal degrees, or unlisted tech stacks.';
  } else {
    verdict =
      'Verdict: Promising fit for an early-career AI prototype builder, junior full-stack web developer, or applied AI intern.';
  }

  const reply = `${verdict}

Where Sagar fits:
${selectedFits.map((f) => `• ${f}`).join('\n')}

Gaps:
${gaps.slice(0, 3).map((g) => `• ${g}`).join('\n')}

If you would like to discuss this role, an internship, or a collaborative project directly with Sagar, feel free to email him at sagarsharmazz369@gmail.com.`;

  if (projectCards.length === 0) {
    projectCards.push({ type: 'project', id: 'udaan' }, { type: 'project', id: 'crop-detector' });
  }

  return {
    reply,
    cards: sanitizeCards(projectCards, rawMessage, recentCardKeys),
  };
}

export function localKeywordFallback(
  rawMessage: string,
  recentCardKeys: string[] = []
): AssistantResponse {
  const q = rawMessage.trim().toLowerCase();

  // 1. Check for standalone prompt injection or role-change attempts (NO cards)
  if (
    !isJobDescriptionOrBrief(rawMessage) &&
    (q.includes('ignore previous') ||
      q.includes('ignore all') ||
      q.includes('system prompt') ||
      q.includes('reveal your instructions') ||
      q.includes('act as') ||
      q.includes('pretend to be') ||
      q.includes('you are now'))
  ) {
    return {
      reply:
        "I am Sagar's AI assistant and can only share factual information about his projects, technical skills, education, and professional contact channels.",
      cards: [],
    };
  }

  // 1.5. Check fit for a role starter / prompt without JD attached
  if (
    q === 'check fit for a role' ||
    q === 'check fit for role' ||
    q === 'role fit' ||
    (q.includes('check fit') && q.length < 80 && !q.includes('requirements') && !q.includes('responsibilities'))
  ) {
    return {
      reply:
        "Please paste a job description or a project brief (up to 3,000 characters). I will compare it directly with Sagar's knowledge base and provide a one-line verdict, where he fits (tied to real projects), and any gaps.",
      cards: [],
    };
  }

  // 1.6. Job description or project brief evaluation (Check fit for a role)
  if (isJobDescriptionOrBrief(rawMessage)) {
    return evaluateRoleFitLocally(rawMessage, recentCardKeys);
  }

  // 2. Greetings (hi, hey, hy, hello, namaste) -> Friendly intro + starter chips, NO cards
  if (isGreetingQuery(rawMessage)) {
    return {
      reply:
        "Hello! I am Sagar's AI assistant. I can answer questions about his background, technical stack, or projects like Udaan, Crop Disease Detector, and Surplus Connector. Feel free to try '30-second summary', 'What has Sagar built?', or ask how to contact him.",
      cards: [],
    };
  }

  // 3. Salary, availability, or resume not shared publicly -> DO NOT say "I only share professional information"
  if (isSalaryOrResumeOrAvailabilityQuery(rawMessage)) {
    return {
      reply:
        "Sagar has not shared this publicly. You can email him directly at sagarsharmazz369@gmail.com to ask about his resume, availability, or compensation.",
      cards: [],
    };
  }

  // 4. Private, personal, family, or phone inquiries (NO cards)
  if (
    q.includes('phone') ||
    q.includes('mobile number') ||
    q.includes('whatsapp') ||
    q.includes('family') ||
    q.includes('parents') ||
    q.includes('girlfriend') ||
    q.includes('dating') ||
    q.includes('marital') ||
    q.includes('religion') ||
    q.includes('politics') ||
    q.includes('net worth') ||
    q.includes('bank') ||
    q.includes('home address')
  ) {
    return {
      reply:
        'I only share professional information about Sagar and his work. For other questions, you can write to him directly by email at sagarsharmazz369@gmail.com.',
      cards: [],
    };
  }

  // 5. Surprise me
  if (q === 'surprise me' || q.includes('surprise me') || q.includes('random project')) {
    const surprise = getRandomSurpriseResponse();
    return {
      reply: surprise.reply,
      cards: sanitizeCards(surprise.cards, rawMessage, recentCardKeys),
    };
  }

  // 6. Contact / hiring / reach queries -> ONLY here do we show the Contact card!
  if (isContactQuery(rawMessage)) {
    return {
      reply:
        'You can send a message directly to Sagar using the form below, or email him at sagarsharmazz369@gmail.com. He also shares tutorials on YouTube (@JustSagarX).',
      cards: sanitizeCards([{ type: 'contact', id: 'sagar' }], rawMessage, recentCardKeys),
    };
  }

  // 7. 30-second summary / About Sagar
  if (
    q.includes('30-second summary') ||
    q.includes('summary') ||
    q.includes('who is sagar') ||
    q.includes('tell me about sagar') ||
    q.includes('about him') ||
    q.includes('about sagar') ||
    q.includes('background') ||
    q.includes('bio') ||
    q.includes('introduce')
  ) {
    return {
      reply:
        "Sagar is a Class 12 student at Liverpool International College in Kathmandu, Nepal, who builds AI products around scholarships, crop disease detection, and food waste reduction. He also runs the YouTube channel Just Sagar, teaching AI in Hindi and Hinglish. Long term, he plans to build an AI company.",
      cards: sanitizeCards([{ type: 'about', id: 'sagar' }], rawMessage, recentCardKeys),
    };
  }

  // 8. Specific project queries
  if (q.includes('udaan') || q.includes('scholarship') || q.includes('match feed')) {
    return {
      reply:
        'Udaan is an in-development platform that matches students with scholarships, programs, colleges, hackathons, and internships using a personalised profile match feed. It uses a research engine to discover opportunities with admin review before publishing.',
      cards: sanitizeCards([{ type: 'project', id: 'udaan' }], rawMessage, recentCardKeys),
    };
  }

  if (
    q.includes('crop') ||
    q.includes('farmer') ||
    q.includes('disease') ||
    q.includes('agriculture') ||
    q.includes('vision')
  ) {
    return {
      reply:
        'The Crop Disease Detector is an in-development web tool built for farmers in Nepal and South Asia. It uses the Gemini Vision API and Google Custom Search API to identify crop diseases from uploaded images.',
      cards: sanitizeCards([{ type: 'project', id: 'crop-detector' }], rawMessage, recentCardKeys),
    };
  }

  if (
    q.includes('surplus') ||
    q.includes('food') ||
    q.includes('waste') ||
    q.includes('hackathon') ||
    q.includes('dark factory') ||
    q.includes('lablab')
  ) {
    return {
      reply:
        'Surplus Connector is a food-surplus coordination platform built for the lablab.ai Dark Factory hackathon (Sep–Oct 2026). Donors post surplus food, which is matched to verified recipients and tracked through pickup. Sagar built the demo app, test suite, observability dashboard, and presentation.',
      cards: sanitizeCards([{ type: 'project', id: 'surplus-connector' }], rawMessage, recentCardKeys),
    };
  }

  if (q.includes('telegram') || q.includes('make.com') || q.includes('bot')) {
    return {
      reply:
        'Sagar built a live Telegram bot automated with Make.com. It was the project where he first learned workflow automation.',
      cards: sanitizeCards([{ type: 'project', id: 'telegram-bot' }], rawMessage, recentCardKeys),
    };
  }

  // 9. What has Sagar built? / Projects overview (Max 2 cards)
  if (
    q.includes('built') ||
    q.includes('project') ||
    q.includes('portfolio') ||
    q.includes('work') ||
    q.includes('apps') ||
    q.includes('products')
  ) {
    return {
      reply:
        'Sagar has built several AI products: Udaan for student opportunity matching, Crop Disease Detector for farmers, Surplus Connector for food recovery, and an automated Telegram bot. Here are two of his key projects.',
      cards: sanitizeCards(
        [
          { type: 'project', id: 'udaan' },
          { type: 'project', id: 'crop-detector' },
        ],
        rawMessage,
        recentCardKeys
      ),
    };
  }

  // 10. Tech stack / Skills
  if (
    q.includes('stack') ||
    q.includes('skill') ||
    q.includes('tech') ||
    q.includes('language') ||
    q.includes('framework') ||
    q.includes('tools') ||
    q.includes('react') ||
    q.includes('typescript') ||
    q.includes('firebase') ||
    q.includes('node') ||
    q.includes('express') ||
    q.includes('gemini')
  ) {
    return {
      reply:
        'Sagar works across frontend (React, TypeScript, Vite, HTML/CSS/JS), backend (Node.js, Express, Firebase Auth, Firestore, Cloud Run), and AI tooling (Gemini API including Vision, prompt design, Make.com, Tavily search). He also designs thumbnails and video content with Canva and CapCut.',
      cards: sanitizeCards([{ type: 'skills', id: 'all' }], rawMessage, recentCardKeys),
    };
  }

  // 11. YouTube / Content creation
  if (
    q.includes('youtube') ||
    q.includes('just sagar') ||
    q.includes('channel') ||
    q.includes('video') ||
    q.includes('shorts') ||
    q.includes('zero to ai') ||
    q.includes('hindi') ||
    q.includes('hinglish')
  ) {
    return {
      reply:
        "Sagar runs the YouTube channel Just Sagar (@JustSagarX), where he teaches AI in Hindi and Hinglish and created a 56-day 'Zero to AI' Shorts series.",
      cards: sanitizeCards([{ type: 'about', id: 'sagar' }], rawMessage, recentCardKeys),
    };
  }

  // 12. Education & Location
  if (
    q.includes('education') ||
    q.includes('school') ||
    q.includes('college') ||
    q.includes('study') ||
    q.includes('student') ||
    q.includes('class 12') ||
    q.includes('liverpool') ||
    q.includes('where') ||
    q.includes('location') ||
    q.includes('kathmandu') ||
    q.includes('nepal')
  ) {
    return {
      reply:
        'Sagar is based in Kathmandu, Nepal, where he is a Class 12 student at Liverpool International College. Alongside his studies, he builds AI products and teaches AI on YouTube.',
      cards: sanitizeCards([{ type: 'about', id: 'sagar' }], rawMessage, recentCardKeys),
    };
  }

  // 13. Default unknown answer (NO cards attached)
  return {
    reply:
      "That information isn't in Sagar's knowledge base. You can ask about his projects (Udaan, Crop Disease Detector, Surplus Connector, Telegram bot) or his tech stack.",
    cards: [],
  };
}
