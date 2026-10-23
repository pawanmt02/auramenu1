import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ARModelType, ARVisionMode } from '../../types';
import { SteamParticles } from './SteamParticles';
import {
  getCrispyBatterTexture,
  getPavBunTexture,
  getGarlicChutneyPodiTexture,
  getNormalNoiseTexture
} from './TextureGenerators';

interface FoodModelProps {
  modelType: ARModelType;
  enableSteam?: boolean;
  steamIntensity?: number;
  autoRotate?: boolean;
  scale?: number;
  visionMode?: ARVisionMode;
}

export function FoodModel({
  modelType,
  enableSteam = true,
  steamIntensity = 0.8,
  autoRotate = false,
  scale = 1,
  visionMode = 'standard'
}: FoodModelProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const isExploded = visionMode === 'exploded-anatomy';
  const isThermal = visionMode === 'thermal-infrared';
  const isWireframe = visionMode === 'wireframe-lidar';

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} dispose={null}>
      {/* Thermal / Infrared aura */}
      {isThermal && (
        <pointLight position={[0, 0.5, 0]} color="#ff0055" intensity={4.0} distance={2.5} />
      )}
      {renderModelContent(modelType, enableSteam, steamIntensity, isExploded, isThermal, isWireframe)}
    </group>
  );
}

function renderModelContent(
  modelType: ARModelType,
  enableSteam: boolean,
  steamIntensity: number,
  isExploded: boolean,
  isThermal: boolean,
  isWireframe: boolean
) {
  switch (modelType) {
    case 'vada_pav':
      return <VadaPavModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'mysore_bonda':
      return <MysoreBondaModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'maddur_vada':
      return <MaddurVadaModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'paneer_pakoda':
      return <PaneerPakodaModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'south_thali':
      return <SouthThaliModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'hyderabadi_biryani':
      return <HyderabadiBiryaniModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'tandoori_platter':
      return <TandooriPlatterModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'gulab_jamun':
      return <GulabJamunModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    case 'masala_dosa':
      return <MasalaDosaModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
    default:
      return <VadaPavModel enableSteam={enableSteam} steamIntensity={steamIntensity} isExploded={isExploded} isThermal={isThermal} isWireframe={isWireframe} />;
  }
}

