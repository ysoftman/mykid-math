import confetti from 'canvas-confetti';
import type React from 'react';
import { useEffect } from 'react';
import { sound } from '../utils/audio';
import { BADGE_DEFINITIONS, DAILY_MISSION_BONUS, type RewardResult } from '../utils/storage';

interface RewardModalProps {
  reward: RewardResult | null;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => {
  const show =
    !!reward && (reward.leveledUp || reward.missionCompleted || reward.newBadges.length > 0);

  useEffect(() => {
    if (!show) return;
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, zIndex: 60 });
    const t = setTimeout(
      () => confetti({ particleCount: 120, spread: 140, origin: { y: 0.4 }, zIndex: 60 }),
      300,
    );
    return () => clearTimeout(t);
  }, [show]);

  if (!reward || !show) return null;

  const badges = BADGE_DEFINITIONS.filter((b) => reward.newBadges.includes(b.id));
  const close = () => {
    sound.playPop();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="축하해요"
        className="w-full max-w-sm space-y-5 rounded-3xl border-4 border-amber-300 bg-white p-6 text-center shadow-2xl animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl">🎊</div>

        {reward.leveledUp && (
          <div>
            <div className="text-3xl font-extrabold text-indigo-700">레벨 업!</div>
            <div className="mt-1 text-sm font-bold text-slate-600">
              이제 Lv. {reward.updatedStats.level} 수학 탐험가예요!
            </div>
          </div>
        )}

        {reward.missionCompleted && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-lg font-extrabold text-emerald-800">
            오늘의 미션 완료! +{DAILY_MISSION_BONUS}⭐
          </div>
        )}

        {badges.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-bold text-amber-700">새 뱃지를 얻었어요!</div>
            {badges.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left"
              >
                <span className="text-4xl">{b.icon}</span>
                <div>
                  <div className="font-extrabold text-slate-800">{b.name}</div>
                  <div className="text-xs text-slate-600">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={close}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 text-base font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95"
        >
          좋아요! 🙌
        </button>
      </div>
    </div>
  );
};
