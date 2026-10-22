/**
 * Hidden collectible 3D spinning stars placed away from the main road.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLLECTIBLES_CONFIG } from '../config/zones';
import { useGameStore } from '../store';

interface CollectibleStarProps {
  id: number;
  position: [number, number, number];
  color: string;
  isFound: boolean;
}

const CollectibleStar: React.FC<CollectibleStarProps> = ({ id, position, color, isFound }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() + id * 1.5;
    meshRef.current.rotation.y = t * 2.0;
    meshRef.current.rotation.z = Math.sin(t * 1.2) * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * 2.5) * 0.15;
  });

  if (isFound) {
    // When found, show a subtle ghost ring marker
    return (
      <group position={position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <ringGeometry args={[0.4, 0.5, 16]} />
          <meshBasicMaterial color={color} opacity={0.2} transparent />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={meshRef} position={position}>
      {/* Central Star Core (Double Octahedron) */}
      <mesh>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Intersecting secondary rotated diamond */}
      <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <octahedronGeometry args={[0.34, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Orbiting halo ring */}
      <mesh rotation={[Math.PI * 0.35, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} opacity={0.8} transparent />
      </mesh>

      {/* Ground light pool */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 16]} />
        <meshBasicMaterial color={color} opacity={0.25} transparent />
      </mesh>
    </group>
  );
};

export const Collectibles: React.FC = () => {
  const collectiblesFound = useGameStore((s) => s.collectiblesFound);

  return (
    <group>
      {COLLECTIBLES_CONFIG.map((item) => (
        <CollectibleStar
          key={item.id}
          id={item.id}
          position={item.position}
          color={item.color}
          isFound={Boolean(collectiblesFound[item.id])}
        />
      ))}
    </group>
  );
};
