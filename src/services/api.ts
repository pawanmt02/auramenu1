import type { AuthState, Dish, SavedExperience, UserProfile, DietaryTag } from '../types';
import { DISHES } from '../data/dishes';

const API_BASE_URL = 'http://localhost:8000/api';
const TOKEN_STORAGE_KEY = 'auramenu_jwt_token';
const USER_STORAGE_KEY = 'auramenu_user_profile';
const SAVED_EXPERIENCES_KEY = 'auramenu_saved_experiences';

const DEFAULT_SAVED_EXPERIENCES: SavedExperience[] = [
  {
    id: 'exp-1',
    dishId: 'mysore-bonda',
    savedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customizations: {
      spiceAdjustment: 1,
      extraDips: ['Gunpowder Podi', 'Roasted Coconut Chutney'],
      portionMultiplier: 1.0,
      notes: 'Extra crispy with coconut chutney drizzle.'
    },
    isFavorite: true
  },
  {
    id: 'exp-2',
    dishId: 'south-thali',
    savedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customizations: {
      spiceAdjustment: 0,
      extraDips: ['Elaneer Payasam Bowl', 'Spiced Buttermilk'],
      portionMultiplier: 1.0,
      notes: 'Imperial celebratory feast setup.'
    },
    isFavorite: true
  }
];

export const apiService = {
  // Get stored auth
  getStoredAuth(): AuthState {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userRaw = localStorage.getItem(USER_STORAGE_KEY);
      if (token && userRaw) {
        return {
          token,
          user: JSON.parse(userRaw) as UserProfile,
          isAuthenticated: true
        };
      }
    } catch {
      // Fallback on error
    }
    return {
      token: null,
      user: null,
      isAuthenticated: false
    };
  },

  setStoredAuth(token: string | null, user: UserProfile | null) {
    if (token && user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  // Mock / Live Login
  async login(username: string, _password: string, tier: UserProfile['tier'] = 'Foodie Explorer'): Promise<{ token: string; user: UserProfile }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: _password })
      });
      if (response.ok) {
        const data = await response.json();
        this.setStoredAuth(data.token, data.user);
        return data;
      }
    } catch {
      // Fall through to mock JWT generation
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: username,
        name: username.replace(/[@.]/g, ' '),
        tier,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      })
    )}.auramenu_signature_${Math.random().toString(36).substring(2, 10)}`;

    const user: UserProfile = {
      id: `usr-${Math.random().toString(36).substring(2, 8)}`,
      name: username.includes('@') ? username.split('@')[0] : username,
      email: username.includes('@') ? username : `${username.toLowerCase()}@auramenu.io`,
      tier,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      dietaryPreferences: ['Vegetarian'],
      favoriteOrigins: ['Mysuru, Karnataka', 'Amritsar, Punjab']
    };

    this.setStoredAuth(mockJwt, user);
    return { token: mockJwt, user };
  },

  // Create Account / Register Pass
  async register(params: {
    name: string;
    email: string;
    passcode: string;
    tier: UserProfile['tier'];
    dietary: DietaryTag[];
    origins: string[];
  }): Promise<{ token: string; user: UserProfile }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (response.ok) {
        const data = await response.json();
        this.setStoredAuth(data.token, data.user);
        return data;
      }
    } catch {
      // Fallback to client generation
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: params.email,
        name: params.name,
        tier: params.tier,
        dietary: params.dietary,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7
      })
    )}.auramenu_vip_signature_${Math.random().toString(36).substring(2, 10)}`;

    const user: UserProfile = {
      id: `usr-${Math.random().toString(36).substring(2, 8)}`,
      name: params.name,
      email: params.email,
      tier: params.tier,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${params.name}`,
      dietaryPreferences: params.dietary,
      favoriteOrigins: params.origins
    };

    this.setStoredAuth(mockJwt, user);
    return { token: mockJwt, user };
  },

  logout() {
    this.setStoredAuth(null, null);
  },

  async getDishes(): Promise<Dish[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }
    return DISHES;
  },

  getSavedExperiences(): SavedExperience[] {
    try {
      const stored = localStorage.getItem(SAVED_EXPERIENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SAVED_EXPERIENCES;
  },

  saveExperience(dishId: string, customizations: SavedExperience['customizations']): SavedExperience[] {
    const current = this.getSavedExperiences();
    const newEntry: SavedExperience = {
      id: `exp-${Date.now()}`,
      dishId,
      savedAt: new Date().toISOString(),
      customizations,
      isFavorite: true
    };
    const updated = [newEntry, ...current.filter((item) => item.dishId !== dishId)];
    try {
      localStorage.setItem(SAVED_EXPERIENCES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  },

  removeSavedExperience(id: string): SavedExperience[] {
    const current = this.getSavedExperiences();
    const updated = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(SAVED_EXPERIENCES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }
};
