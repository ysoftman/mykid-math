import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Problem } from '../../types/math';
import { checkAnswer, cleanAnswerInput } from '../../utils/answer';
import { MathText } from '../MathText';
import { FractionInput } from '../Quiz/FractionInput';

interface GameProblemProps {
  problem: Problem;
  onAnswered: (correct: boolean) => void;
  compact?: boolean;
  disabled?: boolean;
}

// Render with key={problem.id} so the inputs reset for every new problem.
export const GameProblem: React.FC<GameProblemProps> = ({
  problem,
  onAnswered,
  compact = false,
  disabled = false,
}) => {
  const [numAnswer, setNumAnswer] = useState('');
  const [fracNum, setFracNum] = useState('');
  const [fracDen, setFracDen] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const inputBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!disabled) inputBoxRef.current?.querySelector('input')?.focus();
  }, [disabled]);

  const handleSubmit = () => {
    if (disabled) return;
    const input =
      problem.answerType !== 'fraction'
        ? numAnswer
        : fracDen.trim()
          ? `${fracNum}/${fracDen}`
          : fracNum;
    const result = checkAnswer(problem, input);
    if (result === 'empty') {
      setNotice('답을 먼저 입력해 주세요!');
      return;
    }
    if (result === 'unreduced') {
      setNotice('값은 맞았어요! 기약분수로 고쳐 보세요.');
      return;
    }
    setNotice(null);
    onAnswered(result === 'correct');
  };

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {problem.context && (
        <div className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
          📖 {problem.context}
        </div>
      )}
      <h3
        className={`font-bold text-slate-800 leading-relaxed ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}
      >
        <MathText text={problem.question} />
      </h3>

      <div
        ref={inputBoxRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
        className="flex flex-wrap items-center gap-3"
      >
        {problem.answerType === 'fraction' ? (
          <FractionInput
            numerator={fracNum}
            denominator={fracDen}
            onChangeNumerator={setFracNum}
            onChangeDenominator={setFracDen}
            disabled={disabled}
          />
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={numAnswer}
            disabled={disabled}
            onChange={(e) => setNumAnswer(cleanAnswerInput(e.target.value, '.'))}
            placeholder="정답 입력"
            className="w-40 sm:w-48 text-xl font-bold px-4 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          />
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          확인 🎯
        </button>
      </div>
      {problem.answerType === 'fraction' && (
        <p className="text-xs text-slate-500">기약분수로 적어요. 답이 자연수면 분자 칸에만!</p>
      )}
      {notice && <p className="text-xs font-bold text-amber-700">{notice}</p>}
    </div>
  );
};
