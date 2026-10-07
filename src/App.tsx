import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { DecimalsLab } from './components/Lab/DecimalsLab';
// Labs
import { FactorsLab } from './components/Lab/FactorsLab';
import { FractionsLab } from './components/Lab/FractionsLab';
import { GeometryLab } from './components/Lab/GeometryLab';
import { RatiosLab } from './components/Lab/RatiosLab';
import { Navbar } from './components/Navbar';
import { QuizRunner } from './components/Quiz/QuizRunner';
import { ReviewNote } from './components/Review/ReviewNote';
import { Roadmap } from './components/Roadmap';
import { ScratchPad } from './components/ScratchPad';
import type { TopicId, UserStats } from './types/math';
import { sound } from './utils/audio';
import { TOPICS } from './utils/problemGenerators';
import { getStats, getWrongNotes } from './utils/storage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'roadmap' | 'lab' | 'quiz' | 'review'>('roadmap');
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('fractions');
  const [stats, setStats] = useState<UserStats>(getStats());
  const [wrongNotesCount, setWrongNotesCount] = useState<number>(getWrongNotes().length);
  const [isScratchPadOpen, setIsScratchPadOpen] = useState<boolean>(false);

  const refreshStats = useCallback(() => {
    setStats(getStats());
    setWrongNotesCount(getWrongNotes().length);
  }, []);

  useEffect(() => {
    const handleStorage = () => refreshStats();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshStats]);

  const handleSelectTopicFromRoadmap = (topicId: TopicId) => {
    setSelectedTopicId(topicId);
    setCurrentTab('lab'); // First guide to interactive lab, or user can jump to quiz
  };

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        stats={stats}
        onOpenScratchPad={() => setIsScratchPadOpen(true)}
        wrongCount={wrongNotesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Topic Selector Chips when in Lab or Quiz tab */}
        {(currentTab === 'lab' || currentTab === 'quiz') && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              단원 선택
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TOPICS.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedTopicId(topic.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm scale-102'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{topic.icon}</span>
                    <span>{topic.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Router */}
        {currentTab === 'roadmap' && (
          <Roadmap
            stats={stats}
            onSelectTopic={handleSelectTopicFromRoadmap}
            onOpenWrongNotes={() => setCurrentTab('review')}
            onDataImported={refreshStats}
          />
        )}

        {currentTab === 'lab' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {currentTopic.grade}
                </span>
                <h2 className="text-lg font-black text-slate-800 mt-1">
                  {currentTopic.icon} {currentTopic.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{currentTopic.description}</p>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setCurrentTab('quiz');
                }}
                className="self-start px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow transition-all flex items-center gap-1.5 whitespace-nowrap sm:self-auto"
              >
                <span className="hidden sm:inline">이 개념으로 문제 풀기</span>
                <span className="sm:hidden">퀴즈 풀기</span>
                <span>🎯</span>
              </button>
            </div>

            {/* Interactive Labs per Topic */}
            {selectedTopicId === 'factors' && <FactorsLab />}
            {selectedTopicId === 'fractions' && <FractionsLab />}
            {selectedTopicId === 'decimals' && <DecimalsLab />}
            {selectedTopicId === 'geometry' && <GeometryLab />}
            {selectedTopicId === 'ratios' && <RatiosLab />}
          </div>
        )}

        {currentTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 bg-white border border-slate-200 p-4 rounded-2xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentTopic.icon}</span>
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    {currentTopic.title} 도전 퀴즈
                  </h2>
                  <p className="text-xs text-slate-500">문제를 맞혀 별을 획득하고 레벨업하세요!</p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setCurrentTab('lab');
                }}
                className="self-start text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 sm:self-auto"
              >
                <span>🧪</span>
                <span className="hidden sm:inline">원리가 헷갈리면? 실험실 보기</span>
                <span className="sm:hidden">실험실 보기</span>
              </button>
            </div>

            <QuizRunner
              key={selectedTopicId}
              topicId={selectedTopicId}
              onStatsUpdated={refreshStats}
              onOpenScratchPad={() => setIsScratchPadOpen(true)}
            />
          </div>
        )}

        {currentTab === 'review' && (
          <ReviewNote onClose={() => setCurrentTab('roadmap')} onRefreshStats={refreshStats} />
        )}
      </main>

      {/* Floating ScratchPad Modal */}
      <ScratchPad isOpen={isScratchPadOpen} onClose={() => setIsScratchPadOpen(false)} />
    </div>
  );
};

export default App;
