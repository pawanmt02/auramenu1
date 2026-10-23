import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SteamParticlesProps {
  intensity?: number;
  color?: string;
  position?: [number, number, number];
}

export function SteamParticles({ intensity = 0.8, color = '#ffffff', position = [0, 0.4, 0] }: SteamParticlesProps) {
  const count = Math.floor(45 * intensity);
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.15 * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      
      pos[i * 3 + 0] = radius * Math.cos(theta);
      pos[i * 3 + 1] = Math.random() * 0.9;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      spd[i] = 0.003 + Math.random() * 0.005;
    }

    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idxY = i * 3 + 1;
      const idxX = i * 3 + 0;
      const idxZ = i * 3 + 2;

      array[idxY] += speeds[i];
      array[idxX] += Math.sin(array[idxY] * 4 + i) * 0.0008;
      array[idxZ] += Math.cos(array[idxY] * 4 + i) * 0.0008;

      if (array[idxY] > 1.1) {
        const radius = 0.12 * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        array[idxX] = radius * Math.cos(theta);
        array[idxY] = 0.0;
        array[idxZ] = radius * Math.sin(theta);
      }
    }
    posAttr.needsUpdate = true;
  });

  if (intensity <= 0.05) return null;

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color={color}
          transparent
          opacity={0.35 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
