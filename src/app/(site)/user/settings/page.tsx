"use client";

export default function UserSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-darkGray">Cài đặt</h1>
                <p className="text-neutral-darkGray/70 mt-1">Tùy chỉnh tài khoản và bảo mật.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                    <div className="text-neutral-darkGray font-semibold mb-2 flex items-center gap-2">
                        <span className="text-xl">🔔</span>
                        <span>Thông báo</span>
                    </div>
                    <div className="text-neutral-darkGray/70 text-sm mb-4">
                        Tùy chọn nhận email / thông báo đẩy.
                    </div>
                    <div className="text-xs text-neutral-darkGray/50 italic">Tính năng đang được phát triển</div>
                </div>
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                    <div className="text-neutral-darkGray font-semibold mb-2 flex items-center gap-2">
                        <span className="text-xl">🔒</span>
                        <span>Bảo mật</span>
                    </div>
                    <div className="text-neutral-darkGray/70 text-sm mb-4">
                        Đổi mật khẩu, đăng nhập nhiều thiết bị.
                    </div>
                    <div className="text-xs text-neutral-darkGray/50 italic">Tính năng đang được phát triển</div>
                </div>
            </div>
        </div>
    );
}


