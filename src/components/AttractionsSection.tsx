import React, { useState } from 'react';
import { MapPin, Clock, Navigation, Plus, Check, Compass, ArrowRight } from 'lucide-react';
import { ATTRACTIONS, AttractionItem } from '../data/hotelData';
import { ResilientImage } from './ResilientImage';

interface AttractionsSectionProps {
  selectedAttractionIds: string[];
  onToggleAttraction: (id: string) => void;
  onOpenBookingWithItinerary: () => void;
}

export const AttractionsSection: React.FC<AttractionsSectionProps> = ({
  selectedAttractionIds,
  onToggleAttraction,
  onOpenBookingWithItinerary,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'全部景點' | '自然生態' | '山海冒險' | '人文歷史'>('全部景點');
  const [activeAttractionId, setActiveAttractionId] = useState<string>(ATTRACTIONS[0].id);

  const filteredAttractions = ATTRACTIONS.filter((item) =>
    categoryFilter === '全部景點' ? true : item.category === categoryFilter
  );

  const activeAttraction: AttractionItem =
    ATTRACTIONS.find((a) => a.id === activeAttractionId) || ATTRACTIONS[0];

  return (
    <section id="attractions" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#9A5B32] tracking-wider mb-2">
            HUALIEN RIFT VALLEY & PACIFIC COAST · 縱谷與山海行旅
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1C1917]">
            探索花東縱谷周邊秘境與路線規劃
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#44403C] leading-relaxed">
            ok HOTEL 坐落於花蓮壽豐鄉湧泉核心帶，距離雲山水夢幻湖與立川漁場僅 5–6 分鐘車程。點選下方地圖座標或景點卡片，即可預覽車程並將喜愛的景點加入您的住宿行程備忘。
          </p>
        </div>

        {/* Interactive Filter Controls (Functional Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-[#F2ECE1] rounded-xl border border-[#E5DEC9] overflow-x-auto no-scrollbar shrink-0">
          {(['全部景點', '自然生態', '山海冒險', '人文歷史'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#1C1917] text-[#FAF8F5] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Valley Route Map + Spotlight Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Left 7 Cols: Interactive SVG Topographic & Route Map of Hualien */}
        <div className="lg:col-span-7 rounded-2xl bg-[#16382C] text-[#FAF8F5] p-5 md:p-6 border border-[#0F4C3A] flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 z-10 pb-4 border-b border-[#FAF8F5]/15">
            <div>
              <p className="text-xs text-[#D4AF37]">INTERACTIVE VALLEY CONCIERGE MAP</p>
              <h3 className="font-display text-lg md:text-xl font-semibold">
                ok HOTEL 周邊景點車程雷達圖 (點擊地標切換詳情)
              </h3>
            </div>
            <span className="text-xs text-[#FAF8F5]/80 font-mono-num">
              飯店座標：花蓮縣壽豐鄉理想路 1 號
            </span>
          </div>

          {/* Interactive SVG Map Canvas */}
          <div className="relative w-full aspect-[16/10] my-4 rounded-xl bg-[#102B21] border border-[#FAF8F5]/10 overflow-hidden">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              {/* Central Mountain Range & Pacific Ocean Coastline styling */}
              <path
                d="M 0,0 L 35,0 Q 42,50 30,100 L 0,100 Z"
                className="fill-[#1B4332]/50"
              />
              <path
                d="M 78,0 Q 72,45 85,100 L 100,100 L 100,0 Z"
                className="fill-[#0D3B4C]/60"
              />
              {/* Highway 9 & Highway 11 dashed guide lines */}
              <path
                d="M 52,8 Q 48,50 48,92"
                className="stroke-[#FAF8F5]/20 fill-none"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />
              <path
                d="M 74,10 Q 70,50 78,92"
                className="stroke-[#D4AF37]/25 fill-none"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />

              {/* Connection Line from ok HOTEL (50, 58) to Active Attraction */}
              <line
                x1={50}
                y1={58}
                x2={activeAttraction.coordinates.x}
                y2={activeAttraction.coordinates.y}
                className="stroke-[#D4AF37]"
                strokeWidth="0.9"
                strokeDasharray="1.8 1.2"
              />
            </svg>

            {/* Geographic Labels */}
            <div className="absolute top-3 left-3 text-[11px] text-[#FAF8F5]/50 pointer-events-none">
              中央山脈山麓
            </div>
            <div className="absolute bottom-3 right-3 text-[11px] text-[#7DD3FC]/60 pointer-events-none">
              太平洋東海岸 (台11線)
            </div>

            {/* Center Anchor: ok HOTEL */}
            <div
              style={{ left: '50%', top: '58%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            >
              <div className="w-4 h-4 rounded-full bg-[#D4AF37] ring-4 ring-[#D4AF37]/30 shadow-md" />
              <span className="mt-1 px-2 py-0.5 rounded bg-[#1C1917]/90 text-[#D4AF37] text-[11px] font-semibold whitespace-nowrap border border-[#D4AF37]/40">
                ★ ok HOTEL 本館
              </span>
            </div>

            {/* Attraction Pins */}
            {ATTRACTIONS.map((attr) => {
              const isSelected = attr.id === activeAttraction.id;
              const inItinerary = selectedAttractionIds.includes(attr.id);
              return (
                <button
                  key={attr.id}
                  type="button"
                  onClick={() => setActiveAttractionId(attr.id)}
                  style={{ left: `${attr.coordinates.x}%`, top: `${attr.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none min-w-[44px] min-h-[44px] flex flex-col items-center justify-center`}
                  aria-label={`查看 ${attr.name} 路線資訊`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full transition-transform ${
                      isSelected
                        ? 'bg-white scale-125 ring-4 ring-white/40'
                        : inItinerary
                        ? 'bg-[#34D399] ring-2 ring-[#34D399]/40'
                        : 'bg-[#FAF8F5]/80 hover:scale-110'
                    }`}
                  />
                  <span
                    className={`mt-1 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-white text-[#1C1917] font-semibold shadow-md'
                        : 'bg-[#102B21]/90 text-[#FAF8F5]/90 border border-[#FAF8F5]/20'
                    }`}
                  >
                    {attr.name.split(' ')[0]} · {attr.driveMinutes}分
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Map Legend & Quick Route Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#FAF8F5]/80 pt-2">
            <div>
              <span>當前預覽路線：</span>
              <span className="text-white font-semibold">
                ok HOTEL → {activeAttraction.name}
              </span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-mono-num text-[#D4AF37]">
                車程約 {activeAttraction.driveMinutes} 分鐘 ({activeAttraction.distanceKm} km)
              </span>
            </div>
            <div>
              <span>接駁建議：{activeAttraction.shuttleInfo}</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Active Attraction Spotlight Card */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="relative aspect-[16/9] w-full bg-[#1C1917] overflow-hidden">
              <ResilientImage
                src={activeAttraction.image}
                alt={activeAttraction.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs text-[#FAF8F5]/80">
                  {activeAttraction.category} · 距離飯店 <span className="font-mono-num">{activeAttraction.distanceKm} km</span> · 車程 <span className="font-mono-num">{activeAttraction.driveMinutes} 分鐘</span>
                </p>
                <h3 className="font-display text-2xl font-semibold mt-0.5">
                  {activeAttraction.name}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-[#44403C] leading-relaxed">
                {activeAttraction.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#E5DEC9] text-xs text-[#57534E]">
                <p>
                  <span className="font-semibold text-[#1C1917]">最佳造訪時段：</span>
                  <span>{activeAttraction.bestTime} (建議停留 {activeAttraction.recommendedDuration})</span>
                </p>
                <p>
                  <span className="font-semibold text-[#1C1917]">交通與接駁：</span>
                  <span>{activeAttraction.shuttleInfo}</span>
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E5DEC9]">
                <p className="text-xs font-semibold text-[#1C1917]">必訪體驗亮點</p>
                <ul className="space-y-1 text-xs text-[#44403C]">
                  {activeAttraction.highlights.map((h, i) => (
                    <li key={i}>· {h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleAttraction(activeAttraction.id)}
              className={`flex-1 min-h-[46px] px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedAttractionIds.includes(activeAttraction.id)
                  ? 'bg-[#0F4C3A] text-white'
                  : 'bg-[#F2ECE1] text-[#1C1917] hover:bg-[#E5DEC9]'
              }`}
            >
              {selectedAttractionIds.includes(activeAttraction.id) ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已加入住宿順遊行程 ({selectedAttractionIds.length})</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>加入我的住宿順遊行程</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* All Filtered Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((item) => {
          const isIncluded = selectedAttractionIds.includes(item.id);
          const isFocused = activeAttraction.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveAttractionId(item.id)}
              className={`rounded-2xl bg-white border transition-all cursor-pointer p-5 flex flex-col justify-between ${
                isFocused
                  ? 'border-[#0F4C3A] shadow-sm'
                  : 'border-[#E5DEC9] hover:border-[#1C1917]/40'
              }`}
            >
              <div className="space-y-2.5">
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span className="text-[#9A5B32] font-medium">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">車程 {item.driveMinutes} 分鐘</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{item.distanceKm} km</span>
                </div>

                <h4 className="font-display text-xl font-semibold text-[#1C1917]">
                  {item.name}
                </h4>

                <p className="text-xs text-[#44403C] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                <span className="text-xs text-[#57534E] truncate">
                  建議停留 {item.recommendedDuration}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAttraction(item.id);
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isIncluded
                      ? 'bg-[#0F4C3A] text-white'
                      : 'bg-[#F2ECE1] text-[#1C1917] hover:bg-[#E5DEC9]'
                  }`}
                >
                  {isIncluded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已排入行程</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>加入行程</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Itinerary Summary Bar when user has selected attractions */}
      {selectedAttractionIds.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-[#F2ECE1] border border-[#D6CEBF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0F4C3A]">
              您的專屬花東縱谷順遊清單 ({selectedAttractionIds.length} 個景點)
            </p>
            <p className="text-sm text-[#1C1917] mt-0.5">
              已選：{ATTRACTIONS.filter((a) => selectedAttractionIds.includes(a.id)).map((a) => a.name).join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBookingWithItinerary}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-xs font-medium flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>帶入訂房備註並預訂房間</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
