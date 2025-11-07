'use client'

import {motion} from "framer-motion";
import Link from "next/link";

const BookingForm = () => {
    return (
        <div className={""}>
            <motion.div
                className="bg-white sticky top-6 rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.4}}
            >
                {/* Header (Dark bar with underline) */}
                <div className="relative bg-[#241634] text-white px-6 py-4 flex items-center gap-3">
                    <span className="text-2xl">🎟️</span>
                    <h3 className="font-bold text-2xl tracking-wide">ĐẶT VÉ</h3>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-24 bg-primary-pink"></div>
                </div>

                {/* Form Content */}
                <div className="p-5 space-y-4">
                    {/* Chọn Phim */}
                    <div
                        className="relative flex items-center justify-between border-2 border-black rounded-md px-4 py-3 bg-white">
                        <div className="flex items-center gap-3">
                            <div
                                className="border-2 border-black rounded-md w-11 h-11 flex items-center justify-center text-xl">🎬
                            </div>
                            <select className="appearance-none bg-transparent text-lg font-medium focus:outline-none">
                                <option>Chọn Phim</option>
                            </select>
                        </div>
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>

                    {/* Chọn Ngày */}
                    <div
                        className="relative flex items-center justify-between border-2 border-black rounded-md px-4 py-3 bg-white">
                        <div className="flex items-center gap-3">
                            <div
                                className="border-2 border-black rounded-md w-11 h-11 flex items-center justify-center text-xl">📅
                            </div>
                            <select className="appearance-none bg-transparent text-lg font-medium focus:outline-none">
                                <option>Chọn Ngày</option>
                            </select>
                        </div>
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>

                    {/* Chọn Suất */}
                    <div
                        className="relative flex items-center justify-between border-2 border-black rounded-md px-4 py-3 bg-white">
                        <div className="flex items-center gap-3">
                            <div
                                className="border-2 border-black rounded-md w-11 h-11 flex items-center justify-center text-xl">📆
                            </div>
                            <select className="appearance-none bg-transparent text-lg font-medium focus:outline-none">
                                <option>Chọn Suất</option>
                            </select>
                        </div>
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    {/*/*}
Đăng nhập tài khoản khác hoặc Đổi thông tin
Lưu ý:
- Vé đã mua không thể đổi hay trả lại.
- Khi được yêu cầu, vui lòng xuất trình giấy tờ tùy thân để chứng thực độ tuổi khi xem phim.
- Bản sao thông tin vé sẽ được lưu vào mục lịch sử giao dịch trong tài khoản nếu quý khách đã đăng nhập khi mua vé. 1 bản sao khác sẽ gửi đến Email của quý khách. Quý khách vui lòng kiểm tra kỹ cả trong mục spam email.
- Quý khách vui lòng lưu lại hoặc chụp ảnh lại để xuất trình khi qua cửa soát vé (KHÔNG CẦN IN VÉ TẠI QUẦY).
- Nếu có kèm mua bắp nước online quý khách được ưu tiên khi xếp hàng để lên thẳng quầy vé in hóa đơn, sau đó xếp hàng ở quầy bắp nước để nhận.
                    {/**/}
                    {/* CTA Button */}
                    <Link
                        href={``}
                        className="mt-2 block w-full text-center text-xl font-semibold bg-white text-black py-4 rounded-xl border-2 border-primary-pink shadow-[0_6px_0_#c71f79] hover:bg-cinema-neonPink transition-colors"
                    >
                        MUA VÉ
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingForm;
