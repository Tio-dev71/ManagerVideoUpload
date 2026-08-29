'use client';

import { ArrowRight, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CrmCta() {
  return (
    <div className="bg-white py-16 pb-24">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-[#5B3DF5] to-blue-600 rounded-[32px] overflow-hidden">
          
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-[-20%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-10 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Content */}
            <div className="max-w-2xl text-left z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight"
              >
                Chăm sóc khách hàng tốt hơn –<br className="hidden md:block"/>
                Doanh thu tăng trưởng bền vững cùng Topify CRM!
              </motion.h2>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <button className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-[#5B3DF5] bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Xem demo sản phẩm
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-white bg-[#37239C] rounded-xl hover:bg-[#2C1C7D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Dùng thử miễn phí
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-4"
              >
                {[
                  'Dùng thử miễn phí 7 ngày',
                  'Không cần thẻ tín dụng',
                  'Hỗ trợ 24/7'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-blue-100 text-[14px] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 3D Elements Placeholder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative w-full lg:w-[450px] h-[300px] flex items-center justify-center shrink-0 z-10"
            >
              {/* This is a placeholder for the 3D assets in the design */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <Image src="/topi1.png" alt="Mascot" width={224} height={224} className="w-full h-auto object-contain drop-shadow-2xl relative z-10 animate-bounce" style={{ animationDuration: '4s' }} />
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
