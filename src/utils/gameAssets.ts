// Images cut from "Math Heroes Game Asset Sheet.png" (transparent WebP)
import coinChest from '../assets/game/coin-chest.webp';
import explorer from '../assets/game/explorer.webp';
import gemChest from '../assets/game/gem-chest.webp';
import gift from '../assets/game/gift.webp';
import heart from '../assets/game/heart.webp';
import hero from '../assets/game/hero.webp';
import rocket from '../assets/game/rocket.webp';
import shield from '../assets/game/shield.webp';
import solver from '../assets/game/solver.webp';
import star from '../assets/game/star.webp';
import time from '../assets/game/time.webp';
import wizard from '../assets/game/wizard.webp';
import xpBooster from '../assets/game/xp-booster.webp';

export const GAME_ASSETS = {
  hero,
  solver,
  wizard,
  explorer,
  star,
  coinChest,
  gemChest,
  gift,
  rocket,
  shield,
  heart,
  time,
  xpBooster,
} as const;

export type GameAssetKey = keyof typeof GAME_ASSETS;
