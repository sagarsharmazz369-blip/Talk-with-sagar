/**
 * Mobile Virtual Joystick component with pointer events.
 * Provides touch-based steering and acceleration for mobile devices.
 */
import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../store';

export const VirtualJoystick: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const setJoystickVector = useGameStore((s) => s.setJoystickVector);

  const RADIUS = 44; // max distance from center in px

  const handlePointerDown = (e: React.PointerEvent) => {
    setActive(true);
    updatePosition(e.clientX, e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    setJoystickVector({ x: 0, y: 0 });
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= RADIUS) {
      setKnobPos({ x: dx, y: dy });
      setJoystickVector({ x: dx / RADIUS, y: dy / RADIUS });
    } else {
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * RADIUS;
      const clampedY = Math.sin(angle) * RADIUS;
      setKnobPos({ x: clampedX, y: clampedY });
      setJoystickVector({ x: clampedX / RADIUS, y: clampedY / RADIUS });
    }
  };

  useEffect(() => {
    return () => {
      setJoystickVector({ x: 0, y: 0 });
    };
  }, [setJoystickVector]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="w-28 h-28 rounded-full border-2 border-slate-700/80 bg-slate-900/60 backdrop-blur-sm relative flex items-center justify-center touch-none select-none active:border-[#00f0ff]"
      style={{ touchAction: 'none' }}
    >
      {/* Center resting ring */}
      <div className="w-10 h-10 rounded-full border border-slate-600/40 pointer-events-none" />

      {/* Moving Thumb Knob */}
      <div
        className="w-12 h-12 rounded-full bg-[#00f0ff]/30 border-2 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.6)] absolute pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      />
    </div>
  );
};
