export interface ParentSettings {
  minDigit: number; // 0 to 9
  maxDigit: number; // 0 to 9
  sumLimit: number; // 1 to 18
  questionMode: 'choice' | 'keypad' | 'visual';
  timerMode: 'none' | 'playful' | 'challenge'; // none = untimed, playful = gentle bonus, challenge = 15s timer
  voiceFeedback: boolean; // Speech synthesis
  soundEffects: boolean; // Audio FX
  voiceRate: number; // 0.8 to 1.2
  autoSpeak: boolean; // Auto-read question on load
  parentPin: string; // PIN code for parent portal
  themeColor: 'sky' | 'purple' | 'emerald' | 'sunshine' | 'rose';
}

export interface FactFamilyStats {
  attempted: number;
  correct: number;
  totalTimeMs: number;
}

export interface QuestionHistory {
  id: string;
  timestamp: number;
  num1: number;
  num2: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeMs: number;
}

export interface StudentProfile {
  name: string;
  avatarId: string;
  stars: number;
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  totalSolved: number;
  totalCorrect: number;
  factFamilies: Record<number, FactFamilyStats>; // 0..9 representing facts for that number
  unlockedBadges: string[];
  unlockedAvatars: string[];
  history: QuestionHistory[];
  lastActive: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  category: 'streak' | 'accuracy' | 'mastery' | 'milestone';
  reqText: string;
}

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  reqLevel: number;
}
