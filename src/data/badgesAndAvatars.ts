import { Badge, AvatarOption, StudentProfile } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Step!',
    description: 'Solve your very first addition problem correctly!',
    iconName: 'Sparkles',
    color: 'bg-amber-100 text-amber-600 border-amber-300',
    category: 'milestone',
    reqText: 'Solve 1 problem'
  },
  {
    id: 'high_five',
    title: 'High Five!',
    description: 'Reach a streak of 5 correct answers in a row!',
    iconName: 'Flame',
    color: 'bg-orange-100 text-orange-600 border-orange-300',
    category: 'streak',
    reqText: '5-in-a-row streak'
  },
  {
    id: 'streak_master',
    title: 'Super Streak',
    description: 'Reach an impressive 10 correct answers in a row!',
    iconName: 'Zap',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    category: 'streak',
    reqText: '10-in-a-row streak'
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    description: 'Collect 25 shiny stars by answering questions!',
    iconName: 'Star',
    color: 'bg-purple-100 text-purple-600 border-purple-300',
    category: 'milestone',
    reqText: 'Earn 25 stars'
  },
  {
    id: 'level_5',
    title: 'Math Explorer',
    description: 'Reach Level 3 in Math Stars!',
    iconName: 'Trophy',
    color: 'bg-blue-100 text-blue-600 border-blue-300',
    category: 'milestone',
    reqText: 'Reach Level 3'
  },
  {
    id: 'level_10',
    title: 'Math Superhero',
    description: 'Reach Level 5 in Math Stars!',
    iconName: 'Crown',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-300',
    category: 'milestone',
    reqText: 'Reach Level 5'
  },
  {
    id: 'zero_hero',
    title: 'Zero Hero',
    description: 'Master addition with 0! (e.g., 5 + 0 = 5)',
    iconName: 'ShieldCheck',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-300',
    category: 'mastery',
    reqText: 'Solve 5 problems with 0'
  },
  {
    id: 'double_trouble',
    title: 'Double Champ',
    description: 'Solve 5 double problems (like 4 + 4 or 3 + 3)!',
    iconName: 'Target',
    color: 'bg-pink-100 text-pink-600 border-pink-300',
    category: 'mastery',
    reqText: 'Solve 5 double problems'
  },
  {
    id: 'century_solver',
    title: 'Century Master',
    description: 'Solve 50 math problems total!',
    iconName: 'Medal',
    color: 'bg-rose-100 text-rose-600 border-rose-300',
    category: 'milestone',
    reqText: 'Solve 50 problems'
  },
  {
    id: 'accuracy_ace',
    title: 'Accuracy Ace',
    description: 'Maintain 90% or higher accuracy across 20+ problems!',
    iconName: 'Award',
    color: 'bg-teal-100 text-teal-600 border-teal-300',
    category: 'accuracy',
    reqText: '90%+ accuracy (20+ solved)'
  }
];

export const AVATARS: AvatarOption[] = [
  { id: 'starry', name: 'Starry', emoji: '⭐', bgColor: 'bg-yellow-400', reqLevel: 1 },
  { id: 'dino', name: 'Dino Kid', emoji: '🦖', bgColor: 'bg-emerald-400', reqLevel: 1 },
  { id: 'cat', name: 'Whiskers', emoji: '🐱', bgColor: 'bg-pink-400', reqLevel: 1 },
  { id: 'robot', name: 'Beep Boop', emoji: '🤖', bgColor: 'bg-sky-400', reqLevel: 2 },
  { id: 'unicorn', name: 'Sparkle', emoji: '🦄', bgColor: 'bg-purple-400', reqLevel: 3 },
  { id: 'wizard', name: 'Merlin', emoji: '🧙‍♂️', bgColor: 'bg-indigo-400', reqLevel: 4 },
  { id: 'astronaut', name: 'Astro', emoji: '👩‍🚀', bgColor: 'bg-blue-400', reqLevel: 5 },
  { id: 'dragon', name: 'Flame', emoji: '🐉', bgColor: 'bg-rose-400', reqLevel: 6 }
];

export function checkNewBadges(profile: StudentProfile): string[] {
  const newBadges: string[] = [];

  const addIf = (badgeId: string, condition: boolean) => {
    if (condition && !profile.unlockedBadges.includes(badgeId)) {
      newBadges.push(badgeId);
    }
  };

  addIf('first_step', profile.totalCorrect >= 1);
  addIf('high_five', profile.currentStreak >= 5 || profile.bestStreak >= 5);
  addIf('streak_master', profile.currentStreak >= 10 || profile.bestStreak >= 10);
  addIf('star_collector', profile.stars >= 25);
  addIf('level_5', profile.level >= 3);
  addIf('level_10', profile.level >= 5);
  addIf('century_solver', profile.totalSolved >= 50);

  // Check accuracy ace
  if (profile.totalSolved >= 20) {
    const acc = profile.totalCorrect / profile.totalSolved;
    addIf('accuracy_ace', acc >= 0.9);
  }

  // Check Zero Hero
  const zeroStats = profile.factFamilies[0];
  if (zeroStats && zeroStats.correct >= 5) {
    addIf('zero_hero', true);
  }

  // Check Double Champ
  const doublesSolved = profile.history.filter(h => h.isCorrect && h.num1 === h.num2).length;
  addIf('double_trouble', doublesSolved >= 5);

  return newBadges;
}
