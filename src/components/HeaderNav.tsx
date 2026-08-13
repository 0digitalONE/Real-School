import React from 'react';
import { Volume2, VolumeX, Shield, Star, Flame, Trophy, WifiOff, Award, BarChart3, Gamepad2 } from 'lucide-react';
import { StudentProfile, ParentSettings } from '../types';
import { AVATARS } from '../data/badgesAndAvatars';

interface HeaderNavProps {
  profile: StudentProfile;
  settings: ParentSettings;
  activeTab: 'game' | 'dashboard' | 'badges';
  setActiveTab: (tab: 'game' | 'dashboard' | 'badges') => void;
  onToggleSound: () => void;
  onOpenParentPortal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  profile,
  settings,
  activeTab,
  setActiveTab,
  onToggleSound,
  onOpenParentPortal
}) => {
  const avatar = AVATARS.find(a => a.id === profile.avatarId) || AVATARS[0];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-4 border-slate-200 sticky top-0 z-40 px-3 py-2 sm:px-6 sm:py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: App Logo & Kid Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('game')}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-amber-200 transform active:scale-95 transition-transform">
              ⭐
            </div>
            <div>
              <h1 className="font-black text-xl sm:text-2xl text-slate-800 tracking-tight leading-none flex items-center gap-1 font-sans">
                Math<span className="text-amber-500">Stars</span>
              </h1>
              <p className="text-xs text-slate-500 font-bold hidden sm:block">Addition Adventure</p>
            </div>
          </div>

          {/* Offline Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            <WifiOff className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Offline Ready</span>
          </div>
        </div>

        {/* Center: Kid Stats Bar (Level, Stars, Streak) */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/90 p-1.5 sm:p-2 rounded-2xl border-2 border-slate-200">
          {/* Level */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Lvl {profile.level}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-xl text-xs sm:text-sm font-black border border-amber-300">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span className="text-base sm:text-lg">{profile.stars}</span>
          </div>

          {/* Streak */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black transition-colors ${
            profile.currentStreak > 0 ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
          }`}>
            <Flame className={`w-4 h-4 ${profile.currentStreak > 0 ? 'text-yellow-200 animate-bounce' : 'text-slate-400'}`} />
            <span>{profile.currentStreak}</span>
          </div>
        </div>

        {/* Right: Navigation Tabs & Controls */}
        <div className="flex items-center gap-2">
          {/* Game Tab */}
          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-sm transition-all sm:text-base ${
              activeTab === 'game'
                ? 'bg-sky-500 text-white shadow-md border-2 border-sky-400 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Play</span>
          </button>

          {/* Progress Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-sm transition-all sm:text-base ${
              activeTab === 'dashboard'
                ? 'bg-purple-500 text-white shadow-md border-2 border-purple-400 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Mastery</span>
          </button>

          {/* Badges Tab */}
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-sm transition-all sm:text-base relative ${
              activeTab === 'badges'
                ? 'bg-emerald-500 text-white shadow-md border-2 border-emerald-400 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Badges</span>
            {profile.unlockedBadges.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center">
                {profile.unlockedBadges.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`p-2.5 rounded-xl border-2 transition-transform active:scale-90 ${
              settings.soundEffects || settings.voiceFeedback
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title="Toggle Sound & Voice"
          >
            {settings.soundEffects || settings.voiceFeedback ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Parent Portal Button */}
          <button
            onClick={onOpenParentPortal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs sm:text-sm border-2 border-slate-700 shadow-sm transition-transform active:scale-95"
            title="Parent & Teacher Portal"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Parents</span>
          </button>
        </div>
      </div>
    </header>
  );
};
