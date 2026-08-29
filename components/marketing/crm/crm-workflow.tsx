'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Bot, Tags, UserCheck, Headset, ArrowRight } from 'lucide-react';

export default function CrmWorkflow() {
  const steps = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Khách hàng tương tác',
      desc: 'Nhắn tin, bình luận hoặc điền form'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-teal-100 text-teal-600',
      title: 'Bot tự động phản hồi',
      desc: 'Trả lời ngay lập tức theo kịch bản'
    },
    {
      icon: <Tags className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
      title: 'Thu thập & phân loại',
      desc: 'Lưu thông tin, gắn tag, phân loại lead'
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Phân phối nhân viên',
      desc: 'Giao cho nhân viên phù hợp theo quy tắc'
    },
    {
      icon: <Headset className="w-6 h-6" />,
      color: 'bg-pink-100 text-pink-600',
      title: 'Chăm sóc & chốt đơn',
      desc: 'Theo dõi, chăm sóc và chốt đơn hiệu quả'
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            Tự động hóa quy trình – Tiết kiệm thời gian
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2 relative">
          
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row items-center gap-6 lg:gap-2 w-full lg:w-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center w-full lg:w-[200px]"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${step.color} shadow-sm border border-white relative z-10`}>
                  {step.icon}
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed px-4 lg:px-0">
                  {step.desc}
                </p>
              </motion.div>

              {/* Arrow separator (hidden on last item) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex w-8 items-center justify-center -mt-16 text-gray-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
              {idx < steps.length - 1 && (
                <div className="lg:hidden w-1 h-8 bg-gradient-to-b from-gray-200 to-transparent my-2"></div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
