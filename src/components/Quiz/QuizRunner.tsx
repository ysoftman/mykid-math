import confetti from 'canvas-confetti';
import type React from 'react';
import { useState } from 'react';
import type { Difficulty, Problem, TopicId } from '../../types/math';
import { sound } from '../../utils/audio';
import { generateProblem } from '../../utils/problemGenerators';
import { addWrongNote, recordProblemResult } from '../../utils/storage';
import { FractionInput } from './FractionInput';

interface QuizRunnerProps {
  topicId: TopicId;
  onStatsUpdated: () => void;
  onOpenScratchPad: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  topicId,
  onStatsUpdated,
  onOpenScratchPad,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [problem, setProblem] = useState<Problem>(() => generateProblem(topicId, 'medium'));

  // Input states
  const [numAnswer, setNumAnswer] = useState<string>('');
  const [fracNum, setFracNum] = useState<string>('');
  const [fracDen, setFracDen] = useState<string>('');

  // Status states
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleDifficultyChange = (newDiff: Difficulty) => {
    sound.playPop();
    setDifficulty(newDiff);
    const nextP = generateProblem(topicId, newDiff);
    setProblem(nextP);
    setNumAnswer('');
    setFracNum('');
    setFracDen('');
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const loadNewProblem = () => {
    const nextP = generateProblem(topicId, difficulty);
    setProblem(nextP);
    setNumAnswer('');
    setFracNum('');
    setFracDen('');
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    let correct = false;
    let userAnsStr = '';

    if (problem.answerType === 'fraction') {
      const uNum = parseInt(fracNum, 10);
      const uDen = parseInt(fracDen, 10);
      userAnsStr = `${fracNum}/${fracDen}`;

      const targetFrac = problem.correctAnswer as { num: number; den: number };
      if (!isNaN(uNum) && !isNaN(uDen) && uDen !== 0) {
        // Compare values or simplified
        correct = uNum === targetFrac.num && uDen === targetFrac.den;
      }
    } else {
      // number
      const uVal = parseFloat(numAnswer);
      userAnsStr = numAnswer;
      const targetVal = Number(problem.correctAnswer);
      if (!isNaN(uVal)) {
        correct = Math.abs(uVal - targetVal) < 0.001;
      }
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      recordProblemResult(topicId, true);
    } else {
      sound.playWrong();
      recordProblemResult(topicId, false);
      addWrongNote({
        id: `wrong_${Date.now()}`,
        problem,
        userAnswer: userAnsStr,
        solvedAt: new Date().toLocaleDateString('ko-KR'),
      });
      setShowSolution(true); // Automatically show solution on wrong answer for learning
    }

    onStatsUpdated();
  };

  const formattedCorrectAnswer = () => {
    if (problem.answerType === 'fraction') {
      const f = problem.correctAnswer as { num: number; den: number };
      return `${f.num}/${f.den}`;
    }
    return String(problem.correctAnswer);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Top Bar: Subtopic, Difficulty, Scratchpad button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            {problem.subtopic}
          </span>
          <span className="text-xs text-slate-400">무한 생성 문제</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onOpenScratchPad();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200"
          >
            <span>✏️</span>
            <span>연습장 열기</span>
          </button>

          {/* Difficulty selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`px-2 py-1 rounded-md transition-all ${
                  difficulty === d
                    ? 'bg-white text-indigo-600 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {d === 'easy' ? '기본' : d === 'medium' ? '보통' : '도전'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Content */}
      <div className="space-y-4">
        {problem.context && (
          <div className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200">
            📖 {problem.context}
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
          {problem.question}
        </h3>
      </div>

      {/* Answer Input Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600">내 답안:</label>

          {problem.answerType === 'fraction' ? (
            <div className="flex items-center gap-3">
              <FractionInput
                numerator={fracNum}
                denominator={fracDen}
                onChangeNumerator={setFracNum}
                onChangeDenominator={setFracDen}
                disabled={isAnswered}
              />
              <span className="text-xs text-slate-500">(기약분수로 적어주세요)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                step="any"
                value={numAnswer}
                disabled={isAnswered}
                onChange={(e) => setNumAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckAnswer();
                }}
                placeholder="정답 입력"
                className="w-full sm:w-48 text-xl font-bold px-4 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all text-base"
            >
              정답 확인하기! 🎯
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                loadNewProblem();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all text-base flex items-center justify-center gap-2"
            >
              <span>다음 문제 풀기</span>
              <span>➡️</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Feedback Banner */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl flex items-start justify-between gap-3 animate-in fade-in ${
            isCorrect
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isCorrect ? '🎉' : '💡'}</span>
            <div>
              <div className="font-extrabold text-base">
                {isCorrect
                  ? '정답입니다! 참 잘했어요! (+2 ⭐)'
                  : '아쉬워요! 풀이를 보고 다시 원리를 익혀볼까요?'}
              </div>
              <div className="text-xs mt-0.5 opacity-90">
                정답: <strong>{formattedCorrectAnswer()}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setShowSolution(!showSolution);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              isCorrect
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                : 'bg-rose-100 border-rose-300 text-rose-800 hover:bg-rose-200'
            }`}
          >
            {showSolution ? '풀이 접기' : '상세 풀이 보기'}
          </button>
        </div>
      )}

      {/* Hint Accordion */}
      {!isAnswered && (
        <div>
          <button
            onClick={() => {
              sound.playPop();
              setShowHint(!showHint);
            }}
            className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>💡</span>
            <span>{showHint ? '힌트 숨기기' : '어려운가요? 힌트 보기'}</span>
          </button>

          {showHint && (
            <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 animate-in fade-in">
              {problem.hint}
            </div>
          )}
        </div>
      )}

      {/* Step by Step Solution */}
      {showSolution && (
        <div className="border border-indigo-100 bg-indigo-50/40 rounded-2xl p-5 space-y-3 animate-in fade-in">
          <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
            <span>📝</span> 단계별 친절한 풀이 과정:
          </h4>
          <div className="space-y-2">
            {problem.explanations.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs sm:text-sm space-y-1 shadow-2xs"
              >
                <div className="font-bold text-indigo-700">{exp.title}</div>
                <div className="text-slate-700 leading-relaxed">{exp.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
