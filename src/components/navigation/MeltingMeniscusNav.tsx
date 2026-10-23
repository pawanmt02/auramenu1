import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  UtensilsCrossed, 
  Glasses, 
  Sparkles, 
  UserCheck
} from 'lucide-react';
import type { AppPage, AuthState } from '../../types';

interface MeltingMeniscusNavProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
  authState: AuthState;
  savedCount: number;
}

interface NavItem {
  id: AppPage;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
}

export const MeltingMeniscusNav: React.FC<MeltingMeniscusNavProps> = ({
  currentPage,
  onPageChange,
  authState,
  savedCount
}) => {
  const navItems: NavItem[] = [
    {
      id: 'auth',
      label: authState.isAuthenticated ? 'Profile' : 'Portal',
      shortLabel: authState.isAuthenticated ? 'User' : 'Auth',
      icon: authState.isAuthenticated ? UserCheck : Lock
    },
    {
      id: 'library',
      label: 'Culinary Grid',
      shortLabel: 'Menu',
      icon: UtensilsCrossed
    },
    {
      id: 'webxr',
      label: 'WebXR Canvas',
      shortLabel: 'Spatial AR',
      icon: Glasses,
      badge: 'LIVE'
    },
    {
      id: 'saved',
      label: 'Saved Plates',
      shortLabel: 'Saved',
      icon: Sparkles,
      badge: savedCount > 0 ? savedCount : undefined
    }
  ];

  return (
    <>
      {/* SVG Gooey Filter for Melting Meniscus Tension Effect */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="gooey-meniscus">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 19 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Floating Pill Container */}
      <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center items-center px-4 pointer-events-none">
        <nav
          className="relative pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          role="navigation"
          aria-label="Main Navigation"
        >
          {/* Gooey Filter Layer Wrapper */}
          <div className="absolute inset-0 rounded-full gooey-filter-container pointer-events-none overflow-visible">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              if (!isActive) return null;
              return (
                <motion.div
                  key="glowing-bead"
                  layoutId="active-meniscus-bead"
                  className="absolute inset-y-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.9),0_0_40px_rgba(234,88,12,0.6)]"
                  style={{
                    left: `calc(${(navItems.findIndex((i) => i.id === item.id) / navItems.length) * 100}% + 4px)`,
                    width: `calc(${100 / navItems.length}% - 8px)`
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                    mass: 0.8
                  }}
                />
              );
            })}
          </div>

          {/* Navigation Tab Buttons */}
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`relative z-10 flex flex-col items-center justify-center py-2 px-3.5 sm:px-5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 active:scale-95'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full uppercase tracking-tighter ${
                      isActive
                        ? 'bg-zinc-950 text-amber-400 shadow-sm'
                        : 'bg-amber-500 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                <motion.div
                  animate={
                    isActive
                      ? { scale: [1, 1.2, 1.05], y: -2 }
                      : { scale: 1, y: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'} />
                </motion.div>

                <span
                  className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-medium transition-opacity ${
                    isActive ? 'opacity-100 font-bold' : 'opacity-70'
                  }`}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
