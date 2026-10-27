import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Users,
  Search,
  ArrowRight,
  Compass,
  BedDouble,
  Anchor,
  MapPin,
  FileText,
  Sparkles,
  Check,
  CreditCard,
  Phone,
  Train,
} from 'lucide-react';
import {
  ROOMS,
  RATE_PACKAGES,
  ATTRACTIONS,
  RESORT_PROOF,
  IMAGES,
  RoomType,
  FacilityItem,
  BookingRecord,
} from './data/hotelData';
import { ResilientImage } from './components/ResilientImage';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { FacilitiesSection } from './components/FacilitiesSection';
import { AttractionsSection } from './components/AttractionsSection';

const STORAGE_KEY = 'ok_hotel_bookings_v1';

// Helper to get default dates (tomorrow and day after tomorrow)
function getDefaultDates() {
  const today = new Date();
  const checkInDate = new Date(today);
  checkInDate.setDate(today.getDate() + 1);
  const checkOutDate = new Date(today);
  checkOutDate.setDate(today.getDate() + 2);

  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { checkIn: fmt(checkInDate), checkOut: fmt(checkOutDate) };
}

export default function App() {
  const defaultDates = useMemo(() => getDefaultDates(), []);

  // Search & Filter State
  const [checkIn, setCheckIn] = useState<string>(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState<string>(defaultDates.checkOut);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);
  const [roomCategory, setRoomCategory] = useState<
    '全部房型' | '雙人浪漫' | '家庭閣樓' | '尊榮套房' | '毛孩別墅'
  >('全部房型');

  // Modals State
  const [detailRoom, setDetailRoom] = useState<RoomType | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingTargetRoom, setBookingTargetRoom] = useState<RoomType>(ROOMS[0]);
  const [bookingTargetPackageId, setBookingTargetPackageId] = useState<string>(RATE_PACKAGES[0].id);
  const [bookingTargetBed, setBookingTargetBed] = useState<string>(ROOMS[0].bedOptions[0]);
  const [myBookingsOpen, setMyBookingsOpen] = useState<boolean>(false);

  // Selected Attractions for Itinerary
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>(['dream-lake']);

  // Saved Bookings State (with sample initial booking or localStorage)
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }, [bookings]);

  // Calculate nights for quick bar display
  const searchNights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      if (roomCategory !== '全部房型' && room.category !== roomCategory) {
        return false;
      }
      if (pets > 0 && room.id !== 'pet-villa-suite') {
        // Still show all if user explicitly selects another category, else prioritize pet friendly or capacity
      }
      return true;
    });
  }, [roomCategory, pets]);

  const selectedAttractionNames = useMemo(
    () =>
      ATTRACTIONS.filter((a) => selectedAttractionIds.includes(a.id)).map((a) => a.name),
    [selectedAttractionIds]
  );

  const handleOpenBooking = (
    room: RoomType,
    pkgId: string = RATE_PACKAGES[0].id,
    bedOpt?: string
  ) => {
    setDetailRoom(null);
    setBookingTargetRoom(room);
    setBookingTargetPackageId(pkgId);
    setBookingTargetBed(bedOpt || room.bedOptions[0]);
    setBookingModalOpen(true);
  };

  const handleToggleAttraction = (id: string) => {
    setSelectedAttractionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReserveFacilityWithRoom = (facility: FacilityItem) => {
    const recommendedRoom =
      facility.category === '寵物友善'
        ? ROOMS.find((r) => r.id === 'pet-villa-suite') || ROOMS[0]
        : ROOMS[0];
    const recommendedPkg =
      facility.id === 'ecological-park' ? 'pkg-all-inclusive' : 'pkg-hb';
    handleOpenBooking(recommendedRoom, recommendedPkg);
  };

  const handleBookingSuccess = (newRecord: BookingRecord) => {
    setBookings((prev) => [newRecord, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] pb-14 md:pb-0">
      {/* Top Bar Contract: Strictly 3 Zones (1. Single-element Brand Wordmark, 2. 5 Nav Links, 3. 1 Primary Action) */}
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DEC9] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-display text-xl md:text-2xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap"
        >
          ok HOTEL
        </a>

        {/* Zone 2: 5 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#44403C]">
          <a
            href="#rooms"
            className="hover:text-[#0F4C3A] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
          >
            客房介紹
          </a>
          <a
            href="#facilities"
            className="hover:text-[#0F4C3A] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
          >
            園區設施
          </a>
          <a
            href="#packages"
            className="hover:text-[#0F4C3A] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
          >
            專案禮遇
          </a>
          <a
            href="#attractions"
            className="hover:text-[#0F4C3A] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
          >
            縱谷景點
          </a>
          <button
            type="button"
            onClick={() => setMyBookingsOpen(true)}
            className="hover:text-[#0F4C3A] underline-offset-4 hover:underline transition-colors whitespace-nowrap cursor-pointer"
          >
            訂單查詢{bookings.length > 0 ? ` (${bookings.length})` : ''}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
            className="min-h-[40px] px-4 py-2 text-xs md:text-sm font-medium text-white bg-[#0F4C3A] hover:bg-[#0B382B] rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            立即訂房
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section with High-Impact 16:9 Lagoon Visual & Integrated Booking Bar */}
        <section className="relative">
          <div className="relative w-full min-h-[540px] md:min-h-[660px] flex items-center justify-center overflow-hidden bg-[#1C1917]">
            <ResilientImage
              src={IMAGES.heroLagoon}
              alt="ok HOTEL 應許運河與西班牙高第風格建築全景"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Measured Contrast Scrim ensuring >= 4.5:1 legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
              <div className="max-w-3xl space-y-5 text-[#FAF8F5]">
                {/* Unboxed Clean Regional Trust Marker inside Hero */}
                <p className="text-xs md:text-sm text-[#D4AF37] tracking-wider font-medium">
                  花蓮壽豐縱谷 · 2.2 公里環狀應許運河 · 西班牙安達魯西亞建築莊園
                </p>

                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-wide leading-[1.15] text-white">
                  乘著無聲遊艇，駛入花東縱谷的西班牙水岸莊園
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-[#FAF8F5]/90 leading-relaxed max-w-2xl">
                  ok HOTEL 渡假飯店結合高第曲線建築美學、萬坪豐之谷自然生態濕地與 16 座風格拱橋。推開鍛鐵陽台，讓中央山脈的晨嵐與翡翠色運河水光，開啟您的慢活假期。
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
                    className="min-h-[48px] px-7 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium flex items-center gap-2.5 transition-colors shadow-lg"
                  >
                    <span>線上預訂應許假期</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#rooms"
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-sm font-medium flex items-center transition-colors border border-white/25"
                  >
                    瀏覽 6 大主題房型
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Quick Availability & Rate Search Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-14 relative z-20">
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E5DEC9] shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                {/* Check-in */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#57534E] mb-1.5">
                    入住日期 (Check-in)
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                {/* Check-out */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#57534E] mb-1.5">
                    退房日期 (共 <span className="font-mono-num text-[#0F4C3A]">{searchNights}</span> 晚)
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                {/* Guests & Pets */}
                <div className="lg:col-span-3 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#57534E] mb-1.5">成人</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full min-h-[46px] px-2.5 rounded-xl border border-[#D6CEBF] text-xs sm:text-sm bg-[#FAF8F5] font-mono-num"
                    >
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>{n} 大</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#57534E] mb-1.5">孩童</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full min-h-[46px] px-2.5 rounded-xl border border-[#D6CEBF] text-xs sm:text-sm bg-[#FAF8F5] font-mono-num"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n} 小</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#57534E] mb-1.5">毛孩</label>
                    <select
                      value={pets}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPets(val);
                        if (val > 0) setRoomCategory('毛孩別墅');
                      }}
                      className="w-full min-h-[46px] px-2.5 rounded-xl border border-[#D6CEBF] text-xs sm:text-sm bg-[#FAF8F5] font-mono-num"
                    >
                      {[0, 1, 2].map((n) => (
                        <option key={n} value={n}>{n} 寵</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Search / Direct Book Button */}
                <div className="lg:col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      const targetRoom =
                        pets > 0
                          ? ROOMS.find((r) => r.id === 'pet-villa-suite') || ROOMS[0]
                          : adults + children >= 3
                          ? ROOMS.find((r) => r.id === 'santiago-loft') || ROOMS[0]
                          : ROOMS[0];
                      handleOpenBooking(targetRoom, RATE_PACKAGES[0].id);
                    }}
                    className="w-full min-h-[46px] px-5 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    <span>查詢空房與專案價</span>
                  </button>
                </div>
              </div>

              {/* Unboxed Direct Booking Perks Strip */}
              <div className="mt-4 pt-3 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-[#0F4C3A]">官網直訂保證禮遇</span>
                  <span aria-hidden="true">·</span>
                  <span>免費搭乘應許運河電動遊艇</span>
                  <span aria-hidden="true">·</span>
                  <span>花蓮火車站免費定時接駁</span>
                  <span aria-hidden="true">·</span>
                  <span>支援信用卡分期、LINE Pay、Apple Pay 與國旅卡</span>
                </div>
                <span className="font-mono-num text-[#9A5B32] font-medium">
                  早鳥優惠碼：OK2026 (享 92 折)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Complete Room Showcase Section (#rooms) */}
        <section id="rooms" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#9A5B32] tracking-wider mb-2">
                SPANISH GAUDI VILLAS & SUITES · 建築美學客房與別墅
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1C1917]">
                全系列河景客房、閣樓套房與毛孩別墅
              </h2>
              <p className="mt-3 text-sm md:text-base text-[#44403C] leading-relaxed">
                園區所有客房皆環繞 2.2 公里應許運河興建，以手工復古紅磚、百年榆木古董傢俱與鍛鐵陽台打造。每間客房皆享專屬島區碼頭與親水視野。
              </p>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F2ECE1] rounded-xl border border-[#E5DEC9] overflow-x-auto no-scrollbar shrink-0">
              {(['全部房型', '雙人浪漫', '家庭閣樓', '尊榮套房', '毛孩別墅'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRoomCategory(cat)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    roomCategory === cat
                      ? 'bg-[#1C1917] text-[#FAF8F5] shadow-sm'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Uniform Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredRooms.map((room) => (
              <article
                key={room.id}
                className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  {/* 4:3 Room Image */}
                  <div
                    onClick={() => setDetailRoom(room)}
                    className="relative aspect-[4/3] w-full bg-[#1C1917] overflow-hidden cursor-pointer group"
                  >
                    <ResilientImage
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span>{room.dockZone}</span>
                      <span className="font-mono-num">剩餘 {room.remainingRooms} 間</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6 space-y-3">
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#57534E]">
                      <span className="text-[#9A5B32] font-medium">{room.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{room.sizePing} 坪 ({room.sizeSqm} m²)</span>
                      <span aria-hidden="true">·</span>
                      <span>最多 {room.maxGuests} 人</span>
                    </div>

                    <div>
                      <h3
                        onClick={() => setDetailRoom(room)}
                        className="font-display text-2xl font-semibold text-[#1C1917] hover:text-[#0F4C3A] cursor-pointer transition-colors"
                      >
                        {room.name}
                      </h3>
                      <p className="text-xs text-[#78716C] mt-0.5">{room.beds}</p>
                    </div>

                    <p className="text-sm text-[#44403C] leading-relaxed line-clamp-2">
                      {room.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Price Baseline & Actions */}
                <div className="px-5 md:px-6 py-4 bg-[#FAF8F5] border-t border-[#E5DEC9] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#57534E]">一泊一食專案價</span>
                    <div>
                      <span className="font-mono-num text-xl font-bold text-[#1C1917]">
                        NT$ {room.basePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#57534E] ml-1">起 / 晚</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDetailRoom(room)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#D6CEBF] bg-white hover:bg-[#F2ECE1] text-xs font-medium text-[#1C1917] transition-colors whitespace-nowrap"
                    >
                      格局與完整備品
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(room, RATE_PACKAGES[0].id)}
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-xs font-medium text-white transition-colors whitespace-nowrap flex items-center justify-center gap-1"
                    >
                      <span>立即預訂</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Resort Facilities & Ecological Park Section (#facilities) */}
        <FacilitiesSection onReserveFacilityWithRoom={handleReserveFacilityWithRoom} />

        {/* 4. Curated Packages & Quantitative Proof Section (#packages) */}
        <section
          id="packages"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16"
        >
          <div>
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium text-[#9A5B32] tracking-wider mb-2">
                SEASONAL PACKAGES & HOSPITALITY PROOF · 年度住房專案與住客見證
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1C1917]">
                三大精選慢旅方案，一站式預訂水岸假期
              </h2>
              <p className="mt-3 text-sm md:text-base text-[#44403C] leading-relaxed">
                無論是渴望晨光遊河的輕旅行、品嚐里拉餐廳摩爾百匯的雙人饗宴，或是深度探索豐之谷自然生態公園的全包式假期，皆能享有官網直訂最優價格保證。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {RATE_PACKAGES.map((pkg, idx) => {
                const samplePrice = Math.round(ROOMS[0].basePrice * pkg.priceMultiplier);
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-6 border flex flex-col justify-between ${
                      idx === 1
                        ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917]'
                        : 'bg-white text-[#1C1917] border-[#E5DEC9]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className={idx === 1 ? 'text-[#D4AF37] font-medium' : 'text-[#9A5B32] font-medium'}>
                          0{idx + 1}. {idx === 1 ? '最受住客歡迎方案' : '官方直訂專案'}
                        </span>
                        <span className="font-mono-num">
                          雙人 NT$ {samplePrice.toLocaleString()} 起
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-semibold">{pkg.name}</h3>
                      <p className={`text-xs leading-relaxed ${idx === 1 ? 'text-[#FAF8F5]/80' : 'text-[#57534E]'}`}>
                        {pkg.subtitle}
                      </p>

                      <ul className="space-y-2 pt-3 border-t border-current/10 text-xs">
                        {pkg.perks.map((perk, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <Check
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                idx === 1 ? 'text-[#D4AF37]' : 'text-[#0F4C3A]'
                              }`}
                            />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-current/10 space-y-3">
                      <p className={`text-[11px] ${idx === 1 ? 'text-[#FAF8F5]/65' : 'text-[#78716C]'}`}>
                        {pkg.cancellationPolicy}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(ROOMS[0], pkg.id)}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                          idx === 1
                            ? 'bg-[#0F4C3A] hover:bg-[#14634C] text-white'
                            : 'bg-[#F2ECE1] hover:bg-[#E5DEC9] text-[#1C1917]'
                        }`}
                      >
                        <span>選擇此專案並挑選房型</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adjacent Claim-to-Proof Metrics & Real Attributable Testimonials */}
          <div className="p-6 md:p-10 rounded-2xl bg-[#F2ECE1] border border-[#E5DEC9] space-y-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-b border-[#D6CEBF] pb-8">
              {RESORT_PROOF.metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-mono-num text-2xl md:text-3xl font-bold text-[#0F4C3A]">
                    {m.value}
                  </p>
                  <p className="text-sm font-semibold text-[#1C1917]">{m.label}</p>
                  <p className="text-xs text-[#57534E] leading-relaxed">{m.context}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RESORT_PROOF.testimonials.map((t, idx) => (
                <blockquote
                  key={idx}
                  className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] flex flex-col justify-between space-y-4"
                >
                  <p className="text-xs md:text-sm text-[#44403C] leading-relaxed">
                    「{t.quote}」
                  </p>
                  <footer className="pt-3 border-t border-[#E5DEC9] text-xs">
                    <p className="font-semibold text-[#1C1917]">{t.author}</p>
                    <p className="text-[#57534E] mt-0.5">
                      {t.role} · {t.stayDate}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Nearby Attractions & Interactive Hualien Rift Valley Map (#attractions) */}
        <AttractionsSection
          selectedAttractionIds={selectedAttractionIds}
          onToggleAttraction={handleToggleAttraction}
          onOpenBookingWithItinerary={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
        />
      </main>

      {/* Quiet, Informative Footer */}
      <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-[#2E2A27] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#FAF8F5]/15">
          <div className="lg:col-span-4 space-y-3">
            <p className="font-display text-2xl font-bold tracking-tight text-white">
              ok HOTEL 渡假飯店
            </p>
            <p className="text-xs text-[#FAF8F5]/75 leading-relaxed">
              坐落於花蓮縣壽豐鄉花東縱谷核心，擁抱 2.2 公里應許運河、16 座安達魯西亞風格橋樑與 5.7 公頃豐之谷自然生態公園。
            </p>
            <div className="pt-2 space-y-1 text-xs text-[#FAF8F5]/80 font-mono-num">
              <p>地址：974 花蓮縣壽豐鄉理想路 1 號</p>
              <p>訂房專線：+886-3-865-6789</p>
              <p>禮賓信箱：concierge@okhotel-resort.com.tw</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-2.5 text-xs">
            <p className="font-semibold text-[#D4AF37]">園區導覽與服務</p>
            <ul className="space-y-2 text-[#FAF8F5]/75">
              <li><a href="#rooms" className="hover:text-white">西班牙高第風格客房與套房</a></li>
              <li><a href="#facilities" className="hover:text-white">應許運河電動遊艇巡航</a></li>
              <li><a href="#facilities" className="hover:text-white">豐之谷自然生態公園 & 竹筏</a></li>
              <li><a href="#packages" className="hover:text-white">一泊二食里拉摩爾饗宴專案</a></li>
              <li><a href="#attractions" className="hover:text-white">花東縱谷與太魯閣周邊景點</a></li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs">
            <p className="font-semibold text-[#D4AF37]">交通接駁與支援支付方式</p>
            <p className="text-[#FAF8F5]/75 leading-relaxed">
              免費接駁巴士：每日 13:40 / 14:40 / 15:40 / 16:40 於花蓮火車站前站遊客中心發車直達飯店（車程約 25 分鐘）。
            </p>
            <div className="pt-2 border-t border-[#FAF8F5]/15 text-[#FAF8F5]/75">
              <p className="font-medium text-white mb-1">多元支付支援：</p>
              <p>
                Visa · MasterCard · JCB · 美國運通 (支援 3/6 期零利率) · LINE Pay · Apple Pay · Google Pay · 國民旅遊卡特約商店 · ATM 虛擬帳號匯款
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <p>© 2026 ok HOTEL Resort & Lagoon. All rights reserved. 旅館業登記證編號：花蓮縣旅館 088 號</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMyBookingsOpen(true)}
              className="hover:text-white transition-colors"
            >
              查詢或取消訂單
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
              className="hover:text-white transition-colors"
            >
              立即線上訂房
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (<= 56px height, >= 44x44px touch targets, thumb-zone optimized) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E5DEC9] grid grid-cols-5 items-center px-1">
        <a
          href="#rooms"
          className="min-h-[44px] flex flex-col items-center justify-center text-[#44403C] hover:text-[#0F4C3A]"
        >
          <BedDouble className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">房型</span>
        </a>
        <a
          href="#facilities"
          className="min-h-[44px] flex flex-col items-center justify-center text-[#44403C] hover:text-[#0F4C3A]"
        >
          <Anchor className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">設施</span>
        </a>
        <a
          href="#attractions"
          className="min-h-[44px] flex flex-col items-center justify-center text-[#44403C] hover:text-[#0F4C3A]"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">景點</span>
        </a>
        <button
          type="button"
          onClick={() => setMyBookingsOpen(true)}
          className="min-h-[44px] flex flex-col items-center justify-center text-[#44403C] hover:text-[#0F4C3A] relative"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">
            訂單{bookings.length > 0 ? `(${bookings.length})` : ''}
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
          className="min-h-[40px] mx-1 rounded-xl bg-[#0F4C3A] text-white flex flex-col items-center justify-center shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">立即訂房</span>
        </button>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onSelectForBooking={(room, pkgId, bedOpt) =>
          handleOpenBooking(room, pkgId, bedOpt)
        }
      />

      {/* Multi-Step Booking & Multi-Payment Engine Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialRoom={bookingTargetRoom}
        initialPackageId={bookingTargetPackageId}
        initialBedChoice={bookingTargetBed}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults}
        initialChildren={children}
        initialPets={pets}
        selectedAttractionNames={selectedAttractionNames}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* My Bookings Lookup & Cancellation Modal */}
      <MyBookingsModal
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onStartNewBooking={() => handleOpenBooking(ROOMS[0], RATE_PACKAGES[0].id)}
      />
    </div>
  );
}
