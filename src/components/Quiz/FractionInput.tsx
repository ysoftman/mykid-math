import type React from 'react';
import { MAX_ANSWER_LENGTH } from '../../utils/answer';

interface FractionInputProps {
  numerator: string;
  denominator: string;
  onChangeNumerator: (val: string) => void;
  onChangeDenominator: (val: string) => void;
  disabled?: boolean;
}

export const FractionInput: React.FC<FractionInputProps> = ({
  numerator,
  denominator,
  onChangeNumerator,
  onChangeDenominator,
  disabled = false,
}) => {
  return (
    <div className="inline-flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-300 rounded-xl">
      <input
        type="number"
        value={numerator}
        placeholder="분자"
        disabled={disabled}
        onChange={(e) => onChangeNumerator(e.target.value.slice(0, MAX_ANSWER_LENGTH))}
        className="w-20 text-center text-lg font-bold py-1 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
      />
      <div className="w-16 h-0.5 bg-slate-400 my-1 rounded-full" />
      <input
        type="number"
        value={denominator}
        placeholder="분모"
        disabled={disabled}
        onChange={(e) => onChangeDenominator(e.target.value.slice(0, MAX_ANSWER_LENGTH))}
        className="w-20 text-center text-lg font-bold py-1 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
      />
    </div>
  );
};
