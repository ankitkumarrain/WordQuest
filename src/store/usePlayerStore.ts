import { create } from 'zustand';
import {
  PlayerRepository,
  PlayerProfile,
} from '../database/repositories/PlayerRepository';
import { initializeDatabase } from '../database/db';
import { AudioService } from '../services/AudioService';
import { HapticService } from '../services/HapticService';

interface PlayerState {
  profile: PlayerProfile | null;
  coins: number;
  inventory: Record<string, number>;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  isHydrated: boolean;
  unlockedThemes: string[];
  activeTheme: string;

  hydrate: () => Promise<void>;
  updateProfile: (username: string, avatar: string) => Promise<void>;
  addCoins: (amount: number) => Promise<number>;
  spendCoins: (amount: number) => Promise<boolean>;
  consumeBooster: (booster: 'booster_hint' | 'booster_shuffle' | 'booster_reveal') => Promise<boolean>;
  addBooster: (booster: string, count: number) => Promise<void>;
  unlockTheme: (themeId: string, cost: number) => Promise<boolean>;
  setActiveTheme: (themeId: string) => Promise<void>;
  toggleSound: () => void;
  toggleHaptics: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  profile: null,
  coins: 150,
  inventory: {
    coins: 150,
    booster_hint: 3,
    booster_shuffle: 2,
    booster_reveal: 1,
  },
  soundEnabled: true,
  hapticsEnabled: true,
  isHydrated: false,
  unlockedThemes: ['theme_parchment'],
  activeTheme: 'theme_parchment',

  hydrate: async () => {
    try {
      await initializeDatabase();
      const profile = await PlayerRepository.getProfile();
      const inventory = await PlayerRepository.getInventory();
      const coins = inventory['coins'] ?? 150;

      // Extract unlocked themes from inventory
      const themes = ['theme_parchment'];
      for (const key of Object.keys(inventory)) {
        if (key.startsWith('theme_') && inventory[key] > 0 && !themes.includes(key)) {
          themes.push(key);
        }
      }

      // Check active theme
      let activeTheme = 'theme_parchment';
      for (const t of themes) {
        if ((inventory[`active_${t}`] ?? 0) > 0) {
          activeTheme = t;
          break;
        }
      }

      set({
        profile,
        coins,
        inventory,
        unlockedThemes: themes,
        activeTheme,
        isHydrated: true,
      });
    } catch (e) {
      console.warn('Player store hydration fallback:', e);
      set({ isHydrated: true });
    }
  },

  updateProfile: async (username: string, avatar: string) => {
    await PlayerRepository.updateProfile(username, avatar);
    const updated = await PlayerRepository.getProfile();
    set({ profile: updated });
  },

  addCoins: async (amount: number) => {
    const newQty = await PlayerRepository.modifyItemQuantity('coins', amount);
    set((state) => ({
      coins: newQty,
      inventory: { ...state.inventory, coins: newQty },
    }));
    return newQty;
  },

  spendCoins: async (amount: number) => {
    const current = get().coins;
    if (current < amount) return false;

    const newQty = await PlayerRepository.modifyItemQuantity('coins', -amount);
    set((state) => ({
      coins: newQty,
      inventory: { ...state.inventory, coins: newQty },
    }));
    return true;
  },

  consumeBooster: async (booster) => {
    const current = get().inventory[booster] ?? 0;
    if (current <= 0) return false;

    const newQty = await PlayerRepository.modifyItemQuantity(booster, -1);
    set((state) => ({
      inventory: { ...state.inventory, [booster]: newQty },
    }));
    return true;
  },

  addBooster: async (booster: string, count: number) => {
    const newQty = await PlayerRepository.modifyItemQuantity(booster, count);
    set((state) => ({
      inventory: { ...state.inventory, [booster]: newQty },
    }));
  },

  unlockTheme: async (themeId: string, cost: number) => {
    const currentCoins = get().coins;
    if (currentCoins < cost) return false;

    const success = await get().spendCoins(cost);
    if (!success) return false;

    await PlayerRepository.modifyItemQuantity(themeId, 1);
    await get().setActiveTheme(themeId);

    set((state) => ({
      unlockedThemes: state.unlockedThemes.includes(themeId)
        ? state.unlockedThemes
        : [...state.unlockedThemes, themeId],
    }));

    return true;
  },

  setActiveTheme: async (themeId: string) => {
    const currentThemes = get().unlockedThemes;
    for (const t of currentThemes) {
      await PlayerRepository.modifyItemQuantity(`active_${t}`, t === themeId ? 1 : -100);
    }
    set({ activeTheme: themeId });
  },

  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      AudioService.setSoundEnabled(next);
      return { soundEnabled: next };
    }),

  toggleHaptics: () =>
    set((state) => {
      const next = !state.hapticsEnabled;
      HapticService.setEnabled(next);
      return { hapticsEnabled: next };
    }),
}));
