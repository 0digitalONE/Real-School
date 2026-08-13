import React, { useState } from 'react';
import { Shield, X, Lock, CheckCircle2, Sliders, BarChart2, AlertCircle, RotateCcw, Download, ShieldCheck, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { ParentSettings, StudentProfile, FactFamilyStats } from '../types';
import { playSound } from '../utils/audio';

interface ParentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParentSettings;
  profile: StudentProfile;
  onSaveSettings: (newSettings: ParentSettings) => void;
  onResetProgress: () => void;
}

export const ParentPortalModal: React.FC<ParentPortalModalProps> = ({
  isOpen,
  onClose,
  settings,
  profile,
  onSaveSettings,
  onResetProgress
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [gateError, setGateError] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'analytics' | 'privacy'>('analytics');

  // Math Gate Problem: 8 + 7 = 15
  const gateEquation = { num1: 8, num2: 7, answer: 15 };

  const [formSettings, setFormSettings] = useState<ParentSettings>(settings);

  if (!isOpen) return null;

  const handleGateVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer, 10) === gateEquation.answer || pinInput === settings.parentPin) {
      playSound('correct');
      setIsAuthenticated(true);
      setGateError('');
    } else {
      playSound('wrong');
      setGateError('Incorrect verification answer. Please try again!');
    }
  };

  const handleSettingChange = <K extends keyof ParentSettings>(key: K, value: ParentSettings[K]) => {
    const updated = { ...formSettings, [key]: value };
    setFormSettings(updated);
    onSaveSettings(updated);
  };

  const weakestFacts = Object.entries(profile.factFamilies)
    .map(([digit, rawStats]) => {
      const stats = rawStats as FactFamilyStats;
      return {
        digit: parseInt(digit, 10),
        acc: stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 100,
        attempted: stats.attempted
      };
    })
    .filter(item => item.attempted >= 2 && item.acc < 75)
    .sort((a, b) => a.acc - b.acc);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border-4 border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-slate-800 text-white p-5 flex items-center justify-between border-b-4 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Parent & Teacher Portal</h2>
              <p className="text-xs font-bold text-slate-300">
                Difficulty adjustments, learning analytics & privacy settings
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Math Gate / PIN Guard */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 border-2 border-amber-300">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2">Grown-Ups Verification</h3>
            <p className="text-sm font-bold text-slate-500 mb-6">
              Please solve this math problem or enter PIN to access settings:
            </p>

            <form onSubmit={handleGateVerify} className="w-full flex flex-col gap-4">
              <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 text-xl font-black text-slate-800">
                What is {gateEquation.num1} + {gateEquation.num2}?
              </div>

              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Enter answer (e.g. 15)"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 font-bold text-center text-lg focus:border-emerald-500 focus:outline-none"
                autoFocus
              />

              <div className="text-xs text-slate-400 font-bold">Or enter Parent PIN (default: 1234)</div>

              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Parent PIN"
                className="w-full px-4 py-2 rounded-2xl border-2 border-slate-200 font-bold text-center text-sm focus:border-emerald-500 focus:outline-none"
              />

              {gateError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {gateError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-md transition-transform active:scale-95"
              >
                Verify & Open Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Portal Content */
          <div className="p-6 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Learning Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Difficulty & Gameplay</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Child Safety & Privacy</span>
              </button>
            </div>

            {/* Tab 1: Analytics */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Total Problems Solved</span>
                    <div className="text-3xl font-black text-slate-800 mt-1">{profile.totalSolved}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Overall Accuracy</span>
                    <div className="text-3xl font-black text-emerald-600 mt-1">
                      {profile.totalSolved > 0 ? Math.round((profile.totalCorrect / profile.totalSolved) * 100) : 0}%
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Longest Streak</span>
                    <div className="text-3xl font-black text-amber-500 mt-1">{profile.bestStreak}</div>
                  </div>
                </div>

                {/* Weakest Facts Alert */}
                {weakestFacts.length > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-amber-900 text-sm">Targeted Practice Recommendation</h4>
                      <p className="text-xs font-bold text-amber-800 mt-1">
                        Child needs extra practice with: {weakestFacts.map(f => `+${f.digit} facts (${Math.round(f.acc)}% accuracy)`).join(', ')}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Fact Family Mastery Table */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                  <h4 className="font-black text-slate-800 text-sm mb-3">Single-Digit Fact Family Performance</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, digit) => {
                      const stats = profile.factFamilies[digit] || { attempted: 0, correct: 0, totalTimeMs: 0 };
                      const acc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
                      return (
                        <div key={digit} className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                          <div className="font-black text-lg text-slate-800">+{digit} facts</div>
                          <div className={`text-xs font-extrabold ${acc >= 85 ? 'text-emerald-600' : acc >= 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {stats.attempted > 0 ? `${acc}% accuracy` : '0 attempts'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">({stats.correct}/{stats.attempted})</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Settings */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6">
                {/* Digit Range */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 flex flex-col gap-4">
                  <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-500" />
                    Digit Range & Sum Limits
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-extrabold text-slate-600 block mb-1">Minimum Digit</label>
                      <select
                        value={formSettings.minDigit}
                        onChange={(e) => handleSettingChange('minDigit', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white"
                      >
                        <option value={0}>0 (Includes 0 + X)</option>
                        <option value={1}>1 (Starts at 1)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-600 block mb-1">Maximum Digit</label>
                      <select
                        value={formSettings.maxDigit}
                        onChange={(e) => handleSettingChange('maxDigit', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white"
                      >
                        <option value={5}>5 (Beginner: 0-5)</option>
                        <option value={9}>9 (Full Single Digits: 0-9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-600 block mb-1">Maximum Sum Limit</label>
                      <select
                        value={formSettings.sumLimit}
                        onChange={(e) => handleSettingChange('sumLimit', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white"
                      >
                        <option value={10}>Sums up to 10 (e.g. 5 + 5)</option>
                        <option value={18}>Sums up to 18 (e.g. 9 + 9)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Input Mode */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 flex flex-col gap-4">
                  <h4 className="font-black text-slate-800 text-base">Question Format & Input Mode</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSettingChange('questionMode', 'choice')}
                      className={`p-3 rounded-xl border-2 font-black text-xs text-left transition-all ${
                        formSettings.questionMode === 'choice'
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-sm">Multiple Choice</div>
                      <div className="font-normal text-[11px] opacity-80">4 large candidate buttons</div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('questionMode', 'keypad')}
                      className={`p-3 rounded-xl border-2 font-black text-xs text-left transition-all ${
                        formSettings.questionMode === 'keypad'
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-sm">On-Screen Keypad</div>
                      <div className="font-normal text-[11px] opacity-80">0-9 touch pad</div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('questionMode', 'visual')}
                      className={`p-3 rounded-xl border-2 font-black text-xs text-left transition-all ${
                        formSettings.questionMode === 'visual'
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-sm">Visual Counting</div>
                      <div className="font-normal text-[11px] opacity-80">Tap & count grid</div>
                    </button>
                  </div>
                </div>

                {/* Voice & Sound Controls */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 flex flex-col gap-4">
                  <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-amber-500" />
                    Voice Feedback & Audio Settings
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-extrabold text-xs text-slate-800">Spoken Feedback (Speech Synthesis)</span>
                      <input
                        type="checkbox"
                        checked={formSettings.voiceFeedback}
                        onChange={(e) => handleSettingChange('voiceFeedback', e.target.checked)}
                        className="w-5 h-5 accent-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-extrabold text-xs text-slate-800">Auto-Read Questions Out Loud</span>
                      <input
                        type="checkbox"
                        checked={formSettings.autoSpeak}
                        onChange={(e) => handleSettingChange('autoSpeak', e.target.checked)}
                        className="w-5 h-5 accent-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-extrabold text-xs text-slate-800">Sound Effects & Fanfare</span>
                      <input
                        type="checkbox"
                        checked={formSettings.soundEffects}
                        onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                        className="w-5 h-5 accent-emerald-500"
                      />
                    </label>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                        <span>Speech Speed</span>
                        <span>{formSettings.voiceRate}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.1"
                        value={formSettings.voiceRate}
                        onChange={(e) => handleSettingChange('voiceRate', parseFloat(e.target.value))}
                        className="accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Progress */}
                <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-rose-900 text-sm">Reset Student Progress</h5>
                    <p className="text-xs font-bold text-rose-700">Clears stars, level XP, and history</p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all student progress? This cannot be undone.')) {
                        onResetProgress();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Data
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Privacy & Regulations */}
            {activeTab === 'privacy' && (
              <div className="flex flex-col gap-4">
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-black text-emerald-900">
                      100% Child Privacy & Safety Regulation Compliance
                    </h3>
                    <p className="text-xs font-bold text-emerald-800 mt-1 leading-relaxed">
                      Math Stars is built with maximum child safety standards in compliance with COPPA (Children's Online Privacy Protection Act) and FERPA regulations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-sm font-black text-slate-900 block mb-1">🔒 Local Data Storage Only</span>
                    All math practice progress, stars, and level achievements stay 100% on this browser. Zero personal identifiable information is collected or transmitted.
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-sm font-black text-slate-900 block mb-1">🚫 Zero Ads or Microtransactions</span>
                    Math Stars contains absolutely no external advertisements, third-party tracking scripts, or paid add-ons.
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-sm font-black text-slate-900 block mb-1">⚡ 100% Offline Compatible</span>
                    Works completely without an active internet connection using standard client-side synthesis.
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-sm font-black text-slate-900 block mb-1">🛡️ Protected Parent Settings</span>
                    Grown-up configuration panels are guarded behind math verification gates.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
