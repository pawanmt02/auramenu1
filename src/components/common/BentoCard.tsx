import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Sparkles, 
  Glasses, 
  Flame, 
  Clock, 
  Star, 
  Bookmark, 
  MapPin,
  Plus
} from 'lucide-react';
import type { Dish } from '../../types';
import { FoodModel } from '../3d/FoodModels';
import { soundFx } from '../../services/soundFx';

interface BentoCardProps {
  dish: Dish;
  isLarge?: boolean;
  isTall?: boolean;
  onSelectDish: (dish: Dish) => void;
  onLaunchAR: (dish: Dish) => void;
  onSaveDish: (dish: Dish) => void;
  onAddToCart?: (dish: Dish) => void;
  isSaved?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  dish,
  isLarge = false,
  isTall = false,
  onSelectDish,
  onLaunchAR,
  onSaveDish,
  onAddToCart,
  isSaved = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const descriptionWords = dish.description.split(' ');

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-amber-500/50 shadow-2xl transition-colors duration-300 flex flex-col justify-between ${
        isLarge ? 'md:col-span-2 md:row-span-2 min-h-[380px]' : isTall ? 'md:row-span-2 min-h-[360px]' : 'min-h-[300px]'
      }`}
    >
      <motion.div
        style={{
          background: `radial-gradient(circle 280px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.12), transparent 70%)`
        }}
        className="absolute inset-0 pointer-events-none z-20"
      />

      <div className={`absolute inset-0 bg-gradient-to-br ${dish.gradient} opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none`} />

      <div className="relative z-10 p-5 pb-0 flex items-start justify-between gap-2" style={{ transform: 'translateZ(30px)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {dish.category}
            </span>
            <div className="flex items-center text-zinc-400 text-xs gap-1">
              <MapPin size={12} className="text-amber-400" />
              <span className="truncate max-w-[130px]">{dish.origin}</span>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight font-heading group-hover:text-amber-300 transition-colors">
            {dish.name}
          </h3>
          <span className="text-[11px] font-serif italic text-amber-200/80 block">
            {dish.nativeName} — ₹{dish.price}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playPop();
                onAddToCart(dish);
              }}
              className="p-2 rounded-2xl glass-pill text-zinc-300 hover:text-amber-300 hover:bg-white/15 transition-all"
              title="Add to Table Tray"
            >
              <Plus size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playPop();
              onSaveDish(dish);
            }}
            className={`p-2 rounded-2xl glass-pill transition-all ${
              isSaved
                ? 'text-amber-400 bg-amber-500/20 border-amber-400/40'
                : 'text-zinc-400 hover:text-amber-300 hover:bg-white/10'
            }`}
            title="Save Dish"
          >
            <Bookmark size={16} className={isSaved ? 'fill-amber-400' : ''} />
          </button>
        </div>
      </div>

      <div
        className="relative z-10 w-full h-44 sm:h-52 cursor-pointer my-1"
        style={{ transform: 'translateZ(40px)' }}
        onClick={() => {
          soundFx.playPop();
          onSelectDish(dish);
        }}
      >
        <Canvas
          camera={{ position: [0, 1.8, 3.2], fov: 42 }}
          className="w-full h-full pointer-events-auto"
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 5, 2]} intensity={2.0} color="#fffbeb" />
          <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#fed7aa" />
          <pointLight position={[0, 2, 0]} intensity={1.5} color={dish.accentColor} />
          <FoodModel
            modelType={dish.arModelType}
            enableSteam={true}
            steamIntensity={dish.steamIntensity}
            autoRotate={true}
            scale={0.95}
          />
        </Canvas>

        <div className="absolute bottom-1 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300 flex items-center gap-1 opacity-80 group-hover:opacity-100">
          <Sparkles size={10} className="text-amber-400 animate-pulse" />
          <span>3D SPATIAL ASSET</span>
        </div>
      </div>

      <div
        className="relative z-10 p-5 pt-0 mt-auto"
        style={{ transform: 'translateZ(30px)' }}
      >
        <p className="text-xs text-zinc-300 line-clamp-2 mb-3 leading-relaxed">
          {descriptionWords.map((word, idx) => (
            <span
              key={idx}
              className="inline-block transition-transform duration-200 group-hover:text-zinc-100"
              style={{
                transitionDelay: `${idx * 15}ms`
              }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-300 mb-3.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1" title={`Spice Level: ${dish.spiceLevel}/5`}>
            <Flame size={14} className={dish.spiceLevel >= 3 ? 'text-red-500' : 'text-amber-500'} />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`w-1.5 h-3 rounded-full ${
                    lvl <= dish.spiceLevel ? 'bg-amber-500' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <Clock size={12} />
            <span>{dish.prepTime}</span>
            <span>•</span>
            <span>{dish.calories} kcal</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{dish.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectDish(dish)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-xs font-bold text-zinc-200 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Story & Macros</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              onLaunchAR(dish);
            }}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
          >
            <Glasses size={15} />
            <span>Launch AR</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
