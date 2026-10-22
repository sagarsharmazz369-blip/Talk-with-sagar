/**
 * Main 3D Canvas Scene component.
 * Lazy loaded with React.lazy for instant landing screen render.
 * Features isometric orthographic camera, cyberpunk lighting, starfield, and subtle bloom.
 */
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Island } from './Island';
import { Car } from './Car';
import { CyberDesk } from './CyberDesk';
import { ArcadeStation } from './ArcadeStation';
import { SkillVault } from './SkillVault';
import { PostalPod } from './PostalPod';
import { Collectibles } from './Collectibles';
import { CameraController } from './CameraController';
import { useGameStore } from '../store';

// Signal scene readiness once canvas mounts
const SceneReadyNotifier: React.FC = () => {
  const setSceneReady = useGameStore((s) => s.setSceneReady);
  useEffect(() => {
    // Short tick to ensure WebGL context initialized
    const t = setTimeout(() => {
      setSceneReady(true);
    }, 150);
    return () => clearTimeout(t);
  }, [setSceneReady]);

  return null;
};

export const Scene: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    } catch {}
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 select-none bg-[#07070d]">
      <Canvas
        orthographic
        camera={{
          position: [32, 32, 32],
          zoom: 30,
          near: 0.1,
          far: 2000,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      >
        <color attach="background" args={['#07070d']} />
        <SceneReadyNotifier />

        {/* 1. Cyberpunk Lighting Rig */}
        {/* Soft cool ambient light */}
        <ambientLight intensity={0.4} color="#141a2e" />

        {/* Warm key directional light casting high-contrast cyberpunk highlights */}
        <directionalLight position={[20, 30, 15]} intensity={1.2} color="#ffffff" />

        {/* Cyan rim light from northwest */}
        <directionalLight position={[-25, 15, -20]} intensity={1.4} color="#00f0ff" />

        {/* Magenta fill light from southeast */}
        <directionalLight position={[20, 10, 25]} intensity={1.0} color="#ff2bd6" />

        {/* Hemisphere Sky / Ground light */}
        <hemisphereLight args={['#00f0ff', '#ff2bd6', 0.35]} />

        {/* 2. Cyberpunk Starfield Background */}
        <Stars
          radius={60}
          depth={40}
          count={isMobile ? 1000 : 2200}
          factor={4}
          saturation={0.5}
          fade
          speed={0.8}
        />

        {/* 3. Camera Smooth Isometric Follower */}
        <CameraController />

        {/* 4. World Props & Stations */}
        <Island />
        <CyberDesk />
        <ArcadeStation />
        <SkillVault />
        <PostalPod />
        <Collectibles />

        {/* 5. Player Car */}
        <Car />

        {/* 6. Postprocessing: Subtle Bloom Only (Disabled on low-end mobile to maintain 60 FPS) */}
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.82}
              luminanceSmoothing={0.3}
              intensity={0.42}
              radius={0.4}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default Scene;
