/**
 * Low-poly cyberpunk sports car with ref-based physics, collision, and zone interaction.
 * Built as a composite 3-12 part procedural model with zero external assets.
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store';
import {
  ISLAND_RADIUS,
  COLLISION_OBSTACLES,
  ZONES,
  ZoneId,
  COLLECTIBLES_CONFIG,
} from '../config/zones';
import { soundManager } from '../audio';

export const Car: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const brakeLightRef = useRef<THREE.MeshStandardMaterial>(null);

  // Read store actions and state
  const activeZone = useGameStore((s) => s.activeZone);
  const openZone = useGameStore((s) => s.openZone);
  const closeZone = useGameStore((s) => s.closeZone);
  const setNearZone = useGameStore((s) => s.setNearZone);
  const collectItem = useGameStore((s) => s.collectItem);
  const setHasMoved = useGameStore((s) => s.setHasMoved);
  const playerTargetPosition = useGameStore((s) => s.playerTargetPosition);
  const clearPlayerTargetPosition = useGameStore((s) => s.clearPlayerTargetPosition);

  // Physics state kept strictly in refs to prevent React re-renders per frame
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const speed = useRef(0);
  const angle = useRef(0); // Facing angle in radians (0 = pointing +X)
  const steering = useRef(0); // Steer angle (-1 to 1)
  const isBraking = useRef(false);
  const totalDistanceMoved = useRef(0);

  // Input states
  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Track keyboard events with arrow key preventDefault
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys inside the applet
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.current.forward = true;
      if (key === 's' || key === 'arrowdown') keys.current.backward = true;
      if (key === 'a' || key === 'arrowleft') keys.current.left = true;
      if (key === 'd' || key === 'arrowright') keys.current.right = true;

      // Interaction key E or Enter
      if (key === 'e' || key === 'enter') {
        const state = useGameStore.getState();
        if (state.activeZone) {
          state.closeZone();
        } else if (state.nearZone) {
          state.openZone(state.nearZone);
        }
      }

      // Escape key closes open panel
      if (key === 'escape') {
        const state = useGameStore.getState();
        if (state.activeZone) {
          state.closeZone();
        }
      }

      // Mute toggle key M
      if (key === 'm') {
        useGameStore.getState().toggleMute();
      }

      // Quick-Nav toggle key N
      if (key === 'n') {
        useGameStore.getState().toggleQuickNav();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.current.forward = false;
      if (key === 's' || key === 'arrowdown') keys.current.backward = false;
      if (key === 'a' || key === 'arrowleft') keys.current.left = false;
      if (key === 'd' || key === 'arrowright') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Frame physics loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Fast travel teleport check
    if (playerTargetPosition) {
      pos.current.set(playerTargetPosition[0], 0, playerTargetPosition[2]);
      speed.current = 0;
      clearPlayerTargetPosition();
    }

    // Cap delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.05);

    // If panel is open, pause vehicle controls
    const isPaused = activeZone !== null;

    // Combine keyboard input + mobile virtual joystick
    const joystick = useGameStore.getState().joystickVector;
    let inputForward = isPaused ? false : keys.current.forward || joystick.y < -0.25;
    let inputBackward = isPaused ? false : keys.current.backward || joystick.y > 0.25;
    let inputLeft = isPaused ? false : keys.current.left || joystick.x < -0.25;
    let inputRight = isPaused ? false : keys.current.right || joystick.x > 0.25;

    // Vehicle physics constants
    const MAX_FORWARD_SPEED = 10.5;
    const MAX_REVERSE_SPEED = -4.5;
    const ACCELERATION = 18.0;
    const REVERSE_ACCEL = 10.0;
    const BRAKING = 24.0;
    const FRICTION = 0.94;
    const TURN_RATE = 2.8;

    isBraking.current = (inputBackward && speed.current > 0.5) || (inputForward && speed.current < -0.5);

    if (inputForward) {
      if (speed.current < 0) {
        speed.current = THREE.MathUtils.damp(speed.current, 0, BRAKING, dt);
      } else {
        speed.current = Math.min(speed.current + ACCELERATION * dt, MAX_FORWARD_SPEED);
      }
    } else if (inputBackward) {
      if (speed.current > 0) {
        speed.current = THREE.MathUtils.damp(speed.current, 0, BRAKING, dt);
      } else {
        speed.current = Math.max(speed.current - REVERSE_ACCEL * dt, MAX_REVERSE_SPEED);
      }
    } else {
      // Natural rolling friction
      speed.current *= Math.pow(FRICTION, dt * 60);
      if (Math.abs(speed.current) < 0.05) speed.current = 0;
    }

    // Steering: effective when moving
    const speedRatio = speed.current / MAX_FORWARD_SPEED;
    const absSpeed = Math.abs(speed.current);
    const steerFactor = Math.min(absSpeed / 1.5, 1.0);

    let targetSteer = 0;
    if (inputLeft) targetSteer += 1;
    if (inputRight) targetSteer -= 1;
    steering.current = THREE.MathUtils.damp(steering.current, targetSteer, 14, dt);

    // Apply turning (reverse flips steering naturally)
    const turnDirection = speed.current >= 0 ? 1 : -1;
    angle.current += steering.current * TURN_RATE * steerFactor * turnDirection * dt;

    // Calculate displacement
    const moveDist = speed.current * dt;
    const dx = Math.cos(angle.current) * moveDist;
    const dz = -Math.sin(angle.current) * moveDist; // in Three.js Z points backward

    const nextX = pos.current.x + dx;
    const nextZ = pos.current.z + dz;

    // 1. Boundary Clamping to Island Radius (with vehicle margin)
    const CAR_RADIUS = 1.1;
    const maxRadius = ISLAND_RADIUS - CAR_RADIUS;
    const currentDistFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);

    let finalX = nextX;
    let finalZ = nextZ;

    if (currentDistFromCenter > maxRadius) {
      const scale = maxRadius / currentDistFromCenter;
      finalX = nextX * scale;
      finalZ = nextZ * scale;
      speed.current *= 0.4; // Impact slow-down
    }

    // 2. Circle Obstacle Collisions
    for (const obs of COLLISION_OBSTACLES) {
      const distX = finalX - obs.x;
      const distZ = finalZ - obs.z;
      const dist = Math.sqrt(distX * distX + distZ * distZ);
      const minDist = obs.radius + CAR_RADIUS;

      if (dist < minDist && dist > 0.0001) {
        const overlap = minDist - dist;
        finalX += (distX / dist) * overlap;
        finalZ += (distZ / dist) * overlap;
        speed.current *= 0.3;
        soundManager.playBump();
      }
    }

    // Apply position
    pos.current.x = finalX;
    pos.current.z = finalZ;
    groupRef.current.position.set(pos.current.x, 0.25, pos.current.z);
    groupRef.current.rotation.y = angle.current;

    // Wheel rotation animation
    const wheelRotDelta = (moveDist / 0.35) * 1.5;
    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += wheelRotDelta;
    });

    // Brake light material emissive update
    if (brakeLightRef.current) {
      const brakeIntensity = isBraking.current || speed.current < -0.1 ? 2.5 : 0.6;
      brakeLightRef.current.emissiveIntensity = brakeIntensity;
    }

    // Update sound engine pitch
    soundManager.updateEngine(Math.abs(speedRatio));

    // Distance tracking for fading the initial tutorial controls hint
    if (absSpeed > 0.5) {
      totalDistanceMoved.current += absSpeed * dt;
      if (totalDistanceMoved.current > 4.0) {
        setHasMoved(true);
      }
    }

    // 3. Proximity check for zones
    let closestZone: ZoneId | null = null;
    let closestDist = Infinity;

    (Object.keys(ZONES) as ZoneId[]).forEach((zId) => {
      const zone = ZONES[zId];
      const zx = zone.position[0];
      const zz = zone.position[2];
      const d = Math.sqrt((finalX - zx) ** 2 + (finalZ - zz) ** 2);
      if (d <= zone.triggerRadius && d < closestDist) {
        closestDist = d;
        closestZone = zId;
      }
    });

    setNearZone(closestZone);

    // 4. Collectibles pickup check
    COLLECTIBLES_CONFIG.forEach((c) => {
      const cx = c.position[0];
      const cz = c.position[2];
      const d = Math.sqrt((finalX - cx) ** 2 + (finalZ - cz) ** 2);
      if (d < 1.6) {
        collectItem(c.id);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      {/* 1. Main Car Body Chassis (Lower wedge) */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[2.0, 0.32, 1.1]} />
        <meshStandardMaterial
          color="#0b0e17"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Top Cabin / Cockpit */}
      <mesh position={[-0.1, 0.42, 0]}>
        <boxGeometry args={[1.05, 0.28, 0.82]} />
        <meshStandardMaterial
          color="#060810"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Tinted Front Windshield */}
      <mesh position={[0.43, 0.41, 0]} rotation={[0, 0, -Math.PI * 0.16]}>
        <boxGeometry args={[0.08, 0.26, 0.76]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Tinted Rear Window */}
      <mesh position={[-0.63, 0.41, 0]} rotation={[0, 0, Math.PI * 0.16]}>
        <boxGeometry args={[0.08, 0.25, 0.74]} />
        <meshStandardMaterial
          color="#ff2bd6"
          emissive="#ff2bd6"
          emissiveIntensity={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* 3. Cyber Racing Stripe (Center Hood) */}
      <mesh position={[0.45, 0.33, 0]}>
        <boxGeometry args={[0.9, 0.02, 0.16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* 4. Front Headlights (Dual glowing cyan) */}
      <mesh position={[1.01, 0.18, 0.34]}>
        <boxGeometry args={[0.04, 0.1, 0.22]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[1.01, 0.18, -0.34]}>
        <boxGeometry args={[0.04, 0.1, 0.22]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* 5. Rear Taillight Strip (Magenta / Red brake light) */}
      <mesh position={[-1.01, 0.2, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.94]} />
        <meshStandardMaterial
          ref={brakeLightRef}
          color="#ff2bd6"
          emissive="#ff2bd6"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 6. Dual Rear Boosters */}
      <mesh position={[-1.04, 0.12, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 8]} />
        <meshStandardMaterial color="#1a1e2e" emissive="#00f0ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.04, 0.12, -0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 8]} />
        <meshStandardMaterial color="#1a1e2e" emissive="#00f0ff" emissiveIntensity={0.8} />
      </mesh>

      {/* 7. Four Low-Poly Wheels */}
      {[
        { pos: [0.65, 0.12, 0.58], idx: 0 },
        { pos: [0.65, 0.12, -0.58], idx: 1 },
        { pos: [-0.65, 0.12, 0.58], idx: 2 },
        { pos: [-0.65, 0.12, -0.58], idx: 3 },
      ].map(({ pos: wheelPos, idx }) => (
        <group
          key={idx}
          position={wheelPos as [number, number, number]}
          ref={(el) => {
            if (el) wheelsRef.current[idx] = el;
          }}
        >
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 12]} />
            <meshStandardMaterial color="#05060a" roughness={0.9} />
          </mesh>
          {/* Neon Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.18, 8]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      ))}

      {/* 8. Neon Underglow Plane */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.35} transparent />
      </mesh>
    </group>
  );
};