// 0. Mumbai Vada Pav Model (Authentic Street Gourmet 3D Architecture)
function VadaPavModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.45 : 0;
  const batterTex = isThermal ? undefined : getCrispyBatterTexture();
  const pavTex = isThermal ? undefined : getPavBunTexture();
  const garlicPodiTex = isThermal ? undefined : getGarlicChutneyPodiTexture();
  const normalNoise = isThermal ? undefined : getNormalNoiseTexture();

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Black Slate Serving Plate */}
      <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.35, 1.25, 0.08, 48]} />
        <meshStandardMaterial
          color={isThermal ? '#0f172a' : '#18181b'}
          roughness={0.8}
          metalness={0.1}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Rustic Banana Leaf / Butter Paper Placemat */}
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.005, 32]} />
        <meshStandardMaterial
          color={isThermal ? '#003820' : '#14532d'}
          roughness={0.6}
          metalness={0.05}
          wireframe={isWireframe}
        />
      </mesh>

      {/* --- VADA PAV 1 (Primary Hero Centered-Left) --- */}
      <group position={[-0.15, 0, 0]}>
        {/* Layer 1: Bottom Pav Bun Half */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.48, 0.22, 32]} />
          <meshStandardMaterial
            color={isThermal ? '#3b82f6' : '#fde68a'}
            map={pavTex}
            bumpMap={normalNoise}
            bumpScale={0.02}
            roughness={0.7}
            wireframe={isWireframe}
          />
        </mesh>

        {/* Layer 2: Tangy Sweet Tamarind & Green Chutney Slather (Base) */}
        <mesh position={[0, 0.235 + offset * 0.2, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.02, 24]} />
          <meshStandardMaterial
            color={isThermal ? '#22c55e' : '#15803d'}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Layer 3: Red Garlic-Coconut Chutney Podi Bed */}
        <mesh position={[0, 0.25 + offset * 0.4, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.025, 24]} />
          <meshStandardMaterial
            color={isThermal ? '#ef4444' : '#dc2626'}
            map={garlicPodiTex}
            roughness={0.85}
          />
        </mesh>

        {/* Layer 4: Golden Crispy Spiced Batata Vada Sphere (Potato Fritter) */}
        <mesh position={[0, 0.48 + offset * 0.9, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.42, 36, 36]} />
          <meshStandardMaterial
            color={isThermal ? '#ff0055' : '#f59e0b'}
            map={batterTex}
            bumpMap={normalNoise}
            bumpScale={0.04}
            roughness={0.5}
            metalness={0.05}
            wireframe={isWireframe}
          />
        </mesh>

        {/* Layer 5: Top Dusting of Roasted Garlic Chutney Podi */}
        <mesh position={[0, 0.72 + offset * 1.3, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.02, 24]} />
          <meshStandardMaterial
            color={isThermal ? '#ef4444' : '#b91c1c'}
            map={garlicPodiTex}
            roughness={0.9}
          />
        </mesh>

        {/* Layer 6: Top Pav Bun (Golden Glazed Brioche Dome) */}
        <mesh position={[0, 0.88 + offset * 1.8, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.54, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={isThermal ? '#f97316' : '#d97706'}
            map={pavTex}
            bumpMap={normalNoise}
            bumpScale={0.03}
            roughness={0.35}
            metalness={0.08}
            wireframe={isWireframe}
          />
        </mesh>

        {/* Layer 7: Crowned Fried Blistered Salted Green Chilli */}
        <group position={[0.1, 1.18 + offset * 2.3, 0.15]} rotation={[0.2, 0.4, -0.3]}>
          {/* Chilli Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.015, 0.48, 16]} />
            <meshStandardMaterial
              color={isThermal ? '#10b981' : '#166534'}
              roughness={0.25}
              metalness={0.2}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Chilli Stem */}
          <mesh position={[0, 0.26, 0]} rotation={[0, 0, 0.35]} castShadow>
            <cylinderGeometry args={[0.015, 0.012, 0.12, 8]} />
            <meshStandardMaterial color="#14532d" roughness={0.6} />
          </mesh>
          {/* Blister Marks */}
          <mesh position={[0.02, 0.05, 0.02]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Side Accompaniments: Stainless Katori with Extra Red Garlic Podi */}
      <group position={[0.75 + offset * 0.4, 0.08, 0.4 + offset * 0.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.2, 0.18, 28]} />
          <meshStandardMaterial
            color={isThermal ? '#6366f1' : '#e2e8f0'}
            metalness={0.9}
            roughness={0.2}
            wireframe={isWireframe}
          />
        </mesh>
        {/* Garlic podi powder filling */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 28]} />
          <meshStandardMaterial
            color={isThermal ? '#ef4444' : '#b91c1c'}
            map={garlicPodiTex}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Second Blistered Green Chilli on the plate */}
      <group position={[-0.65 - offset * 0.3, 0.04, 0.55 + offset * 0.3]} rotation={[Math.PI / 2, 0.3, 1.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.012, 0.42, 16]} />
          <meshStandardMaterial
            color={isThermal ? '#10b981' : '#15803d'}
            roughness={0.3}
            metalness={0.15}
          />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity} position={[-0.15, 0.95 + offset * 1.8, 0]} />}
    </group>
  );
}

