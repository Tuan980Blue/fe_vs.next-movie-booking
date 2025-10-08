export default function UserSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Cài đặt</h1>
        <p className="text-white/80 mt-1">Tùy chỉnh tài khoản và bảo mật.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/15 rounded-lg p-4">
          <div className="text-white font-semibold mb-1">Thông báo</div>
          <div className="text-white/70 text-sm">Tùy chọn nhận email / thông báo đẩy (placeholder).</div>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-lg p-4">
          <div className="text-white font-semibold mb-1">Bảo mật</div>
          <div className="text-white/70 text-sm">Đổi mật khẩu, đăng nhập nhiều thiết bị (placeholder).</div>
        </div>
      </div>
    </div>
  );
}


