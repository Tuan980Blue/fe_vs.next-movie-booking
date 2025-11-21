"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {motion} from "framer-motion";
import Link from "next/link";
import type {PaymentResponseDto} from "@/models/payment";
import {PaymentStatus} from "@/models/payment";
import {BookingStatus, type BookingResponseDto} from "@/models/booking";
import {getBookingDetailApi, getPaymentDetailApi} from "@/service";
import QrCodeBooking from "@/app/(site)/_components/QRCodeBooking";

type StatusParam = "success" | "pending" | "failed";

type Props = {
    status: StatusParam;
};

type ActionVariant = "primary" | "secondary" | "outline";

interface ActionButton {
    label: string;
    href?: string;
    onClick?: () => void;
    description?: string;
    variant: ActionVariant;
}

const statusMeta: Record<StatusParam, { title: string; description: string; icon: string; badgeColor: string; iconBg: string }> = {
    success: {
        title: "Thanh toán thành công!",
        description: "Chúng tôi đã phát hành vé cho bạn. Kiểm tra email hoặc xem chi tiết bên dưới.",
        icon: "🎉",
        badgeColor: "bg-primary-pink text-neutral-white",
        iconBg: "bg-primary-pink/10",
    },
    pending: {
        title: "Thanh toán đang được xử lý",
        description: "Hệ thống đang xác nhận giao dịch với cổng thanh toán. Bạn có thể tải lại trang sau ít phút.",
        icon: "⏳",
        badgeColor: "bg-accent-yellow text-neutral-darkGray",
        iconBg: "bg-accent-yellow/10",
    },
    failed: {
        title: "Thanh toán không thành công",
        description: "Giao dịch chưa hoàn tất. Vui lòng thử lại hoặc chọn phương thức khác.",
        icon: "⚠️",
        badgeColor: "bg-accent-red text-neutral-white",
        iconBg: "bg-accent-red/10",
    },
};

const BUTTON_VARIANTS: Record<ActionVariant, string> = {
    primary: "w-full rounded-xl bg-primary-pink px-6 py-3 text-base font-semibold text-neutral-white transition-colors hover:bg-primary-pink/90",
    secondary: "w-full rounded-xl bg-white px-6 py-3 text-base font-semibold text-neutral-darkGray border border-neutral-lightGray/60 transition-colors hover:bg-neutral-lightGray/10",
    outline: "w-full rounded-xl border-2 border-primary-pink px-6 py-3 text-base font-semibold text-primary-pink bg-white transition-colors hover:bg-primary-pink/5"
};

