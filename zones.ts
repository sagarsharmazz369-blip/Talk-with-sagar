/**
 * Zone positions, trigger radii, and collision boundaries.
 */

export type ZoneId = 'about' | 'projects' | 'skills' | 'contact';

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  subtitle: string;
  badge: string;
  position: [number, number, number];
  triggerRadius: number;
  color: string;
  icon: string;
  description: string;
  arrivalPosition: [number, number, number]; // Position to place car when fast-traveling
}

export const ZONES: Record<ZoneId, ZoneConfig> = {
  about: {
    id: 'about',
    name: 'Cyber Desk',
    subtitle: 'About Me & Experience',
    badge: 'BIO // RESUME',
    position: [-10.5, 0, -10.5], // Northwest
    triggerRadius: 3.5,
    color: '#00f0ff',
    icon: 'Terminal',
    description: 'Cyber terminal with bio, experience timeline and downloadable resume.',
    arrivalPosition: [-8.5, 0, -8.5],
  },
  projects: {
    id: 'projects',
    name: 'Arcade Arena',
    subtitle: 'Featured Projects',
    badge: '4 MACHINES',
    position: [10.5, 0, -10.5], // Northeast
    triggerRadius: 4.2,
    color: '#ff2bd6',
    icon: 'Gamepad2',
    description: 'Four custom retro arcade cabinets showcasing live web applications.',
    arrivalPosition: [8.5, 0, -8.5],
  },
  skills: {
    id: 'skills',
    name: 'Skill Vault',
    subtitle: 'Capabilities & Tools',
    badge: '4 ORBS',
    position: [10.5, 0, 10.5], // Southeast
    triggerRadius: 4.2,
    color: '#ffe600',
    icon: 'Cpu',
    description: 'Four floating energy orbs representing technical proficiencies.',
    arrivalPosition: [8.5, 0, 8.5],
  },
  contact: {
    id: 'contact',
    name: 'Postal Pod',
    subtitle: 'Send a Message',
    badge: 'DISPATCH',
    position: [-10.5, 0, 10.5], // Southwest
    triggerRadius: 3.5,
    color: '#00ff88',
    icon: 'Mail',
    description: 'Holographic communications hub to send messages and connect.',
    arrivalPosition: [-8.5, 0, 8.5],
  },
};

// 4 Arcade cabinet positions arranged in an arc Northeast
export const ARCADE_CABINETS = [
  { index: 0, position: [8.2, 0, -12.5] as [number, number, number], rotation: Math.PI * 0.15 },
  { index: 1, position: [10.8, 0, -11.8] as [number, number, number], rotation: 0 },
  { index: 2, position: [12.8, 0, -10.0] as [number, number, number], rotation: -Math.PI * 0.15 },
  { index: 3, position: [14.0, 0, -7.5] as [number, number, number], rotation: -Math.PI * 0.3 },
];

// 4 Skill orbs arranged in a ring Southeast
export const SKILL_ORBS = [
  { id: 'frontend', index: 0, angle: 0, color: '#00f0ff', offset: [0, 0, 0] },
  { id: 'backend', index: 1, angle: Math.PI * 0.5, color: '#ff2bd6', offset: [0, 0, 0] },
  { id: 'ai-tools', index: 2, angle: Math.PI, color: '#ffe600', offset: [0, 0, 0] },
  { id: 'graphic-design', index: 3, angle: Math.PI * 1.5, color: '#00ff88', offset: [0, 0, 0] },
];

// 3 Hidden spinning collectible stars placed away from the main path
export const COLLECTIBLES_CONFIG = [
  {
    id: 0,
    name: 'Matrix Data Core',
    position: [-15.2, 0.8, 0] as [number, number, number],
    color: '#00f0ff',
    hint: 'Hidden along the western precipice',
  },
  {
    id: 1,
    name: 'Cyber Crystal',
    position: [0, 0.8, -15.5] as [number, number, number],
    color: '#ff2bd6',
    hint: 'Tucked behind the northern edge',
  },
  {
    id: 2,
    name: 'Golden Hexagon',
    position: [0, 0.8, 15.5] as [number, number, number],
    color: '#ffe600',
    hint: 'Overlooking the southern floating drop',
  },
];

// Island circular boundary radius
export const ISLAND_RADIUS = 18.2;

// Static circular collision obstacles: { x, z, radius }
export const COLLISION_OBSTACLES = [
  // Cyber Desk (Northwest)
  { x: -10.5, z: -10.5, radius: 1.8 },
  // Arcade Cabinets (Northeast)
  { x: 8.2, z: -12.5, radius: 1.1 },
  { x: 10.8, z: -11.8, radius: 1.1 },
  { x: 12.8, z: -10.0, radius: 1.1 },
  { x: 14.0, z: -7.5, radius: 1.1 },
  // Skill Vault Central Pedestal (Southeast)
  { x: 10.5, z: 10.5, radius: 1.6 },
  // Postal Pod (Southwest)
  { x: -10.5, z: 10.5, radius: 1.8 },
  // Decorative perimeter light towers
  { x: -14, z: -8, radius: 0.8 },
  { x: -8, z: -14, radius: 0.8 },
  { x: 14, z: -3, radius: 0.8 },
  { x: 14, z: 3, radius: 0.8 },
  { x: -14, z: 8, radius: 0.8 },
  { x: 8, z: 14, radius: 0.8 },
];
