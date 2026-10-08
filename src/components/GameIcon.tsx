import type React from 'react';
import { GAME_ASSETS, type GameAssetKey } from '../utils/gameAssets';

// Decorative asset image used in place of an emoji; size it with className (default h-5 w-5)
export const GameIcon: React.FC<{ name: GameAssetKey; className?: string }> = ({
  name,
  className = 'h-5 w-5',
}) => (
  <img
    src={GAME_ASSETS[name]}
    alt=""
    className={`inline-block shrink-0 object-contain align-middle ${className}`}
    draggable={false}
  />
);
