import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Calendar,
  Users,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  ROOMS,
  RATE_PACKAGES,
  ADDON_EXPERIENCES,
  PROMO_CODES,
  RoomType,
  BookingRecord,
} from '../data/hotelData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom: RoomType;
  initialPackageId: string;
  initialBedChoice: string;
  initialCheckIn: string;
  initialCheckOut: string;
  initialAdults: number;
  initialChildren: number;
  initialPets: number;
  selectedAttractionNames: string[];
  onBookingSuccess: (record: BookingRecord) => void;
}

const SPECIAL_REQUEST_OPTIONS = [
  '需準備嬰兒床、澡盆與蒸氣消毒鍋',
  '安排高樓層開闊運河視野',
  '安排鄰近碼頭與電梯客房 (長輩友善)',
  '當月壽星 / 結婚週年紀念',
  '需準備毛孩專屬碗架與尿布墊',
  '素食早餐需求 (全素 / 蛋奶素)',
];

const SHUTTLE_SLOTS = [
  '自行開車前往 (免費園區專屬平面車位)',
  '13:40 花蓮火車站(前站遊客中心) 定時接駁車',
  '14:40 花蓮火車站(前站遊客中心) 定時接駁車',
  '15:40 花蓮火車站(前站遊客中心) 定時接駁車',
  '16:40 花蓮火車站(前站遊客中心) 定時接駁車',
  '14:15 花蓮機場 (抵達出口) 預約接駁車',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialRoom,
  initialPackageId,
  initialBedChoice,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  initialPets,
  selectedAttractionNames,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [roomId, setRoomId] = useState<string>(initialRoom.id);
  const [packageId, setPackageId] = useState<string>(initialPackageId || RATE_PACKAGES[0].id);
  const [bedChoice, setBedChoice] = useState<string>(initialBedChoice || initialRoom.bedOptions[0]);
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [adults, setAdults] = useState<number>(initialAdults);
  const [children, setChildren] = useState<number>(initialChildren);
  const [pets, setPets] = useState<number>(initialPets);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [promoInput, setPromoInput] = useState<string>('OK2026');
  const [appliedPromo, setAppliedPromo] = useState<string>('OK2026');
  const [promoFeedback, setPromoFeedback] = useState<string>('已套用：官網直訂早鳥禮遇 92 折');

  // Step 2 State
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('15:00 – 16:30');
  const [shuttleSlot, setShuttleSlot] = useState<string>(SHUTTLE_SLOTS[0]);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Step 3 State: Multi-Payment
  const [paymentMethod, setPaymentMethod] = useState<
    'credit_card' | 'line_pay' | 'apple_pay' | 'travel_card' | 'atm_transfer' | 'hotel_pay'
  >('credit_card');
  const [cardNumber, setCardNumber] = useState<string>('4311 9588 2026 8899');
  const [cardName, setCardName] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('888');
  const [installmentMonths, setInstallmentMonths] = useState<1 | 3 | 6>(1);
  const [travelCardBank, setTravelCardBank] = useState<string>('玉山銀行 國民旅遊卡');
  const [travelCardSubsidy, setTravelCardSubsidy] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Step 4 State: Confirmed Booking Record
  const [confirmedRecord, setConfirmedRecord] = useState<BookingRecord | null>(null);

  // Sync props when opened with a new room
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRoomId(initialRoom.id);
      setPackageId(initialPackageId || RATE_PACKAGES[0].id);
      setBedChoice(initialBedChoice || initialRoom.bedOptions[0]);
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setAdults(initialAdults);
      setChildren(initialChildren);
      setPets(initialPets);
      setFormError('');
    }
  }, [
    isOpen,
    initialRoom,
    initialPackageId,
    initialBedChoice,
    initialCheckIn,
    initialCheckOut,
    initialAdults,
    initialChildren,
    initialPets,
  ]);

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.id === roomId) || ROOMS[0],
    [roomId]
  );

  const selectedPackage = useMemo(
    () => RATE_PACKAGES.find((p) => p.id === packageId) || RATE_PACKAGES[0],
    [packageId]
  );

  // Calculate nights
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Price calculations
  const pricing = useMemo(() => {
    const nightlyRate = Math.round(selectedRoom.basePrice * selectedPackage.priceMultiplier);
    const roomSubtotal = nightlyRate * nights * roomCount;

    let addonsTotal = 0;
    const selectedAddonsList: { id: string; name: string; quantity: number; price: number }[] = [];
    ADDON_EXPERIENCES.forEach((addon) => {
      const qty = addonQuantities[addon.id] || 0;
      if (qty > 0) {
        addonsTotal += addon.price * qty;
        selectedAddonsList.push({
          id: addon.id,
          name: addon.name,
          quantity: qty,
          price: addon.price,
        });
      }
    });

    const promo = appliedPromo ? PROMO_CODES[appliedPromo] : undefined;
    let discountAmount = 0;
    if (promo) {
      if (promo.discountRate) {
        discountAmount = Math.round(roomSubtotal * promo.discountRate);
      } else if (promo.flatOff) {
        discountAmount = promo.flatOff;
      }
    }

    const discountedSubtotal = Math.max(0, roomSubtotal - discountAmount) + addonsTotal;
    const taxAndService = Math.round(discountedSubtotal * 0.1);
    const totalAmount = discountedSubtotal + taxAndService;

    return {
      nightlyRate,
      roomSubtotal,
      addonsTotal,
      selectedAddonsList,
      discountAmount,
      taxAndService,
      totalAmount,
    };
  }, [selectedRoom, selectedPackage, nights, roomCount, addonQuantities, appliedPromo]);

  if (!isOpen) return null;

  const handleApplyPromo = (codeToApply?: string) => {
    const normalized = (codeToApply ?? promoInput).trim().toUpperCase();
    setPromoInput(normalized);
    if (!normalized) {
      setAppliedPromo('');
      setPromoFeedback('未套用優惠碼');
      return;
    }
    const found = PROMO_CODES[normalized];
    if (found) {
      setAppliedPromo(normalized);
      setPromoFeedback(`已套用：${found.label}`);
    } else {
      setAppliedPromo('');
      setPromoFeedback('查無此優惠代碼，請確認或點擊下方推薦代碼');
    }
  };

  const updateAddonQty = (id: string, delta: number) => {
    setAddonQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const toggleSpecialRequest = (req: string) => {
    setSpecialRequests((prev) =>
      prev.includes(req) ? prev.filter((item) => item !== req) : [...prev, req]
    );
  };

  const validateStep2 = () => {
    if (!guestName.trim()) {
      setFormError('請輸入代表住客姓名');
      return false;
    }
    const phoneClean = guestPhone.replace(/[-\s]/g, '');
    if (phoneClean.length < 8) {
      setFormError('請輸入有效的聯絡手機或電話號碼（例如 0912-345-678）');
      return false;
    }
    if (!guestEmail.includes('@')) {
      setFormError('請輸入有效的電子信箱以接收電子訂房確認單與遊艇通行證');
      return false;
    }
    setFormError('');
    return true;
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const paymentLabels: Record<BookingRecord['paymentMethod'], string> = {
        credit_card: `信用卡線上授權 (${installmentMonths === 1 ? '一次付清' : `${installmentMonths}期0利率`})`,
        line_pay: 'LINE Pay 行動支付即時扣款',
        apple_pay: 'Apple Pay / Google Pay 感應支付',
        travel_card: `${travelCardBank} (${travelCardSubsidy ? '已登錄國旅補助檢核' : '一般刷卡'})`,
        atm_transfer: 'ATM 專屬虛擬帳號匯款',
        hotel_pay: '到店付款 (信用卡擔保訂房)',
      };

      const statusMap: Record<BookingRecord['paymentMethod'], BookingRecord['paymentStatus']> = {
        credit_card: '已付款確認',
        line_pay: '已付款確認',
        apple_pay: '已付款確認',
        travel_card: '已付款確認',
        atm_transfer: '待匯款保留',
        hotel_pay: '信用卡擔保確認',
      };

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const dateCompact = checkIn.replace(/-/g, '');
      const combinedNote = [
        customNote.trim(),
        selectedAttractionNames.length > 0
          ? `預計順遊縱谷行程：${selectedAttractionNames.join('、')}`
          : '',
      ]
        .filter(Boolean)
        .join(' ｜ ');

      const newRecord: BookingRecord = {
        bookingId: `OKH-${dateCompact}-${randomSuffix}`,
        createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        pets,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        roomCount,
        bedChoice,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        addons: pricing.selectedAddonsList,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestEmail: guestEmail.trim(),
        arrivalTime,
        shuttleSlot,
        specialRequests,
        customNote: combinedNote,
        paymentMethod,
        paymentMethodLabel: paymentLabels[paymentMethod],
        paymentStatus: statusMap[paymentMethod],
        roomSubtotal: pricing.roomSubtotal,
        addonsTotal: pricing.addonsTotal,
        taxAndService: pricing.taxAndService,
        discountAmount: pricing.discountAmount,
        totalAmount: pricing.totalAmount,
        promoCodeUsed: appliedPromo || undefined,
      };

      setIsProcessingPayment(false);
      setConfirmedRecord(newRecord);
      setStep(4);
      onBookingSuccess(newRecord);
    }, 550);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/65 backdrop-blur-sm p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-engine-title"
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-[#FAF8F5] text-[#1C1917] rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col border border-[#E5DEC9] shadow-2xl">
        {/* Top Header & Progress Bar */}
        <div className="px-5 py-4 bg-[#1C1917] text-[#FAF8F5] flex items-center justify-between border-b border-[#2E2A27] shrink-0">
          <div>
            <p className="text-xs text-[#D4AF37] tracking-wider">ok HOTEL · 線上即時訂房中心</p>
            <h2 id="booking-engine-title" className="font-display text-lg md:text-xl font-semibold">
              {step === 1 && '步驟 1 / 3：確認房型、專案與加購體驗'}
              {step === 2 && '步驟 2 / 3：填寫住客資料與接駁預約'}
              {step === 3 && '步驟 3 / 3：選擇多元支付方式完成預訂'}
              {step === 4 && '預訂完成 · 官方電子住宿確認單'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="關閉訂房視窗"
            className="min-w-[44px] min-h-[44px] rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Strip */}
        {step < 4 && (
          <div className="grid grid-cols-3 bg-[#F2ECE1] border-b border-[#E5DEC9] text-xs shrink-0">
            {[
              { num: 1, label: '1. 房型與體驗加購' },
              { num: 2, label: '2. 住客與接駁預約' },
              { num: 3, label: '3. 多元支付結帳' },
            ].map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < step) setStep(item.num as 1 | 2 | 3);
                  if (item.num === 2 && step === 1) setStep(2);
                }}
                className={`py-2.5 px-3 font-medium text-center transition-colors border-b-2 ${
                  step === item.num
                    ? 'border-[#0F4C3A] text-[#0F4C3A] bg-[#FAF8F5]'
                    : step > item.num
                    ? 'border-transparent text-[#1C1917] hover:bg-[#FAF8F5]/50'
                    : 'border-transparent text-[#78716C]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* Left 7 Cols: Configuration */}
              <div className="lg:col-span-7 space-y-6">
                {/* Dates & Guests */}
                <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                  <h3 className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0F4C3A]" />
                    <span>入住日期與人數配置</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">入住日期 (Check-in 15:00後)</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#D6CEBF] text-sm font-mono-num focus:outline-none focus:border-[#0F4C3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">退房日期 (Check-out 11:00前)</label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#D6CEBF] text-sm font-mono-num focus:outline-none focus:border-[#0F4C3A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">預訂間數</label>
                      <select
                        value={roomCount}
                        onChange={(e) => setRoomCount(Number(e.target.value))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} 間房</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">成人</label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                          <option key={n} value={n}>{n} 位成人</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">孩童 (6-12歲)</label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} 位孩童</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">攜帶毛孩</label>
                      <select
                        value={pets}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPets(val);
                          if (val > 0 && roomId !== 'pet-villa-suite') {
                            setRoomId('pet-villa-suite');
                          }
                        }}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                      >
                        {[0, 1, 2].map((n) => (
                          <option key={n} value={n}>{n} 隻毛孩</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Room & Bed Selector */}
                <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                  <h3 className="text-sm font-semibold text-[#1C1917]">選擇房型與床型配置</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">選擇入住房型</label>
                      <select
                        value={roomId}
                        onChange={(e) => {
                          const newRoom = ROOMS.find((r) => r.id === e.target.value) || ROOMS[0];
                          setRoomId(newRoom.id);
                          setBedChoice(newRoom.bedOptions[0]);
                        }}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white font-medium"
                      >
                        {ROOMS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.sizePing}坪 · NT${r.basePrice.toLocaleString()}起)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#57534E] mb-1">選擇床型配置</label>
                      <select
                        value={bedChoice}
                        onChange={(e) => setBedChoice(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                      >
                        {selectedRoom.bedOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs text-[#57534E]">選擇住房專案</label>
                    <div className="space-y-2">
                      {RATE_PACKAGES.map((pkg) => {
                        const isSelected = pkg.id === packageId;
                        const rate = Math.round(selectedRoom.basePrice * pkg.priceMultiplier);
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setPackageId(pkg.id)}
                            className={`w-full p-3.5 rounded-xl border text-left transition-colors ${
                              isSelected
                                ? 'border-[#0F4C3A] bg-[#0F4C3A]/5'
                                : 'border-[#E5DEC9] hover:border-[#1C1917]/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-[#1C1917]">{pkg.name}</span>
                              <span className="font-mono-num text-sm font-semibold text-[#0F4C3A]">
                                NT$ {rate.toLocaleString()} / 晚
                              </span>
                            </div>
                            <p className="text-xs text-[#57534E] mt-1">{pkg.subtitle}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Add-on Resort Experiences */}
                <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1C1917]">加購園區生態體驗與美饌 (選填)</h3>
                    <p className="text-xs text-[#57534E]">預訂時一併加購享住客專屬保留席次</p>
                  </div>
                  <div className="divide-y divide-[#E5DEC9]">
                    {ADDON_EXPERIENCES.map((addon) => {
                      const qty = addonQuantities[addon.id] || 0;
                      return (
                        <div key={addon.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-[#9A5B32] font-medium">
                              {addon.category} · {addon.duration}
                            </p>
                            <p className="text-sm font-medium text-[#1C1917]">{addon.name}</p>
                            <p className="text-xs text-[#57534E] mt-0.5">{addon.description}</p>
                            <p className="font-mono-num text-xs font-semibold text-[#0F4C3A] mt-1">
                              NT$ {addon.price.toLocaleString()} / {addon.unit}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => updateAddonQty(addon.id, -1)}
                              aria-label={`減少 ${addon.name}`}
                              className="min-w-[40px] min-h-[40px] rounded-xl border border-[#D6CEBF] flex items-center justify-center hover:bg-[#F2ECE1] transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-mono-num text-sm font-semibold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateAddonQty(addon.id, 1)}
                              aria-label={`增加 ${addon.name}`}
                              className="min-w-[40px] min-h-[40px] rounded-xl border border-[#D6CEBF] flex items-center justify-center hover:bg-[#F2ECE1] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Price Summary & Promo Code */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-5 rounded-2xl bg-[#F2ECE1] border border-[#E5DEC9] space-y-4 sticky top-2">
                  <div className="flex items-start justify-between gap-3 border-b border-[#D6CEBF] pb-4">
                    <div>
                      <p className="text-xs text-[#9A5B32] font-medium">{selectedRoom.dockZone}</p>
                      <h4 className="font-display text-xl font-semibold text-[#1C1917]">
                        {selectedRoom.name}
                      </h4>
                      <p className="text-xs text-[#57534E] mt-1">
                        {bedChoice} · {selectedRoom.sizePing} 坪
                      </p>
                    </div>
                    <span className="font-mono-num text-xs font-semibold text-[#0F4C3A] shrink-0">
                      {nights} 晚 · {roomCount} 間
                    </span>
                  </div>

                  {/* Promo Code Box */}
                  <div className="space-y-2 border-b border-[#D6CEBF] pb-4">
                    <label className="block text-xs font-semibold text-[#1C1917]">
                      官網專屬優惠碼
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="輸入優惠碼 (如 OK2026)"
                        className="flex-1 min-h-[42px] px-3 rounded-xl border border-[#D6CEBF] bg-white text-xs font-mono-num uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo()}
                        className="px-4 min-h-[42px] rounded-xl bg-[#1C1917] text-white text-xs font-medium whitespace-nowrap hover:bg-[#332E2A]"
                      >
                        套用
                      </button>
                    </div>
                    <p className="text-xs text-[#0F4C3A] font-medium">{promoFeedback}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(PROMO_CODES).map(([code, info]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleApplyPromo(code)}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono-num transition-colors ${
                            appliedPromo === code
                              ? 'bg-[#0F4C3A] text-white'
                              : 'bg-white text-[#44403C] border border-[#D6CEBF] hover:border-[#1C1917]'
                          }`}
                        >
                          {code} ({info.label.slice(-4)})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Breakdown */}
                  <div className="space-y-2 text-xs text-[#44403C]">
                    <div className="flex justify-between">
                      <span>
                        {selectedPackage.name} ({nights}晚 × {roomCount}間)
                      </span>
                      <span className="font-mono-num">NT$ {pricing.roomSubtotal.toLocaleString()}</span>
                    </div>

                    {pricing.selectedAddonsList.map((ad) => (
                      <div key={ad.id} className="flex justify-between text-[#57534E]">
                        <span>加購：{ad.name} × {ad.quantity}</span>
                        <span className="font-mono-num">NT$ {(ad.price * ad.quantity).toLocaleString()}</span>
                      </div>
                    ))}

                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-[#0F4C3A] font-medium">
                        <span>優惠碼折抵 ({appliedPromo})</span>
                        <span className="font-mono-num">- NT$ {pricing.discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#57534E]">
                      <span>10% 渡假村服務費與稅金</span>
                      <span className="font-mono-num">NT$ {pricing.taxAndService.toLocaleString()}</span>
                    </div>

                    <div className="pt-3 border-t border-[#D6CEBF] flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-[#1C1917]">應付總金額 (含稅)</span>
                      <span className="font-mono-num text-2xl font-bold text-[#0F4C3A]">
                        NT$ {pricing.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {selectedAttractionNames.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/80 border border-[#D6CEBF] text-xs text-[#44403C]">
                      <span className="font-semibold text-[#1C1917]">已加入順遊景點備忘：</span>
                      <span>{selectedAttractionNames.join(' · ')}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full min-h-[48px] rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>下一步：填寫住客與接駁資訊</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto space-y-6">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                <h3 className="text-sm font-semibold text-[#1C1917]">代表住客聯絡資訊</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1">
                      住客姓名 (需與辦理入住證件相符) *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="例如：王大明"
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm focus:outline-none focus:border-[#0F4C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1">
                      行動電話 (發送簡訊與碼頭登船通知) *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="例如：0912-345-678"
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num focus:outline-none focus:border-[#0F4C3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1">
                      電子信箱 (寄送官方訂房確認單) *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm focus:outline-none focus:border-[#0F4C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1">預計抵達飯店時間</label>
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                    >
                      <option value="14:30 – 15:00 (提早寄放行李遊園)">14:30 – 15:00 (提早寄放行李遊園)</option>
                      <option value="15:00 – 16:30">15:00 – 16:30 (標準入住時段)</option>
                      <option value="16:30 – 18:00">16:30 – 18:00 (傍晚星光遊船時段)</option>
                      <option value="18:00 – 20:00">18:00 – 20:00</option>
                      <option value="20:00 後抵達">20:00 後抵達</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs text-[#57534E] mb-1">
                    花蓮火車站 / 花蓮機場 免費定時接駁巴士預約
                  </label>
                  <select
                    value={shuttleSlot}
                    onChange={(e) => setShuttleSlot(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm bg-white"
                  >
                    {SHUTTLE_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#1C1917]">貼心禮賓與特殊需求 (可複選)</h3>
                  <p className="text-xs text-[#57534E]">房務與禮賓團隊將提前為您準備就緒</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SPECIAL_REQUEST_OPTIONS.map((req) => {
                    const active = specialRequests.includes(req);
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => toggleSpecialRequest(req)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                          active
                            ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 text-[#0F4C3A]'
                            : 'border-[#E5DEC9] text-[#44403C] hover:border-[#1C1917]/30'
                        }`}
                      >
                        <span>{req}</span>
                        {active && <Check className="w-4 h-4 text-[#0F4C3A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs text-[#57534E] mb-1">其他備註事項 (飲食過敏、慶生需求等)</label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="如有任何需要禮賓團隊協助安排之事項，請在此填寫..."
                    className="w-full p-3 rounded-xl border border-[#D6CEBF] text-sm focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[48px] px-5 rounded-xl border border-[#D6CEBF] text-sm font-medium text-[#1C1917] hover:bg-[#F2ECE1] flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回修改房型</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="min-h-[48px] px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <span>下一步：選擇支付方式</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* Left 7 Cols: Multi-Payment Selector */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4">
                  <h3 className="text-sm font-semibold text-[#1C1917]">選擇支付方式 (支援 6 種多元付款)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'credit_card', title: '信用卡 / 金融卡', sub: '支援 3/6 期零利率', icon: CreditCard },
                      { id: 'line_pay', title: 'LINE Pay', sub: 'LINE Points 折抵', icon: Smartphone },
                      { id: 'apple_pay', title: 'Apple / Google Pay', sub: '生物辨識快速付款', icon: Smartphone },
                      { id: 'travel_card', title: '國民旅遊卡專區', sub: '自動檢核休假補助', icon: ShieldCheck },
                      { id: 'atm_transfer', title: 'ATM 虛擬帳號', sub: '24小時內匯款保留', icon: Building2 },
                      { id: 'hotel_pay', title: '到店付款擔保', sub: '入住時櫃檯結帳', icon: CheckCircle2 },
                    ].map((pm) => {
                      const IconComp = pm.icon;
                      const active = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id as BookingRecord['paymentMethod'])}
                          className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between min-h-[84px] ${
                            active
                              ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 text-[#0F4C3A]'
                              : 'border-[#E5DEC9] bg-white text-[#1C1917] hover:border-[#1C1917]/30'
                          }`}
                        >
                          <IconComp className={`w-4 h-4 ${active ? 'text-[#0F4C3A]' : 'text-[#9A5B32]'}`} />
                          <div className="mt-2">
                            <p className="text-xs font-semibold">{pm.title}</p>
                            <p className="text-[11px] text-[#57534E]">{pm.sub}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Payment Form Details */}
                  {(paymentMethod === 'credit_card' || paymentMethod === 'travel_card' || paymentMethod === 'hotel_pay') && (
                    <div className="pt-4 border-t border-[#E5DEC9] space-y-4">
                      {paymentMethod === 'travel_card' && (
                        <div className="p-3.5 rounded-xl bg-[#F2ECE1] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F4C3A]">
                              國民旅遊卡特約商店編號：808-992145 (旅宿業合格特約)
                            </span>
                          </div>
                          <div>
                            <label className="block text-xs text-[#57534E] mb-1">選擇國旅卡發卡銀行</label>
                            <select
                              value={travelCardBank}
                              onChange={(e) => setTravelCardBank(e.target.value)}
                              className="w-full min-h-[42px] px-3 rounded-xl border border-[#D6CEBF] text-xs bg-white"
                            >
                              <option value="玉山銀行 國民旅遊卡">玉山銀行 國民旅遊卡</option>
                              <option value="國泰世華 國民旅遊卡">國泰世華 國民旅遊卡</option>
                              <option value="聯邦銀行 國民旅遊卡">聯邦銀行 國民旅遊卡</option>
                              <option value="兆豐銀行 國民旅遊卡">兆豐銀行 國民旅遊卡</option>
                            </select>
                          </div>
                          <label className="flex items-center gap-2 text-xs text-[#1C1917] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={travelCardSubsidy}
                              onChange={(e) => setTravelCardSubsidy(e.target.checked)}
                              className="w-4 h-4 accent-[#0F4C3A]"
                            />
                            <span>自動上傳觀光署國民旅遊卡檢核系統（核銷公務人員休假補助費）</span>
                          </label>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#57534E] mb-1">
                            信用卡卡號 (支援 Visa / MasterCard / JCB / 美國運通)
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="4311 9588 2026 8899"
                            className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#57534E] mb-1">有效期限 (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#57534E] mb-1">安全碼 (CVV)</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="888"
                            className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D6CEBF] text-sm font-mono-num"
                          />
                        </div>
                      </div>

                      {paymentMethod === 'credit_card' && (
                        <div>
                          <label className="block text-xs text-[#57534E] mb-1.5">選擇分期零利率方案</label>
                          <div className="grid grid-cols-3 gap-2">
                            {([1, 3, 6] as const).map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setInstallmentMonths(m)}
                                className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                                  installmentMonths === m
                                    ? 'border-[#0F4C3A] bg-[#0F4C3A] text-white'
                                    : 'border-[#D6CEBF] text-[#44403C]'
                                }`}
                              >
                                {m === 1
                                  ? '一次付清'
                                  : `${m} 期 0 利率 (每期 NT$${Math.round(pricing.totalAmount / m).toLocaleString()})`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'line_pay' && (
                    <div className="p-4 rounded-xl bg-[#00C300]/10 border border-[#00C300]/30 space-y-2 text-xs text-[#1C1917]">
                      <p className="font-semibold text-[#008A00]">LINE Pay 官方安全授權通道</p>
                      <p className="text-[#44403C]">
                        點擊下方「確認付款完成預訂」後，將自動完成 LINE Pay 授權並支援全額或部分 LINE Points 點數折抵。
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 rounded-xl bg-[#F2ECE1] border border-[#D6CEBF] space-y-2 text-xs text-[#1C1917]">
                      <p className="font-semibold">Apple Pay / Google Pay 快速結帳</p>
                      <p className="text-[#44403C]">
                        使用裝置內建 Face ID 或 Touch ID 生物辨識驗證，無須手動輸入卡號即可秒速完成訂房授權。
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'atm_transfer' && (
                    <div className="p-4 rounded-xl bg-[#F2ECE1] border border-[#D6CEBF] space-y-2 text-xs text-[#1C1917]">
                      <p className="font-semibold text-[#0F4C3A]">ATM 虛擬帳號匯款說明</p>
                      <p className="text-[#44403C]">
                        確認送出後系統將立即產生專屬「臺灣銀行 (004)」16 碼虛擬帳號，為您保留房型 24 小時，匯款完成系統即自動入帳並發送簡訊。
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right 5 Cols: Final Verification Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-[#F2ECE1] border border-[#E5DEC9] space-y-4">
                  <h4 className="font-display text-lg font-semibold text-[#1C1917] border-b border-[#D6CEBF] pb-2">
                    預訂明細最終確認
                  </h4>

                  <div className="space-y-1.5 text-xs text-[#44403C]">
                    <p>
                      <span className="text-[#78716C]">代表住客：</span>
                      <span className="font-medium text-[#1C1917]">{guestName} ({guestPhone})</span>
                    </p>
                    <p>
                      <span className="text-[#78716C]">入住期間：</span>
                      <span className="font-mono-num text-[#1C1917]">{checkIn} 至 {checkOut} ({nights} 晚)</span>
                    </p>
                    <p>
                      <span className="text-[#78716C]">預訂房型：</span>
                      <span className="font-medium text-[#1C1917]">{selectedRoom.name} × {roomCount} 間</span>
                    </p>
                    <p>
                      <span className="text-[#78716C]">住房專案：</span>
                      <span>{selectedPackage.name}</span>
                    </p>
                    <p>
                      <span className="text-[#78716C]">接駁預約：</span>
                      <span>{shuttleSlot}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D6CEBF] flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-[#1C1917]">總計結帳金額</span>
                    <span className="font-mono-num text-2xl font-bold text-[#0F4C3A]">
                      NT$ {pricing.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleConfirmBooking}
                      className="w-full min-h-[48px] rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] disabled:opacity-60 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {isProcessingPayment
                          ? '正在加密授權並產生運河登船憑證...'
                          : `確認付款完成預訂 (NT$ ${pricing.totalAmount.toLocaleString()})`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full min-h-[44px] rounded-xl border border-[#D6CEBF] text-xs font-medium text-[#44403C] hover:bg-white"
                    >
                      返回上一步修改住客資料
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && confirmedRecord && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-[#E5DEC9] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F4C3A]">
                        {confirmedRecord.paymentStatus} · 應許運河遊艇席次已保留
                      </p>
                      <h3 className="font-display text-2xl font-bold text-[#1C1917] mt-0.5">
                        感謝您的預訂，{confirmedRecord.guestName} 貴賓
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1">
                        確認信與電子登船通行證已發送至 {confirmedRecord.guestEmail}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F2ECE1] text-left sm:text-right shrink-0">
                    <p className="text-[11px] text-[#57534E]">官方訂房確認編號</p>
                    <p className="font-mono-num text-base font-bold text-[#1C1917]">
                      {confirmedRecord.bookingId}
                    </p>
                  </div>
                </div>

                {/* Boarding Pass & Room Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E5DEC9]">
                  <div className="md:col-span-2 space-y-2 text-xs text-[#44403C]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[#78716C] block">入住日期</span>
                        <span className="font-mono-num font-semibold text-sm text-[#1C1917]">
                          {confirmedRecord.checkIn} (15:00後)
                        </span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block">退房日期</span>
                        <span className="font-mono-num font-semibold text-sm text-[#1C1917]">
                          {confirmedRecord.checkOut} (11:00前)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5DEC9] space-y-1">
                      <p>
                        <span className="text-[#78716C]">入住房型：</span>
                        <span className="font-semibold text-[#1C1917]">
                          {confirmedRecord.roomName} × {confirmedRecord.roomCount} 間 ({confirmedRecord.bedChoice})
                        </span>
                      </p>
                      <p>
                        <span className="text-[#78716C]">住房專案：</span>
                        <span>{confirmedRecord.packageName}</span>
                      </p>
                      <p>
                        <span className="text-[#78716C]">入住人數：</span>
                        <span>
                          {confirmedRecord.adults} 位成人 · {confirmedRecord.children} 位孩童
                          {confirmedRecord.pets > 0 ? ` · ${confirmedRecord.pets} 隻毛孩` : ''}
                        </span>
                      </p>
                      <p>
                        <span className="text-[#78716C]">接駁安排：</span>
                        <span>{confirmedRecord.shuttleSlot}</span>
                      </p>
                      <p>
                        <span className="text-[#78716C]">支付方式：</span>
                        <span>{confirmedRecord.paymentMethodLabel}</span>
                      </p>
                      {confirmedRecord.paymentMethod === 'atm_transfer' && (
                        <p className="text-[#9A5B32] font-mono-num font-semibold">
                          專屬匯款帳號：(004 臺灣銀行) 9527-2026-8810-4912
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Digital Check-in & Lagoon Boat Pass QR */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E5DEC9] flex flex-col items-center justify-center text-center">
                    <p className="text-[11px] font-semibold text-[#0F4C3A] mb-2">
                      快速報到 & 應許運河登船碼
                    </p>
                    <svg
                      viewBox="0 0 100 100"
                      className="w-24 h-24 stroke-[#1C1917] fill-[#1C1917]"
                      aria-label="電子報到 QR Code"
                    >
                      <rect x="8" y="8" width="26" height="26" fill="none" strokeWidth="6" />
                      <rect x="15" y="15" width="12" height="12" />
                      <rect x="66" y="8" width="26" height="26" fill="none" strokeWidth="6" />
                      <rect x="73" y="15" width="12" height="12" />
                      <rect x="8" y="66" width="26" height="26" fill="none" strokeWidth="6" />
                      <rect x="15" y="73" width="12" height="12" />
                      <rect x="42" y="12" width="6" height="6" />
                      <rect x="52" y="20" width="6" height="14" />
                      <rect x="42" y="42" width="16" height="16" />
                      <rect x="12" y="44" width="18" height="6" />
                      <rect x="66" y="44" width="8" height="18" />
                      <rect x="80" y="50" width="10" height="8" />
                      <rect x="44" y="68" width="12" height="6" />
                      <rect x="64" y="70" width="14" height="14" />
                      <rect x="82" y="78" width="8" height="12" />
                    </svg>
                    <p className="font-mono-num text-[11px] text-[#57534E] mt-2">
                      {confirmedRecord.bookingId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D6CEBF] text-xs font-medium text-[#1C1917] hover:bg-[#F2ECE1] flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>列印 / 儲存電子確認單</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0B382B] text-white text-sm font-medium"
                  >
                    完成並返回 ok HOTEL 首頁
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
