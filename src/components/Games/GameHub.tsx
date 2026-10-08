import type React from 'react';
import { useCallback, useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { TOPICS } from '../../utils/problemGenerators';
import { getStats, type RewardResult } from '../../utils/storage';
import { GameIcon } from '../GameIcon';
import { BossBattle } from './BossBattle';
import { FriendDuel } from './FriendDuel';
import { TimeAttack } from './TimeAttack';

type GameId = 'time' | 'boss' | 'duel';

const GAMES: { id: GameId; image: string; title: string; description: string; tint: string }[] = [
  {
    id: 'time',
    image: GAME_ASSETS.gameTime,
    title: '60초 타임어택',
    description: '60초 안에 최대한 많이! 맞힐 때마다 ⭐ 1개',
    tint: 'bg-rose-50 border-rose-200 text-rose-900',
  },
  {
    id: 'boss',
    image: GAME_ASSETS.gameBoss,
    title: '단원 보스전',
    description: '어려운 문제로 보스를 물리치고 👑 왕관을!',
    tint: 'bg-violet-50 border-violet-200 text-violet-900',
  },
  {
    id: 'duel',
    image: GAME_ASSETS.resultDuelDraw,
    title: '친구 대결',
    description: '번갈아 풀며 누가 더 많이 맞히나 겨뤄요',
    tint: 'bg-sky-50 border-sky-200 text-sky-900',
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

  const handleStatsChanged = useCallback(() => {
    setStats(getStats());
    onStatsChanged();
  }, [onStatsChanged]);

  if (game) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setGame(null);
          }}
          className="text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-200 transition-colors"
        >
          ⬅️ 게임 목록으로
        </button>
        {game === 'time' && (
          <TimeAttack
            best={stats.timeAttackBest}
            timeCharges={stats.inventory.time_charge ?? 0}
            onReward={handleReward}
            onStatsChanged={handleStatsChanged}
          />
        )}
        {game === 'boss' && (
          <BossBattle
            bossCleared={stats.bossCleared}
            heartRecovers={stats.inventory.heart_recover ?? 0}
            shields={stats.inventory.shield ?? 0}
            onReward={handleReward}
            onStatsChanged={handleStatsChanged}
          />
        )}
        {game === 'duel' && <FriendDuel />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-slate-800">
          <GameIcon name="tabGames" className="h-10 w-10" />
          수학 게임
        </h2>
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
            className={`${g.tint} flex flex-col items-start justify-start rounded-2xl border p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all`}
          >
            <img src={g.image} alt="" className="h-20 w-20 object-contain" draggable={false} />
            <span className="block mt-3 text-xl font-black">{g.title}</span>
            <span className="block mt-1 text-sm text-slate-700">{g.description}</span>
            {g.id === 'time' && (
              <span className="mt-3 inline-block bg-white/80 px-2.5 py-1 rounded-full text-xs font-bold">
                <GameIcon name="iconBest" className="h-4 w-4" /> 최고 {stats.timeAttackBest}문제
              </span>
            )}
            {g.id === 'boss' && (
              <span className="mt-3 inline-block bg-white/80 px-2.5 py-1 rounded-full text-xs font-bold">
                <GameIcon name="iconCrown" className="h-4 w-4" /> {stats.bossCleared.length} /{' '}
                {TOPICS.length} 단원 격파
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
