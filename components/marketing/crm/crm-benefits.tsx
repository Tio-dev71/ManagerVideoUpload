'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, Users, Headphones, MessageSquare, Bot } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function CrmBenefits() {
  const { t } = useLanguage();
  const stats = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      value: t('crm.benefits.stats.v1'),
      label: t('crm.benefits.stats.l1'),
      sub: t('crm.benefits.stats.s1')
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500 fill-orange-500" />,
      value: t('crm.benefits.stats.v2'),
      label: t('crm.benefits.stats.l2'),
      sub: t('crm.benefits.stats.s2')
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      value: t('crm.benefits.stats.v3'),
      label: t('crm.benefits.stats.l3'),
      sub: t('crm.benefits.stats.s3')
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600 fill-indigo-600/20" />,
      value: t('crm.benefits.stats.v4'),
      label: t('crm.benefits.stats.l4'),
      sub: t('crm.benefits.stats.s4')
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-600" />,
      value: t('crm.benefits.stats.v5'),
      label: t('crm.benefits.stats.l5'),
      sub: t('crm.benefits.stats.s5')
    },
  ];

  return (
    <div className="py-24 bg-gray-50/50">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-8">
          
          {/* Left Text & Mascot */}
          <div className="xl:w-[400px] shrink-0 text-center xl:text-left flex flex-col items-center xl:items-start relative">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Vì sao doanh nghiệp chọn Topify CRM?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-[15px] mb-8 lg:mb-16 max-w-sm"
            >
              Giải pháp toàn diện giúp đội ngũ của bạn làm việc hiệu quả hơn mỗi ngày.
            </motion.p>

            {/* Mascot Placeholder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-48 h-48 xl:w-56 xl:h-56 relative animate-bounce" style={{ animationDuration: '4s' }}
            >
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <Image src="/topi1.png" alt="Mascot" width={224} height={224} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
            </motion.div>
          </div>

          {/* Right Stats Box */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] p-6 lg:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100"
            >
              {stats.map((st, i) => (
                <div key={i} className="flex-1 w-full flex flex-col items-center text-center py-6 md:py-4 px-2 hover:-translate-y-1 transition-transform cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                    {st.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-[#5B3DF5] mb-2">{st.value}</div>
                  <div className="text-[13px] font-bold text-gray-900">{st.label}</div>
                  <div className="text-[13px] text-gray-500">{st.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
