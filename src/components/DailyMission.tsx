import type React from 'react';
import type { UserStats } from '../types/math';
import { GAME_ASSETS } from '../utils/gameAssets';
import {
  DAILY_MISSION_BONUS,
  DAILY_MISSION_GOAL,
  dateKey,
  getAttendanceStreak,
  todayKey,
} from '../utils/storage';
import { GameIcon } from './GameIcon';

export const DailyMission: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const today = todayKey();
  const solvedToday = stats.daily.date === today ? stats.daily.solved : 0;
  const done = solvedToday >= DAILY_MISSION_GOAL;
  const percent = Math.min(100, (solvedToday / DAILY_MISSION_GOAL) * 100);
  const streak = getAttendanceStreak(stats);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <GameIcon name="iconMission" /> 오늘의 미션: 도전 퀴즈 {DAILY_MISSION_GOAL}문제 풀기
        </h3>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <GameIcon name="iconStreak" className="h-4 w-4" /> {streak}일 연속
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          {done ? (
            <span className="text-emerald-700">
              🎉 미션 완료! 출석 도장과 별 {DAILY_MISSION_BONUS}개를 받았어요
            </span>
          ) : (
            <span className="text-slate-700">
              {DAILY_MISSION_GOAL - solvedToday}문제만 더 풀면 출석 도장과 별 {DAILY_MISSION_BONUS}
              개!
            </span>
          )}
          <span className="text-slate-700">
            {Math.min(solvedToday, DAILY_MISSION_GOAL)} / {DAILY_MISSION_GOAL}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="오늘의 미션"
          aria-valuemin={0}
          aria-valuemax={DAILY_MISSION_GOAL}
          aria-valuenow={Math.min(solvedToday, DAILY_MISSION_GOAL)}
          className="w-full bg-slate-100 h-3 rounded-full overflow-hidden"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-slate-700">출석 도장 (최근 2주)</div>
        <p className="text-xs text-slate-500 mt-0.5 mb-2">
          도장 받는 법: <GameIcon name="tabQuiz" className="h-4 w-4" /> 도전 퀴즈에서 하루{' '}
          {DAILY_MISSION_GOAL}문제 풀기 (틀려도 괜찮아요). 게임과 오답 노트 문제는 세지 않아요.
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const key = dateKey(d);
            const stamped = stats.attendance.includes(key);
            const isToday = key === today;
            return (
              <div
                key={key}
                role="img"
                aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일${isToday ? ' (오늘)' : ''} ${stamped ? '도장 받음' : '도장 없음'}`}
                title={`${d.getMonth() + 1}월 ${d.getDate()}일`}
                className={`flex flex-col items-center justify-center rounded-xl border py-1.5 ${
                  stamped ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap ${
                    isToday
                      ? 'font-black text-indigo-700'
                      : stamped
                        ? 'text-emerald-900'
                        : 'text-slate-700'
                  }`}
                >
                  {d.getMonth() + 1}/{d.getDate()}
                </span>
                <span className="mt-0.5 flex h-7 items-center justify-center">
                  {stamped ? (
                    <img
                      src={GAME_ASSETS.gemChest}
                      alt=""
                      className="h-7 w-7 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <span
                      className={`leading-none ${isToday ? 'text-[11px] font-black text-indigo-700' : 'text-lg'}`}
                    >
                      {isToday ? '오늘' : '·'}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
