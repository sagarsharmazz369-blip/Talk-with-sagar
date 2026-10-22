/**
 * Floating rounded cyberpunk island with emissive edge, grid surface, and underbelly.
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ISLAND_RADIUS } from '../config/zones';

export const Island: React.FC = () => {
  // Generate cyber grid texture procedurally so there are zero external image dependencies
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark cyberpunk asphalt
    ctx.fillStyle = '#0a0b12';
    ctx.fillRect(0, 0, 1024, 1024);

    // Glowing cyan grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 2;
    const step = 64;
    for (let x = 0; x <= 1024; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Concentric neon road rings
    ctx.strokeStyle = 'rgba(255, 43, 214, 0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(512, 512, 420, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 512, 280, 0, Math.PI * 2);
    ctx.stroke();

    // Central spawn cyber insignia
    ctx.strokeStyle = 'rgba(255, 230, 0, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(512, 512, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(512 - 130, 512);
    ctx.lineTo(512 + 130, 512);
    ctx.moveTo(512, 512 - 130);
    ctx.lineTo(512, 512 + 130);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Island Surface Plateau */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS, 0.6, 48]} />
        <meshStandardMaterial
          color="#0c0e17"
          roughness={0.7}
          metalness={0.2}
          map={gridTexture || undefined}
        />
      </mesh>

      {/* 2. Emissive Cyber Rim Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ISLAND_RADIUS - 0.25, ISLAND_RADIUS, 64]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
      </mesh>

      {/* Outer secondary magenta accent rim */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ISLAND_RADIUS - 0.05, ISLAND_RADIUS + 0.15, 64]} />
        <meshBasicMaterial color="#ff2bd6" side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Island Rocky Underbelly (Inverted faceted cone) */}
      <mesh position={[0, -2.4, 0]}>
        <coneGeometry args={[ISLAND_RADIUS, 4.2, 24]} />
        <meshStandardMaterial
          color="#05060a"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* 4. Deep core root crystal point */}
      <mesh position={[0, -5.2, 0]}>
        <coneGeometry args={[4.5, 3.8, 12]} />
        <meshStandardMaterial
          color="#030407"
          emissive="#ff2bd6"
          emissiveIntensity={0.15}
          roughness={0.8}
          flatShading
        />
      </mesh>

      {/* 5. Floating cyber rocks & debris beneath */}
      <group position={[0, -4.5, 0]}>
        {[
          [-12, -1.5, -4],
          [11, -2.0, 5],
          [-4, -3.2, 11],
          [7, -2.5, -10],
          [-8, -2.0, -9],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} rotation={[idx, idx * 0.5, idx]}>
            <dodecahedronGeometry args={[0.9 + (idx % 3) * 0.3, 0]} />
            <meshStandardMaterial
              color="#07080f"
              roughness={0.8}
              metalness={0.2}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* 6. Perimeter Light Beacons at key compass points */}
      {[
        [-14, 0, -8],
        [-8, 0, -14],
        [14, 0, -3],
        [14, 0, 3],
        [-14, 0, 8],
        [8, 0, 14],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Post base */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 0.8, 8]} />
            <meshStandardMaterial color="#141724" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Glowing neon beacon cap */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00f0ff' : '#ff2bd6'} />
          </mesh>
        </group>
      ))}

      {/* 7. Central Spawn Platform Decal */}
      <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </group>
    </group>
  );
};