const PaymentStatusContent = ({status}: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentId = searchParams.get("paymentId");
    const fallbackBookingId = searchParams.get("bookingId");

    const [payment, setPayment] = useState<PaymentResponseDto | null>(null);
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let ignore = false;

        async function loadPayment() {
            if (!paymentId) {
                setError("Không tìm thấy thông tin thanh toán.");
                setLoading(false);
                return;
            }

            try {
                const data = await getPaymentDetailApi(paymentId);
                if (!ignore) {
                    setPayment(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : "Không thể tải thông tin thanh toán.");
                    setLoading(false);
                }
            }
        }

        loadPayment();

        return () => {
            ignore = true;
        };
    }, [paymentId]);

    useEffect(() => {
        const bookingId = payment?.bookingId ?? fallbackBookingId;
        if (!bookingId) {
            setLoading(false);
            return;
        }

        let ignore = false;
        let retries = 0;
        const MAX_RETRIES = status === "success" ? 8 : 3;
        const RETRY_DELAY = status === "success" ? 2000 : 3000;

        const loadBooking = async () => {
            try {
                const data = await getBookingDetailApi(bookingId);
                if (ignore) return;

                setBooking(data);
                setError("");

                const stillPending = data?.status === BookingStatus.Pending;
                if (stillPending && retries < MAX_RETRIES && status !== "failed") {
                    retries += 1;
                    setTimeout(loadBooking, RETRY_DELAY);
                    return;
                }

                if (!ignore) {
                    setLoading(false);
                }
            } catch (err: any) {
                if (ignore) return;

                const is404 = err?.response?.status === 404 ||
                    (err instanceof Error && (
                        err.message.includes("404") ||
                        err.message.includes("not found") ||
                        err.message.includes("không tồn tại") ||
                        err.message.includes("Not Found")
                    ));

                if (is404 && status === "success" && retries < MAX_RETRIES) {
                    retries += 1;
                    setTimeout(loadBooking, RETRY_DELAY);
                    return;
                }

                if (retries >= MAX_RETRIES || !is404 || status !== "success") {
                    const errorMessage = err?.response?.data?.message ||
                        (err instanceof Error ? err.message : "Không thể tải thông tin vé.");
                    setError(prev => prev || errorMessage);
                    if (!ignore) {
                        setLoading(false);
                    }
                }
            }
        };

        loadBooking();

        return () => {
            ignore = true;
        };
    }, [payment, fallbackBookingId, status]);

    const bookingDetails = useMemo(() => {
        if (!booking) return null;
        const firstItem = booking.items?.[0];
        return {
            movieTitle: firstItem?.showtime?.movieTitle ?? "",
            showtime: firstItem
                ? `${new Date(firstItem.showtime.startUtc).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} - ${new Date(firstItem.showtime.endUtc).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`
                : "",
            date: firstItem
                ? new Date(firstItem.showtime.startUtc).toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "",
            seats: booking.items?.map(i => `${i.seat.rowLabel}${String(i.seat.seatNumber).padStart(2, "0")}`) ?? [],
            cinema: firstItem?.showtime?.cinemaName ?? "",
            room: firstItem?.showtime?.roomName ?? "",
            totalPrice: (booking.totalAmountMinor || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }),
            bookingCode: booking.code,
        };
    }, [booking]);

    const meta = statusMeta[status];
    const isBookingConfirmed = booking?.status === BookingStatus.Confirmed;
    const paymentStatusLabel = payment
        ? PaymentStatus[payment.status] ?? payment.status
        : null;

    const statusSteps = useMemo(() => {
        return [
            {
                key: "payment",
                title: "Thanh toán",
                description: paymentStatusLabel ? `Trạng thái: ${paymentStatusLabel}` : "Đang cập nhật từ cổng thanh toán",
                completed: payment?.status === PaymentStatus.Succeeded || status === "success",
                failed: status === "failed",
            },
            {
                key: "booking",
                title: "Đặt vé",
                description: bookingDetails?.bookingCode
                    ? `Mã vé: ${bookingDetails.bookingCode}`
                    : "Đang tạo thông tin vé",
                completed: !!bookingDetails?.bookingCode && booking?.status !== BookingStatus.Pending,
                failed: booking?.status === BookingStatus.Canceled,
            },
            {
                key: "confirmation",
                title: "Xác nhận",
                description: meta.description,
                completed: status === "success" && isBookingConfirmed,
                failed: status === "failed",
            },
        ];
    }, [paymentStatusLabel, payment, status, bookingDetails, booking, meta, isBookingConfirmed]);

    const handleRetryPayment = useCallback(() => {
        if (booking?.id) {
            router.push(`/booking/confirm?bookingId=${encodeURIComponent(booking.id)}`);
        } else {
            router.push("/booking/seat-selection");
        }
    }, [booking, router]);

    const actionButtons = useMemo<ActionButton[]>(() => {
        if (status === "success") {
            return [
                {
                    label: "Xem vé của tôi",
                    href: `/user/bookings/${booking?.id}`,
                    variant: "primary",
                    description: "Kiểm tra mã QR và lịch sử giao dịch"
                },
                {
                    label: "Về trang chủ",
                    href: "/",
                    variant: "secondary"
                }
            ];
        }
        if (status === "pending") {
            return [
                {
                    label: "Làm mới trạng thái",
                    onClick: () => window.location.reload(),
                    variant: "primary",
                    description: "Theo dõi cập nhật mới nhất"
                },
                {
                    label: "Xem lịch sử đặt vé",
                    href: "/user/bookings",
                    variant: "outline"
                }
            ];
        }
        return [
            {
                label: "Thử thanh toán lại",
                onClick: handleRetryPayment,
                variant: "primary"
            },
            {
                label: "Chọn suất chiếu khác",
                href: "/booking/seat-selection",
                variant: "outline"
            }
        ];
    }, [status, handleRetryPayment]);

    const bookingQr = bookingDetails?.bookingCode || booking?.code || paymentId || "";
    const canShowQrCard = status === "success" && !!bookingQr;

    return (
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 text-neutral-darkGray">
            {!!error && (
                <motion.div
                    className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-800"
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                    </div>
                </motion.div>
            )}

            <motion.section
                className="rounded-2xl border border-neutral-lightGray/40 bg-white shadow-xl ring-1 ring-neutral-lightGray/30 px-6 py-6"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-widest">
                            <span
                                className={`inline-flex items-center rounded-full ${meta.badgeColor} px-4 py-1.5 font-bold`}>
                                {status === "success" ? "✅ Đã xác nhận" : status === "pending" ? "⏳ Đang xử lý" : "⚠️ Cần thao tác"}
                            </span>
                            {!!payment?.updatedAt && (
                                <span className="text-neutral-darkGray/70 bg-neutral-lightGray/10 px-3 py-1 rounded-full border border-neutral-lightGray/40">
                                    Cập nhật {new Date(payment.updatedAt).toLocaleString("vi-VN")}
                                </span>
                            )}
                        </div>
                        <div className="flex items-start gap-4">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${meta.iconBg}`}>
                                <span className="text-3xl">{meta.icon}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-darkGray">{meta.title}</h1>
                                <p className="mt-2 max-w-2xl text-base text-neutral-darkGray/70">
                                    {meta.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs">
                            {paymentId && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-2">
                                    <span className="text-neutral-darkGray/70">Payment ID</span>
                                    <span className="font-bold text-primary-pink">{paymentId}</span>
                                </span>
                            )}
                            {bookingDetails?.bookingCode && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-2">
                                    <span className="text-neutral-darkGray/70">Mã vé</span>
                                    <span className="font-bold text-primary-pink">{bookingDetails.bookingCode}</span>
                                </span>
                            )}
                            {bookingDetails?.totalPrice && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-2">
                                    <span className="text-neutral-darkGray/70">Tổng tiền</span>
                                    <span className="font-bold text-primary-pink">{bookingDetails.totalPrice}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <motion.section
                    className="space-y-6"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                >
                    <div className="rounded-2xl border border-neutral-lightGray/40 bg-white shadow-xl ring-1 ring-neutral-lightGray/30 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-pink/10 text-2xl font-black text-primary-pink">
                                {bookingDetails?.movieTitle?.[0] || "🎬"}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-primary-pink font-bold">Phim đang đặt</p>
                                    <h3 className="text-xl font-bold text-neutral-darkGray mt-1">{bookingDetails?.movieTitle || "Đang cập nhật"}</h3>
                                </div>
                                <div className="grid gap-4 text-sm text-neutral-darkGray md:grid-cols-2">
                                    <div className="space-y-2">
                                        <p className="text-neutral-darkGray/70 font-medium">Ngày chiếu</p>
                                        <p className="font-semibold text-neutral-darkGray">{bookingDetails?.date || "—"}</p>
                                        <p className="text-neutral-darkGray/70 font-medium mt-3">Khung giờ</p>
                                        <p className="font-semibold text-neutral-darkGray">{bookingDetails?.showtime || "—"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-neutral-darkGray/70 font-medium">Rạp/Phòng</p>
                                        <p className="font-semibold text-neutral-darkGray">{bookingDetails?.cinema || "—"}</p>
                                        <p className="font-semibold text-neutral-darkGray">{bookingDetails?.room || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex-1 min-w-[200px]">
                                    <p className="text-neutral-darkGray/70 font-medium mb-2">Ghế đã chọn</p>
                                    <div className="flex flex-wrap gap-2">
                                        {bookingDetails?.seats?.length
                                            ? bookingDetails.seats.map((seat, index) => (
                                                <motion.span
                                                    key={seat}
                                                    className="rounded-lg border border-primary-pink/40 bg-primary-pink/10 px-3 py-1.5 text-sm font-bold text-primary-pink"
                                                    initial={{opacity: 0, scale: 0.8}}
                                                    animate={{opacity: 1, scale: 1}}
                                                    transition={{delay: 0.1 + index * 0.05}}
                                                >
                                                    {seat}
                                                </motion.span>
                                            ))
                                            : <span className="text-neutral-darkGray/70">—</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-darkGray/70 font-medium mb-1">Tổng thanh toán</p>
                                    <p className="text-2xl font-bold text-primary-pink">{bookingDetails?.totalPrice || "—"}</p>
                                </div>
                            </div>
                        </div>


                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white px-6 py-6 text-sm">
                            <p className="text-xs uppercase tracking-widest text-primary-pink font-bold mb-4">Thông tin thanh toán</p>
                            <div className="mt-3 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-darkGray/70 font-medium">Trạng thái</span>
                                    <span className="font-bold text-primary-pink">
                                        {paymentStatusLabel ?? "Đang cập nhật"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-darkGray/70 font-medium">Nhà cung cấp</span>
                                    <span className="font-bold text-neutral-darkGray">{payment?.provider ?? "—"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-darkGray/70 font-medium">Thời gian tạo</span>
                                    <span className="font-bold text-neutral-darkGray">
                                        {payment?.createdAt ? new Date(payment.createdAt).toLocaleString("vi-VN") : "—"}
                                    </span>
                                </div>
                                {payment?.providerTxnId && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-darkGray/70 font-medium">Mã giao dịch</span>
                                        <span className="font-bold text-primary-pink">{payment.providerTxnId}</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-5 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray/80 text-xs leading-relaxed">
                                {status === "pending" && "Hệ thống đang chờ phản hồi từ ngân hàng hoặc ví điện tử. Bạn có thể ở lại trang này, trạng thái sẽ tự động cập nhật."}
                                {status === "failed" && "Thanh toán chưa được ghi nhận. Hãy thử lại hoặc chọn phương thức khác để không bỏ lỡ suất chiếu."}
                                {status === "success" && "Giao dịch đã xác nhận. Bạn có thể sử dụng mã đặt vé để nhận vé tại rạp."}
                            </p>
                        </div>
                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white px-6 py-6">
                            <div className="grid gap-3">
                                {actionButtons.map(action => {
                                    const button = (
                                        <motion.button
                                            key={action.label}
                                            className={BUTTON_VARIANTS[action.variant]}
                                            whileTap={{scale: 0.98}}
                                            whileHover={{scale: 1.02}}
                                            onClick={action.onClick}
                                        >
                                            {action.label}
                                            {action.description && (
                                                <span
                                                    className="block text-xs font-normal text-neutral-darkGray/70 mt-1">{action.description}</span>
                                            )}
                                        </motion.button>
                                    );
                                    return action.href ? (
                                        <Link href={action.href} key={action.label}>
                                            {button}
                                        </Link>
                                    ) : button;
                                })}
                            </div>
                        </div>
                    </div>


                </motion.section>

                <motion.section
                    className="space-y-6 rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 p-6"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                >
                    {canShowQrCard && (
                        <div className="rounded-xl">
                            <p className="text-xs uppercase tracking-widest text-primary-pink font-bold">Vé điện tử</p>
                            <h4 className="mt-2 text-xl font-bold text-neutral-darkGray">Mã QR nhận vé</h4>
                            <p className="mt-1 text-sm text-neutral-darkGray/70">
                                Lưu mã QR hoặc tải vé về máy để nhận vé tại rạp nhanh chóng.
                            </p>
                            <div className="mt-4 rounded-xl bg-neutral-lightGray/5 p-4 border border-neutral-lightGray/40">
                                <QrCodeBooking bookingQr={bookingQr}/>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-6 py-6 text-sm">
                        <p className="text-xs uppercase tracking-widest text-primary-pink font-bold mb-4">Hỗ trợ nhanh</p>
                        <ul className="mt-4 space-y-3 text-neutral-darkGray">
                            <li className="flex items-start gap-2">
                                <span className="text-primary-pink text-lg">📞</span>
                                <span>Hotline 1900-xxx-xxx (8h - 22h mỗi ngày)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-pink text-lg">✉️</span>
                                <span>Email: support@tamemcinema.vn</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-pink text-lg">ℹ️</span>
                                <span>Cung cấp Payment ID và mã giao dịch khi cần tra soát</span>
                            </li>
                        </ul>
                    </div>
                </motion.section>
            </div>

            <motion.div
                className="rounded-2xl border border-neutral-lightGray/40 bg-white shadow-xl ring-1 ring-neutral-lightGray/30 p-6 text-sm"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
            >
                <h3 className="text-xl font-bold text-neutral-darkGray flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    <span>Mẹo sử dụng</span>
                </h3>
                <div className="mt-5 space-y-3">
                    {status === "success" && (
                        <>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray">
                                <span className="text-primary-pink text-lg">✓</span>
                                <span>Vé điện tử và mã QR đã gửi về email của bạn. Vui lòng kiểm tra cả mục Spam.</span>
                            </p>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray">
                                <span className="text-primary-pink text-lg">✓</span>
                                <span>Mang theo CMND/CCCD khi tới rạp để hỗ trợ đối soát khi cần.</span>
                            </p>
                        </>
                    )}
                    {status === "pending" && (
                        <>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray">
                                <span className="text-accent-yellow text-lg">⏳</span>
                                <span>Nếu tài khoản đã bị trừ tiền, giao dịch sẽ được đồng bộ trong vài phút.</span>
                            </p>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray">
                                <span className="text-primary-pink text-lg">💾</span>
                                <span>Hãy giữ lại biên lai thanh toán để cung cấp cho bộ phận hỗ trợ nếu cần.</span>
                            </p>
                        </>
                    )}
                    {status === "failed" && (
                        <>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
                                <span className="text-accent-red text-lg">⚠️</span>
                                <span>Kiểm tra lại hạn mức thẻ hoặc chọn cổng thanh toán khác.</span>
                            </p>
                            <p className="flex items-start gap-2 p-3 rounded-lg bg-neutral-lightGray/5 border border-neutral-lightGray/40 text-neutral-darkGray">
                                <span className="text-primary-pink text-lg">📞</span>
                                <span>Nếu tiền đã bị trừ, vui lòng gửi mã giao dịch để đội ngũ CSKH hỗ trợ.</span>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentStatusContent;

