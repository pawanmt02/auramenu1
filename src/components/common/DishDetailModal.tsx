import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
  X, 
  Glasses, 
  Flame, 
  Clock, 
  Star, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  Check, 
  ShieldCheck,
  Volume2,
  VolumeX,
  Ruler,
  Thermometer
} from 'lucide-react';
import type { Dish } from '../../types';
import { FoodModel } from '../3d/FoodModels';
import { soundFx } from '../../services/soundFx';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onLaunchAR: (dish: Dish) => void;
  onSaveDish: (dish: Dish) => void;
  isSaved?: boolean;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onLaunchAR,
  onSaveDish,
  isSaved = false
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!dish) return null;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      soundFx.stopSpeech();
      setIsPlayingAudio(false);
    } else {
      soundFx.speakStory(dish.name, dish.story);
      soundFx.playSizzleSound(3.0);
      setIsPlayingAudio(true);
    }
  };

  const handleModalClose = () => {
    soundFx.stopSpeech();
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto flex flex-col"
        >
          <div className="sticky top-0 z-30 flex items-center justify-between p-5 bg-zinc-900/90 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {dish.category}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <MapPin size={13} className="text-amber-400" />
                {dish.origin}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`p-2 rounded-full transition-colors ${
                  isPlayingAudio ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40' : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                }`}
                title="Listen to Chef Story"
              >
                {isPlayingAudio ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
              </button>

              <button
                onClick={handleModalClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-zinc-950 to-zinc-900">
            <Canvas camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[5, 8, 3]} intensity={2.2} />
              <directionalLight position={[-4, 3, -3]} intensity={1.0} color="#fed7aa" />
              <pointLight position={[0, 2, 0]} intensity={2} color={dish.accentColor} />
              
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={2.5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.1}
              />
              
              <FoodModel
                modelType={dish.arModelType}
                enableSteam={true}
                steamIntensity={dish.steamIntensity}
                scale={1.2}
              />
            </Canvas>

            <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 pointer-events-none">
              <Sparkles size={13} className="text-amber-400" />
              <span>Drag to rotate 360° • Three.js Viewport</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 font-heading">
                    {dish.name}
                  </h2>
                  <p className="text-sm font-serif italic text-amber-300/90 mt-0.5">
                    {dish.nativeName} — {dish.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">
                    ₹{dish.price}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {dish.portion}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {dish.dietary.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                  >
                    <ShieldCheck size={12} />
                    {tag}
                  </span>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Flame size={12} />
                  Spice {dish.spiceLevel}/5
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 flex items-center gap-1">
                  <Thermometer size={12} className="text-red-400" />
                  {dish.servingTemperature}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 flex items-center gap-1">
                  <Ruler size={12} className="text-amber-400" />
                  Ø {dish.physicalDimensions.diameterCm}cm
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 flex items-center gap-1">
                  <Clock size={12} />
                  {dish.prepTime}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {dish.rating} ({dish.reviewsCount})
                </span>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                Nutritional & Macro Profile ({dish.calories} kcal)
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[9px] text-zinc-400 block">PROTEIN</span>
                  <span className="text-xs font-black text-amber-300">{dish.nutrition.protein}g</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[9px] text-zinc-400 block">CARBS</span>
                  <span className="text-xs font-black text-blue-300">{dish.nutrition.carbs}g</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[9px] text-zinc-400 block">HEALTHY FATS</span>
                  <span className="text-xs font-black text-orange-300">{dish.nutrition.fats}g</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[9px] text-zinc-400 block">FIBER</span>
                  <span className="text-xs font-black text-emerald-300">{dish.nutrition.fiber}g</span>
                </div>
              </div>
            </div>

            {/* Description & Heritage Story */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400">
                Culinary Heritage & Story
              </h4>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {dish.description}
              </p>
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-serif italic">
                "{dish.story}"
              </div>
            </div>

            {/* Chef Tip */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                Executive Chef Tasting Tip
              </span>
              <p className="text-xs text-amber-200/90 font-serif italic">
                "{dish.chefTip}"
              </p>
            </div>

            {/* Ingredients & Textures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-2">
                  Key Ingredients
                </h4>
                <ul className="text-xs text-zinc-300 space-y-1.5">
                  {dish.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={13} className="text-amber-400 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-2">
                  Texture Profile
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dish.textureHighlights.map((tex, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-white/10 text-zinc-200 font-medium"
                    >
                      {tex}
                    </span>
                  ))}
                </div>

                <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mt-4 mb-2">
                  Recommended Pairings
                </h4>
                <p className="text-xs text-amber-300 font-medium">
                  {dish.pairings.join(' • ')}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-30 p-5 bg-zinc-900/95 backdrop-blur-md border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => onSaveDish(dish)}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-white/10 border-white/10 text-zinc-200 hover:bg-white/15'
              }`}
            >
              <Bookmark size={18} className={isSaved ? 'fill-amber-400' : ''} />
              <span>{isSaved ? 'Saved to Plates' : 'Save Plate'}</span>
            </button>

            <button
              onClick={() => {
                handleModalClose();
                onLaunchAR(dish);
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] cursor-pointer"
            >
              <Glasses size={18} />
              <span>Place on Table (AR)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
