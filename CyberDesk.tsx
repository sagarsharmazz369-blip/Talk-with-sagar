/**
 * Cyber Desk station (Northwest) representing About Me & Experience.
 * Procedural multi-part cyberpunk workspace with holographic screens.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZONES } from '../config/zones';
import { useGameStore } from '../store';

export const CyberDesk: React.FC = () => {
  const holoPrismRef = useRef<THREE.Mesh>(null);
  const openZone = useGameStore((s) => s.openZone);
  const pos = ZONES.about.position;

  useFrame((_, delta) => {
    if (holoPrismRef.current) {
      holoPrismRef.current.rotation.y += delta * 1.2;
      holoPrismRef.current.rotation.x += delta * 0.4;
      holoPrismRef.current.position.y = 1.6 + Math.sin(Date.now() * 0.003) * 0.08;
    }
  });

  return (
    <group
      position={pos}
      rotation={[0, Math.PI * 0.25, 0]}
      onClick={() => openZone('about')}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Ground Emissive Interaction Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.1, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent />
      </mesh>

      {/* Desk Base Platform */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.8, 1.9, 0.08, 16]} />
        <meshStandardMaterial color="#0c0e17" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* 2. Main Cyber Desk Table */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2.4, 0.1, 1.2]} />
        <meshStandardMaterial color="#111422" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Desk Metallic Support Legs */}
      <mesh position={[-0.95, 0.38, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
        <meshStandardMaterial color="#1a1f33" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.95, 0.38, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
        <meshStandardMaterial color="#1a1f33" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 3. Center Main Holographic Screen */}
      <group position={[0, 1.22, -0.3]}>
        {/* Screen Bezel */}
        <mesh>
          <boxGeometry args={[1.1, 0.65, 0.04]} />
          <meshStandardMaterial color="#070912" roughness={0.5} />
        </mesh>
        {/* Glowing Display Face */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.04, 0.59]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Screen Stand */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.22, 8]} />
          <meshStandardMaterial color="#141829" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Left Angled Secondary Screen */}
      <group position={[-0.8, 1.18, -0.2]} rotation={[0, Math.PI * 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.55, 0.03]} />
          <meshStandardMaterial color="#070912" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.66, 0.51]} />
          <meshBasicMaterial color="#ff2bd6" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 8]} />
          <meshStandardMaterial color="#141829" metalness={0.8} />
        </mesh>
      </group>

      {/* 5. Right Angled Secondary Screen */}
      <group position={[0.8, 1.18, -0.2]} rotation={[0, -Math.PI * 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.55, 0.03]} />
          <meshStandardMaterial color="#070912" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.66, 0.51]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 8]} />
          <meshStandardMaterial color="#141829" metalness={0.8} />
        </mesh>
      </group>

      {/* 6. Keyboard & Mousepad */}
      <mesh position={[0, 0.81, 0.18]}>
        <boxGeometry args={[0.8, 0.02, 0.3]} />
        <meshStandardMaterial color="#05070e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.825, 0.18]}>
        <boxGeometry args={[0.68, 0.015, 0.22]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* 7. Floating Rotating Holographic Data Prism */}
      <mesh ref={holoPrismRef} position={[0, 1.6, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>

      {/* 8. Cyber Ergonomic Chair */}
      <group position={[0, 0, 0.8]} rotation={[0, Math.PI, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.65, 0.1, 0.6]} />
          <meshStandardMaterial color="#111422" roughness={0.4} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.86, -0.26]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.6, 0.72, 0.08]} />
          <meshStandardMaterial color="#0e111d" roughness={0.4} />
        </mesh>
        {/* Backrest Cyan Neon Accent */}
        <mesh position={[0, 0.86, -0.21]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.05, 0.6, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Chair Base stem */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 8]} />
          <meshStandardMaterial color="#1f2438" metalness={0.9} />
        </mesh>
      </group>

      {/* Station Title Signpost Pill */}
      <group position={[0, 2.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.25, 0.06]} />
          <meshStandardMaterial color="#080a14" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.42, 0.18]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
    </group>
  );
};
