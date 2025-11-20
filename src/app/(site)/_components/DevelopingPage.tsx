
export const metadata = {
    title: "Đang Phát Triển",
    description: "Trang này đang được xây dựng và sẽ sớm ra mắt.",
};

export default function DevelopingPage() {
    return (
        <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-950 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.25),_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),_transparent_45%)]" />
            <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-pink-500/30 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative z-10 flex w-full max-w-5xl flex-col gap-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="space-y-2">
                    <p className="text-sm text-slate-300">
                        Phiên bản thử nghiệm • Movie Booking 2.0
                    </p>
                    <h1 className="text-2xl text-yellow-400">
                        🚧 Trang đang được nâng cấp
                    </h1>
                    <p className="italic text-slate-300">
                        Đội ngũ đang đánh bóng từng chi tiết để mang tới trải nghiệm đặt vé điện ảnh mượt mà hơn,
                        nhanh hơn và đầy cảm hứng. Hãy quay lại thật sớm để là người đầu tiên khám phá!
                    </p>
                </div>

                <div className="mx-auto flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left md:flex-row md:items-center md:gap-8">
                    <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium text-slate-200">Tiến độ triển khai</p>
                        <div className="h-2 rounded-full bg-white/10">
                            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-pink-500 to-cyan-400" />
                        </div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            68% hoàn thành
                        </p>
                    </div>
                    <div className="grid flex-1 gap-4 text-center md:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                            <p className="text-3xl font-semibold text-pink-300">15</p>
                            <p className="text-xs uppercase tracking-wide text-slate-400">Ý tưởng mới</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                            <p className="text-3xl font-semibold text-cyan-200">4</p>
                            <p className="text-xs uppercase tracking-wide text-slate-400">Tính năng sắp mở</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            title: "Thiết kế mới",
                            desc: "Dark mode đậm chất điện ảnh cùng hiệu ứng neon."
                        },
                        {
                            title: "Đặt vé tức thì",
                            desc: "Hoàn tất chỉ với 3 bước, giữ chỗ trong 10 giây."
                        },
                        {
                            title: "Cá nhân hoá",
                            desc: "Gợi ý phim theo mood và lịch xem yêu thích."
                        }
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left transition hover:scale-[1.02] hover:border-white/30"
                        >
                            <p className="text-sm font-semibold text-white">{feature.title}</p>
                            <p className="text-sm text-slate-300">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid items-center gap-6 text-left md:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                            Lộ trình phát hành
                        </p>
                        <div className="space-y-4 border-l border-white/10 pl-5">
                            <div>
                                <p className="text-xs text-slate-400">Tháng 11</p>
                                <p className="text-base font-medium text-white">Hoàn thiện UI/UX core</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Tháng 12</p>
                                <p className="text-base font-medium text-white">
                                    Kiểm thử trải nghiệm & tối ưu hiệu năng
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Tháng 01</p>
                                <p className="text-base font-medium text-white">Ra mắt bản Beta công khai</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center">
                        <p className="text-sm text-slate-300">
                            Muốn trở thành người đầu tiên trải nghiệm?
                        </p>
                        <button className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-pink-500/30 transition hover:shadow-cyan-400/30">
                            Nhận thông báo khi ra mắt
                        </button>
                        <p className="mt-3 text-xs text-slate-500">
                            Không spam — chỉ những cập nhật thật sự đáng giá.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-slate-400">
                    Cảm ơn bạn đã đồng hành 💗 Những góp ý của bạn giúp chúng tôi xây dựng một nền tảng xem phim tuyệt vời hơn mỗi ngày.
                </p>
            </div>
        </div>
    );
}
