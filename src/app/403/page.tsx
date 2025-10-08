"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="text-7xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-white mb-2">403 - Access Denied</h1>
        <p className="text-white/80 mb-8">Bạn không có quyền truy cập trang này.</p>
        <div className="flex items-center gap-3 justify-center">
          <Link href="/">
            <button className="px-5 py-2 rounded-lg bg-primary-pink text-white font-semibold hover:bg-cinema-neonPink transition-colors">Về trang chủ</button>
          </Link>
          <Link href="/auth">
            <button className="px-5 py-2 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">Đăng nhập tài khoản khác</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}


