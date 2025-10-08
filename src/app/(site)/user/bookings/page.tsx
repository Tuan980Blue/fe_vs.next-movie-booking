export default function UserBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Đơn đặt vé</h1>
        <p className="text-white/80 mt-1">Quản lý vé đã đặt và lịch sử giao dịch.</p>
      </div>

      <div className="bg-white/10 border border-white/15 rounded-lg p-6 text-center">
        <div className="text-white/80">Bạn chưa có đơn đặt vé nào.</div>
      </div>
    </div>
  );
}


