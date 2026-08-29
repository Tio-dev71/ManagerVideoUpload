'use client';

import { motion } from 'framer-motion';
import { Shield, Target, Zap, TrendingUp, Heart, Lock } from 'lucide-react';

export default function WorkBenefits() {
  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Tăng hiệu suất',
      desc: 'Quy trình rõ ràng, giảm thời gian phối hợp.',
      color: 'bg-blue-50'
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: 'Minh bạch & Rõ ràng',
      desc: 'Ai làm gì, khi nào, tiến độ thế nào – đều rõ ràng.',
      color: 'bg-purple-50'
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500 fill-orange-500" />,
      title: 'Tiết kiệm thời gian',
      desc: 'Tự động hóa và nhắc việc giúp tiết kiệm đến 60% thời gian.',
      color: 'bg-orange-50'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: 'Ra quyết định nhanh',
      desc: 'Báo cáo trực quan, dữ liệu real-time hỗ trợ quyết định chính xác.',
      color: 'bg-blue-50'
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />,
      title: 'Gắn kết đội nhóm',
      desc: 'Cộng tác dễ dàng, tăng sự gắn kết và tinh thần trách nhiệm.',
      color: 'bg-pink-50'
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600 fill-indigo-600/20" />,
      title: 'An toàn dữ liệu',
      desc: 'Bảo mật tuyệt đối với hệ thống nhiều lớp bảo vệ.',
      color: 'bg-indigo-50'
    }
  ];

  return (
    <div className="py-24 bg-gray-50/50">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            Vì sao doanh nghiệp chọn Topify Work?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 xl:gap-4">
          {benefits.map((bn, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${bn.color}`}>
                {bn.icon}
              </div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">{bn.title}</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {bn.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
