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

const statusMeta: Record<StatusParam, { title: string; description: string; icon: string; gradient: string }> = {
    success: {
        title: "Thanh toán thành công!",
        description: "Chúng tôi đã phát hành vé cho bạn. Kiểm tra email hoặc xem chi tiết bên dưới.",
        icon: "🎉",
        gradient: "from-emerald-400 to-emerald-600",
    },
    pending: {
        title: "Thanh toán đang được xử lý",
        description: "Hệ thống đang xác nhận giao dịch với cổng thanh toán. Bạn có thể tải lại trang sau ít phút.",
        icon: "⏳",
        gradient: "from-amber-400 to-amber-500",
    },
    failed: {
        title: "Thanh toán không thành công",
        description: "Giao dịch chưa hoàn tất. Vui lòng thử lại hoặc chọn phương thức khác.",
        icon: "⚠️",
        gradient: "from-rose-500 to-red-500",
    },
};

const BUTTON_VARIANTS: Record<ActionVariant, string> = {
    primary: "w-full rounded-2xl bg-primary-pink px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary-pink/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
    secondary: "w-full rounded-2xl bg-white/90 px-6 py-4 text-base font-semibold text-neutral-900 border border-white/30 transition-all duration-300 hover:-translate-y-0.5",
    outline: "w-full rounded-2xl border border-primary-pink/30 px-6 py-4 text-base font-semibold text-primary-pink bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
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
                    href: "/user/my-bookings",
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
                    href: "/user/my-bookings",
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
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 text-white">
            {!!error && (
                <motion.div
                    className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200 backdrop-blur-md"
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                >
                    {error}
                </motion.div>
            )}

            <motion.section
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-2xl shadow-2xl shadow-black/20"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-white/60">
                            <span
                                className={`inline-flex items-center rounded-full bg-gradient-to-r ${meta.gradient} px-3 py-1 text-white`}>
                                {status === "success" ? "Đã xác nhận" : status === "pending" ? "Đang xử lý" : "Cần thao tác"}
                            </span>
                            {!!payment?.updatedAt && (
                                <span className="text-white/50">
                                    Cập nhật {new Date(payment.updatedAt).toLocaleString("vi-VN")}
                                </span>
                            )}
                        </div>
                        <div className="flex items-start gap-4">
                            <motion.div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient}`}
                                animate={{
                                    boxShadow: [
                                        `0 0 0 0 rgba(255,255,255,0.35)`,
                                        `0 0 0 20px rgba(255,255,255,0)`
                                    ]
                                }}
                                transition={{duration: 2, repeat: Infinity}}
                            >
                                <span className="text-3xl">{meta.icon}</span>
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-semibold text-white">{meta.title}</h1>
                                <p className="mt-1 max-w-2xl text-sm text-white/70">
                                    {meta.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs">
                            {paymentId && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">
                                    <span className="text-white/40">Payment ID</span>
                                    <span className="font-semibold text-white">{paymentId}</span>
                                </span>
                            )}
                            {bookingDetails?.bookingCode && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">
                                    <span className="text-white/40">Mã vé</span>
                                    <span className="font-semibold text-white">{bookingDetails.bookingCode}</span>
                                </span>
                            )}
                            {bookingDetails?.totalPrice && (
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">
                                    <span className="text-white/40">Tổng tiền</span>
                                    <span className="font-semibold text-white">{bookingDetails.totalPrice}</span>
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
                    <div
                        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-8 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div
                                className="flex h-20 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black text-white">
                                {bookingDetails?.movieTitle?.[0] || "🎬"}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/50">Phim đang đặt</p>
                                    <h3 className="text-2xl font-semibold text-white">{bookingDetails?.movieTitle || "Đang cập nhật"}</h3>
                                </div>
                                <div className="grid gap-4 text-sm text-white/70 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <p className="text-white/40">Ngày chiếu</p>
                                        <p className="font-medium text-white">{bookingDetails?.date || "—"}</p>
                                        <p className="text-white/40">Khung giờ</p>
                                        <p className="font-medium text-white">{bookingDetails?.showtime || "—"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white/40">Rạp/Phòng</p>
                                        <p className="font-medium text-white">{bookingDetails?.cinema || "—"}</p>
                                        <p className="font-medium text-white">{bookingDetails?.room || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 rounded-2xl border border-primary-pink/30 bg-primary-pink/10 p-5">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div>
                                    <p className="text-white/50">Ghế đã chọn</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {bookingDetails?.seats?.length
                                            ? bookingDetails.seats.map((seat, index) => (
                                                <motion.span
                                                    key={seat}
                                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white"
                                                    initial={{opacity: 0, scale: 0.8}}
                                                    animate={{opacity: 1, scale: 1}}
                                                    transition={{delay: 0.3 + index * 0.08}}
                                                >
                                                    {seat}
                                                </motion.span>
                                            ))
                                            : <span className="text-white/70">—</span>}
                                    </div>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-white/50">Tổng thanh toán</p>
                                    <p className="text-3xl font-bold text-white">{bookingDetails?.totalPrice || "—"}</p>
                                </div>
                            </div>
                        </div>


                        <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-6 text-sm text-white/70">
                            <p className="text-xs uppercase tracking-widest text-white/40">Thông tin thanh toán</p>
                            <div className="mt-3 space-y-4">
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-white/60">Trạng thái</span>
                                    <span className="font-semibold">
                                        {paymentStatusLabel ?? "Đang cập nhật"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60">Nhà cung cấp</span>
                                    <span className="font-semibold text-white">{payment?.provider ?? "—"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60">Thời gian tạo</span>
                                    <span className="font-semibold text-white">
                                        {payment?.createdAt ? new Date(payment.createdAt).toLocaleString("vi-VN") : "—"}
                                    </span>
                                </div>
                                {payment?.providerTxnId && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Mã giao dịch</span>
                                        <span className="font-semibold text-white">{payment.providerTxnId}</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-white/60">
                                {status === "pending" && "Hệ thống đang chờ phản hồi từ ngân hàng hoặc ví điện tử. Bạn có thể ở lại trang này, trạng thái sẽ tự động cập nhật."}
                                {status === "failed" && "Thanh toán chưa được ghi nhận. Hãy thử lại hoặc chọn phương thức khác để không bỏ lỡ suất chiếu."}
                                {status === "success" && "Giao dịch đã xác nhận. Bạn có thể sử dụng mã đặt vé để nhận vé tại rạp."}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-6">
                            <div className="mt-4 grid gap-3">
                                {actionButtons.map(action => {
                                    const button = (
                                        <motion.button
                                            key={action.label}
                                            className={BUTTON_VARIANTS[action.variant]}
                                            whileTap={{scale: 0.98}}
                                            onClick={action.onClick}
                                        >
                                            {action.label}
                                            {action.description && (
                                                <span
                                                    className="block text-xs font-normal text-white/70">{action.description}</span>
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
                    className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                >


                    {canShowQrCard && (
                        <div className="rounded-2xl border border-primary-pink/20 bg-slate-950/60 px-5 py-6">
                            <p className="text-xs uppercase tracking-widest text-primary-pink/80">Vé điện tử</p>
                            <h4 className="mt-2 text-xl font-semibold text-white">Mã QR nhận vé</h4>
                            <p className="mt-1 text-sm text-white/60">
                                Lưu mã QR hoặc tải vé về máy để nhận vé tại rạp nhanh chóng.
                            </p>
                            <div
                                className="mt-4 rounded-2xl">
                                <QrCodeBooking bookingQr={bookingQr}/>
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-6 text-sm text-white/70">
                        <p className="text-xs uppercase tracking-widest text-white/40">Hỗ trợ nhanh</p>
                        <ul className="mt-4 space-y-2">
                            <li>• Hotline 1900-xxx-xxx (8h - 22h mỗi ngày)</li>
                            <li>• Email: support@tamemcinema.vn</li>
                            <li>• Cung cấp Payment ID và mã giao dịch khi cần tra soát</li>
                        </ul>
                    </div>
                </motion.section>
            </div>

            <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/70 backdrop-blur-xl"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
            >
                <h3 className="text-lg font-semibold text-white">📧 Mẹo sử dụng</h3>
                <div className="mt-4 space-y-3">
                    {status === "success" && (
                        <>
                            <p>• Vé điện tử và mã QR đã gửi về email của bạn. Vui lòng kiểm tra cả mục Spam.</p>
                            <p>• Mang theo CMND/CCCD khi tới rạp để hỗ trợ đối soát khi cần.</p>
                        </>
                    )}
                    {status === "pending" && (
                        <>
                            <p>• Nếu tài khoản đã bị trừ tiền, giao dịch sẽ được đồng bộ trong vài phút.</p>
                            <p>• Hãy giữ lại biên lai thanh toán để cung cấp cho bộ phận hỗ trợ nếu cần.</p>
                        </>
                    )}
                    {status === "failed" && (
                        <>
                            <p>• Kiểm tra lại hạn mức thẻ hoặc chọn cổng thanh toán khác.</p>
                            <p>• Nếu tiền đã bị trừ, vui lòng gửi mã giao dịch để đội ngũ CSKH hỗ trợ.</p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentStatusContent;

