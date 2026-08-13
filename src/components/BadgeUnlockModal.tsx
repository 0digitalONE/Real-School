import React, { useEffect } from 'react';
import { Award, Sparkles, X, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGES } from '../data/badgesAndAvatars';
import { playSound } from '../utils/audio';

interface BadgeUnlockModalProps {
  badgeIds: string[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badgeIds, onClose }) => {
  if (!badgeIds || badgeIds.length === 0) return null;

  const currentBadgeId = badgeIds[0];
  const badge = BADGES.find(b => b.id === currentBadgeId);

  useEffect(() => {
    playSound('badge');
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, [currentBadgeId]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Background rays */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-200/50 rounded-full blur-2xl pointer-events-none animate-pulse" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge Title */}
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-4 border border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          New Badge Unlocked!
        </div>

        {/* Big Icon */}
        <div className="w-24 h-24 rounded-3xl bg-amber-400 text-slate-900 flex items-center justify-center text-5xl shadow-xl border-4 border-amber-200 my-2 animate-bounce">
          🏆
        </div>

        <h3 className="text-3xl font-black text-slate-900 mt-2 leading-tight">
          {badge.title}
        </h3>

        <p className="text-sm font-extrabold text-slate-600 mt-2 max-w-xs">
          {badge.description}
        </p>

        <div className="mt-6 w-full">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg shadow-lg border-b-4 border-amber-600 transition-transform active:scale-95"
          >
            Awesome! Collect Badge ⭐
          </button>
        </div>
      </div>
    </div>
  );
};
