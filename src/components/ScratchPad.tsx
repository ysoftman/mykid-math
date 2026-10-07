import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/audio';

interface ScratchPadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchPad: React.FC<ScratchPadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb'); // blue default
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 20 : lineWidth;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sound.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[480px] sm:h-[420px] bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 font-bold text-sm">
          <span>✏️</span>
          <span>수학 끄적끄적 연습장</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="text-xs bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            모두 지우기
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            aria-label="연습장 닫기"
            className="w-8 h-8 rounded-xl bg-indigo-700 hover:bg-indigo-800 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-100 p-2 flex items-center justify-between gap-2 border-b border-slate-200 text-xs">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {['#1e293b', '#2563eb', '#dc2626', '#16a34a', '#9333ea'].map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
                sound.playPop();
              }}
              aria-label={`펜 색 ${c}`}
              aria-pressed={!isEraser && color === c}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                !isEraser && color === c
                  ? 'scale-125 border-white ring-2 ring-indigo-500'
                  : 'border-transparent'
              }`}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setLineWidth(lineWidth === 3 ? 6 : 3);
              sound.playPop();
            }}
            className="px-2.5 py-1 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 font-bold"
            title="선 굵기 전환"
          >
            {lineWidth === 3 ? '굵기: 보통' : '굵기: 두껍게'}
          </button>
          <button
            onClick={() => {
              setIsEraser(false);
              sound.playPop();
            }}
            aria-pressed={!isEraser}
            className={`px-2.5 py-1 rounded-xl font-bold ${
              !isEraser
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            펜
          </button>
          <button
            onClick={() => {
              setIsEraser(true);
              sound.playPop();
            }}
            aria-pressed={isEraser}
            className={`px-2.5 py-1 rounded-xl font-bold ${
              isEraser
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            지우개
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="flex-1 relative bg-white touch-none cursor-crosshair">
        {/* Graph Paper Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full relative z-10"
        />
      </div>
    </div>
  );
};
