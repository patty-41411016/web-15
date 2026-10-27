import React, { useState } from 'react';
import { X, Check, Maximize2, Users, BedDouble, Anchor, ArrowRight, Compass } from 'lucide-react';
import { RoomType, RATE_PACKAGES } from '../data/hotelData';
import { ResilientImage } from './ResilientImage';

interface RoomDetailModalProps {
  room: RoomType | null;
  onClose: () => void;
  onSelectForBooking: (room: RoomType, packageId: string, bedOption: string) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onSelectForBooking,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'primary' | 'secondary' | 'blueprint'>('primary');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(RATE_PACKAGES[0].id);
  const [selectedBed, setSelectedBed] = useState<string>(room?.bedOptions[0] || '');

  React.useEffect(() => {
    if (room) {
      setSelectedBed(room.bedOptions[0]);
      setActiveMediaTab('primary');
    }
  }, [room]);

  if (!room) return null;

  const currentPkg = RATE_PACKAGES.find((p) => p.id === selectedPackageId) || RATE_PACKAGES[0];
  const calculatedNightlyPrice = Math.round(room.basePrice * currentPkg.priceMultiplier);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] text-[#1C1917] rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row border border-[#E5DEC9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-full pt-3 pb-1 bg-[#FAF8F5] flex items-center justify-center shrink-0">
          <div className="w-10 h-1.5 bg-[#D6CEBF] rounded-full" />
        </div>

        {/* Close Button (44x44px minimum touch target) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉房型詳情"
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 min-w-[44px] min-h-[44px] rounded-full bg-[#1C1917]/80 text-[#FAF8F5] hover:bg-[#1C1917] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Gallery & Architectural Blueprint */}
        <div className="w-full md:w-1/2 bg-[#F2ECE1] flex flex-col justify-between shrink-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1C1917]">
            {activeMediaTab === 'primary' && (
              <ResilientImage
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            )}
            {activeMediaTab === 'secondary' && (
              <ResilientImage
                src={room.secondaryImage}
                alt={`${room.name} 運河景觀`}
                className="w-full h-full object-cover"
              />
            )}
            {activeMediaTab === 'blueprint' && (
              <div className="w-full h-full bg-[#16382C] text-[#FAF8F5] p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#FAF8F5]/20 pb-3">
                  <div>
                    <p className="text-xs text-[#D4AF37] tracking-wider">ARCHITECTURAL SPATIAL PLAN</p>
                    <h4 className="font-display text-lg font-semibold">{room.name} · 空間配置圖</h4>
                  </div>
                  <span className="font-mono-num text-xs text-[#FAF8F5]/80">
                    {room.sizePing} 坪 ({room.sizeSqm} m²)
                  </span>
                </div>

                {/* Architectural SVG Schematic */}
                <div className="my-auto py-3">
                  <svg viewBox="0 0 400 200" className="w-full h-36 stroke-[#FAF8F5]/80 fill-none" strokeWidth="1.5">
                    {/* Outer walls */}
                    <rect x="20" y="15" width="360" height="170" rx="4" className="fill-[#FAF8F5]/5" />
                    {/* Balcony zone */}
                    <rect x="290" y="15" width="90" height="170" className="fill-[#D4AF37]/15 stroke-[#D4AF37]" strokeDasharray="4 2" />
                    <text x="335" y="95" textAnchor="middle" className="fill-[#D4AF37] text-[10px] stroke-none font-sans">
                      親水觀景露台
                    </text>
                    <text x="335" y="112" textAnchor="middle" className="fill-[#FAF8F5]/80 text-[9px] stroke-none font-mono">
                      {room.floorPlanSpecs.balconyPing}
                    </text>
                    {/* Bedroom zone */}
                    <rect x="130" y="15" width="160" height="115" className="fill-[#FAF8F5]/5" />
                    <rect x="165" y="35" width="90" height="65" rx="3" className="stroke-[#FAF8F5] fill-[#FAF8F5]/10" />
                    <text x="210" y="72" textAnchor="middle" className="fill-[#FAF8F5] text-[10px] stroke-none font-sans">
                      主臥睡眠區
                    </text>
                    {/* Living salon zone */}
                    <rect x="130" y="130" width="160" height="55" className="fill-[#FAF8F5]/5" />
                    <text x="210" y="162" textAnchor="middle" className="fill-[#FAF8F5]/90 text-[10px] stroke-none font-sans">
                      安達魯西亞起居沙龍 ({room.floorPlanSpecs.indoorPing})
                    </text>
                    {/* Bath & Foyer zone */}
                    <rect x="20" y="15" width="110" height="115" className="fill-[#FAF8F5]/5" />
                    <circle cx="65" cy="58" r="22" className="stroke-[#FAF8F5]/90 fill-[#FAF8F5]/10" />
                    <text x="75" y="110" textAnchor="middle" className="fill-[#FAF8F5]/90 text-[9px] stroke-none font-sans">
                      景觀浴池與乾濕分離衛浴
                    </text>
                    {/* Entrance */}
                    <rect x="20" y="130" width="110" height="55" className="fill-[#FAF8F5]/5" />
                    <text x="75" y="162" textAnchor="middle" className="fill-[#FAF8F5]/75 text-[9px] stroke-none font-sans">
                      玄關 · 迷你吧 · 衣帽間
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FAF8F5]/20 text-xs">
                  <div>
                    <span className="text-[#FAF8F5]/60">室內挑高：</span>
                    <span className="font-mono-num">{room.floorPlanSpecs.ceilingHeight}</span>
                  </div>
                  <div>
                    <span className="text-[#FAF8F5]/60">衛浴配置：</span>
                    <span>{room.floorPlanSpecs.bathType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Media View Switcher Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#1C1917]/80 backdrop-blur-md rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('primary')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                    activeMediaTab === 'primary'
                      ? 'bg-[#FAF8F5] text-[#1C1917]'
                      : 'text-[#FAF8F5]/80 hover:text-white'
                  }`}
                >
                  客房實景
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('secondary')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                    activeMediaTab === 'secondary'
                      ? 'bg-[#FAF8F5] text-[#1C1917]'
                      : 'text-[#FAF8F5]/80 hover:text-white'
                  }`}
                >
                  窗外運河視野
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('blueprint')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                    activeMediaTab === 'blueprint'
                      ? 'bg-[#FAF8F5] text-[#1C1917]'
                      : 'text-[#FAF8F5]/80 hover:text-white'
                  }`}
                >
                  空間配置圖
                </button>
              </div>
            </div>
          </div>

          {/* Architectural Specs & Highlights on Left Column */}
          <div className="p-5 md:p-6 space-y-4">
            <div className="text-xs text-[#57534E] flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{room.dockZone}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{room.sizePing} 坪 ({room.sizeSqm} m²)</span>
              <span aria-hidden="true">·</span>
              <span>最多入住 {room.maxGuests} 位</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#1C1917] tracking-wide">專屬房型禮遇與空間亮點</h4>
              <ul className="space-y-1.5">
                {room.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#44403C]">
                    <Check className="w-3.5 h-3.5 text-[#0F4C3A] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#E5DEC9]">
              <h4 className="text-xs font-semibold text-[#1C1917] mb-2">客房設備與備品清單</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-[#57534E]">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="truncate">
                    · {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Configuration Module */}
        <div className="w-full md:w-1/2 p-5 md:p-7 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-[#9A5B32] font-medium mb-1">
                {room.category} · {room.englishName}
              </p>
              <h2 id="room-modal-title" className="font-display text-2xl md:text-3xl font-semibold text-[#1C1917]">
                {room.name}
              </h2>
              <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                {room.longDesc}
              </p>
            </div>

            {/* Step 1: Bed Option Selector */}
            <div className="space-y-2 pt-2 border-t border-[#E5DEC9]">
              <label className="block text-xs font-semibold text-[#1C1917]">
                1. 選擇床型配置
              </label>
              <div className="grid grid-cols-1 gap-2">
                {room.bedOptions.map((bedOpt) => (
                  <button
                    key={bedOpt}
                    type="button"
                    onClick={() => setSelectedBed(bedOpt)}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedBed === bedOpt
                        ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 text-[#0F4C3A]'
                        : 'border-[#E5DEC9] bg-white text-[#44403C] hover:border-[#1C1917]/40'
                    }`}
                  >
                    <span>{bedOpt}</span>
                    {selectedBed === bedOpt && <Check className="w-4 h-4 text-[#0F4C3A] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Rate Package Selector */}
            <div className="space-y-2.5 pt-2 border-t border-[#E5DEC9]">
              <label className="block text-xs font-semibold text-[#1C1917]">
                2. 選擇住房專案 (皆含應許運河遊艇巡航)
              </label>
              <div className="space-y-2.5">
                {RATE_PACKAGES.map((pkg) => {
                  const pkgPrice = Math.round(room.basePrice * pkg.priceMultiplier);
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? 'border-[#0F4C3A] bg-[#0F4C3A]/5'
                          : 'border-[#E5DEC9] bg-white hover:border-[#1C1917]/30'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-[#1C1917]">{pkg.name}</span>
                        <span className="font-mono-num text-sm font-semibold text-[#0F4C3A] shrink-0">
                          NT$ {pkgPrice.toLocaleString()} <span className="text-xs font-normal text-[#57534E]">/ 晚</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] mt-1">{pkg.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky / Bottom Purchase Action Bar */}
          <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-4 bg-[#FAF8F5]">
            <div>
              <p className="text-xs text-[#57534E]">
                專案每晚房價 (今日剩餘 <span className="font-mono-num text-[#9A5B32] font-semibold">{room.remainingRooms}</span> 間)
              </p>
              <p className="font-mono-num text-2xl font-bold text-[#1C1917]">
                NT$ {calculatedNightlyPrice.toLocaleString()}
                <span className="text-xs font-normal text-[#57534E] ml-1">起 / 晚 (未稅)</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectForBooking(room, selectedPackageId, selectedBed)}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
            >
              <span>立即預訂此房型</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
