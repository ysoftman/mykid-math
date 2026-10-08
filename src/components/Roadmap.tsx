import type React from 'react';
import type { TopicId, UserStats } from '../types/math';
import { sound } from '../utils/audio';
import { GAME_ASSETS } from '../utils/gameAssets';
import { TOPICS } from '../utils/problemGenerators';
import {
  BADGE_DEFINITIONS,
  exportData,
  getAttendanceStreak,
  importData,
  SHOP_ITEMS,
} from '../utils/storage';
import { DailyMission } from './DailyMission';
import { GameIcon } from './GameIcon';
import { CharacterAvatar } from './Shop';

interface RoadmapProps {
  stats: UserStats;
  onSelectTopic: (topicId: TopicId) => void;
  onOpenWrongNotes: () => void;
  onDataImported: () => void;
  onOpenShop: () => void;
  onOpenGames: () => void;
  onStartQuiz: () => void;
}

// [current, goal] per badge, mirroring the unlock conditions in storage.ts
function badgeProgress(id: string, s: UserStats): [number, number] | null {
  switch (id) {
    case 'first_step':
      return [s.totalCorrect, 1];
    case 'factor_pro':
      return [s.topicProgress.factors.correctCount, 5];
    case 'fraction_master':
      return [s.topicProgress.fractions.correctCount, 5];
    case 'decimal_wiz':
      return [s.topicProgress.decimals.correctCount, 5];
    case 'geometry_architect':
      return [s.topicProgress.geometry.correctCount, 5];
    case 'ratio_master':
      return [s.topicProgress.ratios.correctCount, 5];
    case 'star_collector':
      return [s.stars, 20];
    case 'math_hero':
      return [s.level, 5];
    case 'combo_5':
      return [s.bestCombo, 5];
    case 'wrong_conqueror':
      return [s.wrongConquered, 5];
    case 'attendance_7':
      return [getAttendanceStreak(s), 7];
    case 'time_attack_10':
      return [s.timeAttackBest, 10];
    case 'boss_slayer':
      return [s.bossCleared.length, 1];
    default:
      return null;
  }
}

