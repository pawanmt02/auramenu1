import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
  Sparkles, 
  Glasses, 
  Flame, 
  Trash2, 
  User, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus, 
  LogOut,
  Compass
} from 'lucide-react';
import type { 
  Dish, 
  SavedExperience, 
  AuthState, 
  ARSettings, 
  DietaryTag 
} from '../types';
import { FoodModel } from '../components/3d/FoodModels';

interface SavedExperiencesPageProps {
  savedExperiences: SavedExperience[];
  allDishes: Dish[];
  authState: AuthState;
  onLaunchAR: (dish: Dish) => void;
  onRemoveSaved: (id: string) => void;
  onUpdateCustomization: (id: string, updated: SavedExperience['customizations']) => void;
  onLogout: () => void;
  onNavigateToAuth: () => void;
  arSettings: ARSettings;
  onUpdateARSettings: (settings: ARSettings) => void;
}

type SettingsTab = 'saved-plates' | 'account' | 'ar-calibration' | 'dietary-filters';

export const SavedExperiencesPage: React.FC<SavedExperiencesPageProps> = ({
  savedExperiences,
  allDishes,
  authState,
  onLaunchAR,
  onRemoveSaved,
  onUpdateCustomization,
  onLogout,
  onNavigateToAuth,
  arSettings,
  onUpdateARSettings
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('saved-plates');
  const [direction, setDirection] = useState<number>(0);
  const [selectedExpId, setSelectedExpId] = useState<string>(
    savedExperiences.length > 0 ? savedExperiences[0].id : ''
  );

  const activeExperience = savedExperiences.find((e) => e.id === selectedExpId) || savedExperiences[0];
  const activeDish = activeExperience
    ? allDishes.find((d) => d.id === activeExperience.dishId) || allDishes[0]
    : allDishes[0];

  const handleTabChange = (newTab: SettingsTab) => {
    const tabs: SettingsTab[] = ['saved-plates', 'account', 'ar-calibration', 'dietary-filters'];
    const oldIdx = tabs.indexOf(activeTab);
    const newIdx = tabs.indexOf(newTab);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setActiveTab(newTab);
  };

  const handleSpiceChange = (delta: number) => {
    if (!activeExperience) return;
    const current = activeExperience.customizations.spiceAdjustment || 0;
    const next = Math.max(-1, Math.min(2, current + delta));
    onUpdateCustomization(activeExperience.id, {
      ...activeExperience.customizations,
      spiceAdjustment: next
    });
  };

  const handlePortionChange = (multiplier: number) => {
    if (!activeExperience) return;
    onUpdateCustomization(activeExperience.id, {
      ...activeExperience.customizations,
      portionMultiplier: multiplier
    });
  };

  const handleToggleDip = (dip: string) => {
    if (!activeExperience) return;
    const currentDips = activeExperience.customizations.extraDips || [];
    const exists = currentDips.includes(dip);
    const updated = exists ? currentDips.filter((d) => d !== dip) : [...currentDips, dip];
    onUpdateCustomization(activeExperience.id, {
      ...activeExperience.customizations,
      extraDips: updated
    });
  };

  const portionMult = activeExperience?.customizations.portionMultiplier || 1.0;
  const dipsCount = activeExperience?.customizations.extraDips?.length || 0;
  const dynamicPrice = activeDish ? Math.round(activeDish.price * portionMult + dipsCount * 40) : 0;
  const dynamicCalories = activeDish ? Math.round(activeDish.calories * portionMult + dipsCount * 60) : 0;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-28 pt-6 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      <div className="fixed top-10 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={14} className="animate-pulse" />
              <span>Fluid Spatial Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-heading text-zinc-100">
              Saved Experiences <span className="text-amber-400">&</span> Customizer
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1.5 rounded-2xl glass-panel border border-white/10 overflow-x-auto max-w-full">
            <button
              onClick={() => handleTabChange('saved-plates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'saved-plates'
                  ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles size={14} />
              <span>Saved Plates ({savedExperiences.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('account')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User size={14} />
              <span>Account Pass</span>
            </button>

            <button
              onClick={() => handleTabChange('ar-calibration')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'ar-calibration'
                  ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass size={14} />
              <span>AR Calibration</span>
            </button>

            <button
              onClick={() => handleTabChange('dietary-filters')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'dietary-filters'
                  ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Dietary</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 'saved-plates' && (
            <motion.div
              key="saved-plates-panel"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {savedExperiences.length === 0 ? (
                <div className="text-center py-20 rounded-3xl glass-panel p-8">
                  <Sparkles size={48} className="mx-auto text-zinc-600 mb-3" />
                  <h3 className="text-lg font-bold text-zinc-300">No saved spatial plates yet</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    Browse the Culinary Library and bookmark your favorite dishes to customize portions and spice balances.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Vertical List of Saved Dishes */}
                  <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-1">
                      Saved Journal ({savedExperiences.length})
                    </h3>

                    <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                      {savedExperiences.map((exp) => {
                        const dish = allDishes.find((d) => d.id === exp.dishId);
                        if (!dish) return null;
                        const isSelected = exp.id === activeExperience?.id;

                        return (
                          <motion.div
                            key={exp.id}
                            layout
                            onClick={() => setSelectedExpId(exp.id)}
                            className={`p-3.5 rounded-2xl glass-panel border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-amber-500/80 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                                : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                            }`}
                          >
                            <motion.div
                              layoutId={`dish-thumb-${exp.id}`}
                              className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0"
                            >
                              <div className="w-12 h-12">
                                <Canvas camera={{ position: [0, 1.8, 3.2], fov: 40 }}>
                                  <ambientLight intensity={1.5} />
                                  <directionalLight position={[2, 3, 2]} intensity={2} />
                                  <FoodModel
                                    modelType={dish.arModelType}
                                    enableSteam={false}
                                    scale={0.9}
                                  />
                                </Canvas>
                              </div>
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-zinc-100 truncate font-heading">
                                {dish.name}
                              </h4>
                              <p className="text-[11px] text-amber-400/90 font-serif italic truncate">
                                {dish.nativeName}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                                <span>₹{dish.price}</span>
                                <span>•</span>
                                <span>{dish.origin.split(',')[0]}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSaved(exp.id);
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                              title="Remove from saved"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Expanded Detail View & Live 3D Customizer */}
                  {activeDish && activeExperience && (
                    <div className="lg:col-span-8">
                      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {activeDish.category}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {activeDish.origin}
                              </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 font-heading">
                              {activeDish.name}
                            </h2>
                            <p className="text-xs font-serif italic text-amber-300">
                              {activeDish.nativeName} — {activeDish.subtitle}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onLaunchAR(activeDish)}
                            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer"
                          >
                            <Glasses size={18} />
                            <span>Launch Custom AR</span>
                          </button>
                        </div>

                        {/* Large 3D Turntable Hero Canvas */}
                        <div className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/5 relative overflow-hidden">
                          <Canvas camera={{ position: [0, 2.0, 3.4], fov: 42 }}>
                            <ambientLight intensity={1.3} />
                            <directionalLight position={[4, 6, 3]} intensity={2.2} />
                            <pointLight position={[0, 2, 0]} intensity={2} color={activeDish.accentColor} />
                            <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={2} />
                            <FoodModel
                              modelType={activeDish.arModelType}
                              enableSteam={true}
                              steamIntensity={activeDish.steamIntensity}
                              scale={1.15 * portionMult}
                            />
                          </Canvas>

                          <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 pointer-events-none">
                            <Sparkles size={12} className="text-amber-400" />
                            <span>Shared Layout Morph • Live 3D Mesh</span>
                          </div>
                        </div>

                        {/* Live Plate Customizer Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Spice Adjustment */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                                <Flame size={15} className="text-amber-500" />
                                Spice Level Calibration
                              </span>
                              <span className="text-xs font-bold text-amber-400">
                                {activeExperience.customizations.spiceAdjustment > 0
                                  ? `+${activeExperience.customizations.spiceAdjustment} Fiery`
                                  : activeExperience.customizations.spiceAdjustment < 0
                                  ? '-1 Mild'
                                  : 'Chef Standard'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleSpiceChange(-1)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200"
                              >
                                <Minus size={16} />
                              </button>
                              <div className="flex-1 flex justify-center gap-1">
                                {[-1, 0, 1, 2].map((val) => (
                                  <div
                                    key={val}
                                    className={`h-2 flex-1 rounded-full ${
                                      (activeExperience.customizations.spiceAdjustment || 0) >= val
                                        ? 'bg-amber-500'
                                        : 'bg-zinc-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <button
                                onClick={() => handleSpiceChange(1)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Portion Multiplier */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase font-bold text-zinc-300">
                                Portion Scale
                              </span>
                              <span className="text-xs font-bold text-amber-400">
                                {portionMult}x Portion Size
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {[0.75, 1.0, 1.5].map((mult) => (
                                <button
                                  key={mult}
                                  onClick={() => handlePortionChange(mult)}
                                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                                    portionMult === mult
                                      ? 'bg-amber-500 text-zinc-950 font-black'
                                      : 'bg-white/10 text-zinc-300 hover:bg-white/15'
                                  }`}
                                >
                                  {mult === 0.75 ? 'Tasting' : mult === 1.0 ? 'Regular' : 'Feast (1.5x)'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Extra Artisan Dips Add-ons */}
                          <div className="md:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                            <span className="text-xs uppercase font-bold text-zinc-300 block">
                              Add-on Chutneys & Culinary Accents (+₹40 each)
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                'Roasted Coconut Chutney',
                                'Gunpowder Podi + Ghee',
                                'Spiced Pudina Mint Dip',
                                'Tamarind Dates Chutney',
                                'Clay Cup Burani Raita'
                              ].map((dip) => {
                                const isAdded = (activeExperience.customizations.extraDips || []).includes(dip);
                                return (
                                  <button
                                    key={dip}
                                    onClick={() => handleToggleDip(dip)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                                      isAdded
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
                                    }`}
                                  >
                                    {isAdded ? <Check size={13} className="text-amber-400" /> : <Plus size={13} />}
                                    <span>{dip}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Calculated Live Order Summary Row */}
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                              Customized Plate Total
                            </span>
                            <div className="text-xl font-black text-amber-400">
                              ₹{dynamicPrice} <span className="text-xs font-normal text-zinc-400">({dynamicCalories} kcal)</span>
                            </div>
                          </div>

                          <div className="text-right text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <Check size={14} />
                            <span>Configuration Synchronized</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account-panel"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-black text-2xl shadow-xl">
                  {authState.user?.name ? authState.user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-100 font-heading">
                    {authState.user?.name || 'Guest Explorer'}
                  </h3>
                  <p className="text-xs text-zinc-400">{authState.user?.email || 'guest@auramenu.io'}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {authState.user?.tier || 'Foodie Explorer'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Simulated FastAPI JWT Bearer Token
                </span>
                <p className="text-xs font-mono text-amber-400/90 break-all leading-relaxed">
                  {authState.token || 'No active token. Sign in to generate.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onNavigateToAuth}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200"
                >
                  Switch Persona / Portal
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 border border-red-500/30 flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'ar-calibration' && (
            <motion.div
              key="ar-calib-panel"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
            >
              <h3 className="text-lg font-black text-zinc-100 font-heading">
                WebXR & Spatial Plane Calibration
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Horizontal Surface Detection Sensitivity
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Adjusts LiDAR and visual plane hit-test thresholds.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={arSettings.surfaceSensitivity}
                    onChange={(e) =>
                      onUpdateARSettings({ ...arSettings, surfaceSensitivity: Number(e.target.value) })
                    }
                    className="w-28 accent-amber-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Gyroscopic 3D Parallax Tilt
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Tilt 2D UI and Bento cards according to device motion.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateARSettings({ ...arSettings, gyroParallaxEnabled: !arSettings.gyroParallaxEnabled })
                    }
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      arSettings.gyroParallaxEnabled
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {arSettings.gyroParallaxEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Tactile Haptic Feedback
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Vibration pulse on button clicks and AR plane anchoring.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateARSettings({ ...arSettings, hapticsEnabled: !arSettings.hapticsEnabled })
                    }
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      arSettings.hapticsEnabled
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {arSettings.hapticsEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'dietary-filters' && (
            <motion.div
              key="dietary-panel"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
            >
              <h3 className="text-lg font-black text-zinc-100 font-heading">
                Dietary & Allergen Preferences
              </h3>
              <p className="text-xs text-zinc-400">
                Personalize your culinary reality. AuraMenu filters dishes and badges them with real-time suitability metrics.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Vegetarian', 'Vegan', 'Gluten-Free', 'Jain-Friendly', 'Halal', 'Dairy-Free'] as DietaryTag[]).map(
                  (tag) => (
                    <div
                      key={tag}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-zinc-200">{tag}</span>
                      <Check size={16} className="text-emerald-400" />
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
