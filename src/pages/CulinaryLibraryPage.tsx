import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Glasses, 
  UtensilsCrossed, 
  SlidersHorizontal,
  ShoppingBag
} from 'lucide-react';
import type { Dish, DishCategory, DietaryTag } from '../types';
import { BentoCard } from '../components/common/BentoCard';
import { DishDetailModal } from '../components/common/DishDetailModal';
import { FloatingSpiceParticles } from '../components/common/FloatingSpiceParticles';
import { OrderCartDrawer, type CartItem } from '../components/common/OrderCartDrawer';
import { PhotoTo3dModal } from '../components/common/PhotoTo3dModal';
import { soundFx } from '../services/soundFx';

interface CulinaryLibraryPageProps {
  dishes: Dish[];
  savedDishIds: string[];
  onLaunchAR: (dish: Dish) => void;
  onSaveDish: (dish: Dish) => void;
  cartItems: CartItem[];
  onUpdateCartQuantity: (dishId: string, delta: number) => void;
  onRemoveCartItem: (dishId: string) => void;
  onAddToCart: (dish: Dish) => void;
  onClearCart: () => void;
  onAddCustomDish?: (dish: Dish, launchAr: boolean) => void;
}

export const CulinaryLibraryPage: React.FC<CulinaryLibraryPageProps> = ({
  dishes,
  savedDishIds,
  onLaunchAR,
  onSaveDish,
  cartItems,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onAddToCart,
  onClearCart,
  onAddCustomDish
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag | 'All'>('All');
  const [selectedSpiceMax, setSelectedSpiceMax] = useState<number>(5);
  const [activeModalDish, setActiveModalDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPhotoScannerOpen, setIsPhotoScannerOpen] = useState(false);

  const categories: DishCategory[] = ['All', 'Starters', 'Platters', 'Main Course', 'Desserts'];
  const dietaryFilters: (DietaryTag | 'All')[] = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Jain-Friendly', 'Halal'];

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesDietary = selectedDietary === 'All' || dish.dietary.includes(selectedDietary);
      const matchesSpice = dish.spiceLevel <= selectedSpiceMax;

      return matchesSearch && matchesCategory && matchesDietary && matchesSpice;
    });
  }, [dishes, searchQuery, selectedCategory, selectedDietary, selectedSpiceMax]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32 pt-6 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Ambient Floating Spice Particles */}
      <FloatingSpiceParticles />

      {/* Background Spatial Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-10 w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles size={14} className="animate-pulse" />
              <span>Spatial Culinary Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading text-zinc-100">
              The Culinary <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Library</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              High-fidelity 3D renders of regional heritage dishes. Gyroscopic tilt cards, inspect exploded culinary anatomy, or project onto your table via WebXR.
            </p>
          </div>

          {/* Quick Actions (Scan Photo to 3D, Table Tray Cart, AR Studio) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Free 2D Photo to 3D Scanner Button */}
            <button
              type="button"
              onClick={() => {
                soundFx.playScannerBeep();
                setIsPhotoScannerOpen(true);
              }}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/10 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Free 2D-to-3D Scan</span>
            </button>

            {/* Table Tray Cart Pill Button */}
            <button
              type="button"
              onClick={() => {
                soundFx.playPop();
                setIsCartOpen(true);
              }}
              className="py-3 px-4 rounded-2xl glass-pill hover:bg-white/15 text-zinc-200 text-xs font-bold flex items-center gap-2 relative shadow-lg cursor-pointer transition-all"
            >
              <ShoppingBag size={17} className="text-amber-400" />
              <span>Table Tray</span>
              {totalCartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px] shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Launch AR Studio */}
            <button
              type="button"
              onClick={() => onLaunchAR(dishes[0])}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
            >
              <Glasses size={18} />
              <span>Enter AR Studio</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-8">
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish (Mysore Bonda, Thali...), region, aroma or ingredient..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-panel text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-bold text-zinc-400 hover:text-zinc-200"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : 'glass-panel text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <SlidersHorizontal size={13} />
                Diet:
              </span>
              <select
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value as DietaryTag | 'All')}
                aria-label="Filter by dietary preference"
                className="px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 font-medium focus:outline-none focus:border-amber-500/50"
              >
                {dietaryFilters.map((df) => (
                  <option key={df} value={df} className="bg-zinc-900 text-zinc-100">
                    {df}
                  </option>
                ))}
              </select>

              <select
                value={selectedSpiceMax}
                onChange={(e) => setSelectedSpiceMax(Number(e.target.value))}
                aria-label="Filter by maximum spice level"
                className="px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 font-medium focus:outline-none focus:border-amber-500/50"
              >
                <option value={5} className="bg-zinc-900 text-zinc-100">Max Spice: All (5/5)</option>
                <option value={3} className="bg-zinc-900 text-zinc-100">Medium (≤ 3/5)</option>
                <option value={2} className="bg-zinc-900 text-zinc-100">Mild (≤ 2/5)</option>
                <option value={1} className="bg-zinc-900 text-zinc-100">Sweet / Gentle (1/5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Bento Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-20 rounded-3xl glass-panel p-8 border border-white/5">
            <UtensilsCrossed size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-lg font-bold text-zinc-300">No matching culinary creations</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or dietary filters to explore our full heritage menu.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDietary('All');
                setSelectedSpiceMax(5);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => {
                const isLarge = index === 0;
                const isTall = index === 3;

                return (
                  <BentoCard
                    key={dish.id}
                    dish={dish}
                    isLarge={isLarge}
                    isTall={isTall}
                    onSelectDish={(d) => setActiveModalDish(d)}
                    onLaunchAR={(d) => onLaunchAR(d)}
                    onSaveDish={(d) => onSaveDish(d)}
                    onAddToCart={(d) => onAddToCart(d)}
                    isSaved={savedDishIds.includes(dish.id)}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 3D Turntable Modal */}
      <DishDetailModal
        dish={activeModalDish}
        onClose={() => setActiveModalDish(null)}
        onLaunchAR={(d) => onLaunchAR(d)}
        onSaveDish={(d) => onSaveDish(d)}
        isSaved={activeModalDish ? savedDishIds.includes(activeModalDish.id) : false}
      />

      {/* Order Cart Drawer */}
      <OrderCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveCartItem}
        onLaunchAR={onLaunchAR}
        onClearCart={onClearCart}
      />

      {/* Free 2D Photo to 3D Photogrammetry Scanner Modal */}
      <PhotoTo3dModal
        isOpen={isPhotoScannerOpen}
        onClose={() => setIsPhotoScannerOpen(false)}
        onDishCreated={(newDish, launchArImmediately) => {
          setIsPhotoScannerOpen(false);
          if (onAddCustomDish) {
            onAddCustomDish(newDish, launchArImmediately);
          } else if (launchArImmediately) {
            onLaunchAR(newDish);
          }
        }}
      />
    </div>
  );
};
