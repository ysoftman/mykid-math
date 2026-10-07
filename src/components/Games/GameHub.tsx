import type React from 'react';
import { useCallback, useState } from 'react';
import { sound } from '../../utils/audio';
import { TOPICS } from '../../utils/problemGenerators';
import { getStats, type RewardResult } from '../../utils/storage';
import { BossBattle } from './BossBattle';
import { FamilyDuel } from './FamilyDuel';
import { TimeAttack } from './TimeAttack';

type GameId = 'time' | 'boss' | 'duel';

const GAMES: { id: GameId; icon: string; title: string; description: string; color: string }[] = [
  {
    id: 'time',
    icon: '⏱️',
    title: '60초 타임어택',
    description: '60초 안에 최대한 많이! 맞힐 때마다 ⭐ 1개',
    color: 'from-rose-500 to-orange-500',
  },
  {
    id: 'boss',
    icon: '⚔️',
    title: '단원 보스전',
    description: '어려운 문제로 보스를 물리치고 👑 왕관을!',
    color: 'from-violet-600 to-indigo-600',
  },
  {
    id: 'duel',
    icon: '👨‍👩‍👧',
    title: '가족 대결',
    description: '번갈아 풀며 누가 더 많이 맞히나 겨뤄요',
    color: 'from-sky-500 to-pink-500',
  },
];

interface GameHubProps {
  onReward: (r: RewardResult) => void;
  onStatsChanged: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onReward, onStatsChanged }) => {
  const [game, setGame] = useState<GameId | null>(null);
  const [stats, setStats] = useState(getStats);

  const handleReward = useCallback(
    (r: RewardResult) => {
      setStats(getStats());
      onReward(r);
      onStatsChanged();
    },
    [onReward, onStatsChanged],
  );

  if (game) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setGame(null);
          }}
          className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-200 transition-colors"
        >
          ⬅️ 게임 목록으로
        </button>
        {game === 'time' && <TimeAttack best={stats.timeAttackBest} onReward={handleReward} />}
        {game === 'boss' && <BossBattle bossCleared={stats.bossCleared} onReward={handleReward} />}
        {game === 'duel' && <FamilyDuel />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">🎮 수학 게임</h2>
        <p className="text-sm text-slate-600">재미있게 놀면서 실력을 키워요!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              sound.playPop();
              setGame(g.id);
            }}
            className={`bg-gradient-to-br ${g.color} rounded-2xl p-5 text-left text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all`}
          >
            <div className="text-5xl">{g.icon}</div>
            <div className="mt-3 text-xl font-black">{g.title}</div>
            <div className="mt-1 text-sm text-white/90">{g.description}</div>
            {g.id === 'time' && (
              <div className="mt-3 inline-block bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                🏆 최고 {stats.timeAttackBest}문제
              </div>
            )}
            {g.id === 'boss' && (
              <div className="mt-3 inline-block bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                👑 {stats.bossCleared.length} / {TOPICS.length} 단원 격파
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