// 1. Mysore Bonda Model (Enhanced with Golden Crispy Porous Batter Texture)
function MysoreBondaModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.35 : 0;
  const foodColor = isThermal ? '#ff3b30' : '#f59e0b';
  const plateColor = isThermal ? '#1c1c1e' : '#1e2024';
  const batterTex = isThermal ? undefined : getCrispyBatterTexture();
  const normalNoise = isThermal ? undefined : getNormalNoiseTexture();

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.3, 1.15, 0.08, 48]} />
        <meshStandardMaterial color={plateColor} roughness={0.7} metalness={0.15} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <ringGeometry args={[1.15, 1.25, 48]} />
        <meshStandardMaterial color={isThermal ? '#007aff' : '#333740'} roughness={0.5} />
      </mesh>

      {/* Bondas with Crispy Batter Texture & Explosion Offset */}
      <mesh position={[-0.32 - offset, 0.22 + offset * 0.4, -0.15 - offset]} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={foodColor}
          map={batterTex}
          bumpMap={normalNoise}
          bumpScale={0.03}
          roughness={0.55}
          wireframe={isWireframe}
        />
      </mesh>
      <mesh position={[0.32 + offset, 0.22 + offset * 0.4, -0.15 - offset]} castShadow receiveShadow>
        <sphereGeometry args={[0.31, 32, 32]} />
        <meshStandardMaterial
          color={isThermal ? '#ff9500' : '#d97706'}
          map={batterTex}
          bumpMap={normalNoise}
          bumpScale={0.03}
          roughness={0.58}
          wireframe={isWireframe}
        />
      </mesh>
      <mesh position={[0, 0.22, 0.32 + offset]} castShadow receiveShadow>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshStandardMaterial
          color={foodColor}
          map={batterTex}
          bumpMap={normalNoise}
          bumpScale={0.03}
          roughness={0.52}
          wireframe={isWireframe}
        />
      </mesh>
      <mesh position={[0, 0.52 + offset * 1.5, 0.02]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isThermal ? '#ff2d55' : '#f59e0b'}
          map={batterTex}
          bumpMap={normalNoise}
          bumpScale={0.04}
          roughness={0.5}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Chutney Bowls */}
      <group position={[0.7 + offset, 0.08 + offset * 0.2, 0.45 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.22, 0.22, 32]} />
          <meshStandardMaterial color={isThermal ? '#5856d6' : '#cca43b'} metalness={0.85} roughness={0.25} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#f8fafc'} roughness={0.3} />
        </mesh>
      </group>

      <group position={[-0.7 - offset, 0.08 + offset * 0.2, 0.45 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.22, 0.22, 32]} />
          <meshStandardMaterial color={isThermal ? '#5856d6' : '#cca43b'} metalness={0.85} roughness={0.25} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#ff453a' : '#dc2626'} roughness={0.35} />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity} position={[0, 0.6 + offset, 0]} />}
    </group>
  );
}

// 2. Maddur Vada Model
function MaddurVadaModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.35 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.35, 1.2, 0.08, 48]} />
        <meshStandardMaterial color={isThermal ? '#1c1c1e' : '#7c2d12'} roughness={0.85} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 48]} />
        <meshStandardMaterial color={isThermal ? '#30d158' : '#15803d'} roughness={0.4} />
      </mesh>

      <mesh position={[-0.35 - offset, 0.12 + offset * 0.4, -0.2 - offset]} rotation={[0.1, 0.2, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.1, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff3b30' : '#c25e19'} roughness={0.85} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0.38 + offset, 0.14 + offset * 0.4, -0.1 - offset]} rotation={[-0.15, -0.2, 0.12]} castShadow receiveShadow>
        <cylinderGeometry args={[0.47, 0.47, 0.1, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff9500' : '#b95013'} roughness={0.85} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, 0.22 + offset * 1.2, 0.25 + offset]} rotation={[0.15, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.11, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff2d55' : '#cd691f'} roughness={0.82} wireframe={isWireframe} />
      </mesh>

      <group position={[0.65 + offset, 0.12 + offset * 0.2, 0.5 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#a16207" metalness={0.6} roughness={0.3} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#ffd60a' : '#fef08a'} roughness={0.4} />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity * 0.7} position={[0, 0.45 + offset, 0]} />}
    </group>
  );
}

// 3. Paneer Pakoda Model
function PaneerPakodaModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.35 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.3, 1.2, 0.08, 48]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} wireframe={isWireframe} />
      </mesh>

      {/* Pakoda 1 with Exposed Herb Core */}
      <group position={[-0.35 - offset, 0.16 + offset * 0.3, -0.2 - offset]} rotation={[0, 0.3, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.26, 0.45]} />
          <meshStandardMaterial color={isThermal ? '#ff3b30' : '#eab308'} roughness={0.65} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, isExploded ? 0.15 : 0, 0]}>
          <boxGeometry args={[0.46, 0.05, 0.46]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#16a34a'} roughness={0.3} />
        </mesh>
      </group>

      {/* Pakoda 2 */}
      <group position={[0.35 + offset, 0.16 + offset * 0.3, -0.15 - offset]} rotation={[0, -0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.26, 0.45]} />
          <meshStandardMaterial color={isThermal ? '#ff9500' : '#f59e0b'} roughness={0.65} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, isExploded ? 0.15 : 0, 0]}>
          <boxGeometry args={[0.46, 0.05, 0.46]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#16a34a'} roughness={0.3} />
        </mesh>
      </group>

      {/* Pakoda 3 */}
      <group position={[0, 0.22 + offset * 1.2, 0.28 + offset]} rotation={[0.1, 0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.28, 0.5]} />
          <meshStandardMaterial color={isThermal ? '#ff2d55' : '#eab308'} roughness={0.6} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, isExploded ? 0.18 : 0, 0]}>
          <boxGeometry args={[0.51, 0.05, 0.51]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#16a34a'} roughness={0.3} />
        </mesh>
      </group>

      <group position={[-0.65 - offset, 0.1, 0.45 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.22, 32]} />
          <meshStandardMaterial color="#d4d4d8" roughness={0.2} metalness={0.4} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#22c55e'} roughness={0.25} />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity} position={[0, 0.5 + offset, 0]} />}
    </group>
  );
}

