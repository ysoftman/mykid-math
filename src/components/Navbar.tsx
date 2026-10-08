import type React from 'react';
import { useState } from 'react';
import type { UserStats } from '../types/math';
import { sound } from '../utils/audio';
import { GAME_ASSETS } from '../utils/gameAssets';
import { GameIcon } from './GameIcon';

// Build time in KST, e.g. "2026.10.08 23:41"
const VERSION = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  dateStyle: 'short',
  timeStyle: 'short',
})
  .format(new Date(__APP_BUILD_TIME__))
  .replaceAll('-', '.');

export type Tab = 'roadmap' | 'lab' | 'quiz' | 'review' | 'shop' | 'games';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
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
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onTabChange('roadmap');
          }}
          className="flex items-center gap-2 cursor-pointer select-none group text-left"
        >
          <GameIcon
            name="appLogo"
            className="h-10 w-10 group-hover:scale-105 transition-transform"
          />
          <span className="block">
            <span className="block whitespace-nowrap font-black text-slate-800 text-sm sm:text-lg leading-tight tracking-tight">
              준영이의 수학공부
            </span>
            <span className="block text-[10px] leading-tight text-slate-500">버전 {VERSION}</span>
          </span>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('roadmap');
            }}
            className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-bold rounded-xl transition-all ${
              currentTab === 'roadmap'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="tabRoadmap" />
            로드맵
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('lab');
            }}
            className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-bold rounded-xl transition-all ${
              currentTab === 'lab'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="tabLab" />
            개념 실험실
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('quiz');
            }}
            className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-bold rounded-xl transition-all ${
              currentTab === 'quiz'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="tabQuiz" />
            도전 퀴즈
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onTabChange('review');
            }}
            className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-bold rounded-xl transition-all relative ${
              currentTab === 'review'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="tabReview" />
            오답 노트
            {wrongCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white rounded-full text-xs font-bold">
                {wrongCount}
              </span>
            )}
          </button>
          {(
            [
              ['games', 'tabGames', '게임'],
              ['shop', 'tabShop', '상점'],
            ] as const
          ).map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => {
                sound.playPop();
                onTabChange(tab);
              }}
              className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-bold rounded-xl transition-all ${
                currentTab === tab
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GameIcon name={icon} />
              {label}
            </button>
          ))}
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
            className="flex items-center gap-1 whitespace-nowrap text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors border border-slate-200"
          >
            <GameIcon name="uiPencil" />
            <span className="hidden sm:inline">연습장</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? '효과음 끄기' : '효과음 켜기'}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm transition-colors border border-slate-200"
          >
            <GameIcon name={soundOn ? 'uiSoundOn' : 'uiSoundOff'} className="h-7 w-7" />
          </button>

          {/* Level and Stars Badge */}
          <div className="hidden items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-amber-900 sm:flex">
            <span className="text-xs font-extrabold">Lv.{stats.level}</span>
            <span className="w-px h-3 bg-amber-200" />
            <div className="flex items-center gap-0.5 text-xs font-black text-amber-700">
              <img
                src={GAME_ASSETS.star}
                alt="별"
                className="w-4 h-4 object-contain"
                draggable={false}
              />
              <span>{stats.stars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="grid grid-cols-6 lg:hidden border-t border-slate-100 px-1 py-1 bg-slate-50 text-[12px] font-bold">
        {(
          [
            ['roadmap', 'tabRoadmap', '로드맵'],
            ['lab', 'tabLab', '실험실'],
            ['quiz', 'tabQuiz', '퀴즈'],
            ['review', 'tabReview', `오답(${wrongCount})`],
            ['games', 'tabGames', '게임'],
            ['shop', 'tabShop', '상점'],
          ] as const
        ).map(([tab, icon, label]) => (
          <button
            key={tab}
            onClick={() => {
              sound.playPop();
              onTabChange(tab);
            }}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1 leading-tight whitespace-nowrap ${
              currentTab === tab
                ? `${tab === 'review' ? 'text-rose-700' : 'text-indigo-700'} bg-white shadow-2xs`
                : 'text-slate-500'
            }`}
          >
            <GameIcon name={icon} className="h-6 w-6" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
