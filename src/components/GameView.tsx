import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RefreshCw, CheckCircle2, Sparkles, ArrowRight, HelpCircle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedProblem, generateProblem, processAnswerResult } from '../utils/gameLogic';
import { ParentSettings, StudentProfile } from '../types';
import { speakText, playSound } from '../utils/audio';
import { AVATARS } from '../data/badgesAndAvatars';

interface GameViewProps {
  settings: ParentSettings;
  profile: StudentProfile;
  onUpdateProfile: (newProfile: StudentProfile, newlyUnlockedBadges: string[]) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  settings,
  profile,
  onUpdateProfile
}) => {
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    show: boolean;
  } | null>(null);
  const [countedDots, setCountedDots] = useState<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load avatar object
  const currentAvatar = AVATARS.find(a => a.id === profile.avatarId) || AVATARS[0];

  // Initialize or load next problem
  const loadNextProblem = (prevNum1?: number, prevNum2?: number) => {
    const nextProb = generateProblem(settings, profile, prevNum1, prevNum2);
    setProblem(nextProb);
    setSelectedAnswer(null);
    setKeypadInput('');
    setFeedback(null);
    setCountedDots([]);
    setIsSubmitting(false);
    startTimeRef.current = Date.now();

    if (settings.autoSpeak && settings.voiceFeedback) {
      speakText(
        `What is ${nextProb.num1} plus ${nextProb.num2}?`,
        settings.voiceFeedback,
        settings.voiceRate
      );
    }
  };

  useEffect(() => {
    loadNextProblem();
  }, [settings.minDigit, settings.maxDigit, settings.sumLimit]);

  const handleSpeakQuestion = () => {
    if (!problem) return;
    playSound('pop');
    speakText(
      `What is ${problem.num1} plus ${problem.num2}?`,
      true,
      settings.voiceRate
    );
  };

  const handleDotClick = (index: number) => {
    playSound('pop');
    if (countedDots.includes(index)) {
      setCountedDots(countedDots.filter(i => i !== index));
    } else {
      setCountedDots([...countedDots, index]);
      if (settings.voiceFeedback) {
        speakText(`${countedDots.length + 1}`, true, 1.2);
      }
    }
  };

  const submitAnswer = (chosen: number) => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setSelectedAnswer(chosen);

    const timeTaken = Date.now() - startTimeRef.current;
    const { updatedProfile, isCorrect, starsEarned, newBadges } = processAnswerResult(
      profile,
      problem.num1,
      problem.num2,
      chosen,
      timeTaken
    );

    if (isCorrect) {
      playSound('correct');
      playSound('star');

      // Trigger Confetti Pop
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });

      const encouragingPhrase = [
        `Super job! ${problem.num1} plus ${problem.num2} equals ${problem.answer}!`,
        `Awesome! You got it right!`,
        `Brilliant! ${chosen} is correct!`,
        `You're a math superstar! ${problem.num1} + ${problem.num2} = ${problem.answer}`
      ][Math.floor(Math.random() * 4)];

      setFeedback({
        isCorrect: true,
        message: `+${starsEarned} Star${starsEarned > 1 ? 's' : ''}! Great job!`,
        show: true
      });

      speakText(encouragingPhrase, settings.voiceFeedback, settings.voiceRate);

      onUpdateProfile(updatedProfile, newBadges);

      // Auto advance to next question after 2 seconds
      setTimeout(() => {
        loadNextProblem(problem.num1, problem.num2);
      }, 2000);

    } else {
      playSound('wrong');

      const tryAgainPhrase = [
        `Nice try! ${problem.num1} plus ${problem.num2} is ${problem.answer}. Let's try another!`,
        `Almost! Remember, ${problem.num1} + ${problem.num2} = ${problem.answer}. You can do it!`,
        `Good effort! Let's count together to see why it's ${problem.answer}.`
      ][Math.floor(Math.random() * 3)];

      setFeedback({
        isCorrect: false,
        message: `The correct answer is ${problem.answer}. Keep going!`,
        show: true
      });

      speakText(tryAgainPhrase, settings.voiceFeedback, settings.voiceRate);

      onUpdateProfile(updatedProfile, []);

      // Advance after slightly longer so child can review answer
      setTimeout(() => {
        loadNextProblem(problem.num1, problem.num2);
      }, 2600);
    }
  };

  if (!problem) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* Top Banner Card: Question Display & Voice Helper */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-xl flex flex-col items-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot Greeting */}
        <div className="flex items-center gap-3 mb-4 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
          <span className="text-3xl">{currentAvatar.emoji}</span>
          <span className="font-extrabold text-slate-700 text-sm sm:text-base">
            {feedback?.show
              ? feedback.isCorrect
                ? 'Woohoo! Perfect!'
                : 'Keep going, superstar!'
              : `Let's solve together!`}
          </span>
          <button
            onClick={handleSpeakQuestion}
            className="ml-2 p-2 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm transition-transform active:scale-90"
            title="Listen to question"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* The Math Equation */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 my-2 text-slate-800 select-none">
          <div className="text-6xl sm:text-8xl font-black bg-sky-100 text-sky-700 px-5 py-3 rounded-2xl border-4 border-sky-300 shadow-inner">
            {problem.num1}
          </div>
          <div className="text-5xl sm:text-7xl font-black text-amber-500">+</div>
          <div className="text-6xl sm:text-8xl font-black bg-pink-100 text-pink-700 px-5 py-3 rounded-2xl border-4 border-pink-300 shadow-inner">
            {problem.num2}
          </div>
          <div className="text-5xl sm:text-7xl font-black text-amber-500">=</div>
          <div className="text-6xl sm:text-8xl font-black bg-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl border-4 border-emerald-300 min-w-[100px] text-center shadow-inner">
            {selectedAnswer !== null
              ? selectedAnswer
              : settings.questionMode === 'keypad'
              ? keypadInput || '?'
              : '?'}
          </div>
        </div>

        {/* Interactive Visual Objects Counter */}
        <div className="mt-6 w-full bg-amber-50/80 rounded-2xl p-4 border-2 border-amber-200 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs sm:text-sm font-black text-amber-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Tap items to count out loud:
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
              Counted: {countedDots.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            {/* Num1 items */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white rounded-xl border border-sky-200">
              {Array.from({ length: problem.num1 }).map((_, idx) => {
                const dotId = idx;
                const isSelected = countedDots.includes(dotId);
                return (
                  <button
                    key={`num1_${idx}`}
                    onClick={() => handleDotClick(dotId)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-2xl sm:text-3xl rounded-xl flex items-center justify-center transition-all transform active:scale-90 ${
                      isSelected
                        ? 'bg-amber-300 ring-4 ring-amber-400 scale-110 shadow-md'
                        : 'bg-sky-50 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    {problem.objectIcon}
                  </button>
                );
              })}
            </div>

            <span className="font-black text-2xl text-amber-600">+</span>

            {/* Num2 items */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white rounded-xl border border-pink-200">
              {Array.from({ length: problem.num2 }).map((_, idx) => {
                const dotId = problem.num1 + idx;
                const isSelected = countedDots.includes(dotId);
                return (
                  <button
                    key={`num2_${idx}`}
                    onClick={() => handleDotClick(dotId)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-2xl sm:text-3xl rounded-xl flex items-center justify-center transition-all transform active:scale-90 ${
                      isSelected
                        ? 'bg-amber-300 ring-4 ring-amber-400 scale-110 shadow-md'
                        : 'bg-pink-50 hover:bg-pink-100 border border-pink-200'
                    }`}
                  >
                    {problem.objectIcon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Answer Submission Section based on questionMode */}
      <div className="w-full">
        {/* Multiple Choice Mode */}
        {settings.questionMode === 'choice' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {problem.options.map((opt, idx) => {
              const bgColors = [
                'bg-sky-500 hover:bg-sky-600 border-sky-600 text-white',
                'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white',
                'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white',
                'bg-purple-500 hover:bg-purple-600 border-purple-600 text-white'
              ];
              const colorClass = bgColors[idx % bgColors.length];
              const isSelected = selectedAnswer === opt;

              return (
                <button
                  key={opt}
                  disabled={isSubmitting}
                  onClick={() => submitAnswer(opt)}
                  className={`h-24 sm:h-32 text-5xl sm:text-6xl font-black rounded-3xl border-b-8 shadow-lg flex items-center justify-center transition-all transform active:scale-95 ${colorClass} ${
                    isSelected ? 'ring-8 ring-amber-400 scale-105' : ''
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Keypad Mode */}
        {settings.questionMode === 'keypad' && (
          <div className="w-full max-w-sm mx-auto bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-lg">
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  disabled={isSubmitting}
                  onClick={() => {
                    playSound('pop');
                    if (keypadInput.length < 2) {
                      setKeypadInput(prev => prev + num);
                    }
                  }}
                  className={`h-16 text-3xl font-black bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl border-b-4 border-slate-300 shadow-xs flex items-center justify-center transition-transform active:scale-90 ${
                    num === 0 ? 'col-span-1' : ''
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                disabled={isSubmitting}
                onClick={() => {
                  playSound('pop');
                  setKeypadInput('');
                }}
                className="h-16 text-lg font-extrabold bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl border-b-4 border-rose-300 flex items-center justify-center col-span-2"
              >
                Clear
              </button>
            </div>

            <button
              disabled={isSubmitting || keypadInput === ''}
              onClick={() => submitAnswer(parseInt(keypadInput, 10))}
              className={`w-full py-4 text-2xl font-black rounded-2xl border-b-4 shadow-md transition-all flex items-center justify-center gap-2 ${
                keypadInput !== ''
                  ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
              Submit Answer
            </button>
          </div>
        )}

        {/* Visual Drag / Select Mode */}
        {settings.questionMode === 'visual' && (
          <div className="w-full bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-lg flex flex-col items-center gap-4">
            <p className="text-sm font-extrabold text-slate-600">Select the total count:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: 19 }).map((_, val) => (
                <button
                  key={val}
                  disabled={isSubmitting}
                  onClick={() => submitAnswer(val)}
                  className={`w-14 h-14 text-2xl font-black rounded-2xl border-b-4 shadow-sm flex items-center justify-center transition-transform active:scale-90 ${
                    val === problem.answer
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Banner Modal / Overlay */}
      {feedback && feedback.show && (
        <div className={`w-full p-6 rounded-3xl border-4 shadow-xl flex items-center justify-between gap-4 animate-bounce ${
          feedback.isCorrect
            ? 'bg-emerald-500 text-white border-emerald-300'
            : 'bg-rose-500 text-white border-rose-300'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              {feedback.isCorrect ? '🎉' : '💡'}
            </div>
            <div>
              <h3 className="font-black text-2xl leading-none">
                {feedback.isCorrect ? 'Correct!' : 'Nice Try!'}
              </h3>
              <p className="font-extrabold text-white/90 text-sm sm:text-base mt-1">
                {feedback.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => loadNextProblem(problem.num1, problem.num2)}
            className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-base shadow-md flex items-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 shrink-0"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
