/**
 * Skill Vault station (Southeast) representing Capabilities & Tools.
 * Central futuristic pedestal surrounded by 4 floating, rotating energy orbs.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKILL_ORBS, ZONES } from '../config/zones';
import { PORTFOLIO_CONTENT } from '../content';
import { useGameStore } from '../store';

export const SkillVault: React.FC = () => {
  const centralMonolithRef = useRef<THREE.Mesh>(null);
  const orbMeshes = useRef<(THREE.Group | null)[]>([]);
  const openZone = useGameStore((s) => s.openZone);
  const nearZone = useGameStore((s) => s.nearZone);
  const isNear = nearZone === 'skills';
  const pos = ZONES.skills.position;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate central monolith
    if (centralMonolithRef.current) {
      centralMonolithRef.current.rotation.y = t * 0.4;
      centralMonolithRef.current.position.y = 1.6 + Math.sin(t * 1.5) * 0.1;
    }

    // Animate 4 floating orbs in a ring around the pedestal
    orbMeshes.current.forEach((mesh, i) => {
      if (mesh) {
        const baseAngle = (i * Math.PI) / 2;
        const currentAngle = baseAngle + t * 0.35;
        const radius = 2.2;
        const ox = Math.cos(currentAngle) * radius;
        const oz = Math.sin(currentAngle) * radius;
        const bob = Math.sin(t * 2.5 + i * 1.2) * (isNear ? 0.22 : 0.12);

        mesh.position.set(ox, 1.4 + bob, oz);
        mesh.rotation.y = t * 1.5;
        mesh.rotation.x = t * 0.8;
      }
    });
  });

  return (
    <group
      position={pos}
      onClick={() => openZone('skills')}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Ground Emissive Ring */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.6, 32]} />
        <meshBasicMaterial color="#ffe600" opacity={0.4} transparent />
      </mesh>

      {/* 2. Concentric Outer Ground Inscription */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.65, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.3} transparent />
      </mesh>

      {/* 3. Base Hexagonal Pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.6, 6]} />
        <meshStandardMaterial color="#0c0e17" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 4. Upper Core Ring */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.15, 6]} />
        <meshBasicMaterial color="#ffe600" />
      </mesh>

      {/* 5. Central Hovering Monolith Crystal */}
      <mesh ref={centralMonolithRef} position={[0, 1.6, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#ffe600"
          emissive="#ffe600"
          emissiveIntensity={isNear ? 1.5 : 0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 6. Four Floating Energy Orbs */}
      {SKILL_ORBS.map((orb, i) => {
        const category = PORTFOLIO_CONTENT.skillCategories[i];
        const color = category ? category.accentColor : orb.color;

        return (
          <group
            key={orb.id}
            ref={(el) => {
              orbMeshes.current[i] = el;
            }}
            onClick={(e) => {
              e.stopPropagation();
              openZone('skills', 0, orb.id);
            }}
          >
            {/* Core glowing sphere */}
            <mesh>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Orbiting ring */}
            <mesh rotation={[Math.PI * 0.3, 0, 0]}>
              <ringGeometry args={[0.42, 0.48, 16]} />
              <meshBasicMaterial color={color} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Station Hologram Header */}
      <group position={[0, 3.2, 0]} rotation={[0, -Math.PI * 0.75, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.32, 0.08]} />
          <meshStandardMaterial color="#090b14" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.72, 0.24]} />
          <meshBasicMaterial color="#ffe600" />
        </mesh>
      </group>
    </group>
  );
};
