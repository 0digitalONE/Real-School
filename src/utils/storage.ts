import { ParentSettings, StudentProfile } from '../types';

const SETTINGS_KEY = 'math_stars_settings_v1';
const PROFILE_KEY = 'math_stars_profile_v1';

export const DEFAULT_SETTINGS: ParentSettings = {
  minDigit: 0,
  maxDigit: 9,
  sumLimit: 18,
  questionMode: 'choice',
  timerMode: 'none',
  voiceFeedback: true,
  soundEffects: true,
  voiceRate: 0.95,
  autoSpeak: true,
  parentPin: '1234',
  themeColor: 'sky',
};

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Math Star',
  avatarId: 'starry',
  stars: 0,
  xp: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  totalSolved: 0,
  totalCorrect: 0,
  factFamilies: {
    0: { attempted: 0, correct: 0, totalTimeMs: 0 },
    1: { attempted: 0, correct: 0, totalTimeMs: 0 },
    2: { attempted: 0, correct: 0, totalTimeMs: 0 },
    3: { attempted: 0, correct: 0, totalTimeMs: 0 },
    4: { attempted: 0, correct: 0, totalTimeMs: 0 },
    5: { attempted: 0, correct: 0, totalTimeMs: 0 },
    6: { attempted: 0, correct: 0, totalTimeMs: 0 },
    7: { attempted: 0, correct: 0, totalTimeMs: 0 },
    8: { attempted: 0, correct: 0, totalTimeMs: 0 },
    9: { attempted: 0, correct: 0, totalTimeMs: 0 },
  },
  unlockedBadges: [],
  unlockedAvatars: ['starry', 'dino', 'cat'],
  history: [],
  lastActive: Date.now(),
};

export function loadSettings(): ParentSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ParentSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      factFamilies: { ...DEFAULT_PROFILE.factFamilies, ...(parsed.factFamilies || {}) }
    };
  } catch (e) {
    console.error('Failed to load profile:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function resetProfile(): StudentProfile {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Failed to reset profile:', e);
  }
  return DEFAULT_PROFILE;
}
