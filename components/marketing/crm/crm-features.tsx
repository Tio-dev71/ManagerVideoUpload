'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Users, Filter, Bot, Zap, Network } from 'lucide-react';
import Link from 'next/link';

export default function CrmFeatures() {
  const features = [
    {
      title: 'Hộp thư đa kênh',
      desc: 'Tập trung tất cả tin nhắn, bình luận về một nơi. Không bỏ sót khách hàng.',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Quản lý khách hàng',
      desc: 'Lưu trữ thông tin chi tiết, phân loại, gắn tag và theo dõi lịch sử tương tác.',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Cơ hội & Pipeline',
      desc: 'Quản lý lead và cơ hội bán hàng theo từng giai đoạn. Theo dõi doanh thu.',
      icon: <Filter className="w-6 h-6" />,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Chatbot AI',
      desc: 'Chatbot thông minh 24/7, trả lời tự động, chăm sóc và tạo lead hiệu quả.',
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Bot bình luận',
      desc: 'Tự động trả lời bình luận theo kịch bản, lọc lead và thu hút khách hàng tiềm năng.',
      icon: <Zap className="w-6 h-6 fill-pink-600/20" />,
      color: 'bg-pink-50 text-pink-600',
    },
    {
      title: 'Tự động hóa',
      desc: 'Trigger, kịch bản tự động giúp tiết kiệm thời gian và tăng hiệu suất đội ngũ.',
      icon: <Network className="w-6 h-6" />,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
          >
            Tất cả công cụ bạn cần để chăm sóc khách hàng và tăng doanh thu
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((ft, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${ft.color}`}>
                {ft.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">{ft.title}</h4>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-1">
                {ft.desc}
              </p>
              <Link href="#" className="inline-flex items-center text-[13px] font-bold text-[#5B3DF5] hover:text-[#4F2FE0]">
                Tìm hiểu thêm <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
