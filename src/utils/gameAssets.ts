// Images cut from "Math Heroes Game Asset Sheet.png", "Korean-Style Hats and Pet Icons.png",
// "Chibi Game Achievement Icons.png" and "Colorful Math Chapter Badges.png" (transparent WebP)
import coinChest from '../assets/game/coin-chest.webp';
import explorer from '../assets/game/explorer.webp';
import gameBoss from '../assets/game/game-boss.webp';
import gameDuel from '../assets/game/game-duel.webp';
import gameTime from '../assets/game/game-time.webp';
import gemChest from '../assets/game/gem-chest.webp';
import gift from '../assets/game/gift.webp';
import hatBeanie from '../assets/game/hat-beanie.webp';
import hatBunny from '../assets/game/hat-bunny.webp';
import hatCap from '../assets/game/hat-cap.webp';
import hatCaptain from '../assets/game/hat-captain.webp';
import hatCat from '../assets/game/hat-cat.webp';
import hatCowboy from '../assets/game/hat-cowboy.webp';
import hatCrown from '../assets/game/hat-crown.webp';
import hatDino from '../assets/game/hat-dino.webp';
import hatGoggles from '../assets/game/hat-goggles.webp';
import hatHeadphone from '../assets/game/hat-headphone.webp';
import hatViking from '../assets/game/hat-viking.webp';
import hatWizard from '../assets/game/hat-wizard.webp';
import heart from '../assets/game/heart.webp';
import hero from '../assets/game/hero.webp';
import itemBook from '../assets/game/item-book.webp';
import itemCalculator from '../assets/game/item-calculator.webp';
import itemClover from '../assets/game/item-clover.webp';
import itemMagnet from '../assets/game/item-magnet.webp';
import itemPencil from '../assets/game/item-pencil.webp';
import itemPotion from '../assets/game/item-potion.webp';
import petCactus from '../assets/game/pet-cactus.webp';
import petCat from '../assets/game/pet-cat.webp';
import petChick from '../assets/game/pet-chick.webp';
import petDragon from '../assets/game/pet-dragon.webp';
import petGhost from '../assets/game/pet-ghost.webp';
import petGolem from '../assets/game/pet-golem.webp';
import petHusky from '../assets/game/pet-husky.webp';
import petPanda from '../assets/game/pet-panda.webp';
import petPenguin from '../assets/game/pet-penguin.webp';
import petRobot from '../assets/game/pet-robot.webp';
import petSlime from '../assets/game/pet-slime.webp';
import petUnicorn from '../assets/game/pet-unicorn.webp';
import rocket from '../assets/game/rocket.webp';
import shield from '../assets/game/shield.webp';
import solver from '../assets/game/solver.webp';
import star from '../assets/game/star.webp';
import time from '../assets/game/time.webp';
import topicDecimals from '../assets/game/topic-decimals.webp';
import topicFactors from '../assets/game/topic-factors.webp';
import topicFractions from '../assets/game/topic-fractions.webp';
import topicGeometry from '../assets/game/topic-geometry.webp';
import topicRatios from '../assets/game/topic-ratios.webp';
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
  gameTime,
  gameBoss,
  gameDuel,
  topicFactors,
  topicFractions,
  topicDecimals,
  topicGeometry,
  topicRatios,
  hatCap,
  hatCaptain,
  hatWizard,
  hatCrown,
  hatBeanie,
  hatBunny,
  hatCat,
  hatCowboy,
  hatDino,
  hatGoggles,
  hatHeadphone,
  hatViking,
  petHusky,
  petCat,
  petPenguin,
  petDragon,
  petCactus,
  petChick,
  petGhost,
  petGolem,
  petPanda,
  petRobot,
  petSlime,
  petUnicorn,
  itemBook,
  itemCalculator,
  itemClover,
  itemMagnet,
  itemPencil,
  itemPotion,
} as const;

export type GameAssetKey = keyof typeof GAME_ASSETS;
