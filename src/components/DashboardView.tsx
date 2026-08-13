import React from 'react';
import { Trophy, Star, Target, CheckCircle2, XCircle, Clock, Flame, Award, Zap } from 'lucide-react';
import { StudentProfile } from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ profile }) => {
  const accuracy = profile.totalSolved > 0
    ? Math.round((profile.totalCorrect / profile.totalSolved) * 100)
    : 0;

  // XP Progress calculation
  const currentLevelMinXp = (profile.level - 1) * 50;
  const currentLevelXp = profile.xp - currentLevelMinXp;
  const xpProgressPercent = Math.min(100, Math.max(0, (currentLevelXp / 50) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level & XP Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-5 border-4 border-indigo-400 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-200">Current Level</span>
            <Trophy className="w-6 h-6 text-amber-300" />
          </div>
          <div className="my-3">
            <div className="text-4xl font-black">Level {profile.level}</div>
            <div className="text-xs font-bold text-indigo-200 mt-1">
              {currentLevelXp} / 50 XP to Level {profile.level + 1}
            </div>
          </div>
          {/* XP Progress Bar */}
          <div className="w-full h-3 bg-indigo-900/40 rounded-full overflow-hidden border border-indigo-400">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Stars Collected Card */}
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 rounded-3xl p-5 border-4 border-amber-300 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-amber-900">Total Stars</span>
            <Star className="w-6 h-6 text-amber-900 fill-amber-900" />
          </div>
          <div className="my-2">
            <div className="text-5xl font-black">{profile.stars}</div>
            <div className="text-xs font-bold text-amber-900 mt-1">Shiny Stars Earned</div>
          </div>
          <div className="text-xs font-bold bg-amber-600/20 px-3 py-1 rounded-full w-fit">
            Superstar Learner
          </div>
        </div>

        {/* Accuracy Gauge Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-5 border-4 border-emerald-400 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">Overall Accuracy</span>
            <Target className="w-6 h-6 text-emerald-200" />
          </div>
          <div className="my-2">
            <div className="text-5xl font-black">{accuracy}%</div>
            <div className="text-xs font-bold text-emerald-100 mt-1">
              {profile.totalCorrect} correct out of {profile.totalSolved}
            </div>
          </div>
          <div className="text-xs font-bold bg-emerald-900/30 px-3 py-1 rounded-full w-fit">
            {accuracy >= 80 ? '🌟 Mastery Pace' : accuracy >= 50 ? '👍 Good Progress' : '💪 Building Skills'}
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-3xl p-5 border-4 border-orange-400 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-orange-200">Best Streak</span>
            <Flame className="w-6 h-6 text-amber-200" />
          </div>
          <div className="my-2">
            <div className="text-5xl font-black">{profile.bestStreak}</div>
            <div className="text-xs font-bold text-orange-200 mt-1">In-a-Row High Score</div>
          </div>
          <div className="text-xs font-bold bg-orange-900/30 px-3 py-1 rounded-full w-fit">
            Current: {profile.currentStreak} streak
          </div>
        </div>
      </div>

      {/* Fact Families Single Digit Mastery Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
              <Zap className="w-7 h-7 text-amber-500" />
              Addition Fact Family Mastery
            </h2>
            <p className="text-slate-500 text-sm font-bold mt-1">
              Track mastery levels for single digits 0 through 9
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-extrabold">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              🟢 Mastered (85%+)
            </span>
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              🟡 Learning
            </span>
            <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              🔴 Practice Needed
            </span>
          </div>
        </div>

        {/* Fact Family Cards Grid (0 through 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, digit) => {
            const stats = profile.factFamilies[digit] || { attempted: 0, correct: 0, totalTimeMs: 0 };
            const factAccuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
            
            let statusBadge = {
              label: 'Practice Needed',
              color: 'bg-rose-100 text-rose-700 border-rose-300',
              dot: 'bg-rose-500'
            };

            if (stats.attempted >= 5 && factAccuracy >= 85) {
              statusBadge = {
                label: 'Mastered 🌟',
                color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                dot: 'bg-emerald-500'
              };
            } else if (stats.attempted > 0) {
              statusBadge = {
                label: 'Learning 📈',
                color: 'bg-amber-100 text-amber-800 border-amber-300',
                dot: 'bg-amber-500'
              };
            }

            return (
              <div
                key={digit}
                className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-black text-slate-800">+{digit}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <div className="my-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1">
                    <span>Accuracy</span>
                    <span>{stats.attempted > 0 ? `${factAccuracy}%` : 'Unplayed'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        factAccuracy >= 85 ? 'bg-emerald-500' : factAccuracy >= 60 ? 'bg-amber-500' : 'bg-rose-400'
                      }`}
                      style={{ width: `${stats.attempted > 0 ? factAccuracy : 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between mt-1">
                  <span>Solved: {stats.correct}/{stats.attempted}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-sky-500" />
          Recent Activity
        </h3>

        {profile.history.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-bold">
            No questions solved yet! Head over to the Play tab to earn your first stars!
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100 max-h-80 overflow-y-auto pr-2">
            {profile.history.slice(0, 15).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm sm:text-base">
                <div className="flex items-center gap-3">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                  )}
                  <span className="font-black text-slate-800">
                    {item.num1} + {item.num2} = {item.correctAnswer}
                  </span>
                  {!item.isCorrect && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Answered: {item.userAnswer}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <span>{(item.timeMs / 1000).toFixed(1)}s</span>
                  <span className="text-slate-300">•</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
