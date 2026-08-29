'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Columns, Calendar, Users, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function WorkFeatures() {
  const features = [
    {
      title: 'Quản lý công việc',
      desc: 'Tạo, giao, theo dõi và quản lý công việc chi tiết.',
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Dự án & Kanban',
      desc: 'Quản lý dự án linh hoạt với bảng Kanban trực quan.',
      icon: <Columns className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Lịch & Deadline',
      desc: 'Lên lịch, nhắc việc và quản lý deadline thông minh.',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-pink-50 text-pink-600',
    },
    {
      title: 'Đội nhóm & Phân quyền',
      desc: 'Quản lý thành viên, vai trò và phân quyền rõ ràng.',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Mục tiêu (OKR/KPI)',
      desc: 'Đặt mục tiêu, theo dõi và đánh giá kết quả minh bạch.',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Báo cáo & Hiệu suất',
      desc: 'Báo cáo trực quan, đo lường hiệu suất toàn diện.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="py-24 bg-gray-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
          >
            Tất cả những gì bạn cần để quản trị công việc và đội nhóm hiệu quả
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
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all group flex flex-col h-full hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${ft.color}`}>
                {ft.icon}
              </div>
              <h4 className="text-[17px] font-bold text-gray-900 mb-3">{ft.title}</h4>
              <p className="text-[14px] text-gray-600 mb-6 leading-relaxed flex-1">
                {ft.desc}
              </p>
              <Link href="#" className="inline-flex items-center text-[13px] font-bold text-blue-600 hover:text-blue-700">
                Tìm hiểu thêm <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
