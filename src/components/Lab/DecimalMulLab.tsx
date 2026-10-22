import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { GameIcon } from '../GameIcon';
import { LabGuide } from './LabGuide';

const LEFT = ['0.3', '0.7', '1.2', '2.5'];
const RIGHT = ['0.2', '0.4', '0.7', '0.9'];
const placesOf = (text: string) => text.split('.')[1]?.length ?? 0;
const digitsOf = (text: string) => Number(text.replace('.', ''));

export const DecimalMulLab: React.FC = () => {
  const [left, setLeft] = useState('0.3');
  const [right, setRight] = useState('0.7');

  const product = digitsOf(left) * digitsOf(right);
  const places = placesOf(left) + placesOf(right);
  const answer = product / 10 ** places;
  // Pad the product so the point always has a digit in front: 21 with 2 places -> "0.21"
  const padded = String(product).padStart(places + 1, '0');
  const whole = padded.slice(0, padded.length - places);
  const fraction = padded.slice(padded.length - places);

  const chips = (
    values: string[],
    selected: string,
    select: (value: string) => void,
    label: string,
  ) => (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={value === selected}
          onClick={() => {
            sound.playPop();
            select(value);
          }}
          className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
            value === selected
              ? 'border-orange-300 bg-orange-100 text-orange-900'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );

  return (
    <section className="space-y-5 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <img
            src={GAME_ASSETS.topicDecimalMul}
            alt=""
            className="h-9 w-9 object-contain"
            draggable={false}
          />
          소수의 곱셈 자릿수 실험실
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          두 소수를 고르면 자연수처럼 곱한 뒤 소수점을 어디에 찍는지 단계별로 보여 줘요.
        </p>
      </div>

      <LabGuide />

      <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
        <GameIcon name="dmExpression" className="h-10 w-20 shrink-0" />
        <p className="text-sm leading-relaxed text-orange-950">
          <strong>소수의 곱셈은 자연수의 곱셈과 똑같이 계산</strong>한 다음, 두 소수의 소수점 아래
          자리 수를 더한 만큼 소수점을 왼쪽으로 옮겨요.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {chips(LEFT, left, setLeft, '앞의 수')}
        <span className="text-xl font-black text-slate-500">×</span>
        {chips(RIGHT, right, setRight, '뒤의 수')}
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-900 p-5 text-white">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs font-bold text-orange-300">1단계 · 자연수처럼 곱하기</p>
            <p className="mt-1 text-lg font-black">
              {digitsOf(left)} × {digitsOf(right)} = {product}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs font-bold text-orange-300">2단계 · 자리 수 더하기</p>
            <p className="mt-1 text-lg font-black">
              {placesOf(left)}자리 + {placesOf(right)}자리 = {places}자리
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs font-bold text-orange-300">3단계 · 소수점 찍기</p>
            <p className="mt-1 text-lg font-black">왼쪽으로 {places}칸 ←</p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-1"
          aria-label={`소수점을 찍은 결과 ${answer}`}
        >
          {[...whole].map((digit, index) => (
            <span
              key={`w${index}`}
              className="flex h-12 w-10 items-center justify-center rounded-lg bg-slate-700 text-2xl font-black"
            >
              {digit}
            </span>
          ))}
          <span className="text-3xl font-black text-orange-400">.</span>
          {[...fraction].map((digit, index) => (
            <span
              key={`f${index}`}
              className="flex h-12 w-10 items-center justify-center rounded-lg bg-orange-500 text-2xl font-black"
            >
              {digit}
            </span>
          ))}
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-xl font-black text-orange-300 sm:text-2xl">
          <GameIcon name="dmBoard" className="h-9 w-9" />
          {left} × {right} = {answer}
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <GameIcon name="dmCubes" className="mt-0.5 h-8 w-8 shrink-0" />
        <p>
          <strong>기억해요:</strong> 0.3 × 0.7은 0.1이 3개와 0.1이 7개를 곱한 것이라 0.01이 21개, 즉
          0.21이에요. 곱한 결과의 끝에 0이 남으면 지워서 써요.
        </p>
      </div>
    </section>
  );
};
