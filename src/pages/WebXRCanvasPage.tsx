import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Camera, 
  Sun, 
  Flame, 
  RotateCw, 
  Check, 
  Sparkles, 
  Info, 
  Maximize2, 
  RefreshCw, 
  Eye, 
  VideoOff,
  Video,
  Volume2,
  VolumeX,
  Thermometer,
  Layers,
  Ruler,
  Plus
} from 'lucide-react';
import type { Dish, LightingMode, ARVisionMode } from '../types';
import { FoodModel } from '../components/3d/FoodModels';
import { soundFx } from '../services/soundFx';

interface PlacedDishInstance {
  instanceId: string;
  dish: Dish;
  position: [number, number, number];
  scale: number;
  rotationY: number;
}

interface WebXRCanvasPageProps {
  selectedDish: Dish;
  allDishes: Dish[];
  onSelectDish: (dish: Dish) => void;
  onBackToLibrary: () => void;
  onSaveDish: (dish: Dish) => void;
  isSaved?: boolean;
}

// 3D Placed Dish Mesh with Elastic Spring Physics (0 -> 1.2 -> 1.0)
function AnchoredMultiDishMesh({
  instances,
  activeDish,
  isPlaced,
  scaleFactor,
  rotationY,
  enableSteam,
  lightingMode,
  visionMode
}: {
  instances: PlacedDishInstance[];
  activeDish: Dish;
  isPlaced: boolean;
  scaleFactor: number;
  rotationY: number;
  enableSteam: boolean;
  lightingMode: LightingMode;
  visionMode: ARVisionMode;
}) {
  const meshGroupRef = useRef<THREE.Group>(null!);
  const currentScaleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;

    if (isPlaced) {
      const targetScale = scaleFactor;
      const springStiffness = 180;
      const springDamping = 12;

      const force = (targetScale - currentScaleRef.current) * springStiffness;
      velocityRef.current += force * delta;
      velocityRef.current -= velocityRef.current * springDamping * delta;
      currentScaleRef.current += velocityRef.current * delta;

      if (Math.abs(currentScaleRef.current - targetScale) < 0.001 && Math.abs(velocityRef.current) < 0.01) {
        currentScaleRef.current = targetScale;
      }
    } else {
      currentScaleRef.current = THREE.MathUtils.lerp(currentScaleRef.current, 0, delta * 15);
    }

    const s = Math.max(0, currentScaleRef.current);
    meshGroupRef.current.scale.set(s, s, s);
    meshGroupRef.current.rotation.y = rotationY;
  });

  const getLighting = () => {
    switch (lightingMode) {
      case 'warm-candle':
        return { ambient: 0.8, dir: '#ff9800', dirInt: 2.2, point: '#ff5722', pointInt: 2.5 };
      case 'daylight':
        return { ambient: 1.4, dir: '#ffffff', dirInt: 2.5, point: '#e0f2fe', pointInt: 1.0 };
      case 'lounge':
        return { ambient: 0.6, dir: '#a855f7', dirInt: 1.8, point: '#ec4899', pointInt: 2.0 };
      case 'studio':
      default:
        return { ambient: 1.1, dir: '#fffbeb', dirInt: 2.0, point: activeDish.accentColor, pointInt: 1.8 };
    }
  };

  const light = getLighting();

  return (
    <group position={[0, -0.2, 0]}>
      <ambientLight intensity={light.ambient} />
      <directionalLight position={[4, 7, 3]} intensity={light.dirInt} color={light.dir} castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.9} color="#ffffff" />
      <pointLight position={[0, 2.5, 0]} intensity={light.pointInt} color={light.point} />

      {/* Main Active Dish */}
      <group ref={meshGroupRef}>
        <FoodModel
          modelType={activeDish.arModelType}
          enableSteam={enableSteam}
          steamIntensity={activeDish.steamIntensity}
          scale={1.0}
          visionMode={visionMode}
        />
      </group>

      {/* Multi-dish placed instances on table */}
      {instances.map((inst) => (
        <group key={inst.instanceId} position={inst.position} rotation={[0, inst.rotationY, 0]}>
          <FoodModel
            modelType={inst.dish.arModelType}
            enableSteam={enableSteam}
            steamIntensity={inst.dish.steamIntensity}
            scale={inst.scale}
            visionMode={visionMode}
          />
        </group>
      ))}

      {/* Dynamic Ground Contact Shadows */}
      <ContactShadows
        position={[0, -0.06, 0]}
        opacity={isPlaced ? 0.75 : 0}
        scale={6}
        blur={2.4}
        far={1.8}
      />
    </group>
  );
}

