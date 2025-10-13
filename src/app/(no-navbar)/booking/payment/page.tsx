
"use client"

import {motion} from "framer-motion";
import {useState} from "react";

const PaymentPage = () => {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳', description: 'Visa, Mastercard, JCB' },
        { id: 'momo', name: 'Ví MoMo', icon: '📱', description: 'Thanh toán qua ví điện tử' },
        { id: 'zalopay', name: 'ZaloPay', icon: '💰', description: 'Thanh toán nhanh qua ZaloPay' },
        { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: '🏦', description: 'Chuyển khoản trực tiếp' },
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            // Redirect to complete page
        }, 3000);
    };

    return (
        <div className="min-h-screen py-8 px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-pink to-accent-orange rounded-full mb-6"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-3xl">💳</span>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        Thanh toán vé xem phim
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Chọn phương thức thanh toán phù hợp và hoàn tất đặt vé của bạn
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-neutral-darkGray mb-2">Phương thức thanh toán</h2>
                                <p className="text-neutral-lightGray">Chọn cách thức thanh toán bạn muốn sử dụng</p>
                            </div>

                            <div className="space-y-4">
                                {paymentMethods.map((method, index) => (
                                    <motion.div
                                        key={method.id}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                            selectedMethod === method.id
                                                ? 'border-primary-pink bg-primary-pink/5 shadow-lg'
                                                : 'border-neutral-lightGray/30 hover:border-primary-pink/50 hover:bg-neutral-lightGray/5'
                                        }`}
                                        onClick={() => setSelectedMethod(method.id)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                                                selectedMethod === method.id
                                                    ? 'bg-primary-pink text-white'
                                                    : 'bg-neutral-lightGray/20 text-neutral-darkGray'
                                            }`}>
                                                {method.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-darkGray">{method.name}</h3>
                                                <p className="text-sm text-neutral-lightGray">{method.description}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                selectedMethod === method.id
                                                    ? 'border-primary-pink bg-primary-pink'
                                                    : 'border-neutral-lightGray'
                                            }`}>
                                                {selectedMethod === method.id && (
                                                    <motion.div
                                                        className="w-3 h-3 bg-white rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden sticky top-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary-pink via-accent-orange to-accent-yellow px-6 py-4">
                                <div className="flex items-center gap-3 text-white">
                                    <span className="text-xl">🎫</span>
                                    <span className="font-bold">Tóm tắt đơn hàng</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-darkGray">Phim:</span>
                                        <span className="font-semibold text-neutral-darkGray">Avengers: Endgame</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-darkGray">Suất chiếu:</span>
                                        <span className="font-semibold text-neutral-darkGray">20:00 - 22:30</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-darkGray">Ghế:</span>
                                        <span className="font-semibold text-neutral-darkGray">A5, A6</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-darkGray">Số lượng:</span>
                                        <span className="font-semibold text-neutral-darkGray">2 vé</span>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-lightGray/30 pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span className="text-neutral-darkGray">Tổng cộng:</span>
                                        <span className="text-primary-pink">180,000đ</span>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <motion.button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        isProcessing
                                            ? 'bg-neutral-lightGray cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-r from-primary-pink via-accent-orange to-accent-yellow text-white hover:shadow-2xl hover:scale-105'
                                    }`}
                                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Thanh toán ngay</span>
                                            <span>💳</span>
                                        </div>
                                    )}
                                </motion.button>

                                <p className="text-xs text-neutral-lightGray text-center">
                                    🔒 Thanh toán được bảo mật 100%
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
