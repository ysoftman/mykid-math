import type React from 'react';
import { useState } from 'react';
import type { Difficulty, Problem, TopicId } from '../../types/math';
import { formatAnswer } from '../../utils/answer';
import { sound } from '../../utils/audio';
import confetti from '../../utils/confetti';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { generateProblem, TOPICS } from '../../utils/problemGenerators';
import { KID_NAME } from '../../utils/profile';
import { GameIcon } from '../GameIcon';
import { MathText } from '../MathText';
import { GameProblem } from './GameProblem';

const TURNS_PER_PLAYER = 5;
const TOTAL_TURNS = TURNS_PER_PLAYER * 2;
const PLAYER_STYLES = [
  'bg-sky-50 border-sky-300 text-sky-800',
  'bg-pink-50 border-pink-300 text-pink-800',
];
const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: '하', medium: '중', hard: '상' };

type Phase = 'setup' | 'play' | 'done';
type TurnResult = { correct: boolean; answer: string };

export const FamilyDuel: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [names, setNames] = useState<[string, string]>([KID_NAME, '엄마']);
  const [topicId, setTopicId] = useState<TopicId>('fractions');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);

  const player = turn % 2;
  const displayName = (i: number) => names[i].trim() || `플레이어 ${i + 1}`;

  const start = () => {
    sound.playPop();
    setTurn(0);
    setScores([0, 0]);
    setTurnResult(null);
    setProblem(generateProblem(topicId, difficulty));
    setPhase('play');
  };

  const handleAnswered = (correct: boolean) => {
    if (!problem) return;
    if (correct) {
      sound.playCorrect();
      setScores((s) => (player === 0 ? [s[0] + 1, s[1]] : [s[0], s[1] + 1]));
    } else {
      sound.playWrong();
    }
    setTurnResult({ correct, answer: formatAnswer(problem) });
  };

  const nextTurn = () => {
    sound.playPop();
    setTurnResult(null);
    if (turn + 1 >= TOTAL_TURNS) {
      setPhase('done');
      sound.playFanfare();
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      return;
    }
    setTurn(turn + 1);
    setProblem(generateProblem(topicId, difficulty));
  };

  const scoreBoard = (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`rounded-2xl border-2 p-3 text-center transition-all ${PLAYER_STYLES[i]} ${
            phase === 'play' && player === i ? 'ring-4 ring-amber-300 scale-105' : 'opacity-80'
          }`}
        >
          <div className="text-sm font-bold truncate">{displayName(i)}</div>
          <div className="text-3xl font-black">{scores[i]}</div>
        </div>
      ))}
    </div>
  );

  if (phase === 'setup') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-5">
        <div className="text-center space-y-1">
          <img
            src={GAME_ASSETS.gameDuel}
            alt=""
            className="mx-auto h-20 w-20 object-contain"
            draggable={false}
          />
          <h3 className="text-2xl font-black text-slate-800">가족 대결</h3>
          <p className="text-sm text-slate-600">
            번갈아 가며 {TURNS_PER_PLAYER}문제씩 풀어요. 더 많이 맞힌 사람이 승리!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <label key={i} className="block space-y-1">
              <span className="text-xs font-bold text-slate-600">플레이어 {i + 1} 이름</span>
              <input
                type="text"
                value={names[i]}
                maxLength={10}
                onChange={(e) =>
                  setNames((n) => (i === 0 ? [e.target.value, n[1]] : [n[0], e.target.value]))
                }
                className={`w-full px-4 py-2 font-bold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${PLAYER_STYLES[i]}`}
              />
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600">단원</div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  sound.playPop();
                  setTopicId(t.id);
                }}
                aria-pressed={topicId === t.id}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                  topicId === t.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <img src={t.image} alt="" className="h-6 w-6 object-contain" draggable={false} />
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600">난이도</div>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  sound.playPop();
                  setDifficulty(d);
                }}
                aria-pressed={difficulty === d}
                className={`min-w-14 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                  difficulty === d
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={start}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-sm active:scale-95 transition-all"
        >
          대결 시작! ⚔️
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1;
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-5">
        <GameIcon
          name={winner === null ? 'resultDuelDraw' : 'resultDuelWin'}
          className="h-28 w-28"
        />
        <h3 className="text-2xl font-black text-slate-800">
          {winner === null ? '무승부! 둘 다 최고예요!' : `${displayName(winner)} 승리!`}
        </h3>
        {scoreBoard}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setPhase('setup');
          }}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-sm active:scale-95 transition-all"
        >
          한 판 더! 🔄
        </button>
      </div>
    );
  }

  const nextPlayer = (turn + 1) % 2;
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-5">
      {scoreBoard}
      <div className="text-center space-y-1">
        <div className="text-xs font-bold text-slate-500">
          {turn + 1} / {TOTAL_TURNS} 턴
        </div>
        <div className={`inline-block px-5 py-2 rounded-full border-2 ${PLAYER_STYLES[player]}`}>
          <span className="text-2xl sm:text-3xl font-black">{displayName(player)} 차례!</span>
        </div>
      </div>

      {problem && (
        <GameProblem
          key={problem.id}
          problem={problem}
          onAnswered={handleAnswered}
          disabled={turnResult !== null}
        />
      )}

      {turnResult && (
        <div
          className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 ${
            turnResult.correct
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <div className="font-extrabold">
            {turnResult.correct ? (
              '🎉 정답! +1점'
            ) : (
              <MathText text={`💡 아쉬워요! 정답은 ${turnResult.answer}`} />
            )}
          </div>
          <button
            type="button"
            onClick={nextTurn}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all"
          >
            {turn + 1 >= TOTAL_TURNS ? '결과 보기 🏁' : `${displayName(nextPlayer)} 차례로 ➡️`}
          </button>
        </div>
      )}
    </div>
  );
};
