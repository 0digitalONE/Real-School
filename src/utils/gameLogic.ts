import { ParentSettings, StudentProfile, QuestionHistory } from '../types';
import { BADGES, checkNewBadges } from '../data/badgesAndAvatars';

export interface GeneratedProblem {
  num1: number;
  num2: number;
  answer: number;
  options: number[];
  objectIcon: string; // Emoji for visual counting dots (e.g. 🍎, 🌟, 🐶, ⚽, 🍕)
}

const OBJECT_ICONS = ['🍎', '🌟', '🐶', '⚽', '🍕', '🐱', '🚀', '🍓', '🎈', '🎨'];

export function generateProblem(
  settings: ParentSettings,
  profile: StudentProfile,
  previousNum1?: number,
  previousNum2?: number
): GeneratedProblem {
  const { minDigit, maxDigit, sumLimit } = settings;

  // Gather list of valid pairs (num1, num2)
  const validPairs: [number, number][] = [];
  for (let d1 = minDigit; d1 <= maxDigit; d1++) {
    for (let d2 = minDigit; d2 <= maxDigit; d2++) {
      if (d1 + d2 <= sumLimit) {
        validPairs.push([d1, d2]);
      }
    }
  }

  if (validPairs.length === 0) {
    // Fallback if settings are too restrictive
    validPairs.push([1, 1]);
  }

  // Smart selection: find pairs that belong to weak fact families
  // Calculate weights for each pair
  const weightedPairs = validPairs.map(pair => {
    const [a, b] = pair;
    const statsA = profile.factFamilies[a] || { attempted: 0, correct: 0, totalTimeMs: 0 };
    const statsB = profile.factFamilies[b] || { attempted: 0, correct: 0, totalTimeMs: 0 };
    
    // Accuracy for fact a and b
    const accA = statsA.attempted > 0 ? statsA.correct / statsA.attempted : 0.5;
    const accB = statsB.attempted > 0 ? statsB.correct / statsB.attempted : 0.5;
    const combinedAcc = (accA + accB) / 2;

    // Give higher weight to lower accuracy or low attempts
    let weight = Math.max(1, Math.round((1.1 - combinedAcc) * 10));

    // Reduce weight if same as previous to prevent repetition
    if (a === previousNum1 && b === previousNum2) {
      weight = 1;
    }

    return { pair, weight };
  });

  // Pick pair based on weights
  const totalWeight = weightedPairs.reduce((acc, curr) => acc + curr.weight, 0);
  let randomVal = Math.random() * totalWeight;
  let selectedPair = weightedPairs[0].pair;

  for (const item of weightedPairs) {
    if (randomVal <= item.weight) {
      selectedPair = item.pair;
      break;
    }
    randomVal -= item.weight;
  }

  const [num1, num2] = selectedPair;
  const answer = num1 + num2;

  // Generate 4 unique distractor options for multiple choice
  const optionsSet = new Set<number>();
  optionsSet.add(answer);

  const possibleDistractors = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 3,
    answer - 3,
    num1,
    num2,
    Math.abs(num1 - num2),
  ].filter(val => val >= 0 && val <= 18);

  // Shuffle distractors
  possibleDistractors.sort(() => Math.random() - 0.5);

  for (const d of possibleDistractors) {
    if (optionsSet.size >= 4) break;
    optionsSet.add(d);
  }

  // Fill up if still less than 4
  let candidate = 0;
  while (optionsSet.size < 4) {
    if (!optionsSet.has(candidate) && candidate >= 0 && candidate <= 18) {
      optionsSet.add(candidate);
    }
    candidate++;
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  // Pick a random cute counting icon
  const objectIcon = OBJECT_ICONS[Math.floor(Math.random() * OBJECT_ICONS.length)];

  return {
    num1,
    num2,
    answer,
    options,
    objectIcon
  };
}

export function processAnswerResult(
  profile: StudentProfile,
  num1: number,
  num2: number,
  userAnswer: number,
  timeMs: number
): {
  updatedProfile: StudentProfile;
  isCorrect: boolean;
  starsEarned: number;
  xpEarned: number;
  leveledUp: boolean;
  newBadges: string[];
} {
  const correctAnswer = num1 + num2;
  const isCorrect = userAnswer === correctAnswer;

  const historyItem: QuestionHistory = {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    num1,
    num2,
    userAnswer,
    correctAnswer,
    isCorrect,
    timeMs,
  };

  const newHistory = [historyItem, ...profile.history].slice(0, 100); // keep last 100

  // Update fact family stats for num1 and num2
  const updatedFactFamilies = { ...profile.factFamilies };

  [num1, num2].forEach(num => {
    const prev = updatedFactFamilies[num] || { attempted: 0, correct: 0, totalTimeMs: 0 };
    updatedFactFamilies[num] = {
      attempted: prev.attempted + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      totalTimeMs: prev.totalTimeMs + timeMs,
    };
  });

  let starsEarned = 0;
  let xpEarned = 0;
  let newStreak = profile.currentStreak;

  if (isCorrect) {
    newStreak += 1;
    starsEarned = 1 + (newStreak >= 5 ? 1 : 0); // Bonus star for 5+ streak!
    xpEarned = 10 + Math.min(newStreak, 5) * 2; // Streak XP multiplier
  } else {
    newStreak = 0;
  }

  const bestStreak = Math.max(profile.bestStreak, newStreak);
  const totalSolved = profile.totalSolved + 1;
  const totalCorrect = profile.totalCorrect + (isCorrect ? 1 : 0);
  const totalStars = profile.stars + starsEarned;
  const totalXp = profile.xp + xpEarned;

  // Level calculation: 50 XP per level
  const oldLevel = profile.level;
  const newLevel = Math.floor(totalXp / 50) + 1;
  const leveledUp = newLevel > oldLevel;

  // Check unlocked avatars
  const unlockedAvatars = [...profile.unlockedAvatars];
  if (leveledUp) {
    if (newLevel >= 2 && !unlockedAvatars.includes('robot')) unlockedAvatars.push('robot');
    if (newLevel >= 3 && !unlockedAvatars.includes('unicorn')) unlockedAvatars.push('unicorn');
    if (newLevel >= 4 && !unlockedAvatars.includes('wizard')) unlockedAvatars.push('wizard');
    if (newLevel >= 5 && !unlockedAvatars.includes('astronaut')) unlockedAvatars.push('astronaut');
    if (newLevel >= 6 && !unlockedAvatars.includes('dragon')) unlockedAvatars.push('dragon');
  }

  const interimProfile: StudentProfile = {
    ...profile,
    stars: totalStars,
    xp: totalXp,
    level: newLevel,
    currentStreak: newStreak,
    bestStreak,
    totalSolved,
    totalCorrect,
    factFamilies: updatedFactFamilies,
    unlockedAvatars,
    history: newHistory,
    lastActive: Date.now(),
  };

  // Check for badge unlocks
  const newlyUnlockedBadgeIds = checkNewBadges(interimProfile);
  const updatedUnlockedBadges = [...profile.unlockedBadges, ...newlyUnlockedBadgeIds];

  const finalProfile: StudentProfile = {
    ...interimProfile,
    unlockedBadges: updatedUnlockedBadges,
  };

  return {
    updatedProfile: finalProfile,
    isCorrect,
    starsEarned,
    xpEarned,
    leveledUp,
    newBadges: newlyUnlockedBadgeIds,
  };
}
