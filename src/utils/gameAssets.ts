// Images cut from "Math Heroes Game Asset Sheet.png" and "Korean-Style Hats and Pet Icons.png" (transparent WebP)
import coinChest from '../assets/game/coin-chest.webp';
import explorer from '../assets/game/explorer.webp';
import gemChest from '../assets/game/gem-chest.webp';
import gift from '../assets/game/gift.webp';
import hatCap from '../assets/game/hat-cap.webp';
import hatCaptain from '../assets/game/hat-captain.webp';
import hatCrown from '../assets/game/hat-crown.webp';
import hatWizard from '../assets/game/hat-wizard.webp';
import heart from '../assets/game/heart.webp';
import hero from '../assets/game/hero.webp';
import petCat from '../assets/game/pet-cat.webp';
import petDragon from '../assets/game/pet-dragon.webp';
import petHusky from '../assets/game/pet-husky.webp';
import petPenguin from '../assets/game/pet-penguin.webp';
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
  hatCap,
  hatCaptain,
  hatWizard,
  hatCrown,
  petHusky,
  petCat,
  petPenguin,
  petDragon,
} as const;

export type GameAssetKey = keyof typeof GAME_ASSETS;