// 4. Royal Dakshin Thali Model (Radial Starburst Explosion)
function SouthThaliModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.45 : 0;
  const katoris = [
    { angle: 0, color: '#ea580c' },
    { angle: (Math.PI * 2) / 6, color: '#dc2626' },
    { angle: (Math.PI * 4) / 6, color: '#facc15' },
    { angle: (Math.PI * 6) / 6, color: '#f8fafc' },
    { angle: (Math.PI * 8) / 6, color: '#b91c1c' },
    { angle: (Math.PI * 10) / 6, color: '#fde047' }
  ];

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.38, 0.08, 64]} />
        <meshStandardMaterial color={isThermal ? '#007aff' : '#cca43b'} metalness={0.9} roughness={0.2} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[1.45, 0.04, 16, 64]} />
        <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Rice Mound */}
      <mesh position={[0, 0.15 + offset * 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={isThermal ? '#ff3b30' : '#fdfefe'} roughness={0.7} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, 0.52 + offset * 1.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={isThermal ? '#ffd60a' : '#eab308'} roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* Radial Katoris Starburst */}
      {katoris.map((k, idx) => {
        const radius = 1.05 + offset;
        const x = Math.cos(k.angle) * radius;
        const z = Math.sin(k.angle) * radius;
        return (
          <group key={idx} position={[x, 0.1 + offset * 0.3, z]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.2, 0.22, 32]} />
              <meshStandardMaterial color={isThermal ? '#5856d6' : '#cca43b'} metalness={0.88} roughness={0.22} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
              <meshStandardMaterial color={isThermal ? '#ff9500' : k.color} roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[-0.85 - offset, 0.25 + offset, 0.5 + offset]} rotation={[0.4, 0.3, -0.5]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.015, 32]} />
        <meshStandardMaterial color={isThermal ? '#ffd60a' : '#fef08a'} roughness={0.6} />
      </mesh>

      {enableSteam && <SteamParticles intensity={steamIntensity} position={[0, 0.65 + offset, 0]} />}
    </group>
  );
}

// 5. Hyderabadi Biryani Clay Handi Model (Lid Lift Explosion)
function HyderabadiBiryaniModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.6 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.65, 0.6, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff3b30' : '#9a3412'} roughness={0.85} wireframe={isWireframe} />
      </mesh>

      {/* Floating Dough Rim */}
      <mesh position={[0, 0.52 + offset * 0.4, 0]}>
        <torusGeometry args={[0.86, 0.06, 16, 48]} />
        <meshStandardMaterial color={isThermal ? '#ffd60a' : '#fed7aa'} roughness={0.7} />
      </mesh>

      {/* Rice Mound & Aromatics */}
      <mesh position={[0, 0.54 + offset * 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color={isThermal ? '#ff2d55' : '#f59e0b'} roughness={0.75} wireframe={isWireframe} />
      </mesh>

      <mesh position={[0.1, 0.82 + offset, 0.1]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.12]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} />
      </mesh>

      <group position={[1.1 + offset * 0.5, 0.12, 0.4 + offset * 0.5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.24, 0.24, 32]} />
          <meshStandardMaterial color={isThermal ? '#5856d6' : '#9a3412'} roughness={0.8} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#f8fafc'} roughness={0.25} />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity * 1.5} position={[0, 0.9 + offset, 0]} />}
    </group>
  );
}

