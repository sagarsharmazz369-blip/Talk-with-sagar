/**
 * Postal Pod station (Southwest) representing Contact & Messaging.
 * Futuristic communications tower with pulsing antenna and holographic letter.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZONES } from '../config/zones';
import { useGameStore } from '../store';

export const PostalPod: React.FC = () => {
  const holoMailRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.MeshBasicMaterial>(null);
  const openZone = useGameStore((s) => s.openZone);
  const pos = ZONES.contact.position;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate and hover holographic mail envelope
    if (holoMailRef.current) {
      holoMailRef.current.rotation.y = t * 1.4;
      holoMailRef.current.position.y = 2.4 + Math.sin(t * 2.0) * 0.12;
    }

    // Pulse antenna beacon
    if (beaconRef.current) {
      const pulse = 0.5 + Math.sin(t * 4.0) * 0.5;
      beaconRef.current.color.set('#00ff88').multiplyScalar(0.7 + pulse * 0.8);
    }
  });

  return (
    <group
      position={pos}
      rotation={[0, Math.PI * 0.75, 0]}
      onClick={() => openZone('contact')}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Ground Emissive Interaction Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.2, 32]} />
        <meshBasicMaterial color="#00ff88" opacity={0.4} transparent />
      </mesh>

      {/* 2. Base Pedestal Ring */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.24, 16]} />
        <meshStandardMaterial color="#0c0e17" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* 3. Central Pod Body */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 1.4, 12]} />
        <meshStandardMaterial color="#111626" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Pod Visor / Glass Terminal Window */}
      <mesh position={[0, 1.05, 0.62]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.62, 0.52, 0.1]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      {/* Pod Roof Dome */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#090b14" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 4. Transmission Antenna Mast */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.3, 8]} />
        <meshStandardMaterial color="#1f253d" metalness={0.9} />
      </mesh>

      {/* Antenna Beacon Tip */}
      <mesh position={[0, 2.98, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial ref={beaconRef} color="#00ff88" />
      </mesh>

      {/* 5. Floating Holographic Envelope Icon */}
      <group ref={holoMailRef} position={[0, 2.4, 0]}>
        {/* Envelope Body */}
        <mesh>
          <boxGeometry args={[0.65, 0.44, 0.05]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Envelope Flap Accent */}
        <mesh position={[0, 0.08, 0.03]}>
          <coneGeometry args={[0.3, 0.22, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 6. Front Dispatch Terminal Console */}
      <group position={[0, 0.5, 0.95]} rotation={[-Math.PI * 0.15, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.35, 0.06]} />
          <meshStandardMaterial color="#080a12" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.54, 0.28]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      </group>
    </group>
  );
};
