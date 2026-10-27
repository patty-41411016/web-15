import React, { useState } from 'react';
import { X, Search, Calendar, Trash2, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { BookingRecord } from '../data/hotelData';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (bookingId: string) => void;
  onStartNewBooking: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onStartNewBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-bookings-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF8F5] text-[#1C1917] rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col border border-[#E5DEC9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#1C1917] text-[#FAF8F5] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#D4AF37]">ok HOTEL · 禮賓訂單管理</p>
            <h2 id="my-bookings-title" className="font-display text-xl font-semibold">
              線上訂房查詢與憑證管理 ({bookings.length} 筆)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉訂單查詢"
            className="min-w-[44px] min-h-[44px] rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-[#F2ECE1] border-b border-[#E5DEC9] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="輸入訂房編號 (如 OKH-...)、住客姓名或手機號碼查詢..."
              className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#D6CEBF] bg-white text-sm focus:outline-none focus:border-[#0F4C3A]"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <FileText className="w-10 h-10 text-[#9A5B32]/60 mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <p className="font-display text-lg font-semibold text-[#1C1917]">
                  目前尚無符合條件的訂房紀錄
                </p>
                <p className="text-xs text-[#57534E]">
                  您可立即預訂應許運河渡假套房，完成後訂單與登船憑證將自動保存於此。
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartNewBooking();
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-medium inline-flex items-center gap-2 hover:bg-[#0B382B]"
              >
                <span>立即前往預訂客房</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            filteredBookings.map((record) => (
              <div
                key={record.bookingId}
                className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                    <span className="font-semibold text-[#0F4C3A]">{record.paymentStatus}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num font-semibold text-[#1C1917]">{record.bookingId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#78716C]">建立於 {record.createdAt}</span>
                  </div>

                  <span className="font-mono-num text-base font-bold text-[#0F4C3A]">
                    NT$ {record.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#44403C]">
                  <div>
                    <p className="text-[#78716C] mb-0.5">入住房型與專案</p>
                    <p className="font-semibold text-sm text-[#1C1917]">
                      {record.roomName} × {record.roomCount} 間
                    </p>
                    <p className="text-[#57534E] mt-0.5">{record.packageName}</p>
                    <p className="text-[#57534E]">{record.bedChoice}</p>
                  </div>

                  <div>
                    <p className="text-[#78716C] mb-0.5">入住日期與人數</p>
                    <p className="font-mono-num font-semibold text-[#1C1917]">
                      {record.checkIn} → {record.checkOut} ({record.nights} 晚)
                    </p>
                    <p className="mt-0.5">
                      代表人：{record.guestName} ({record.guestPhone})
                    </p>
                    <p className="text-[#57534E]">
                      {record.adults} 成人 · {record.children} 孩童
                      {record.pets > 0 ? ` · ${record.pets} 毛孩` : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#78716C] mb-0.5">接駁與支付方式</p>
                    <p className="text-[#1C1917]">{record.shuttleSlot}</p>
                    <p className="text-[#57534E] mt-0.5">{record.paymentMethodLabel}</p>
                    {record.addons.length > 0 && (
                      <p className="text-[#0F4C3A] mt-0.5">
                        已加購：{record.addons.map((a) => `${a.name}×${a.quantity}`).join('、')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#57534E]">
                    憑訂房編號或手機號碼即可於 6 號碼頭或大廳辦理入住
                  </span>

                  {confirmDeleteId === record.bookingId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-700 font-medium">確定取消此筆預訂？</span>
                      <button
                        type="button"
                        onClick={() => {
                          onCancelBooking(record.bookingId);
                          setConfirmDeleteId(null);
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-700 text-white text-xs font-medium"
                      >
                        確認取消
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#D6CEBF] text-xs"
                      >
                        保留訂單
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(record.bookingId)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#E5DEC9] text-xs text-[#78716C] hover:text-red-700 hover:border-red-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>取消預訂</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
