import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// [FIREBASE_PURGE_COMPLETE]: Local Storage Primary engine active.

export type RankLevel = 'Novice' | 'Junior Analyst' | 'Security Specialist' | 'Elite Hacker' | 'Network Master' | 'Recruta';
export type League = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

// --- Black Market Item Types ---
export type MarketItemType = 'title' | 'profile_fx' | 'access_key';

export interface MarketItem {
  id: string;
  type: MarketItemType;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  equipped?: boolean;
}

// --- Bit Reward Scale ---
export const BIT_REWARDS = {
  COMMON_LESSON: 50,
  ADVANCED_LAB: 150,
  PERFECT_SCORE_BONUS: 50,
  EMERGENCY_TASK: 450, // 3x Common reward
} as const;

export const EMERGENCY_ON_FIRE_DURATION_MS = 60000; // 60 seconds

// --- Black Market Catalog ---
export const BLACK_MARKET_CATALOG: Omit<MarketItem, 'purchased' | 'equipped'>[] = [
  // Custom Titles
  { id: 'title_encryptor', type: 'title', name: '[ENCRYPTOR]', description: 'Título equipável de operador especializado em criptografia.', cost: 1000 },
  { id: 'title_zero_day', type: 'title', name: '[ZERO_DAY]', description: 'Título equipável de operador que descobriu uma vulnerabilidade crítica.', cost: 2500 },
  { id: 'title_oblivion', type: 'title', name: '[OBLIVION_OPERATOR]', description: 'Título equipável de operador que executa em silêncio absoluto.', cost: 5000 },
  // Profile FX
  { id: 'fx_static_glitch', type: 'profile_fx', name: 'Static Glitch Effect', description: 'Efeito de ruído estático no perfil do Dossier.', cost: 1500 },
  { id: 'fx_neon_border', type: 'profile_fx', name: 'Neon Border Glow', description: 'Aura neon em sua linha no grid de Ranking.', cost: 3000 },
  // Access Keys
  { id: 'key_legacy_archive', type: 'access_key', name: 'Legacy Archive', description: 'Desbloqueia lições ocultas do arquivo legado da SecRoad.', cost: 10000 },
];

interface UserProfile {
  name: string;
  rank: RankLevel;
  avatar: string;
  totalXP: number;
  completedLessons: number;
  equippedTitle?: string; // The equipped custom title
}

interface Stats {
  hearts: number;
  streak: number;
  bits: number;
  credits: number;
}

interface SecState {
  user: UserProfile;
  stats: Stats;
  completedLessonIds: string[];
  breachLogs: Array<{ id: string, timestamp: string, layer: string, title: string }>;
  isGraduated: boolean;
  graduationDate: string | null;
  isOnFire: boolean;
  onFireExpiresAt: number | null;
  emergencyTasksCompleted: number;
  market: MarketItem[];
  lastBitsEarned: number | null; // For toast notification
  _hasHydrated: boolean; // Hydration flag for App.tsx gate

  // Actions
  completeLesson: (lessonId: string, xpGain: number, bitsGain: number, hintsUsed: boolean, isAdvanced?: boolean, isPerfect?: boolean) => void;
  completeEmergencyTask: () => void;
  doubleBits: () => void;
  loseHeart: () => void;
  addHeart: () => void;
  useCredit: () => void;
  buyHeart: (cost: number) => boolean;
  buyCredits: (amount: number, cost: number) => boolean;
  purchaseItem: (itemId: string) => { success: boolean; message: string };
  equipTitle: (titleId: string) => void;
  deductBits: (amount: number) => boolean;
  clearBitsToast: () => void;
  resetProgress: () => void;
  syncToFirestore: () => Promise<void>;
  loadUserData: (uid: string) => Promise<void>;
  setHasHydrated: (state: boolean) => void;

  // Getters
  getLeague: () => { tier: League; progressToNext: number; totalToNext: number };
  hasPurchased: (itemId: string) => boolean;
  hasEffect: (effectId: string) => boolean;
}

const buildInitialMarket = (): MarketItem[] =>
  BLACK_MARKET_CATALOG.map(item => ({ ...item, purchased: false, equipped: false }));

