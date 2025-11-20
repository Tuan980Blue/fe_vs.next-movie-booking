
'use client';

import {useMemo} from "react";
import {
    ArrowUpRight,
    BadgeDollarSign,
    HeartHandshake,
    ShieldCheck,
    Stars,
} from "lucide-react";
import type {PriceRuleResponseDto} from "@/models";
import {SeatType} from "@/models/seat";

const seatTypeConfigs = [
    {
        type: SeatType.Standard,
        label: "Ghế Thường",
        accent: "from-primary-purple/40 to-primary-black/80",
        tag: "Best value",
        description: "Ghế chuẩn với tầm nhìn tối ưu, lý tưởng cho mọi suất chiếu.",
        perks: ["Khoảng cách ghế chuẩn 1m", "Phù hợp mọi khung giờ", "Ưu đãi thành viên Silver"]
    },
    {
        type: SeatType.Vip,
        label: "Ghế VIP",
        accent: "from-primary-pink/60 to-primary-purple/80",
        tag: "Hot choice",
        description: "Đệm dày, khoảng chân rộng, vị trí trung tâm với âm thanh bao trùm.",
        perks: ["Tựa lưng cao cấp", "Khăn phủ đầu ghế", "Nước lọc miễn phí"]
    },
    {
        type: SeatType.Couple,
        label: "Ghế Couple",
        accent: "from-rose-600/70 via-fuchsia-600/70 to-indigo-700/70",
        tag: "Signature",
        description: "Không gian riêng tư với tay vịn gập và bàn mini cho cặp đôi.",
        perks: ["Tay vịn gập linh hoạt", "Tặng combo snack mini", "Ưu tiên chọn suất"]
    },
    {
        type: SeatType.Accessible,
        label: "Ghế Hỗ Trợ",
        accent: "from-emerald-600/60 to-slate-900/80",
        tag: "Inclusive",
        description: "Khu vực thiết kế riêng cho khách có nhu cầu hỗ trợ.",
        perks: ["Lối đi rộng", "Gần lối thoát hiểm", "Hỗ trợ nhân viên 1-1"]
    }
];

const FALLBACK_PRICES: Record<number, number> = {
    [SeatType.Standard]: 85000,
    [SeatType.Vip]: 115000,
    [SeatType.Couple]: 180000,
    [SeatType.Accessible]: 75000
};

const STATIC_PRICE_RULES: PriceRuleResponseDto[] = [
    {
        id: "std-weekday",
        seatType: SeatType.Standard,
        priceMinor: 85000,
        isActive: true,
        createdAt: "2024-11-08T09:00:00Z"
    },
    {
        id: "std-weekend",
        seatType: SeatType.Standard,
        priceMinor: 95000,
        isActive: true,
        createdAt: "2024-11-09T09:00:00Z"
    },
    {
        id: "vip-weekday",
        seatType: SeatType.Vip,
        priceMinor: 115000,
        isActive: true,
        createdAt: "2024-11-08T09:00:00Z"
    },
    {
        id: "vip-weekend",
        seatType: SeatType.Vip,
        priceMinor: 125000,
        isActive: true,
        createdAt: "2024-11-09T09:00:00Z"
    },
    {
        id: "couple-all",
        seatType: SeatType.Couple,
        priceMinor: 180000,
        isActive: true,
        createdAt: "2024-11-10T09:00:00Z"
    },
    {
        id: "accessible-all",
        seatType: SeatType.Accessible,
        priceMinor: 75000,
        isActive: true,
        createdAt: "2024-11-07T09:00:00Z"
    }
];

const formatCurrency = (amount: number, currency = "VND") =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(amount);

const PricePage = () => {
    const rules = STATIC_PRICE_RULES;

    const enrichedSeatTypes = useMemo(() => {
        return seatTypeConfigs.map((config) => {
            const matches = rules
                .filter((rule) => rule.seatType === config.type)
                .sort((a, b) => a.priceMinor - b.priceMinor);
            const basePrice = matches[0]?.priceMinor ?? FALLBACK_PRICES[config.type];
            return {
                ...config,
                price: basePrice,
                variations: matches
            };
        });
    }, [rules]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#05030a] via-[#0a0615] to-[#0f1224] px-4 pb-16 pt-10 text-neutral-white lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col">
                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">chi tiết bảng giá</p>
                                <h3 className="text-xl font-semibold text-white">Tổng quan nhanh</h3>
                            </div>
                            <BadgeDollarSign className="h-6 w-6 text-accent-yellow" />
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-200">
                                <thead>
                                <tr className="text-xs uppercase tracking-wide text-neutral-400">
                                    <th className="pb-4 pr-6 font-medium">Loại ghế</th>
                                    <th className="pb-4 pr-6 font-medium">Giá niêm yết</th>
                                    <th className="pb-4 pr-6 font-medium">Tình trạng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {enrichedSeatTypes.map((seat) => (
                                    <tr key={seat.type} className="border-t border-white/10">
                                        <td className="py-4 pr-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">{seat.label}</span>
                                                <span className="text-xs text-neutral-400">{seat.description}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-6 font-semibold text-white">{formatCurrency(seat.price)}</td>
                                        <td className="py-4 pr-6 text-xs">
                                            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                                                Đang áp dụng
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-purple/50 to-black/60 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                            <h3 className="text-lg font-semibold text-white">Ghi chú khi đặt giá</h3>
                            <ul className="mt-4 flex flex-col gap-4 text-sm text-neutral-200">
                                <li className="flex items-start gap-3">
                                    <Stars className="mt-1 h-4 w-4 text-accent-yellow" />
                                    Giá có thể điều chỉnh nhẹ theo khung giờ vàng (sau 18h) hoặc suất chiếu đặc biệt.
                                </li>
                                <li className="flex items-start gap-3">
                                    <HeartHandshake className="mt-1 h-4 w-4 text-primary-pink" />
                                    Thành viên hạng Gold trở lên được giảm 5-10% tùy chương trình.
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="mt-1 h-4 w-4 text-emerald-300" />
                                    Đổi suất miễn phí 1 lần trước giờ chiếu 24h, áp dụng với thanh toán online.
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold text-white">Chuẩn bị đặt vé?</h3>
                            <p className="mt-2 text-sm text-neutral-300">
                                Chọn suất chiếu, hệ thống sẽ tự động áp dụng giá ghế tương ứng và hiển thị chi tiết trước khi xác nhận.
                            </p>
                            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-pink to-primary-purple px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary-pink/40 transition hover:translate-y-0.5">
                                Mở lịch chiếu
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PricePage;