function PlaneReticle({ isScanning, isPlaced }: { isScanning: boolean; isPlaced: boolean }) {
  const reticleRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (reticleRef.current && !isPlaced) {
      reticleRef.current.rotation.z += delta * 1.5;
    }
  });

  if (isPlaced) return null;

  return (
    <group position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <group ref={reticleRef}>
        <mesh>
          <ringGeometry args={[0.65, 0.7, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={isScanning ? 0.8 : 0.3} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]} position={[0, 0.72, 0]}>
            <planeGeometry args={[0.04, 0.15]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        ))}
      </group>

      <gridHelper args={[2, 10, '#f59e0b', '#78350f']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.01]} />
    </group>
  );
}

export const WebXRCanvasPage: React.FC<WebXRCanvasPageProps> = ({
  selectedDish,
  allDishes,
  onSelectDish,
  onBackToLibrary,
  onSaveDish,
  isSaved = false
}) => {
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const [planeDetected] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<LightingMode>('warm-candle');
  const [visionMode, setVisionMode] = useState<ARVisionMode>('standard');
  const [enableSteam, setEnableSteam] = useState<boolean>(true);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [showNutritionalHUD, setShowNutritionalHUD] = useState<boolean>(false);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState<boolean>(false);
  const [multiDishInstances, setMultiDishInstances] = useState<PlacedDishInstance[]>([]);
  const [, startTransition] = useTransition();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      if (!cameraActive) {
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraPermissionGranted(true);
          }
        }
      } catch {
        setCameraPermissionGranted(false);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handlePlaceModel = () => {
    setIsPlaced(true);
    soundFx.playAnchorThud();
    soundFx.playSizzleSound();

    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 80]);
    }

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff']
    });
  };

  const handleAddAnotherDishToTable = (dishToAdd: Dish) => {
    if (!isPlaced) {
      handlePlaceModel();
      return;
    }
    const angle = (multiDishInstances.length + 1) * 1.1;
    const distance = 1.35;
    const newPos: [number, number, number] = [
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    ];

    const newInst: PlacedDishInstance = {
      instanceId: `inst-${Date.now()}`,
      dish: dishToAdd,
      position: newPos,
      scale: 0.85,
      rotationY: Math.random() * Math.PI
    };

    setMultiDishInstances((prev) => [...prev, newInst]);
    soundFx.playPop();
    soundFx.playSizzleSound(1.5);
  };

  const handleResetPlacement = () => {
    setIsPlaced(false);
    setMultiDishInstances([]);
    soundFx.stopSpeech();
    setIsAudioGuideActive(false);
  };

  const handleToggleAudioGuide = () => {
    if (isAudioGuideActive) {
      soundFx.stopSpeech();
      setIsAudioGuideActive(false);
    } else {
      soundFx.speakStory(selectedDish.name, selectedDish.story);
      soundFx.playSizzleSound(3.0);
      setIsAudioGuideActive(true);
    }
  };

  const handleCaptureSnapshot = () => {
    soundFx.playPop();
    if (navigator.vibrate) navigator.vibrate(50);
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.5 }
    });
    alert(`📸 AuraMenu AR Snapshot of ${selectedDish.name} captured to your culinary journal!`);
  };

  return (
    <div
      ref={canvasContainerRef}
      className="fixed inset-0 z-40 bg-zinc-950 select-none overflow-hidden touch-none"
    >
      {/* 1. Camera Passthrough Feed */}
      {cameraActive && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
            cameraPermissionGranted ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Simulated Passthrough Studio Background */}
      {(!cameraActive || !cameraPermissionGranted) && (
        <div className="absolute inset-0 z-0 bg-radial from-zinc-900 via-zinc-950 to-black">
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-zinc-900/90 to-transparent border-t border-amber-500/10 pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
      )}

      {/* 2. Top Header Controls Pill Overlay */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => {
            soundFx.stopSpeech();
            onBackToLibrary();
          }}
          className="pointer-events-auto p-3 rounded-full glass-pill text-zinc-200 hover:text-white hover:bg-white/20 active:scale-95 transition-all shadow-xl flex items-center gap-1.5"
          aria-label="Back to Culinary Library"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold hidden sm:inline">Library</span>
        </button>

        {/* Center Dish Indicator Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full glass-pill shadow-xl border border-white/10">
          <div className="text-center px-1">
            <h2 className="text-xs sm:text-sm font-black text-zinc-100 font-heading truncate max-w-[150px] sm:max-w-[200px]">
              {selectedDish.name}
            </h2>
            <p className="text-[10px] text-amber-400 font-serif italic leading-none">
              {selectedDish.servingTemperature} • ₹{selectedDish.price}
            </p>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Chef Voice Audio Guide */}
          <button
            type="button"
            onClick={handleToggleAudioGuide}
            className={`p-3 rounded-full glass-pill transition-all ${
              isAudioGuideActive ? 'text-amber-400 border-amber-400/40 bg-amber-500/20' : 'text-zinc-200'
            }`}
            title="Chef Story & Tasting Guide"
          >
            {isAudioGuideActive ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
          </button>

          {/* Camera Passthrough Toggle */}
          <button
            type="button"
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-3 rounded-full glass-pill transition-all ${
              cameraActive && cameraPermissionGranted
                ? 'text-emerald-400 border-emerald-400/30'
                : 'text-zinc-400'
            }`}
            title={cameraActive ? 'Camera Passthrough Active' : 'Enable Camera Passthrough'}
          >
            {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
          </button>

          {/* Nutritional Macro HUD Toggle */}
          <button
            type="button"
            onClick={() => setShowNutritionalHUD(!showNutritionalHUD)}
            className={`p-3 rounded-full glass-pill transition-all ${
              showNutritionalHUD ? 'text-amber-400 border-amber-400/40 bg-amber-500/20' : 'text-zinc-200'
            }`}
            title="Nutritional & Ingredient HUD"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* 3. Three.js Spatial Canvas */}
      <div
        className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing"
        onClick={() => {
          if (!isPlaced && planeDetected) {
            handlePlaceModel();
          }
        }}
      >
        <Canvas
          camera={{ position: [0, 1.4, 2.8], fov: 48 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          shadows
        >
          <PlaneReticle isScanning={planeDetected} isPlaced={isPlaced} />

          <AnchoredMultiDishMesh
            instances={multiDishInstances}
            activeDish={selectedDish}
            isPlaced={isPlaced}
            scaleFactor={scaleFactor}
            rotationY={rotationY}
            enableSteam={enableSteam}
            lightingMode={lightingMode}
            visionMode={visionMode}
          />

          {isPlaced && (
            <OrbitControls
              enablePan={false}
              minDistance={1.2}
              maxDistance={5.0}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
            />
          )}
        </Canvas>
      </div>

      {/* 4. Scanning Instruction Toast */}
      <AnimatePresence>
        {!isPlaced && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none px-4"
          >
            <div className="px-4 py-2 rounded-full glass-pill border border-amber-500/30 text-zinc-200 text-xs font-medium flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Table surface detected. Tap reticle or trigger button to anchor.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Rich Nutritional Macro HUD */}
      <AnimatePresence>
        {showNutritionalHUD && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="absolute top-20 right-4 z-30 w-80 glass-panel p-4 rounded-3xl border border-white/10 shadow-2xl text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-amber-400 uppercase tracking-widest text-[10px]">
                Spatial Nutrition & Macro HUD
              </span>
              <span className="text-zinc-400">{selectedDish.portion}</span>
            </div>

            {/* Macro Breakdown Donuts / Bars */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[9px] text-zinc-400 block uppercase">Protein</span>
                <span className="text-xs font-black text-amber-300">{selectedDish.nutrition.protein}g</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[9px] text-zinc-400 block uppercase">Carbs</span>
                <span className="text-xs font-black text-blue-300">{selectedDish.nutrition.carbs}g</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[9px] text-zinc-400 block uppercase">Fats</span>
                <span className="text-xs font-black text-orange-300">{selectedDish.nutrition.fats}g</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[9px] text-zinc-400 block uppercase">Fiber</span>
                <span className="text-xs font-black text-emerald-300">{selectedDish.nutrition.fiber}g</span>
              </div>
            </div>

            {/* Physical Dimensions */}
            <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Ruler size={13} className="text-amber-400" />
                Physical Dimensions:
              </span>
              <span className="text-[11px] font-bold text-zinc-200">
                Ø {selectedDish.physicalDimensions.diameterCm}cm × {selectedDish.physicalDimensions.heightCm}cm H
              </span>
            </div>

            {/* Chef Tip */}
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Chef Tasting Tip</span>
              <p className="text-[11px] text-amber-200/90 font-serif italic leading-snug">
                "{selectedDish.chefTip}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Floating In-AR Dish Switcher Carousel Tray */}
      <div className="absolute bottom-28 inset-x-0 z-30 flex flex-col items-center gap-2.5 pointer-events-none px-4">
        {/* AR Vision Modes Pill (Exploded Anatomy, Thermal Infrared, Standard) */}
        {isPlaced && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full glass-pill border border-white/10 shadow-2xl"
          >
            <button
              onClick={() => setVisionMode('standard')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                visionMode === 'standard' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Standard Realistic
            </button>

            <button
              onClick={() => setVisionMode('exploded-anatomy')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                visionMode === 'exploded-anatomy' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers size={13} />
              <span>Exploded Layers</span>
            </button>

            <button
              onClick={() => setVisionMode('thermal-infrared')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                visionMode === 'thermal-infrared' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Thermometer size={13} />
              <span>Thermal Vision</span>
            </button>

            <button
              onClick={() => {
                const modes: LightingMode[] = ['warm-candle', 'daylight', 'studio', 'lounge'];
                const next = modes[(modes.indexOf(lightingMode) + 1) % modes.length];
                setLightingMode(next);
              }}
              className="px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-300 hover:bg-white/10 flex items-center gap-1"
            >
              <Sun size={13} className="text-amber-400" />
            </button>
          </motion.div>
        )}

        {/* In-AR Quick Dish Carousel Tray */}
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
          {allDishes.map((dish) => {
            const isCurrent = dish.id === selectedDish.id;
            return (
              <button
                key={dish.id}
                onClick={() => {
                  soundFx.playPop();
                  startTransition(() => {
                    onSelectDish(dish);
                  });
                }}
                className={`px-3.5 py-2 rounded-2xl whitespace-nowrap text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105'
                    : 'glass-pill text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{dish.name}</span>
                <span className={`text-[10px] ${isCurrent ? 'text-zinc-900 font-extrabold' : 'text-amber-400'}`}>
                  ₹{dish.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-3 mt-1">
          {isPlaced ? (
            <>
              {/* Reset */}
              <button
                type="button"
                onClick={handleResetPlacement}
                className="p-3.5 rounded-full glass-pill text-zinc-300 hover:text-white active:scale-95 shadow-xl transition-all"
                title="Clear Table / Reset"
              >
                <RefreshCw size={18} />
              </button>

              {/* Add Multi-dish Feast */}
              <button
                type="button"
                onClick={() => handleAddAnotherDishToTable(selectedDish)}
                className="py-3 px-4 rounded-full glass-pill border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xl"
                title="Add Another Plate to Feast"
              >
                <Plus size={15} />
                <span>Add Plate to Feast ({multiDishInstances.length + 1})</span>
              </button>

              {/* Rotate */}
              <button
                type="button"
                onClick={() => setRotationY((prev) => prev + Math.PI / 4)}
                className="p-3.5 rounded-full glass-pill text-zinc-300 hover:text-white active:scale-95 shadow-xl transition-all"
                title="Rotate 45°"
              >
                <RotateCw size={18} />
              </button>

              {/* Steam FX */}
              <button
                type="button"
                onClick={() => setEnableSteam(!enableSteam)}
                className={`p-3.5 rounded-full glass-pill transition-all ${
                  enableSteam ? 'text-amber-400 border-amber-400/30' : 'text-zinc-500'
                }`}
                title="Toggle Steam FX"
              >
                <Flame size={18} />
              </button>

              {/* Scale Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full glass-pill text-xs text-zinc-300">
                <Maximize2 size={12} className="text-zinc-400" />
                <input
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.1"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="w-16 h-1 accent-amber-500 bg-zinc-700 rounded-lg cursor-pointer"
                  title={`Scale: ${(scaleFactor * 100).toFixed(0)}%`}
                />
              </div>

              {/* Capture AR Snapshot */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="p-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/20 active:scale-95 shadow-xl transition-all"
                title="Take AR Photo"
              >
                <Camera size={20} />
              </button>

              {/* Save Experience */}
              <button
                type="button"
                onClick={() => onSaveDish(selectedDish)}
                className={`py-3 px-5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950'
                }`}
              >
                {isSaved ? <Check size={15} /> : <Sparkles size={15} />}
                <span>{isSaved ? 'Saved' : 'Save Plate'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handlePlaceModel}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm uppercase tracking-widest flex items-center gap-2.5 animate-attention-pulse shadow-[0_0_35px_rgba(245,158,11,0.8)] cursor-pointer select-none"
            >
              <Eye size={20} className="animate-bounce" />
              <span>Place on Table</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
