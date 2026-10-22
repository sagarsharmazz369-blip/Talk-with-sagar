/**
 * Isometric Orthographic Camera controller with smooth player tracking and landing transition.
 */
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store';

export const CameraController: React.FC = () => {
  const { camera, size } = useThree();
  const gameStarted = useGameStore((s) => s.gameStarted);
  const activeZone = useGameStore((s) => s.activeZone);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    try {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {}
  }, []);

  // Smoothed camera target position
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const introProgress = useRef(0);

  // Isometric angle offset
  const ISO_OFFSET = new THREE.Vector3(22, 22, 22);
  const INTRO_OFFSET = new THREE.Vector3(42, 42, 42);

  // Dynamic zoom based on window width so mobile and desktop both look optimal
  useEffect(() => {
    if ('zoom' in camera) {
      const orthoCam = camera as THREE.OrthographicCamera;
      const baseZoom = size.width < 768 ? 24 : 32;
      orthoCam.zoom = baseZoom;
      orthoCam.updateProjectionMatrix();
    }
  }, [camera, size.width]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Look for player car mesh in scene
    const car = state.scene.getObjectByName('player-car') || state.scene.children.find((c) => c.children.some((sub) => sub.type === 'Mesh'));
    // Or interpolate towards car position
    let targetX = 0;
    let targetZ = 0;

    // Find car group if available
    state.scene.traverse((obj) => {
      if (obj.type === 'Group' && obj.position.y >= 0.24 && obj.position.y <= 0.26) {
        targetX = obj.position.x;
        targetZ = obj.position.z;
      }
    });

    // Smoothly track target
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, targetX, 5.0, dt);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, targetZ, 5.0, dt);

    // Intro transition
    if (gameStarted) {
      if (prefersReducedMotion.current) {
        introProgress.current = 1.0;
      } else {
        introProgress.current = THREE.MathUtils.damp(introProgress.current, 1.0, 2.5, dt);
      }
    }

    const currentOffset = new THREE.Vector3().lerpVectors(
      INTRO_OFFSET,
      ISO_OFFSET,
      introProgress.current
    );

    // When panel is open, slight subtle pull-back
    if (activeZone) {
      currentOffset.multiplyScalar(1.05);
    }

    camera.position.x = currentTarget.current.x + currentOffset.x;
    camera.position.y = currentTarget.current.y + currentOffset.y;
    camera.position.z = currentTarget.current.z + currentOffset.z;

    camera.lookAt(currentTarget.current.x, 0.5, currentTarget.current.z);
  });

  return null;
};
