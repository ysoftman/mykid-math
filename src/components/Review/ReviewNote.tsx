import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { WrongNoteItem } from '../../types/math';
import { getWrongNotes, removeWrongNote } from '../../utils/storage';
import { sound } from '../../utils/audio';

interface ReviewNoteProps {
  onClose: () => void;
  onRefreshStats: () => void;
}

export const ReviewNote: React.FC<ReviewNoteProps> = ({ onClose, onRefreshStats }) => {
  const [notes, setNotes] = useState<WrongNoteItem[]>(getWrongNotes());
  const [retryId, setRetryId] = useState<string | null>(null);
  const [retryInput, setRetryInput] = useState<string>('');
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);

  const handleRetrySubmit = (item: WrongNoteItem) => {
    let isCorrect = false;
    const p = item.problem;

    if (p.answerType === 'fraction') {
      const targetFrac = p.correctAnswer as { num: number; den: number };
      const [uNum, uDen] = retryInput.split('/').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(uNum) && !isNaN(uDen)) {
        isCorrect = uNum === targetFrac.num && uDen === targetFrac.den;
      }
    } else {
      const uVal = parseFloat(retryInput);
      const targetVal = Number(p.correctAnswer);
      if (!isNaN(uVal)) {
        isCorrect = Math.abs(uVal - targetVal) < 0.001;
      }
    }

    if (isCorrect) {
      sound.playCorrect();
      confetti({ particleCount: 60, spread: 50 });
      setRetryFeedback('🎉 완벽해요! 오답을 완전히 정복했습니다!');
      setTimeout(() => {
        removeWrongNote(p.id);
        const updated = getWrongNotes();
        setNotes(updated);
        setRetryId(null);
        setRetryInput('');
        setRetryFeedback(null);
        onRefreshStats();
      }, 1200);
    } else {
      sound.playWrong();
      setRetryFeedback('아직 정답이 아니에요. 아래 풀이를 다시 읽어보세요!');
    }
  };

  const handleDeleteItem = (problemId: string) => {
    sound.playPop();
    removeWrongNote(problemId);
    setNotes(getWrongNotes());
    onRefreshStats();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">오답 복습 노트</h3>
            <p className="text-xs text-slate-500">
              틀렸던 문제를 다시 풀어보며 내 것으로 만들어요!
            </p>
          </div>
        </div>

        <button
          onClick={() => { sound.playPop(); onClose(); }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          돌아가기
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-5xl">🌟</div>
          <h4 className="text-lg font-bold text-slate-700">오답 노트가 비어있어요!</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            문제를 풀다가 틀리면 이곳에 차곡차곡 쌓여요. 언제든 다시 풀어보며 복습할 수 있습니다!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500">
            총 <strong className="text-rose-600">{notes.length}개</strong>의 복습할 문제가 있습니다.
          </div>

          {notes.map((item) => {
            const isRetrying = retryId === item.id;
            const isExpanded = expandedExplanationId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">
                      {item.problem.subtopic}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.solvedAt} 풀이</span>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.problem.id)}
                    className="text-slate-400 hover:text-rose-500 text-xs transition-colors"
                    title="오답 노트에서 삭제"
                  >
                    삭제 ✕
                  </button>
                </div>

                <div className="font-bold text-slate-800 text-sm sm:text-base">
                  {item.problem.question}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400">내가 적은 오답: </span>
                    <strong className="text-rose-600 font-mono">{item.userAnswer || '미입력'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">정답: </span>
                    <strong className="text-indigo-600 font-mono">
                      {typeof item.problem.correctAnswer === 'object'
                        ? `${(item.problem.correctAnswer as any).num}/${(item.problem.correctAnswer as any).den}`
                        : item.problem.correctAnswer}
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      sound.playPop();
                      setExpandedExplanationId(isExpanded ? null : item.id);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    {isExpanded ? '접기 ▲' : '해설 다시보기 ▼'}
                  </button>

                  {!isRetrying ? (
                    <button
                      onClick={() => {
                        sound.playPop();
                        setRetryId(item.id);
                        setRetryInput('');
                        setRetryFeedback(null);
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      다시 풀기 🎯
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={retryInput}
                        placeholder={item.problem.answerType === 'fraction' ? '예: 3/4' : '정답 입력'}
                        onChange={(e) => setRetryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRetrySubmit(item);
                        }}
                        className="w-28 px-2 py-1 text-xs border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                      />
                      <button
                        onClick={() => handleRetrySubmit(item)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                      >
                        확인
                      </button>
                      <button
                        onClick={() => setRetryId(null)}
                        className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        취소
                      </button>
                    </div>
                  )}
                </div>

                {isRetrying && retryFeedback && (
                  <div className="text-xs font-bold p-2 bg-indigo-50 text-indigo-900 rounded-lg">
                    {retryFeedback}
                  </div>
                )}

                {/* Expanded Explanations */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    {item.problem.explanations.map((exp, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-0.5">
                        <div className="font-bold text-indigo-600">{exp.title}</div>
                        <div className="text-slate-700">{exp.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
