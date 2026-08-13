import React from 'react';
import { Award, Lock, Sparkles, Check, Flame, Zap, Star, Trophy, Crown, ShieldCheck, Target, Medal } from 'lucide-react';
import { StudentProfile } from '../types';
import { BADGES, AVATARS } from '../data/badgesAndAvatars';
import { playSound } from '../utils/audio';

interface BadgesViewProps {
  profile: StudentProfile;
  onSelectAvatar: (avatarId: string) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ profile, onSelectAvatar }) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-8 h-8" />;
      case 'Flame': return <Flame className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Star': return <Star className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      case 'Crown': return <Crown className="w-8 h-8" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
      case 'Target': return <Target className="w-8 h-8" />;
      case 'Medal': return <Medal className="w-8 h-8" />;
      default: return <Award className="w-8 h-8" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Avatars Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-amber-500" />
              Choose Your Math Buddy
            </h2>
            <p className="text-slate-500 text-sm font-bold mt-1">
              Level up in Math Stars to unlock awesome new characters!
            </p>
          </div>
          <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200">
            Lvl {profile.level} Required
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AVATARS.map((avatar) => {
            const isUnlocked = profile.unlockedAvatars.includes(avatar.id) || profile.level >= avatar.reqLevel;
            const isSelected = profile.avatarId === avatar.id;

            return (
              <button
                key={avatar.id}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    playSound('pop');
                    onSelectAvatar(avatar.id);
                  }
                }}
                className={`relative p-4 rounded-3xl border-4 flex flex-col items-center gap-2 transition-all transform active:scale-95 ${
                  isSelected
                    ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300 scale-105 shadow-md'
                    : isUnlocked
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl ${avatar.bgColor} flex items-center justify-center text-4xl shadow-md border-2 border-white`}>
                  {avatar.emoji}
                </div>

                <span className="font-extrabold text-slate-800 text-base">{avatar.name}</span>

                {isSelected ? (
                  <span className="text-xs font-black text-amber-800 bg-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </span>
                ) : isUnlocked ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Lvl {avatar.reqLevel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
              <Award className="w-7 h-7 text-amber-500" />
              Interactive Trophy Room
            </h2>
            <p className="text-slate-500 text-sm font-bold mt-1">
              Earn shiny badges as you master addition facts and build streaks!
            </p>
          </div>

          <div className="bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl border-2 border-amber-300 font-black text-sm">
            {profile.unlockedBadges.length} / {BADGES.length} Badges Earned
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  if (isUnlocked) playSound('badge');
                }}
                className={`p-5 rounded-3xl border-4 transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? `${badge.color} shadow-lg scale-100 cursor-pointer`
                    : 'bg-slate-50 border-slate-200 opacity-65'
                }`}
              >
                <div className={`p-3 rounded-2xl border-2 shrink-0 ${
                  isUnlocked
                    ? 'bg-white shadow-sm border-current'
                    : 'bg-slate-200 border-slate-300 text-slate-400'
                }`}>
                  {isUnlocked ? getBadgeIcon(badge.iconName) : <Lock className="w-8 h-8" />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      {badge.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-xs bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-full">
                        Unlocked!
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-600 leading-snug">
                    {badge.description}
                  </p>

                  <span className="text-[11px] font-extrabold text-slate-400 mt-2">
                    Requirement: {badge.reqText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
