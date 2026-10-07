import type React from 'react';
import type { UserStats } from '../types/math';
import { sound } from '../utils/audio';
import confetti from '../utils/confetti';
import { GAME_ASSETS } from '../utils/gameAssets';
import { KID_CALL } from '../utils/profile';
import {
  buyItem,
  buyPowerUp,
  equipItem,
  getEquippedCharacter,
  POWER_UP_MAX,
  POWER_UPS,
  type PowerUpId,
  SHOP_ITEMS,
  type ShopSlot,
} from '../utils/storage';

const SLOTS: { slot: ShopSlot; title: string; icon: string }[] = [
  { slot: 'character', title: '캐릭터', icon: '🦸' },
  { slot: 'hat', title: '모자', icon: '🎩' },
  { slot: 'pet', title: '펫', icon: '🐾' },
  { slot: 'theme', title: '배너 테마', icon: '🎨' },
];

const AVATAR_SIZES = {
  sm: { box: 'w-20 h-20', hat: '-top-6 w-12 h-10', pet: '-bottom-2 -right-4 w-10 h-10' },
  lg: { box: 'w-28 h-28', hat: '-top-8 w-16 h-14', pet: '-bottom-2 -right-5 w-14 h-14' },
};

// Equipped character picture with the hat above the head and the pet at the bottom corner
export const CharacterAvatar: React.FC<{ stats: UserStats; size: 'sm' | 'lg' }> = ({
  stats,
  size,
}) => {
  const character = getEquippedCharacter(stats);
  const hat = SHOP_ITEMS.find((item) => item.id === stats.equipped.hat);
  const pet = SHOP_ITEMS.find((item) => item.id === stats.equipped.pet);
  const s = AVATAR_SIZES[size];
  return (
    <div
      className={`relative ${s.box} shrink-0 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center`}
    >
      <img
        src={GAME_ASSETS[character.image ?? 'hero']}
        alt={[character.name, hat?.name, pet?.name].filter(Boolean).join(', ')}
        className="w-full h-full object-contain p-1"
        draggable={false}
      />
      {hat?.image && (
        <img
          src={GAME_ASSETS[hat.image]}
          alt=""
          className={`absolute left-1/2 -translate-x-1/2 object-contain ${s.hat}`}
          draggable={false}
        />
      )}
      {pet?.image && (
        <img
          src={GAME_ASSETS[pet.image]}
          alt=""
          className={`absolute object-contain ${s.pet}`}
          draggable={false}
        />
      )}
    </div>
  );
};

const StarPrice: React.FC<{ price: number; affordable: boolean }> = ({ price, affordable }) => (
  <span
    className={`inline-flex items-center gap-1 text-xs font-bold ${affordable ? 'text-amber-700' : 'text-slate-500'}`}
  >
    <img src={GAME_ASSETS.star} alt="별" className="w-4 h-4 object-contain" draggable={false} />
    {price}
  </span>
);

const BuyButton: React.FC<{ lacking: number; full?: boolean; onBuy: () => void }> = ({
  lacking,
  full,
  onBuy,
}) => {
  const disabled = lacking > 0 || !!full;
  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={disabled}
      className={`w-full text-xs font-bold px-3 py-1.5 rounded-xl border ${
        disabled
          ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
          : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
      }`}
    >
      {full ? '가득 찼어요' : lacking > 0 ? `별 ${lacking}개 더 모아요` : '사기'}
    </button>
  );
};

interface ShopProps {
  stats: UserStats;
  onStatsChanged: () => void;
}

export const Shop: React.FC<ShopProps> = ({ stats, onStatsChanged }) => {
  const spendable = stats.stars - stats.spentStars;

  const celebrate = () => {
    sound.playCorrect();
    confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    onStatsChanged();
  };

  const handleBuy = (itemId: string) => {
    if (buyItem(itemId)) celebrate();
  };

  const handleBuyPowerUp = (id: PowerUpId) => {
    if (buyPowerUp(id)) celebrate();
  };

  const handleEquip = (itemId: string | null, slot: ShopSlot) => {
    sound.playPop();
    equipItem(itemId, slot);
    onStatsChanged();
  };

  return (
    <div className="space-y-6">
      {/* Avatar preview + wallet */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <CharacterAvatar stats={stats} size="lg" />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-black text-slate-800">🛍️ {KID_CALL}의 별 상점</h2>
          <p className="text-xs text-slate-500">
            문제를 풀어 모은 별로 캐릭터, 모자, 펫, 배너 테마와 게임 아이템을 사 보세요! 별을 써도
            레벨은 그대로예요.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-center">
          <div className="text-xs font-bold text-amber-800">쓸 수 있는 별</div>
          <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-700">
            <img
              src={GAME_ASSETS.star}
              alt=""
              className="w-8 h-8 object-contain"
              draggable={false}
            />
            {spendable}
          </div>
        </div>
      </div>

      {SLOTS.map(({ slot, title, icon }) => (
        <div key={slot} className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>{icon}</span> {title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SHOP_ITEMS.filter((item) => item.slot === slot).map((item) => {
              const owned = stats.ownedItems.includes(item.id);
              const equipped = stats.equipped[slot] === item.id;
              const lacking = item.price - spendable;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 flex flex-col items-center gap-2 text-center transition-all ${
                    equipped
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {item.image ? (
                    <img
                      src={GAME_ASSETS[item.image]}
                      alt=""
                      className="w-24 h-24 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className={`w-full h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-2xl`}
                    >
                      {item.icon}
                    </div>
                  )}
                  <div className="text-sm font-bold text-slate-800">{item.name}</div>

                  {equipped ? (
                    <>
                      <span className="text-xs font-bold text-indigo-700">✨ 착용 중</span>
                      {/* The character slot can never be empty */}
                      {slot !== 'character' && (
                        <button
                          type="button"
                          onClick={() => handleEquip(null, slot)}
                          className="w-full text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
                        >
                          {slot === 'theme' ? '기본으로' : '벗기'}
                        </button>
                      )}
                    </>
                  ) : owned ? (
                    <button
                      type="button"
                      onClick={() => handleEquip(item.id, slot)}
                      className="w-full text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                    >
                      착용하기
                    </button>
                  ) : (
                    <>
                      <StarPrice price={item.price} affordable={lacking <= 0} />
                      <BuyButton lacking={lacking} onBuy={() => handleBuy(item.id)} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Consumable power-ups for games and quizzes */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span>🎒</span> 게임 아이템
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POWER_UPS.map((p) => {
            const count = stats.inventory[p.id] ?? 0;
            const lacking = p.price - spendable;
            const full = count >= POWER_UP_MAX;
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 flex lg:flex-col items-center gap-3 lg:text-center"
              >
                <img
                  src={GAME_ASSETS[p.image]}
                  alt=""
                  className="w-16 h-16 shrink-0 object-contain"
                  draggable={false}
                />
                <div className="flex-1 min-w-0 w-full space-y-1.5">
                  <div className="flex items-center justify-between gap-2 lg:flex-col lg:gap-1">
                    <span className="text-sm font-bold text-slate-800">{p.name}</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                      보유 {count}/{POWER_UP_MAX}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                  <div className="flex items-center gap-2">
                    <StarPrice price={p.price} affordable={lacking <= 0 && !full} />
                    <BuyButton lacking={lacking} full={full} onBuy={() => handleBuyPowerUp(p.id)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
