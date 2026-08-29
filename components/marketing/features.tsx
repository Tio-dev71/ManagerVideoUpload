'use client';

import { motion } from 'framer-motion';
import { Share2, MessageSquare, BarChart3, Link as LinkIcon, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ClientMarquee from '@/components/marketing/shared/client-marquee';

const features = [
  {
    name: 'Quản lý & Đăng bài đa kênh',
    description: 'Tạo, quản lý và đăng bài trên nhiều nền tảng mạng xã hội cùng lúc. Hỗ trợ đa dạng định dạng nội dung.',
    icon: Share2,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
  {
    name: 'Hộp thư & CSKH đa kênh',
    description: 'Tập trung tất cả tin nhắn, bình luận từ nhiều kênh về một nơi. Phản hồi nhanh, không bỏ sót khách hàng.',
    icon: MessageSquare,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
  {
    name: 'Báo cáo & Phân tích',
    description: 'Đo lường hiệu quả chiến dịch, phân tích hành vi khách hàng và đưa ra quyết định dựa trên dữ liệu chính xác.',
    icon: BarChart3,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
  {
    name: 'Quản trị công việc & đội nhóm',
    description: 'Phân công, giao việc, duyệt nội dung và theo dõi tiến độ công việc một cách hiệu quả.',
    icon: Users,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
  {
    name: 'Tự động hóa thông minh',
    description: 'Tự động hóa các tác vụ lặp đi lặp lại, tiết kiệm thời gian và tối ưu hiệu suất làm việc.',
    icon: ShieldCheck,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
  {
    name: 'Tích hợp mạnh mẽ',
    description: 'Kết nối với nhiều công cụ và nền tảng phổ biến như Google Sheet, Zalo, CRM, Webhook...',
    icon: LinkIcon,
    color: 'text-[#5B3DF5]',
    bg: 'bg-indigo-50',
    link: '#',
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="bg-white py-24 relative overflow-hidden">
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Clients Row */}
        <ClientMarquee />

        {/* Features Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#5B3DF5] text-xs font-bold tracking-wide uppercase mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            TÍNH NĂNG NỔI BẬT
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900 mb-6 leading-[1.2]">
            Giải pháp toàn diện cho<br className="hidden md:block"/> doanh nghiệp <span className="text-[#5B3DF5]">hiện đại</span>
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-[0_20px_40px_rgba(8,112,184,0.07)] transition-all duration-300 flex flex-col h-full"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h4 className="text-[17px] font-bold text-gray-900 mb-3">{feature.name}</h4>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6 flex-1">
                {feature.description}
              </p>
              <a href={feature.link} className="inline-flex items-center text-sm font-semibold text-[#5B3DF5] hover:text-blue-700 transition-colors mt-auto">
                Tìm hiểu thêm
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
