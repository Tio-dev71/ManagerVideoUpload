'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <div className="relative py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#5B3DF5] to-[#3B82F6] px-8 py-20 text-center shadow-2xl"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-heading">
              Sẵn sàng để bứt phá doanh thu cùng Topify?
            </h2>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed">
              Hàng ngàn doanh nghiệp đã chuyển đổi số thành công. Bắt đầu dùng thử miễn phí 14 ngày ngay hôm nay. Không cần thẻ tín dụng.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#5B3DF5] bg-white rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Dùng thử miễn phí 14 ngày
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent rounded-full hover:bg-white/10 transition-all border border-white/30"
              >
                Liên hệ tư vấn
              </Link>
            </div>
            <p className="mt-6 text-blue-100 text-sm">
              Không cần thẻ tín dụng. Hủy bất cứ lúc nào.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