export const Roadmap: React.FC<RoadmapProps> = ({
  stats,
  onSelectTopic,
  onOpenWrongNotes,
  onDataImported,
  onOpenShop,
  onOpenGames,
  onStartQuiz,
}) => {
  const currentLevel = stats.level;
  const currentStars = stats.stars;
  const nextLevelStars = currentLevel * 10;
  const currentLevelBaseStars = (currentLevel - 1) * 10;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStars - currentLevelBaseStars) / 10) * 100),
  );
  const equippedItem = (id?: string) => SHOP_ITEMS.find((item) => item.id === id);
  const bannerGradient =
    equippedItem(stats.equipped.theme)?.gradient ?? 'from-indigo-700 via-indigo-600 to-violet-700';

  const handleExport = () => {
    const url = URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `mykid-math-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !window.confirm('지금 기록을 불러온 파일로 바꿀까요?')) return;
    try {
      importData(await file.text());
      onDataImported();
      alert('기록을 불러왔어요!');
    } catch {
      alert('올바른 기록 파일이 아니에요.');
    }
  };

  return (
    <div className="space-y-6">
      {/* User Progress Banner */}
      <div
        className={`bg-gradient-to-r ${bannerGradient} rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <GameIcon name="iconRocket" /> 초등 5~6학년 수학 마스터 로드맵
            </div>
            <div className="flex items-center gap-3 pt-2">
              <CharacterAvatar stats={stats} size="sm" />
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Lv. {currentLevel} 수학 탐험가
              </h2>
            </div>
            <p className="text-white/90 text-xs sm:text-sm max-w-md">
              문제를 맞히면 별(⭐)을 모아 레벨업해요!
            </p>
            {/* Inverted primary: an indigo-600 button would disappear on the indigo banner */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onStartQuiz();
              }}
              className="px-6 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-base font-black shadow-md transition-colors"
            >
              오늘의 퀴즈 풀기 ▶
            </button>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col items-center min-w-[200px]">
            <div className="flex items-center gap-2">
              <img
                src={GAME_ASSETS.star}
                alt=""
                className="w-9 h-9 object-contain"
                draggable={false}
              />
              <span className="text-3xl font-black">{currentStars}</span>
              <span className="text-xs text-white/90">별 보유</span>
            </div>
            <div
              role="progressbar"
              aria-label="다음 레벨까지"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
              className="w-full bg-black/20 h-2.5 rounded-full mt-3 overflow-hidden"
            >
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-white/90 mt-1 font-semibold">
              다음 레벨까지 별 {Math.max(0, nextLevelStars - currentStars)}개 남음
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-black">{stats.totalSolved}</div>
            <div className="text-xs text-white/90">총 푼 문제</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black">{stats.totalCorrect}</div>
            <div className="text-xs text-white/90">정답 맞힌 문제</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black">
              {stats.totalSolved > 0
                ? `${Math.round((stats.totalCorrect / stats.totalSolved) * 100)}%`
                : '0%'}
            </div>
            <div className="text-xs text-white/90">정답률</div>
          </div>
        </div>
      </div>

      <DailyMission stats={stats} />

      {/* Shop & Games */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onOpenShop();
          }}
          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl p-4 text-left transition-colors flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-2 min-[480px]:gap-3"
        >
          <img
            src={GAME_ASSETS.gift}
            alt=""
            className="w-12 h-12 shrink-0 object-contain"
            draggable={false}
          />
          <span>
            <span className="block text-sm font-black text-amber-900">별 상점</span>
            <span className="block text-xs text-amber-800">
              쓸 수 있는 별 ⭐ {stats.stars - stats.spentStars}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onOpenGames();
          }}
          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl p-4 text-left transition-colors flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-2 min-[480px]:gap-3"
        >
          <img
            src={GAME_ASSETS.rocket}
            alt=""
            className="w-12 h-12 shrink-0 object-contain"
            draggable={false}
          />
          <span>
            <span className="block text-sm font-black text-indigo-900">수학 게임</span>
            <span className="block text-xs text-indigo-700">타임어택 · 보스전 · 가족 대결</span>
          </span>
        </button>
      </div>

      {/* Badges Earned */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <GameIcon name="iconTrophy" /> 획득한 업적 뱃지 ({stats.badges.length}/
          {BADGE_DEFINITIONS.length})
        </h3>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map((badge) => {
            const unlocked = stats.badges.includes(badge.id);
            const progress = unlocked ? null : badgeProgress(badge.id, stats);
            const current = progress ? Math.min(progress[0], progress[1]) : 0;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex items-start gap-3 ${
                  unlocked
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <GameIcon name={unlocked ? badge.image : 'badgeLocked'} className="h-9 w-9" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">{badge.name}</div>
                  <div className={`text-xs ${unlocked ? 'text-amber-800' : 'text-slate-500'}`}>
                    {badge.desc}
                  </div>
                  {progress && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${(current / progress[1]) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {current}/{progress[1]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics Roadmap List */}
      <div className="space-y-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-800">단원별 학습 코스</h3>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onOpenWrongNotes();
            }}
            className="self-start text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 sm:self-auto"
          >
            <GameIcon name="tabReview" />
            <span>오답 노트 보러가기</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOPICS.map((topic, index) => {
            const progress = stats.topicProgress[topic.id] || {
              solvedCount: 0,
              correctCount: 0,
              stars: 0,
            };

            return (
              <button
                type="button"
                key={topic.id}
                onClick={() => {
                  sound.playPop();
                  onSelectTopic(topic.id);
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={topic.image}
                        alt=""
                        className="h-14 w-14 shrink-0 object-contain group-hover:scale-110 transition-transform"
                        draggable={false}
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-500">
                          단원 {index + 1} · {topic.grade}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-700 transition-colors">
                          {topic.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 text-xs font-bold">
                      <GameIcon name="star" className="h-4 w-4" />
                      <span>{progress.stars}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{topic.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    푼 문제: <strong className="text-slate-700">{progress.solvedCount}개</strong>{' '}
                    (정답 {progress.correctCount}개)
                  </span>
                  <span className="font-bold text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    학습 시작 ➔
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backup */}
      <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-bold">
        <span className="text-slate-500 mr-auto">기록 백업 (다른 기기로 옮기기)</span>
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
        >
          <GameIcon name="iconExport" className="h-4 w-4" /> 내보내기
        </button>
        <label className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500">
          <GameIcon name="iconImport" className="h-4 w-4" /> 불러오기
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};
