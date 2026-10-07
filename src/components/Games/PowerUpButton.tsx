import type React from 'react';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { POWER_UPS, type PowerUpId } from '../../utils/storage';

interface PowerUpButtonProps {
  id: PowerUpId;
  count: number;
  onUse: () => void;
  label?: string;
  disabled?: boolean;
}

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({
  id,
  count,
  onUse,
  label,
  disabled = false,
}) => {
  const powerUp = POWER_UPS.find((p) => p.id === id);
  if (!powerUp) return null;
  const text = label ?? powerUp.name;
  return (
    <button
      type="button"
      onClick={onUse}
      disabled={disabled || count <= 0}
      title={powerUp.desc}
      aria-label={`${label ? `${powerUp.name} ${label}` : powerUp.name} (${count}개 있음)`}
      className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-bold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-50 disabled:active:scale-100"
    >
      <img
        src={GAME_ASSETS[powerUp.image]}
        alt=""
        className="w-8 h-8 object-contain"
        draggable={false}
      />
      <span>{text}</span>
      <span className="px-1.5 py-0.5 bg-white rounded-full text-xs text-indigo-800">{count}</span>
    </button>
  );
};
