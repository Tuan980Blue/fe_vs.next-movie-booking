export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Tổng quan tài khoản</h1>
        <p className="text-white/80 mt-1">Tổng hợp nhanh thông tin và hoạt động gần đây.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 border border-white/15 rounded-lg p-4">
          <div className="text-white/70 text-sm">Số đơn đã đặt</div>
          <div className="text-3xl font-bold text-white mt-1">0</div>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-lg p-4">
          <div className="text-white/70 text-sm">Vé sắp tới</div>
          <div className="text-3xl font-bold text-white mt-1">0</div>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-lg p-4">
          <div className="text-white/70 text-sm">Ưu đãi khả dụng</div>
          <div className="text-3xl font-bold text-white mt-1">0</div>
        </div>
      </div>

      <div className="bg-white/10 border border-white/15 rounded-lg p-4">
        <div className="text-white font-semibold mb-2">Hoạt động gần đây</div>
        <div className="text-white/70 text-sm">Chưa có dữ liệu.</div>
      </div>
    </div>
  );
}


