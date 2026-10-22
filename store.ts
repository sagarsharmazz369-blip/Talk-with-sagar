/**
 * Global game state management with Zustand.
 * Handles game start, zone overlays, collectibles persistence, and audio state.
 */
import { create } from 'zustand';
import { ZoneId, ZONES } from './config/zones';
import { soundManager } from './audio';
import { trackEvent } from './analytics';

const STORAGE_KEY = 'cyber_portfolio_collectibles_v1';

// Safe localStorage helper with in-memory fallback
let inMemoryCollectibles: boolean[] = [false, false, false];

function loadSavedCollectibles(): boolean[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed.map(Boolean);
      }
    }
  } catch {
    // In-memory fallback if localStorage is blocked in iframe
  }
  return inMemoryCollectibles;
}

function saveCollectibles(items: boolean[]): void {
  inMemoryCollectibles = [...items];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Fallback in-memory
  }
}

export interface GameState {
  gameStarted: boolean;
  sceneReady: boolean;
  viewMode: 'game' | 'classic';
  activeZone: ZoneId | null;
  activeProjectIndex: number;
  activeSkillCategory: string | null;
  isMuted: boolean;
  nearZone: ZoneId | null;
  collectiblesFound: boolean[];
  achievementUnlocked: boolean;
  showAchievementToast: boolean;
  hasMoved: boolean;
  isQuickNavOpen: boolean;
  isHelpOpen: boolean;
  joystickVector: { x: number; y: number };
  isTouchDevice: boolean;
  playerTargetPosition: [number, number, number] | null;

  // Actions
  setGameStarted: () => void;
  setSceneReady: (ready: boolean) => void;
  setViewMode: (mode: 'game' | 'classic') => void;
  openZone: (zone: ZoneId, projectIndex?: number, skillCategory?: string | null) => void;
  closeZone: () => void;
  setNearZone: (zone: ZoneId | null) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  collectItem: (index: number) => void;
  dismissAchievementToast: () => void;
  setHasMoved: (moved: boolean) => void;
  toggleQuickNav: () => void;
  setQuickNavOpen: (open: boolean) => void;
  toggleHelp: () => void;
  setHelpOpen: (open: boolean) => void;
  setJoystickVector: (v: { x: number; y: number }) => void;
  setIsTouchDevice: (isTouch: boolean) => void;
  fastTravelToZone: (zone: ZoneId) => void;
  clearPlayerTargetPosition: () => void;
}

export const useGameStore = create<GameState>((set, get) => {
  const initialCollectibles = loadSavedCollectibles();
  const allInitialFound = initialCollectibles.every(Boolean);

  return {
    gameStarted: false,
    sceneReady: false,
    viewMode: 'game',
    activeZone: null,
    activeProjectIndex: 0,
    activeSkillCategory: null,
    isMuted: true, // Default OFF
    nearZone: null,
    collectiblesFound: initialCollectibles,
    achievementUnlocked: allInitialFound,
    showAchievementToast: false,
    hasMoved: false,
    isQuickNavOpen: false,
    isHelpOpen: false,
    joystickVector: { x: 0, y: 0 },
    isTouchDevice: false,
    playerTargetPosition: null,

    setGameStarted: () => {
      set({ gameStarted: true });
      trackEvent('start_pressed');
    },

    setSceneReady: (ready: boolean) => {
      set({ sceneReady: ready });
    },

    setViewMode: (mode: 'game' | 'classic') => {
      set({ viewMode: mode, isQuickNavOpen: false });
      if (mode === 'classic') {
        trackEvent('classic_view_opened');
      }
    },

    openZone: (zone: ZoneId, projectIndex = 0, skillCategory = null) => {
      soundManager.playInteract();
      set({
        activeZone: zone,
        activeProjectIndex: projectIndex,
        activeSkillCategory: skillCategory,
        isQuickNavOpen: false,
      });
      trackEvent('zone_opened', { zone, projectIndex });
    },

    closeZone: () => {
      soundManager.playPanelClose();
      set({ activeZone: null });
    },

    setNearZone: (zone: ZoneId | null) => {
      set({ nearZone: zone });
    },

    toggleMute: () => {
      const nextMuted = soundManager.toggleMute();
      set({ isMuted: nextMuted });
    },

    setMuted: (muted: boolean) => {
      soundManager.setMuted(muted);
      set({ isMuted: muted });
    },

    collectItem: (index: number) => {
      const current = get().collectiblesFound;
      if (current[index]) return;

      const updated = [...current];
      updated[index] = true;
      saveCollectibles(updated);

      soundManager.playCollect();
      trackEvent('collectible_found', { index, total: updated.filter(Boolean).length });

      const allFound = updated.every(Boolean);
      if (allFound && !get().achievementUnlocked) {
        setTimeout(() => {
          soundManager.playSecret();
          set({
            achievementUnlocked: true,
            showAchievementToast: true,
          });
          trackEvent('achievement_unlocked', { title: 'Master Explorer' });
        }, 350);
      }

      set({ collectiblesFound: updated });
    },

    dismissAchievementToast: () => {
      set({ showAchievementToast: false });
    },

    setHasMoved: (moved: boolean) => {
      set({ hasMoved: moved });
    },

    toggleQuickNav: () => {
      const next = !get().isQuickNavOpen;
      soundManager.playUiClick();
      set({ isQuickNavOpen: next });
    },

    setQuickNavOpen: (open: boolean) => {
      set({ isQuickNavOpen: open });
    },

    toggleHelp: () => {
      soundManager.playUiClick();
      set({ isHelpOpen: !get().isHelpOpen });
    },

    setHelpOpen: (open: boolean) => {
      set({ isHelpOpen: open });
    },

    setJoystickVector: (v: { x: number; y: number }) => {
      set({ joystickVector: v });
    },

    setIsTouchDevice: (isTouch: boolean) => {
      set({ isTouchDevice: isTouch });
    },

    fastTravelToZone: (zone: ZoneId) => {
      const cfg = ZONES[zone];
      if (!cfg) return;
      soundManager.playInteract();
      trackEvent('quicknav_used', { zone });
      set({
        playerTargetPosition: cfg.arrivalPosition,
        activeZone: zone,
        isQuickNavOpen: false,
      });
    },

    clearPlayerTargetPosition: () => {
      set({ playerTargetPosition: null });
    },
  };
});
