import type React from 'react';
import { useState } from 'react';
import type { UserStats } from '../types/math';
import { sound } from '../utils/audio';

const BUILD_DATE = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
}).format(new Date(__APP_BUILD_TIME__));

interface NavbarProps {
  currentTab: 'roadmap' | 'lab' | 'quiz' | 'review';
  onTabChange: (tab: 'roadmap' | 'lab' | 'quiz' | 'review') => void;
  stats: UserStats;
  onOpenScratchPad: () => void;
  wrongCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  stats,
  onOpenScratchPad,
  wrongCount,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(sound.isEnabled());

  const handleSoundToggle = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
    if (newState) sound.playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => {
            sound.playPop();
            onTabChange('roadmap');
          }}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
            📐
          </div>
          <div>
            <div className="font-black text-slate-800 text-sm sm:text-lg leading-tight tracking-tight">
              준영이의 수학공부
            </div>
            <div className="hidden text-sm font-bold text-indigo-600 tracking-wide sm:block">
              초등 5·6학년 생각하는 수학
            </div>
            <div className="text-[10px] leading-tight text-slate-500">
              빌드 날짜 {BUILD_DATE.replaceAll('-', '.')}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('roadmap');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentTab === 'roadmap'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ 로드맵
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('lab');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentTab === 'lab'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧪 개념 실험실
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('quiz');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentTab === 'quiz'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 도전 퀴즈
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('review');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all relative ${
              currentTab === 'review'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📝 오답 노트
            {wrongCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-xs font-bold">
                {wrongCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Tools & Badges */}
        <div className="flex items-center gap-2">
          {/* Scratchpad Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenScratchPad();
            }}
            title="수학 연습장 / 칠판 열기"
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors border border-slate-200"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">연습장</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? '효과음 끄기' : '효과음 켜기'}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm transition-colors border border-slate-200"
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          {/* Level and Stars Badge */}
          <div className="hidden items-center gap-2 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-amber-900 sm:flex">
            <span className="text-xs font-extrabold">Lv.{stats.level}</span>
            <span className="w-px h-3 bg-amber-200" />
            <div className="flex items-center gap-0.5 text-xs font-black text-amber-700">
              <span>⭐</span>
              <span>{stats.stars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="flex md:hidden border-t border-slate-100 px-2 py-1.5 bg-slate-50 justify-around text-xs font-bold">
        <button
          onClick={() => {
            sound.playPop();
            onTabChange('roadmap');
          }}
          className={`px-2 py-1 rounded-lg ${currentTab === 'roadmap' ? 'text-indigo-600 bg-white shadow-2xs' : 'text-slate-500'}`}
        >
          🗺️ 로드맵
        </button>
        <button
          onClick={() => {
            sound.playPop();
            onTabChange('lab');
          }}
          className={`px-2 py-1 rounded-lg ${currentTab === 'lab' ? 'text-indigo-600 bg-white shadow-2xs' : 'text-slate-500'}`}
        >
          🧪 실험실
        </button>
        <button
          onClick={() => {
            sound.playPop();
            onTabChange('quiz');
          }}
          className={`px-2 py-1 rounded-lg ${currentTab === 'quiz' ? 'text-indigo-600 bg-white shadow-2xs' : 'text-slate-500'}`}
        >
          🎯 퀴즈
        </button>
        <button
          onClick={() => {
            sound.playPop();
            onTabChange('review');
          }}
          className={`px-2 py-1 rounded-lg relative ${currentTab === 'review' ? 'text-rose-600 bg-white shadow-2xs' : 'text-slate-500'}`}
        >
          📝 오답({wrongCount})
        </button>
      </div>
    </header>
  );
};
