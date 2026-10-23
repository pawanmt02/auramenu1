import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppPage, AuthState, Dish, SavedExperience, ARSettings, UserProfile } from './types';
import { DISHES } from './data/dishes';
import { apiService } from './services/api';
import { MeltingMeniscusNav } from './components/navigation/MeltingMeniscusNav';
import { AuthPortalPage } from './pages/AuthPortalPage';
import { CulinaryLibraryPage } from './pages/CulinaryLibraryPage';
import { WebXRCanvasPage } from './pages/WebXRCanvasPage';
import { SavedExperiencesPage } from './pages/SavedExperiencesPage';
import type { CartItem } from './components/common/OrderCartDrawer';

const DEFAULT_AR_SETTINGS: ARSettings = {
  planeDetectionMode: 'auto',
  lightingMode: 'warm-candle',
  shadowQuality: 'high',
  hapticsEnabled: true,
  steamEffectEnabled: true,
  audioGuidanceEnabled: true,
  gyroParallaxEnabled: true,
  surfaceSensitivity: 85,
  scaleOverride: 1.0,
  renderFidelity: 'ultra'
};

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('library');
  const [authState, setAuthState] = useState<AuthState>(apiService.getStoredAuth());
  const [dishes, setDishes] = useState<Dish[]>(DISHES);
  const [selectedDish, setSelectedDish] = useState<Dish>(DISHES[0]);
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>(() =>
    apiService.getSavedExperiences()
  );
  const [arSettings, setArSettings] = useState<ARSettings>(DEFAULT_AR_SETTINGS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { dish: DISHES[0], quantity: 2 },
    { dish: DISHES[1], quantity: 1 }
  ]);

  useEffect(() => {
    const stored = apiService.getStoredAuth();
    if (stored.isAuthenticated) {
      setAuthState(stored);
    }
  }, []);

  const handleLoginSuccess = (token: string, user: UserProfile) => {
    setAuthState({
      token,
      user,
      isAuthenticated: true
    });
  };

  const handleLogout = () => {
    apiService.logout();
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false
    });
    setCurrentPage('auth');
  };

  const handleLaunchAR = (dish: Dish) => {
    setSelectedDish(dish);
    setCurrentPage('webxr');
  };

  const handleAddCustomDish = (newDish: Dish, launchAr: boolean) => {
    setDishes((prev) => [newDish, ...prev]);
    if (launchAr) {
      setSelectedDish(newDish);
      setCurrentPage('webxr');
    }
  };

  const handleSaveDish = (dish: Dish) => {
    const updated = apiService.saveExperience(dish.id, {
      spiceAdjustment: 0,
      extraDips: [],
      portionMultiplier: 1.0,
      notes: 'Bookmarked from Culinary Library'
    });
    setSavedExperiences(updated);
  };

  const handleRemoveSaved = (id: string) => {
    const updated = apiService.removeSavedExperience(id);
    setSavedExperiences(updated);
  };

  const handleUpdateCustomization = (id: string, updatedCustom: SavedExperience['customizations']) => {
    const updated = savedExperiences.map((item) =>
      item.id === id ? { ...item, customizations: updatedCustom } : item
    );
    setSavedExperiences(updated);
    try {
      localStorage.setItem('auramenu_saved_experiences', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Cart operations
  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.dish.id === dishId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveCartItem = (dishId: string) => {
    setCartItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const savedDishIds = savedExperiences.map((e) => e.dishId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      <AnimatePresence mode="wait">
        {currentPage === 'auth' && (
          <motion.div
            key="page-auth"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
          >
            <AuthPortalPage
              authState={authState}
              onLoginSuccess={handleLoginSuccess}
              onNavigateToLibrary={() => setCurrentPage('library')}
            />
          </motion.div>
        )}

        {currentPage === 'library' && (
          <motion.div
            key="page-library"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <CulinaryLibraryPage
              dishes={dishes}
              savedDishIds={savedDishIds}
              onLaunchAR={handleLaunchAR}
              onSaveDish={handleSaveDish}
              cartItems={cartItems}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onRemoveCartItem={handleRemoveCartItem}
              onAddToCart={handleAddToCart}
              onClearCart={handleClearCart}
              onAddCustomDish={handleAddCustomDish}
            />
          </motion.div>
        )}

        {currentPage === 'webxr' && (
          <motion.div
            key="page-webxr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <WebXRCanvasPage
              selectedDish={selectedDish}
              allDishes={dishes}
              onSelectDish={setSelectedDish}
              onBackToLibrary={() => setCurrentPage('library')}
              onSaveDish={handleSaveDish}
              isSaved={savedDishIds.includes(selectedDish.id)}
            />
          </motion.div>
        )}

        {currentPage === 'saved' && (
          <motion.div
            key="page-saved"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <SavedExperiencesPage
              savedExperiences={savedExperiences}
              allDishes={dishes}
              authState={authState}
              onLaunchAR={handleLaunchAR}
              onRemoveSaved={handleRemoveSaved}
              onUpdateCustomization={handleUpdateCustomization}
              onLogout={handleLogout}
              onNavigateToAuth={() => setCurrentPage('auth')}
              arSettings={arSettings}
              onUpdateARSettings={setArSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Persistent Melting Meniscus Navigation Bar */}
      <MeltingMeniscusNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        authState={authState}
        savedCount={savedExperiences.length}
      />
    </div>
  );
}

export default App;
