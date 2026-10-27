import React, { useState } from 'react';
import { Clock, MapPin, ArrowUpRight, Check } from 'lucide-react';
import { FACILITIES, FacilityItem } from '../data/hotelData';
import { ResilientImage } from './ResilientImage';

interface FacilitiesSectionProps {
  onReserveFacilityWithRoom: (facility: FacilityItem) => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  onReserveFacilityWithRoom,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    '全部設施' | '運河水岸' | '自然生態' | '身心療癒' | '美饌饗宴' | '寵物友善'
  >('全部設施');
  const [expandedFacilityId, setExpandedFacilityId] = useState<string>(FACILITIES[0].id);

  const filteredFacilities = FACILITIES.filter((f) =>
    selectedCategory === '全部設施' ? true : f.category === selectedCategory
  );

  return (
    <section
      id="facilities"
      className="py-16 md:py-24 bg-[#F2ECE1]/70 border-y border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#9A5B32] tracking-wider mb-2">
              RESORT FACILITIES & ECOLOGICAL SANCTUARY · 園區設施與慢活體驗
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1C1917]">
              2.2 公里應許運河與萬坪豐之谷生態體驗
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#44403C] leading-relaxed">
              從穿梭於 16 座西班牙拱橋的無聲電動遊艇、中島鐘乳石岩洞溫水池，到佔地 5.7 公頃的豐之谷自然生態公園，讓每一刻停留都成為與自然共鳴的感官饗宴。
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9] overflow-x-auto no-scrollbar shrink-0">
            {(['全部設施', '運河水岸', '自然生態', '身心療癒', '美饌饗宴', '寵物友善'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#0F4C3A] text-white shadow-sm'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Asymmetric Bento Grid of Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {filteredFacilities.map((facility, idx) => {
            const isFeatured = idx === 0 && selectedCategory === '全部設施';
            const isExpanded = expandedFacilityId === facility.id;

            return (
              <div
                key={facility.id}
                className={`rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] overflow-hidden flex flex-col justify-between transition-colors ${
                  isFeatured ? 'lg:col-span-7' : idx === 1 && selectedCategory === '全部設施' ? 'lg:col-span-5' : 'lg:col-span-4'
                }`}
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative aspect-[16/9] w-full bg-[#1C1917] overflow-hidden">
                    <ResilientImage
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-xs text-[#FAF8F5]/85">
                        {facility.category} · {facility.highlightsMetric}
                      </p>
                      <h3 className="font-display text-xl md:text-2xl font-semibold mt-0.5">
                        {facility.indexNumber}. {facility.name}
                      </h3>
                    </div>
                  </div>

                  {/* Facility Body */}
                  <div className="p-5 md:p-6 space-y-4">
                    {/* Clean unboxed metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#57534E]">
                      <span>開放時間：{facility.openHours}</span>
                      <span aria-hidden="true">·</span>
                      <span>位置：{facility.locationZone}</span>
                    </div>

                    <p className="text-sm text-[#44403C] leading-relaxed">
                      {facility.summary}
                    </p>

                    {isExpanded && (
                      <ul className="space-y-1.5 pt-3 border-t border-[#E5DEC9] text-xs text-[#44403C]">
                        {facility.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#0F4C3A] shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 md:px-6 py-4 border-t border-[#E5DEC9] flex items-center justify-between gap-3 bg-white/50">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFacilityId(isExpanded ? '' : facility.id)
                    }
                    className="min-h-[40px] text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors whitespace-nowrap"
                  >
                    {isExpanded ? '收合詳細亮點' : '查看詳細導覽亮點'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onReserveFacilityWithRoom(facility)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#0F4C3A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <span>搭配住房預訂此體驗</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
