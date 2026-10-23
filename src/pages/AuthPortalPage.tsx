import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  User, 
  Mail, 
  ChefHat, 
  Crown, 
  Compass, 
  ShieldCheck, 
  Check, 
  QrCode,
  Zap,
  Flame,
  ArrowLeft
} from 'lucide-react';
import type { AuthState, UserProfile, DietaryTag } from '../types';
import { apiService } from '../services/api';
import { soundFx } from '../services/soundFx';

interface AuthPortalPageProps {
  authState: AuthState;
  onLoginSuccess: (token: string, user: UserProfile) => void;
  onNavigateToLibrary: () => void;
}

export const AuthPortalPage: React.FC<AuthPortalPageProps> = ({
  authState,
  onLoginSuccess,
  onNavigateToLibrary
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(authState.token);
  const [createdUserProfile, setCreatedUserProfile] = useState<UserProfile | null>(null);

  // Sign In State
  const [username, setUsername] = useState('ar_epicurean');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedTier, setSelectedTier] = useState<UserProfile['tier']>('Culinary Connoisseur');

  // Create Account / Pass State
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [regName, setRegName] = useState('Deva S.');
  const [regEmail, setRegEmail] = useState('deva@auramenu.io');
  const [regPasscode, setRegPasscode] = useState('aurapass2026');
  const [regTier, setRegTier] = useState<UserProfile['tier']>('Chef Patron');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>(['Vegetarian', 'Gluten-Free']);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([
    'Mysuru & Udupi Traditions',
    'Amritsari Tandoor'
  ]);

  const dietaryOptions: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Jain-Friendly', 'Halal', 'Dairy-Free'];
  const originOptions = [
    'Mysuru & Udupi Traditions',
    'Amritsari Tandoor',
    'Hyderabadi Nizam Royal',
    'Awadhi Nawabi Feasts',
    'Davanagere Heritage'
  ];

  const handleToggleDietary = (tag: DietaryTag) => {
    soundFx.playPop();
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleOrigin = (org: string) => {
    soundFx.playPop();
    setSelectedOrigins((prev) =>
      prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]
    );
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsPressed(true);
    setIsLoading(true);
    soundFx.playPop();

    try {
      const response = await apiService.login(username || 'culinary_guest', password, selectedTier);
      setGeneratedToken(response.token);
      setCreatedUserProfile(response.user);
      setAuthSuccess(true);
      soundFx.playAnchorThud();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff']
      });

      onLoginSuccess(response.token, response.user);

      setTimeout(() => {
        onNavigateToLibrary();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    soundFx.playPop();

    try {
      const response = await apiService.register({
        name: regName,
        email: regEmail,
        passcode: regPasscode,
        tier: regTier,
        dietary: selectedDietary,
        origins: selectedOrigins
      });

      setGeneratedToken(response.token);
      setCreatedUserProfile(response.user);
      setAuthSuccess(true);
      soundFx.playAnchorThud();

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff']
      });

      onLoginSuccess(response.token, response.user);

      setTimeout(() => {
        onNavigateToLibrary();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-zinc-800 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-400 selection:text-zinc-950">
      {/* Background Soft Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Neumorphic Card Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg neumorph-card rounded-3xl p-6 sm:p-9 relative z-10"
      >
        {/* Header Branding */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl neumorph-card-sm text-amber-600 mb-3 shadow-sm">
            <Sparkles size={28} className="animate-spin-slow" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-800 font-heading">
            Aura<span className="text-amber-600">Menu</span>
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mt-0.5">
            The Transition Portal • Spatial Culinary Reality
          </p>
        </motion.div>

        {/* Tab Toggle (Sign In vs Create Pass) */}
        <motion.div
          variants={itemVariants}
          className="flex p-1.5 rounded-2xl neumorph-input mb-6"
        >
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              setActiveTab('signin');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'neumorph-button text-amber-700 font-black shadow-md'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              setActiveTab('signup');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'neumorph-button text-amber-700 font-black shadow-md'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            CREATE PASS (REGISTER)
          </button>
        </motion.div>

        {/* MODE 1: SIGN IN FLOW */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5 ml-1">
                Identity / Username
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ar_epicurean"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl neumorph-input text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all font-medium"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5 ml-1">
                Security Key
              </label>
              <div className="relative flex items-center">
                <KeyRound size={18} className="absolute left-4 text-zinc-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl neumorph-input text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all font-medium"
                  required
                />
              </div>
            </motion.div>

            {/* Quick Demo Access Buttons */}
            <motion.div variants={itemVariants} className="pt-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1 block mb-2">
                Instant Demo Access:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setUsername('chef_patron');
                    setSelectedTier('Chef Patron');
                  }}
                  className={`p-2 rounded-xl text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    username === 'chef_patron' ? 'neumorph-input text-amber-700' : 'neumorph-button text-zinc-600'
                  }`}
                >
                  <ChefHat size={16} className="text-amber-600" />
                  <span className="text-[10px] leading-tight">Chef Patron</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setUsername('vip_taster');
                    setSelectedTier('Culinary Connoisseur');
                  }}
                  className={`p-2 rounded-xl text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    username === 'vip_taster' ? 'neumorph-input text-amber-700' : 'neumorph-button text-zinc-600'
                  }`}
                >
                  <Crown size={16} className="text-amber-600" />
                  <span className="text-[10px] leading-tight">VIP Explorer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setUsername('guest_foodie');
                    setSelectedTier('Foodie Explorer');
                  }}
                  className={`p-2 rounded-xl text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    username === 'guest_foodie' ? 'neumorph-input text-amber-700' : 'neumorph-button text-zinc-600'
                  }`}
                >
                  <Compass size={16} className="text-amber-600" />
                  <span className="text-[10px] leading-tight">Fast Guest</span>
                </button>
              </div>
            </motion.div>

            {/* Sign in Button */}
            <motion.div variants={itemVariants} className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                className={`w-full py-4 px-6 rounded-2xl text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer select-none transition-all ${
                  isPressed || authSuccess
                    ? 'neumorph-button-primary-pressed'
                    : 'neumorph-button-primary'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : authSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>AUTHENTICATED • ENTERING</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO SPATIAL MENU</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        )}

        {/* MODE 2: CREATE ACCOUNT / PASS WIZARD */}
        {activeTab === 'signup' && (
          <form onSubmit={handleCreatePass} className="space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Pass Creation Step {registerStep} of 3
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-5 h-1.5 rounded-full transition-colors ${
                      registerStep >= s ? 'bg-amber-600' : 'bg-zinc-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Identity & Tier */}
            {registerStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1 ml-1">
                    Your Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={18} className="absolute left-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Maya Iyer"
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl neumorph-input text-zinc-800 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1 ml-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="maya@auramenu.io"
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl neumorph-input text-zinc-800 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1 ml-1">
                    Passcode Key
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound size={18} className="absolute left-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="password"
                      value={regPasscode}
                      onChange={(e) => setRegPasscode(e.target.value)}
                      placeholder="Create security key"
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl neumorph-input text-zinc-800 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5 ml-1">
                    Select Member Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Chef Patron', 'Culinary Connoisseur', 'Foodie Explorer'] as UserProfile['tier'][]).map(
                      (tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setRegTier(tier);
                          }}
                          className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            regTier === tier
                              ? 'neumorph-input text-amber-700'
                              : 'neumorph-button text-zinc-600'
                          }`}
                        >
                          <Crown size={14} className="text-amber-600 shrink-0" />
                          <span className="truncate">{tier}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setRegisterStep(2);
                  }}
                  className="w-full mt-2 py-3 rounded-2xl neumorph-button-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Dietary Preferences</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Dietary Palette Selection */}
            {registerStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="text-xs text-zinc-600">
                  Select your dietary lifestyles for automatic real-time AR dish filtering:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((tag) => {
                    const isSelected = selectedDietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleDietary(tag)}
                        className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'neumorph-input text-amber-700 font-black'
                            : 'neumorph-button text-zinc-600'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck size={14} className={isSelected ? 'text-amber-600' : 'text-zinc-400'} />
                          {tag}
                        </span>
                        {isSelected && <Check size={14} className="text-amber-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="py-3 px-4 rounded-2xl neumorph-button text-xs font-bold text-zinc-600 flex items-center gap-1"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setRegisterStep(3);
                    }}
                    className="flex-1 py-3 rounded-2xl neumorph-button-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next: Regional Origins</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Regional Flavors & Issue Pass */}
            {registerStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="text-xs text-zinc-600">
                  Select your preferred regional culinary heritage cuisines:
                </div>

                <div className="space-y-2">
                  {originOptions.map((org) => {
                    const isSelected = selectedOrigins.includes(org);
                    return (
                      <button
                        key={org}
                        type="button"
                        onClick={() => handleToggleOrigin(org)}
                        className={`w-full p-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'neumorph-input text-amber-700 font-black'
                            : 'neumorph-button text-zinc-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Flame size={14} className={isSelected ? 'text-amber-600' : 'text-zinc-400'} />
                          {org}
                        </span>
                        {isSelected && <Check size={14} className="text-amber-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(2)}
                    className="py-3 px-4 rounded-2xl neumorph-button text-xs font-bold text-zinc-600 flex items-center gap-1"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-2xl neumorph-button-primary text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <QrCode size={16} />
                        <span>ISSUE SPATIAL PASS</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        )}

        {/* Animated VIP Passport Card Preview upon issuance */}
        <AnimatePresence>
          {authSuccess && createdUserProfile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="mt-6 p-5 rounded-3xl bg-zinc-950 text-zinc-100 border border-amber-500/40 shadow-2xl space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400 block">
                    AuraMenu Spatial Passport
                  </span>
                  <h3 className="text-base font-black font-heading text-zinc-100">
                    {createdUserProfile.name}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {createdUserProfile.email}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/10 text-amber-400">
                  <QrCode size={28} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
                <span className="text-amber-300 font-bold">{createdUserProfile.tier}</span>
                <span className="text-emerald-400 font-mono">STATUS: ACTIVE VIP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live JWT Simulation Handoff Pill */}
        <AnimatePresence>
          {generatedToken && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-2xl bg-zinc-900 text-amber-400 text-xs font-mono overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between mb-1 text-[10px] text-zinc-400 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Zap size={12} className="text-amber-400" />
                  FastAPI JWT Session Bearer
                </span>
                <span className="text-emerald-400">SECURE HANDOFF</span>
              </div>
              <div className="truncate opacity-85 text-[11px]">
                {generatedToken}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Skip Action */}
        <motion.div variants={itemVariants} className="text-center mt-5">
          <button
            type="button"
            onClick={onNavigateToLibrary}
            className="text-xs font-bold text-zinc-500 hover:text-amber-700 transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer"
          >
            Direct Spatial Preview (Skip to Library)
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