// 6. Tandoori Sizzler Platter Model
function TandooriPlatterModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.4 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.1, 1.4]} />
        <meshStandardMaterial color="#573010" roughness={0.75} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0, -0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.06, 1.1]} />
        <meshStandardMaterial color={isThermal ? '#ff3b30' : '#18181b'} roughness={0.5} metalness={0.7} wireframe={isWireframe} />
      </mesh>

      <pointLight position={[0, 0.15, 0]} color="#ff4400" intensity={3} distance={1.5} />

      {/* Skewer 1 */}
      <group position={[0, 0.15 + offset * 0.8, -0.2 - offset]} rotation={[0, 0, 0.05]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 16]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
          <mesh key={i} position={[x * (isExploded ? 1.4 : 1), 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color={isThermal ? '#ff2d55' : '#dc2626'} roughness={0.6} wireframe={isWireframe} />
          </mesh>
        ))}
      </group>

      {/* Skewer 2 */}
      <group position={[0, 0.15 + offset * 0.8, 0.2 + offset]} rotation={[0, 0, -0.05]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 16]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
          <mesh key={i} position={[x * (isExploded ? 1.4 : 1), 0, 0]} castShadow>
            <boxGeometry args={[0.21, 0.21, 0.21]} />
            <meshStandardMaterial color={isThermal ? '#ff9500' : '#ea580c'} roughness={0.65} wireframe={isWireframe} />
          </mesh>
        ))}
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity * 1.3} position={[0, 0.5 + offset, 0]} />}
    </group>
  );
}

// 7. Saffron Gulab Jamun Sundae Model
function GulabJamunModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.35 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.2, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color={isThermal ? '#007aff' : '#ffffff'}
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.5}
          thickness={0.2}
          wireframe={isWireframe}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.72, 0.35, 0.22, 32]} />
        <meshStandardMaterial color={isThermal ? '#5856d6' : '#fef08a'} roughness={0.2} />
      </mesh>

      {/* Floating Jamuns */}
      <mesh position={[-0.22 - offset, 0.42 + offset * 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff3b30' : '#581c10'} roughness={0.25} metalness={0.1} wireframe={isWireframe} />
      </mesh>
      <mesh position={[0.22 + offset, 0.46 + offset * 1.2, 0.05]} castShadow receiveShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff2d55' : '#4a150c'} roughness={0.25} metalness={0.1} wireframe={isWireframe} />
      </mesh>

      {enableSteam && <SteamParticles intensity={steamIntensity * 0.4} position={[0, 0.6 + offset, 0]} />}
    </group>
  );
}

// 8. Masala Dosa Model (Unroll & Filling Reveal)
function MasalaDosaModel({
  enableSteam,
  steamIntensity,
  isExploded,
  isThermal,
  isWireframe
}: {
  enableSteam: boolean;
  steamIntensity: number;
  isExploded: boolean;
  isThermal: boolean;
  isWireframe: boolean;
}) {
  const offset = isExploded ? 0.35 : 0;
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.4, 1.25, 0.08, 48]} />
        <meshStandardMaterial color={isThermal ? '#1c1c1e' : '#1e293b'} roughness={0.4} metalness={0.5} wireframe={isWireframe} />
      </mesh>

      {/* Crepe Roll */}
      <mesh position={[0, 0.22 + offset * 0.4, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 1.8, 32]} />
        <meshStandardMaterial color={isThermal ? '#ff9500' : '#ca8a04'} roughness={0.55} wireframe={isWireframe} />
      </mesh>

      {/* Exposed Spiced Potato Mash when exploded */}
      {isExploded && (
        <mesh position={[0, 0.22 + offset * 1.2, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 1.5, 32]} />
          <meshStandardMaterial color={isThermal ? '#ff2d55' : '#eab308'} roughness={0.8} />
        </mesh>
      )}

      {/* White Butter Pat */}
      <mesh position={[0, 0.48 + offset * 1.5, -0.1]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.15]} />
        <meshStandardMaterial color={isThermal ? '#ffd60a' : '#fef9c3'} roughness={0.1} />
      </mesh>

      <group position={[-0.6 - offset, 0.08, 0.5 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#30d158' : '#f8fafc'} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.6 + offset, 0.08, 0.5 + offset]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
          <meshStandardMaterial color={isThermal ? '#ff3b30' : '#ef4444'} roughness={0.35} />
        </mesh>
      </group>

      {enableSteam && <SteamParticles intensity={steamIntensity} position={[0, 0.55 + offset, 0]} />}
    </group>
  );
}
