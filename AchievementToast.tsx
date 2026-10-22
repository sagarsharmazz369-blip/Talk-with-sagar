/**
 * Retro-futuristic Achievement Unlocked toast banner.
 */
import React from 'react';
import { Trophy, Star, X } from 'lucide-react';
import { useGameStore } from '../store';

export const AchievementToast: React.FC = () => {
  const showToast = useGameStore((s) => s.showAchievementToast);
  const dismiss = useGameStore((s) => s.dismissAchievementToast);

  if (!showToast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#090b14]/95 border-2 border-[#ffe600] shadow-[0_0_30px_rgba(255,230,0,0.5)] text-white backdrop-blur-md">
        <div className="p-2 rounded-xl bg-[#ffe600]/20 border border-[#ffe600]/40 text-[#ffe600]">
          <Trophy className="w-5 h-5" />
        </div>

        <div>
          <span className="font-pixel text-[9px] text-[#ffe600] tracking-wider block">
            ACHIEVEMENT UNLOCKED // 100%
          </span>
          <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 mt-0.5">
            <span>MASTER EXPLORER</span>
            <div className="flex items-center text-[#ffe600]">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
          </h4>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss achievement"
          className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
