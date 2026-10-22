/**
 * Arcade Arena station (Northeast) representing Projects.
 * 4 distinct retro-futuristic arcade machines arranged in an arc.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ARCADE_CABINETS } from '../config/zones';
import { PORTFOLIO_CONTENT } from '../content';
import { useGameStore } from '../store';

interface ArcadeCabinetProps {
  index: number;
  position: [number, number, number];
  rotation: number;
}

const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ index, position, rotation }) => {
  const openZone = useGameStore((s) => s.openZone);
  const project = PORTFOLIO_CONTENT.projects[index] || PORTFOLIO_CONTENT.projects[0];
  const screenGlowRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (screenGlowRef.current) {
      // Subtle CRT screen flicker
      const pulse = 0.85 + Math.sin(Date.now() * 0.005 + index) * 0.15;
      screenGlowRef.current.color.set(project.accentColor).multiplyScalar(pulse);
    }
  });

  return (
    <group
      position={position}
      rotation={[0, rotation + Math.PI * 0.75, 0]}
      onClick={(e) => {
        e.stopPropagation();
        openZone('projects', index);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Main Cabinet Hull */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.9, 2.0, 0.8]} />
        <meshStandardMaterial color="#0c0e17" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* 2. Side Accent Trim (Project specific neon) */}
      <mesh position={[0.46, 1.0, 0]}>
        <boxGeometry args={[0.03, 1.96, 0.78]} />
        <meshBasicMaterial color={project.accentColor} />
      </mesh>
      <mesh position={[-0.46, 1.0, 0]}>
        <boxGeometry args={[0.03, 1.96, 0.78]} />
        <meshBasicMaterial color={project.accentColor} />
      </mesh>

      {/* 3. Angled Control Deck */}
      <mesh position={[0, 0.88, 0.38]} rotation={[Math.PI * 0.1, 0, 0]}>
        <boxGeometry args={[0.82, 0.08, 0.35]} />
        <meshStandardMaterial color="#161a29" roughness={0.3} />
      </mesh>

      {/* Arcade Joystick (Balltop) */}
      <group position={[-0.2, 0.96, 0.38]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial color="#ff2bd6" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ff2bd6" />
        </mesh>
      </group>

      {/* Arcade Buttons */}
      {[-0.04, 0.08, 0.2].map((bx, bi) => (
        <mesh key={bi} position={[bx, 0.94, 0.38]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshBasicMaterial color={bi % 2 === 0 ? '#00f0ff' : '#ffe600'} />
        </mesh>
      ))}

      {/* 4. Recessed CRT Screen */}
      <group position={[0, 1.35, 0.24]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.72, 0.52]} />
          <meshBasicMaterial ref={screenGlowRef} color={project.accentColor} />
        </mesh>
      </group>

      {/* 5. Top Lighted Marquee Banner */}
      <mesh position={[0, 1.88, 0.36]} rotation={[-Math.PI * 0.05, 0, 0]}>
        <boxGeometry args={[0.84, 0.22, 0.14]} />
        <meshStandardMaterial color="#05070d" />
      </mesh>
      <mesh position={[0, 1.88, 0.44]} rotation={[-Math.PI * 0.05, 0, 0]}>
        <planeGeometry args={[0.8, 0.18]} />
        <meshBasicMaterial color={project.accentColor} />
      </mesh>

      {/* 6. Coin Door */}
      <mesh position={[0, 0.42, 0.41]}>
        <boxGeometry args={[0.42, 0.45, 0.04]} />
        <meshStandardMaterial color="#05060b" roughness={0.8} />
      </mesh>
      {/* Coin Slots */}
      <mesh position={[-0.08, 0.52, 0.435]}>
        <boxGeometry args={[0.02, 0.08, 0.01]} />
        <meshBasicMaterial color="#ffe600" />
      </mesh>
      <mesh position={[0.08, 0.52, 0.435]}>
        <boxGeometry args={[0.02, 0.08, 0.01]} />
        <meshBasicMaterial color="#ffe600" />
      </mesh>

      {/* Emissive floor glow pad */}
      <mesh position={[0, 0.01, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color={project.accentColor} opacity={0.25} transparent />
      </mesh>
    </group>
  );
};

export const ArcadeStation: React.FC = () => {
  const openZone = useGameStore((s) => s.openZone);

  return (
    <group>
      {/* Station Ground Interaction Perimeter Ring */}
      <mesh position={[10.5, 0.012, -10.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.6, 4.0, 32]} />
        <meshBasicMaterial color="#ff2bd6" opacity={0.4} transparent />
      </mesh>

      {/* Central Arcade Overhead Hologram Sign */}
      <group
        position={[10.5, 3.2, -10.5]}
        rotation={[0, -Math.PI * 0.25, 0]}
        onClick={() => openZone('projects')}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <boxGeometry args={[2.2, 0.4, 0.08]} />
          <meshStandardMaterial color="#090b14" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.1, 0.32]} />
          <meshBasicMaterial color="#ff2bd6" />
        </mesh>
      </group>

      {/* Render the 4 cabinets along the arc */}
      {ARCADE_CABINETS.map((cab) => (
        <ArcadeCabinet
          key={cab.index}
          index={cab.index}
          position={cab.position}
          rotation={cab.rotation}
        />
      ))}
    </group>
  );
};
