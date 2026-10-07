import type React from 'react';
import type { UserStats } from '../types/math';
import {
  DAILY_MISSION_BONUS,
  DAILY_MISSION_GOAL,
  dateKey,
  getAttendanceStreak,
  todayKey,
} from '../utils/storage';

// Local 'YYYY-MM-DD', same format as todayKey()

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
          <span>🎯</span> 오늘의 미션: 문제 {DAILY_MISSION_GOAL}개 풀기
        </h3>
        {streak > 0 && (
          <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
            🔥 {streak}일 연속
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          {done ? (
            <span className="text-emerald-700">
              🎉 미션 완료! 별 {DAILY_MISSION_BONUS}개를 받았어요
            </span>
          ) : (
            <span className="text-slate-500">
              {DAILY_MISSION_GOAL - solvedToday}문제만 더 풀면 별 {DAILY_MISSION_BONUS}개!
            </span>
          )}
          <span className="text-slate-700">
            {Math.min(solvedToday, DAILY_MISSION_GOAL)} / {DAILY_MISSION_GOAL}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-slate-500 mb-2">출석 도장 (최근 2주)</div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const key = dateKey(d);
            const stamped = stats.attendance.includes(key);
            const isToday = key === today;
            return (
              <div
                key={key}
                title={`${d.getMonth() + 1}월 ${d.getDate()}일`}
                className={`flex flex-col items-center justify-center rounded-xl border py-1.5 ${
                  stamped ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <span
                  className={`text-xs ${isToday ? 'font-black text-indigo-700' : 'text-slate-500'}`}
                >
                  {isToday ? '오늘' : d.getDate()}
                </span>
                <span className="text-lg leading-none mt-0.5">{stamped ? '✅' : '·'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
