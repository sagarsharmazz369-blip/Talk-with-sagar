/**
 * Single source of truth for all portfolio content.
 * Clearly marked placeholder content where appropriate.
 */

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDetails: string[];
  techTags: string[];
  liveDemoUrl: string;
  githubUrl: string;
  badge: string;
  accentColor: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  badge: string;
  accentColor: string;
  description: string;
  skills: Array<{ name: string; level: number; note: string }>;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface SocialLinks {
  youtube: string;
  github: string;
  linkedin: string;
  x: string;
  email: string;
}

export interface PortfolioContent {
  name: string;
  title: string;
  location: string;
  tagline: string;
  introTerminal: string;
  bioParagraphs: string[];
  resumeUrl: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  socials: SocialLinks;
  formspreeFormId: string;
}

export const PORTFOLIO_CONTENT: PortfolioContent = {
  // [PLACEHOLDER CONTENT: Name]
  name: 'YOUR NAME',
  title: 'Full-Stack Software Engineer & Creative Technologist',
  location: 'Kathmandu, Nepal / Remote',
  tagline: 'Crafting responsive WebGL worlds, intelligent AI integrations & resilient web systems.',
  introTerminal: `[BOOT SEQUENCE 0x7F]
> INITIALIZING SYSTEM OPERATOR: YOUR NAME...
> SPECIALIZATION: FULL-STACK & INTERACTIVE 3D
> SYSTEM STATUS: ONLINE // READY FOR DISPATCH`,
  bioParagraphs: [
    "Hello traveler! I am a software engineer and creative builder obsessed with the intersection of high-performance web applications, interactive 3D graphics, and intuitive user experiences.",
    "Over the past several years, I have architected full-stack platforms with modern React, TypeScript, Node.js, and cloud backends, as well as AI-powered applications that solve everyday community challenges.",
    "Whether designing modular microservices or rendering smooth 60fps WebGL scenes, I focus on clean architecture, accessible interfaces, and ruthless attention to craft.",
  ],
  // [PLACEHOLDER CONTENT: Resume URL]
  resumeUrl: 'https://example.com/resume.pdf',
  experience: [
    {
      role: 'Full-Stack & AI Systems Lead',
      company: 'Udaan Student Opportunities Platform',
      period: '2025 - Present',
      location: 'Kathmandu, Nepal',
      highlights: [
        'Architected personalized scholarship and opportunity feed using Express, Cloud Run, Firestore, and intelligent Gemini query matching.',
        'Engineered an administrative review and moderation engine that verifies thousands of educational listings.',
        'Cut opportunity search time by 60% through structured faceted search and real-time alerts.',
      ],
    },
    {
      role: 'Frontend & 3D Interactive Developer',
      company: 'Independent / Creative Studio',
      period: '2024 - 2025',
      location: 'Remote',
      highlights: [
        'Built gamified product showcases, 3D interactive dashboards, and procedural WebGL simulations with Three.js and React.',
        'Authored reusable design systems ensuring 100% WCAG AA accessibility across high-contrast dark and cyberpunk themes.',
        'Optimized bundle size and frame budgets to deliver silky 60 FPS gameplay on mobile browsers.',
      ],
    },
    {
      role: 'Team Lead & Core Engineer',
      company: 'Surplus Connector (lablab.ai Hackathon)',
      period: 'Fall 2024',
      location: 'Global',
      highlights: [
        'Built full food-rescue coordination demo, test suite, and observability dashboard during the Dark Factory hackathon.',
        'Delivered responsive real-time dispatch matching donors with surplus food to verified shelters.',
      ],
    },
  ],
  projects: [
    {
      id: 'udaan',
      title: 'Udaan Opportunity Engine',
      subtitle: 'Scholarships & Hackathon Matcher',
      description:
        'A comprehensive platform matching students with scholarships, colleges, internships, and hackathons using personalized recommendation pipelines.',
      fullDetails: [
        'Personalized match feed computed from student profile attributes and goals.',
        'Autonomous research scraper coupled with admin human-in-the-loop validation.',
        'Zero-latency caching layer with Firebase Auth and Google Cloud Run deployment.',
      ],
      techTags: ['React', 'TypeScript', 'Express', 'Cloud Run', 'Firestore', 'Gemini API'],
      liveDemoUrl: 'https://example.com/demo/udaan',
      githubUrl: 'https://github.com/example/udaan-engine',
      badge: 'FEATURED APP',
      accentColor: '#00f0ff',
    },
    {
      id: 'crop-detector',
      title: 'Crop Disease AI Vision',
      subtitle: 'AgriTech Diagnostic Assistant',
      description:
        'A lightweight mobile web tool using AI vision to diagnose plant crop diseases from leaf photographs, designed for farmers across South Asia.',
      fullDetails: [
        'Sub-second inference pipeline providing immediate pest and pathogen identifications.',
        'Localized treatment advisories in accessible vernacular languages.',
        'Ultra-lightweight progressive web app operating under spotty 3G cellular bandwidth.',
      ],
      techTags: ['TypeScript', 'Gemini Vision', 'HTML5 Canvas', 'Service Worker', 'Tailwind'],
      liveDemoUrl: 'https://example.com/demo/crop-detector',
      githubUrl: 'https://github.com/example/crop-disease-detector',
      badge: 'AI VISION',
      accentColor: '#00ff88',
    },
    {
      id: 'surplus-connector',
      title: 'Surplus Food Connector',
      subtitle: 'Real-Time Food Rescue Network',
      description:
        'A real-time coordination dashboard connecting commercial donors with excess meals directly to shelters and community food pantries.',
      fullDetails: [
        'Live dispatch workflow: Donor posts surplus -> verified claim -> transit tracking -> confirmed rescue.',
        'Real-time observability dashboard monitoring rescue volume and environmental impact.',
        'Created for the lablab.ai Dark Factory hackathon with comprehensive test coverage.',
      ],
      techTags: ['React 19', 'TypeScript', 'Vite', 'Firestore', 'Tailwind CSS', 'Framer Motion'],
      liveDemoUrl: 'https://example.com/demo/surplus-connector',
      githubUrl: 'https://github.com/example/surplus-connector',
      badge: 'HACKATHON WINNER',
      accentColor: '#ff2bd6',
    },
    {
      id: 'cyber-driver',
      title: 'Neon Cyber Drift 3D',
      subtitle: 'Procedural Isometric Game Engine',
      description:
        'An arcade isometric 3D portfolio and driving sandbox built entirely with procedural geometry, custom shaders, and Web Audio API synthesis.',
      fullDetails: [
        'Custom vehicle physics simulation featuring acceleration, drifting friction, and spatial collision.',
        'Procedural cyberpunk city and floating island with zero external 3D asset dependencies.',
        'Dynamic 8-bit sound synthesis engine running without external audio files.',
      ],
      techTags: ['Three.js', 'React Three Fiber', 'Zustand', 'Web Audio API', 'TypeScript'],
      liveDemoUrl: 'https://example.com/demo/cyber-driver',
      githubUrl: 'https://github.com/example/cyber-driver-3d',
      badge: 'WEBGL 3D',
      accentColor: '#ffe600',
    },
  ],
  skillCategories: [
    {
      id: 'frontend',
      name: 'Frontend & 3D',
      iconName: 'Layout',
      badge: 'TIER 1',
      accentColor: '#00f0ff',
      description: 'Building responsive, accessible web interfaces and smooth 60 FPS WebGL experiences.',
      skills: [
        { name: 'React & Next.js', level: 95, note: 'Component architecture, hooks, suspense' },
        { name: 'TypeScript', level: 92, note: 'Strict typing, generics, robust interfaces' },
        { name: 'Three.js / WebGL', level: 88, note: 'Shaders, procedural geometry, scene graph' },
        { name: 'Tailwind CSS', level: 96, note: 'Design systems, tokens, animation' },
        { name: 'Framer Motion', level: 90, note: 'Physics gestures, layout animations' },
      ],
    },
    {
      id: 'backend',
      name: 'Backend & Cloud',
      iconName: 'Server',
      badge: 'TIER 1',
      accentColor: '#ff2bd6',
      description: 'Scalable API services, microservices, containerized workloads, and databases.',
      skills: [
        { name: 'Node.js & Express', level: 92, note: 'REST APIs, middleware, security' },
        { name: 'Firebase & Firestore', level: 94, note: 'Realtime db, security rules, auth' },
        { name: 'Google Cloud Run / GCP', level: 85, note: 'Container deployments, IAM, scaling' },
        { name: 'PostgreSQL / SQL', level: 82, note: 'Relational modeling, migrations, indexing' },
        { name: 'WebSockets / Realtime', level: 86, note: 'Bi-directional streams & events' },
      ],
    },
    {
      id: 'ai-tools',
      name: 'AI & Automation',
      iconName: 'Cpu',
      badge: 'SPECIALTY',
      accentColor: '#ffe600',
      description: 'Leveraging modern LLM APIs, multimodal vision, and autonomous workflow pipelines.',
      skills: [
        { name: 'Gemini API & Vision', level: 94, note: 'Multimodal analysis, structured output' },
        { name: 'Prompt Architecture', level: 95, note: 'Grounding, system instructions, guardrails' },
        { name: 'Make.com & Workflows', level: 90, note: 'Automated webhooks and integration pipelines' },
        { name: 'Tavily / Search Grounding', level: 88, note: 'Live knowledge retrieval' },
        { name: 'Telegram Bot APIs', level: 92, note: 'Automated conversational agents' },
      ],
    },
    {
      id: 'graphic-design',
      name: 'Content & Design',
      iconName: 'Palette',
      badge: 'CREATIVE',
      accentColor: '#00ff88',
      description: 'Visual identity, UI prototyping, video production, and storytelling.',
      skills: [
        { name: 'UI / UX Prototyping', level: 90, note: 'Wireframing, typography, design systems' },
        { name: 'Canva & Vector Assets', level: 92, note: 'Brand assets, banners, iconography' },
        { name: 'CapCut & Video Editing', level: 88, note: 'Paced editing, audio sync, color grade' },
        { name: 'YouTube Production', level: 85, note: 'Content creation (@JustSagarX)' },
      ],
    },
  ],
  socials: {
    // [PLACEHOLDER CONTENT: Socials]
    youtube: 'https://www.youtube.com/@JustSagarX',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
    x: 'https://x.com/example',
    email: 'sagarsharmazz369@gmail.com',
  },
  // [PLACEHOLDER CONTENT: Formspree Form ID]
  formspreeFormId: 'YOUR_FORM_ID',
};
