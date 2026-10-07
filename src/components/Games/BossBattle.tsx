import confetti from 'canvas-confetti';
import type React from 'react';
import { useState } from 'react';
import type { Problem, TopicId } from '../../types/math';
import { formatAnswer } from '../../utils/answer';
import { sound } from '../../utils/audio';
import { generateProblem, TOPICS } from '../../utils/problemGenerators';
import { BOSS_CLEAR_STARS, type RewardResult, recordBossClear } from '../../utils/storage';
import { GameProblem } from './GameProblem';

const BOSS_HP = 5;
const MAX_HEARTS = 3;

const BOSSES: Record<TopicId, { icon: string; name: string }> = {
  factors: { icon: '🐉', name: '약수 드래곤' },
  fractions: { icon: '👹', name: '분수 도깨비' },
  decimals: { icon: '🧟', name: '소수점 좀비' },
  geometry: { icon: '🤖', name: '도형 로봇' },
  ratios: { icon: '🦖', name: '비율 공룡' },
};

interface BossBattleProps {
  bossCleared: TopicId[];
  onReward: (r: RewardResult) => void;
}

type Phase = 'select' | 'battle' | 'win' | 'lose';

export const BossBattle: React.FC<BossBattleProps> = ({ bossCleared, onReward }) => {
  const [phase, setPhase] = useState<Phase>('select');
  const [topicId, setTopicId] = useState<TopicId>('factors');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [hits, setHits] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [missed, setMissed] = useState<Problem | null>(null);
  const [lastHit, setLastHit] = useState(false);

  const boss = BOSSES[topicId];

  const startBattle = (id: TopicId) => {
    sound.playPop();
    setTopicId(id);
    setProblem(generateProblem(id, 'hard'));
    setHits(0);
    setHearts(MAX_HEARTS);
    setMissed(null);
    setLastHit(false);
    setPhase('battle');
  };

  const handleAnswered = (correct: boolean) => {
    if (!problem) return;
    if (correct) {
      sound.playCorrect();
      const nextHits = hits + 1;
      setHits(nextHits);
      setLastHit(true);
      if (nextHits >= BOSS_HP) {
        const r = recordBossClear(topicId);
        onReward(r);
        sound.playFanfare();
        confetti({ particleCount: 250, spread: 120, origin: { y: 0.6 } });
        setPhase('win');
        return;
      }
      setProblem(generateProblem(topicId, 'hard'));
      return;
    }
    sound.playWrong();
    setHearts(hearts - 1);
    setLastHit(false);
    setMissed(problem);
    if (hearts - 1 <= 0) setPhase('lose');
  };

  const nextAfterMiss = () => {
    sound.playPop();
    setMissed(null);
    setProblem(generateProblem(topicId, 'hard'));
  };

  const missedPanel = missed && (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-left">
      <div className="font-extrabold text-rose-900">
        💔 앗, 보스의 반격! 정답은 <strong>{formatAnswer(missed)}</strong>
      </div>
      {missed.explanations[0] && (
        <div className="bg-white p-3 rounded-xl border border-rose-100 text-xs sm:text-sm space-y-1">
          <div className="font-bold text-indigo-700">{missed.explanations[0].title}</div>
          <div className="text-slate-700 leading-relaxed">{missed.explanations[0].content}</div>
        </div>
      )}
    </div>
  );

  if (phase === 'select') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black text-slate-800">⚔️ 단원 보스전</h3>
          <p className="text-sm text-slate-600">
            어려운(상) 문제 {BOSS_HP}개를 맞혀 보스를 물리치세요! 하트는 {MAX_HEARTS}개예요.
            <br />
            승리하면 ⭐ {BOSS_CLEAR_STARS}개!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((t) => {
            const cleared = bossCleared.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => startBattle(t.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:shadow-md active:scale-95 ${
                  cleared ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-4xl">{BOSSES[t.id].icon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-extrabold text-slate-800">{BOSSES[t.id].name}</span>
                  <span className="block text-xs text-slate-500 truncate">
                    {t.icon} {t.title}
                  </span>
                </span>
                {cleared && <span className="text-2xl">👑</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'win') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="text-6xl">👑</div>
        <h3 className="text-2xl font-black text-slate-800">{boss.name} 격파!</h3>
        <p className="text-sm text-slate-600">
          어려운 문제 {BOSS_HP}개를 모두 맞혀 보스를 물리쳤어요!
        </p>
        <p className="text-lg font-bold text-amber-600">+{BOSS_CLEAR_STARS} ⭐ 획득!</p>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setPhase('select');
          }}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          다른 보스 도전하기
        </button>
      </div>
    );
  }

  if (phase === 'lose') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="text-6xl">{boss.icon}</div>
        <h3 className="text-2xl font-black text-slate-800">아쉽게 졌어요...</h3>
        <p className="text-sm text-slate-600">
          보스 체력을 {hits}/{BOSS_HP} 깎았어요. 풀이를 보고 다시 도전해 봐요!
        </p>
        {missedPanel}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => startBattle(topicId)}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            다시 도전 🔥
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setPhase('select');
            }}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
          >
            보스 고르기
          </button>
        </div>
      </div>
    );
  }

  const hpPercent = ((BOSS_HP - hits) / BOSS_HP) * 100;
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-5">
      <div className="bg-gradient-to-br from-slate-800 to-violet-900 rounded-2xl p-4 text-white space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold">{boss.name}</span>
          <span className="text-lg" aria-label={`남은 하트 ${hearts}개`}>
            {'❤️'.repeat(hearts)}
            {'🤍'.repeat(MAX_HEARTS - hearts)}
          </span>
        </div>
        <div className="text-center">
          <span
            key={hits}
            className={`inline-block text-6xl sm:text-7xl ${lastHit ? 'animate-bounce' : ''}`}
          >
            {boss.icon}
          </span>
          {lastHit && !missed && (
            <div className="text-sm font-bold text-amber-300">💥 공격 성공!</div>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span>보스 HP</span>
            <span>
              {BOSS_HP - hits} / {BOSS_HP}
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {missed ? (
        <div className="space-y-3">
          {missedPanel}
          <button
            type="button"
            onClick={nextAfterMiss}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            다음 문제로 공격! ➡️
          </button>
        </div>
      ) : (
        problem && <GameProblem key={problem.id} problem={problem} onAnswered={handleAnswered} />
      )}
    </div>
  );
};
