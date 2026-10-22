import React, { useEffect, useRef } from 'react';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type OrbMood = 'calm' | 'happy' | 'excited' | 'curious' | 'empathetic' | 'serious';

interface AssistantOrbProps {
  state: OrbState;
  mood: OrbMood;
  audioLevel?: number; // 0.0 to 1.0 (mic level when listening, output level when speaking)
  className?: string;
  size?: number; // diameter in px
}

export const AssistantOrb: React.FC<AssistantOrbProps> = ({
  state,
  mood,
  audioLevel = 0,
  className = '',
  size = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);
  const smoothedLevelRef = useRef<number>(0);

  // Determine speed and tint based on mood (staying strictly within neutrals and deep crimson #C8102E)
  const getMoodConfig = (m: OrbMood) => {
    switch (m) {
      case 'excited':
        return { speed: 1.8, coreAlpha: 0.85, crimsonWeight: 0.85 };
      case 'happy':
        return { speed: 1.4, coreAlpha: 0.75, crimsonWeight: 0.7 };
      case 'curious':
        return { speed: 1.2, coreAlpha: 0.65, crimsonWeight: 0.5 };
      case 'empathetic':
        return { speed: 0.8, coreAlpha: 0.6, crimsonWeight: 0.4 };
      case 'serious':
        return { speed: 0.65, coreAlpha: 0.5, crimsonWeight: 0.25 };
      case 'calm':
      default:
        return { speed: 0.9, coreAlpha: 0.55, crimsonWeight: 0.35 };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      const moodConfig = getMoodConfig(mood);
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Smooth audio level
      const targetLevel = Math.max(0, Math.min(1, audioLevel));
      smoothedLevelRef.current += (targetLevel - smoothedLevelRef.current) * 0.2;
      const effectiveLevel = smoothedLevelRef.current;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = size * 0.32;

      if (!prefersReducedMotion) {
        phaseRef.current += 0.03 * moodConfig.speed;
      }

      const phase = phaseRef.current;

      // Base radius modulation based on state
      let radiusMod = 0;
      let outerRingScale = 1;

      if (state === 'idle') {
        radiusMod = Math.sin(phase) * 3;
        outerRingScale = 1 + Math.sin(phase * 0.5) * 0.05;
      } else if (state === 'listening') {
        radiusMod = effectiveLevel * 14 + Math.sin(phase * 2) * 2;
        outerRingScale = 1 + effectiveLevel * 0.35;
      } else if (state === 'thinking') {
        radiusMod = Math.sin(phase * 3) * 4;
        outerRingScale = 1.08 + Math.cos(phase * 2) * 0.08;
      } else if (state === 'speaking') {
        radiusMod = effectiveLevel * 16 + Math.sin(phase * 2.5) * 3;
        outerRingScale = 1 + effectiveLevel * 0.4;
      }

      const currentRadius = Math.max(10, baseRadius + radiusMod);

      // Color computation: blend neutral slate (#14161A in light, #F2F0EA in dark) with crimson (#C8102E)
      // Crimson RGB: 200, 16, 46
      // Light Neutral: 20, 22, 26
      // Dark Neutral: 242, 240, 234
      const neutralR = isDark ? 240 : 25;
      const neutralG = isDark ? 238 : 28;
      const neutralB = isDark ? 232 : 34;

      const crimsonR = 200;
      const crimsonG = 16;
      const crimsonB = 46;

      const w = moodConfig.crimsonWeight;
      const r = Math.round(neutralR * (1 - w) + crimsonR * w);
      const g = Math.round(neutralG * (1 - w) + crimsonG * w);
      const b = Math.round(neutralB * (1 - w) + crimsonB * w);

      // 1. Draw outermost subtle halo ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * outerRingScale * 1.35, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.08 + effectiveLevel * 0.12})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw middle reactive ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * outerRingScale * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.16 + effectiveLevel * 0.22})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // 3. Draw gradient core
      const grad = ctx.createRadialGradient(
        centerX - currentRadius * 0.2,
        centerY - currentRadius * 0.2,
        currentRadius * 0.1,
        centerX,
        centerY,
        currentRadius
      );

      const alpha = moodConfig.coreAlpha;
      grad.addColorStop(0, `rgba(${crimsonR}, ${crimsonG + 40}, ${crimsonB + 30}, ${alpha * 0.65})`);
      grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.05)`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // 4. Subtle hairline perimeter
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.35 + effectiveLevel * 0.35})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 5. Thinking orbit dots
      if (state === 'thinking' && !prefersReducedMotion) {
        const dotCount = 3;
        for (let i = 0; i < dotCount; i++) {
          const dotAngle = phase * 2 + (i * Math.PI * 2) / dotCount;
          const orbitR = currentRadius * 1.22;
          const dx = centerX + Math.cos(dotAngle) * orbitR;
          const dy = centerY + Math.sin(dotAngle) * orbitR;

          ctx.beginPath();
          ctx.arc(dx, dy, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${crimsonR}, ${crimsonG}, ${crimsonB}, 0.8)`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, mood, audioLevel, size]);

  return (
    <div
      role="img"
      aria-label={`Assistant presence: ${state} state, ${mood} tone`}
      className={`relative inline-flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="w-full h-full block"
      />
    </div>
  );
};
