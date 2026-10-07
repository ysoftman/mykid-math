import confetti from 'canvas-confetti';
import type React from 'react';
import type { UserStats } from '../types/math';
import { sound } from '../utils/audio';
import { KID_CALL } from '../utils/profile';
import { buyItem, equipItem, SHOP_ITEMS, type ShopSlot } from '../utils/storage';

const SLOTS: { slot: ShopSlot; title: string; icon: string }[] = [
  { slot: 'hat', title: '모자', icon: '🎩' },
  { slot: 'pet', title: '펫', icon: '🐾' },
  { slot: 'theme', title: '배너 테마', icon: '🎨' },
];

interface ShopProps {
  stats: UserStats;
  onStatsChanged: () => void;
}

export const Shop: React.FC<ShopProps> = ({ stats, onStatsChanged }) => {
  const spendable = stats.stars - stats.spentStars;
  const iconOf = (id?: string) => SHOP_ITEMS.find((item) => item.id === id)?.icon;
  const hat = iconOf(stats.equipped.hat);
  const pet = iconOf(stats.equipped.pet);

  const handleBuy = (itemId: string) => {
    if (!buyItem(itemId)) return;
    sound.playCorrect();
    confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    onStatsChanged();
  };

  const handleEquip = (itemId: string | null, slot: ShopSlot) => {
    sound.playPop();
    equipItem(itemId, slot);
    onStatsChanged();
  };

  return (
    <div className="space-y-6">
      {/* Avatar preview + wallet */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-28 h-28 shrink-0 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center">
          <span className="text-6xl">🧒</span>
          {hat && <span className="absolute -top-5 text-5xl">{hat}</span>}
          {pet && <span className="absolute -bottom-1 -right-3 text-4xl">{pet}</span>}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-black text-slate-800">🛍️ {KID_CALL}의 별 상점</h2>
          <p className="text-xs text-slate-500">
            문제를 풀어 모은 별로 모자, 펫, 배너 테마를 사서 꾸며 보세요! 별을 써도 레벨은
            그대로예요.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-center">
          <div className="text-xs font-bold text-amber-700">쓸 수 있는 별</div>
          <div className="text-3xl font-black text-amber-900">⭐ {spendable}</div>
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
                  {item.gradient ? (
                    <div
                      className={`w-full h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-2xl`}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    <span className="text-4xl">{item.icon}</span>
                  )}
                  <div className="text-sm font-bold text-slate-800">{item.name}</div>

                  {equipped ? (
                    <>
                      <span className="text-xs font-bold text-indigo-700">✨ 착용 중</span>
                      <button
                        onClick={() => handleEquip(null, slot)}
                        className="w-full text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
                      >
                        {slot === 'theme' ? '기본으로' : '벗기'}
                      </button>
                    </>
                  ) : owned ? (
                    <button
                      onClick={() => handleEquip(item.id, slot)}
                      className="w-full text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      착용하기
                    </button>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-amber-700">⭐ {item.price}</span>
                      <button
                        onClick={() => handleBuy(item.id)}
                        disabled={lacking > 0}
                        className="w-full text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                      >
                        {lacking > 0 ? `별 ${lacking}개 더 모아요` : '사기'}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
