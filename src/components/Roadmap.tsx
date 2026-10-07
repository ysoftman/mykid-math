import type React from 'react';
import type { TopicId, UserStats } from '../types/math';
import { sound } from '../utils/audio';
import { TOPICS } from '../utils/problemGenerators';
import { BADGE_DEFINITIONS, exportData, importData } from '../utils/storage';

interface RoadmapProps {
  stats: UserStats;
  onSelectTopic: (topicId: TopicId) => void;
  onOpenWrongNotes: () => void;
  onDataImported: () => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  stats,
  onSelectTopic,
  onOpenWrongNotes,
  onDataImported,
}) => {
  const currentLevel = stats.level;
  const currentStars = stats.stars;
  const nextLevelStars = currentLevel * 10;
  const currentLevelBaseStars = (currentLevel - 1) * 10;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStars - currentLevelBaseStars) / 10) * 100),
  );

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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <span>🚀</span> 초등 5~6학년 수학 마스터 로드맵
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Lv. {currentLevel} 수학 탐험가</h2>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-md">
              문제를 맞히면 별(⭐)을 모으고 레벨업할 수 있어요! 단원별 실험실에서 원리를 먼저
              살펴보고 도전해보세요.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-black">{currentStars}</span>
              <span className="text-xs text-white/90">별 보유</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-indigo-100 mt-1 font-semibold">
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

      {/* Badges Earned */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span>🏆</span> 획득한 업적 뱃지 ({stats.badges.length}/{BADGE_DEFINITIONS.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map((badge) => {
            const unlocked = stats.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  unlocked
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-2xl">{unlocked ? badge.icon : '🔒'}</span>
                <div>
                  <div className="text-xs font-bold">{badge.name}</div>
                  <div className="text-xs line-clamp-1">{badge.desc}</div>
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
            onClick={() => {
              sound.playPop();
              onOpenWrongNotes();
            }}
            className="self-start text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 sm:self-auto"
          >
            <span>📝</span>
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
              <div
                key={topic.id}
                onClick={() => {
                  sound.playPop();
                  onSelectTopic(topic.id);
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {topic.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500">
                          단원 {index + 1} · {topic.grade}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                          {topic.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                      <span>⭐</span>
                      <span>{progress.stars}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{topic.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    푼 문제: <strong className="text-slate-700">{progress.solvedCount}개</strong>{' '}
                    (정답 {progress.correctCount}개)
                  </span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    학습 시작 ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup */}
      <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-bold">
        <span className="text-slate-500 mr-auto">기록 백업 (다른 기기로 옮기기)</span>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
        >
          💾 내보내기
        </button>
        <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer">
          📂 불러오기
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