export const useSecStore = create<SecState>()(
  persist(
    (set, get) => ({
      user: {
        name: 'Operator',
        rank: 'Novice',
        avatar: 'Default',
        totalXP: 0,
        completedLessons: 0,
        equippedTitle: undefined,
      },
      stats: {
        hearts: 5,
        streak: 0,
        bits: 100,
        credits: 3,
      },
      completedLessonIds: [],
      breachLogs: [],
      isGraduated: Boolean(false),
      graduationDate: null,
      isOnFire: Boolean(false),
      onFireExpiresAt: null,
      emergencyTasksCompleted: 0,
      market: buildInitialMarket(),
      lastBitsEarned: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      syncToFirestore: async () => {
        // LOCAL_ONLY: Progress preserved in AsyncStorage
      },

      loadUserData: async (uid: string) => {
        // LOCAL_ONLY: Session persistence handled by persist middleware
      },

      completeLesson: (lessonId, xpGain, bitsGain, hintsUsed, isAdvanced = false, isPerfect = false) => {
        const { completedLessonIds, user, stats, syncToFirestore } = get();
        if (completedLessonIds.includes(lessonId)) return;

        const newCompletedCount = user.completedLessons + 1;

        let newRank = user.rank;
        if (newCompletedCount >= 10) newRank = 'Elite Hacker';
        else if (newCompletedCount >= 5) newRank = 'Security Specialist';
        else if (newCompletedCount >= 1) newRank = 'Junior Analyst';

        const baseReward = isAdvanced ? BIT_REWARDS.ADVANCED_LAB : BIT_REWARDS.COMMON_LESSON;
        const perfectBonus = isPerfect ? BIT_REWARDS.PERFECT_SCORE_BONUS : 0;
        const totalBitsEarned = bitsGain > 0 ? bitsGain : baseReward + perfectBonus;

        set({
          user: {
            ...user,
            totalXP: Number(user.totalXP) + Number(xpGain),
            completedLessons: newCompletedCount,
            rank: newRank as RankLevel,
          },
          stats: {
            ...stats,
            bits: Number(stats.bits) + Number(totalBitsEarned),
            hearts: !hintsUsed ? Math.min(5, stats.hearts + 1) : stats.hearts,
            credits: Math.min(5, stats.credits + 1),
          },
          completedLessonIds: [...completedLessonIds, lessonId],
          lastBitsEarned: totalBitsEarned,
          breachLogs: [
            {
              id: lessonId,
              timestamp: new Date().toLocaleTimeString(),
              layer: lessonId.startsWith('l1') ? '01' :
                     lessonId.startsWith('l2') ? '02' :
                     lessonId.startsWith('l3') ? '03' :
                     lessonId.startsWith('l4') ? '04' :
                     lessonId.startsWith('l5') ? '05' :
                     lessonId.startsWith('l6') ? '06' :
                     lessonId.startsWith('l7') ? '07' :
                     lessonId.startsWith('l8') ? '08' : 'XX',
              title: 'ACESSO_GARANTIDO'
            },
            ...get().breachLogs.slice(0, 49)
          ]
        });

        const { completedLessonIds: updatedIds } = get();
        const hasL7 = updatedIds.some(id => id.startsWith('l7'));

        if (hasL7 && !Boolean(get().isGraduated)) {
          set({ isGraduated: Boolean(true), graduationDate: new Date().toLocaleDateString() });
        }
        
        syncToFirestore();
      },

      clearBitsToast: () => set({ lastBitsEarned: null }),

      completeEmergencyTask: () => {
        const { stats, emergencyTasksCompleted, syncToFirestore } = get();
        const reward = BIT_REWARDS.EMERGENCY_TASK;
        const expiresAt = Date.now() + EMERGENCY_ON_FIRE_DURATION_MS;
        set({
          stats: { ...stats, bits: Number(stats.bits) + reward },
          lastBitsEarned: reward,
          isOnFire: Boolean(true),
          onFireExpiresAt: expiresAt,
          emergencyTasksCompleted: emergencyTasksCompleted + 1,
        });
        
        syncToFirestore();

        setTimeout(() => {
          if (Date.now() >= (get().onFireExpiresAt ?? 0)) {
            set({ isOnFire: Boolean(false), onFireExpiresAt: null });
          }
        }, EMERGENCY_ON_FIRE_DURATION_MS);
      },

      deductBits: (amount: number) => {
        const { stats, syncToFirestore } = get();
        if (Number(stats.bits) < amount) return false;
        set({ stats: { ...stats, bits: Number(stats.bits) - amount } });
        syncToFirestore();
        return true;
      },

      purchaseItem: (itemId: string) => {
        const { market, stats, syncToFirestore } = get();
        const item = market.find(i => i.id === itemId);
        if (!item) return { success: false, message: '// ITEM_NOT_FOUND: INVALID_ID' };
        if (item.purchased) return { success: false, message: '// ALREADY_OWNED: ITEM_IN_ARCHIVE' };
        if (Number(stats.bits) < item.cost) {
          return { success: false, message: `// INSUFFICIENT_FUNDS: ACCESS_DENIED (Need ${item.cost - stats.bits} more bits)` };
        }
        set({
          stats: { ...stats, bits: Number(stats.bits) - item.cost },
          market: market.map(i => i.id === itemId ? { ...i, purchased: true } : i),
        });
        syncToFirestore();
        return { success: true, message: `// ACQUISITION_COMPLETE: ${item.name}` };
      },

      equipTitle: (titleId: string) => {
        const { market, user } = get();
        const item = market.find(i => i.id === titleId && i.purchased && i.type === 'title');
        if (!item) return;
        set({
          user: { ...user, equippedTitle: item.name },
          market: market.map(i => i.type === 'title' ? { ...i, equipped: i.id === titleId } : i),
        });
      },

      doubleBits: () => {
        const { stats, syncToFirestore } = get();
        set({ stats: { ...stats, bits: Math.floor(Number(stats.bits) * 2) } });
        syncToFirestore();
      },

      loseHeart: () => {
        set((state) => ({ stats: { ...state.stats, hearts: Math.max(0, state.stats.hearts - 1) } }));
      },

      addHeart: () => {
        set((state) => ({ stats: { ...state.stats, hearts: Math.min(5, state.stats.hearts + 1) } }));
      },

      useCredit: () => {
        set((state) => ({ stats: { ...state.stats, credits: Math.max(0, state.stats.credits - 1) } }));
      },

      buyHeart: (cost) => {
        const { stats, syncToFirestore } = get();
        if (Number(stats.bits) >= Number(cost) && stats.hearts < 5) {
          set({ stats: { ...stats, bits: Number(stats.bits) - Number(cost), hearts: stats.hearts + 1 } });
          syncToFirestore();
          return true;
        }
        return false;
      },

      buyCredits: (amount, cost) => {
        const { stats, syncToFirestore } = get();
        if (Number(stats.bits) >= Number(cost)) {
          set({ stats: { ...stats, bits: Number(stats.bits) - Number(cost), credits: Math.min(10, stats.credits + Number(amount)) } });
          syncToFirestore();
          return true;
        }
        return false;
      },

      resetProgress: () => {
        set({
          user: { name: 'Operator', rank: 'Novice', avatar: 'Default', totalXP: 0, completedLessons: 0, equippedTitle: undefined },
          stats: { hearts: 5, streak: 0, bits: 100, credits: 3 },
          completedLessonIds: [],
          breachLogs: [],
          isGraduated: Boolean(false),
          graduationDate: null,
          isOnFire: Boolean(false),
          onFireExpiresAt: null,
          emergencyTasksCompleted: 0,
          market: buildInitialMarket(),
          lastBitsEarned: null,
        });
      },

      getLeague: () => {
        const lessons = get().user.completedLessons;
        if (lessons >= 16) return { tier: 'Gold', progressToNext: 0, totalToNext: 0 };
        if (lessons >= 6) return { tier: 'Silver', progressToNext: lessons - 6, totalToNext: 10 };
        return { tier: 'Bronze', progressToNext: lessons, totalToNext: 6 };
      },

      hasPurchased: (itemId: string) => {
        return Boolean(get().market.find(i => i.id === itemId)?.purchased ?? false);
      },

      hasEffect: (effectId: string) => {
        return Boolean(get().market.find(i => i.id === effectId)?.purchased ?? false);
      },
    }),
    {
      name: 'sec-road-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        console.log('--- [HYDRATION_START]: Re-synching Local Archive ---');
        return (state, error) => {
          if (error) {
            console.error('--- [HYDRATION_ERROR]: Local Storage Corrupted ---', error);
          } else {
            state?.setHasHydrated(true);
            console.log('--- [HYDRATION_COMPLETE]: SecStore Initialized ---');
          }
        };
      },
    }
  )
);
