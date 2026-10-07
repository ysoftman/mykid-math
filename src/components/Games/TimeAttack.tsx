import confetti from 'canvas-confetti';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { Difficulty, Problem } from '../../types/math';
import { formatAnswer } from '../../utils/answer';
import { sound } from '../../utils/audio';
import { generateProblem, TOPICS } from '../../utils/problemGenerators';
import { type RewardResult, recordTimeAttack } from '../../utils/storage';
import { GameProblem } from './GameProblem';

const DURATION = 60;

function randomProblem(): Problem {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const difficulty: Difficulty = Math.random() < 0.5 ? 'easy' : 'medium';
  return generateProblem(topic.id, difficulty);
}

interface TimeAttackProps {
  best: number;
  onReward: (r: RewardResult) => void;
}

type Phase = 'ready' | 'playing' | 'done';
type Feedback = { correct: boolean; answer: string };

export const TimeAttack: React.FC<TimeAttackProps> = ({ best, onReward }) => {
  const [phase, setPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [problem, setProblem] = useState<Problem>(randomProblem);
  const [correctCount, setCorrectCount] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<(RewardResult & { isNewBest: boolean }) | null>(null);

  useEffect(() => {
    if (phase !== 'playing') return;
    const endAt = Date.now() + DURATION * 1000;
    const id = window.setInterval(() => {
      setTimeLeft(Math.max(0, (endAt - Date.now()) / 1000));
    }, 100);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0) return;
    setPhase('done');
    const r = recordTimeAttack(correctCount);
    setResult(r);
    onReward(r);
    if (r.isNewBest && correctCount > 0) {
      sound.playFanfare();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  }, [phase, timeLeft, correctCount, onReward]);

  const start = () => {
    sound.playPop();
    setProblem(randomProblem());
    setCorrectCount(0);
    setSolvedCount(0);
    setFeedback(null);
    setResult(null);
    setTimeLeft(DURATION);
    setPhase('playing');
  };

  const handleAnswered = (correct: boolean) => {
    if (correct) {
      sound.playCorrect();
      setCorrectCount((c) => c + 1);
    } else {
      sound.playWrong();
    }
    setSolvedCount((c) => c + 1);
    setFeedback({ correct, answer: formatAnswer(problem) });
    setProblem(randomProblem());
  };

  if (phase === 'ready') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="text-6xl">⏱️</div>
        <h3 className="text-2xl font-black text-slate-800">60초 타임어택</h3>
        <p className="text-sm text-slate-600">
          60초 동안 여러 단원의 문제를 최대한 많이 맞혀 보세요!
          <br />
          맞힌 문제 하나마다 ⭐ 1개를 받아요.
        </p>
        <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 font-bold px-4 py-2 rounded-xl">
          🏆 최고 기록: {best}문제
        </div>
        <div>
          <button
            type="button"
            onClick={start}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-lg rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            시작하기! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="text-6xl">{result?.isNewBest && correctCount > 0 ? '🏆' : '⏰'}</div>
        <h3 className="text-2xl font-black text-slate-800">시간 끝!</h3>
        {result?.isNewBest && correctCount > 0 && (
          <div className="text-xl font-black text-rose-600">🎉 신기록!</div>
        )}
        <p className="text-lg text-slate-700">
          {solvedCount}문제 중 <strong className="text-indigo-600">{correctCount}문제</strong>{' '}
          맞혔어요!
        </p>
        <p className="text-sm text-slate-600">
          받은 별: ⭐ {correctCount + (result?.bonusStars ?? 0)} · 최고 기록:{' '}
          {Math.max(best, correctCount)}문제
        </p>
        <button
          type="button"
          onClick={start}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-lg rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          다시 하기 🔄
        </button>
      </div>
    );
  }

  const percent = (timeLeft / DURATION) * 100;
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className={timeLeft <= 10 ? 'text-rose-600' : 'text-slate-700'}>
            ⏱️ {Math.ceil(timeLeft)}초
          </span>
          <span className="text-indigo-600">✅ {correctCount}문제</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-100 ${
              timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`text-sm font-bold px-3 py-2 rounded-xl ${
            feedback.correct
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.correct ? '⭕ 정답!' : `❌ 아쉬워요! 정답은 ${feedback.answer}`}
        </div>
      )}

      <GameProblem key={problem.id} problem={problem} onAnswered={handleAnswered} compact />
    </div>
  );
};
