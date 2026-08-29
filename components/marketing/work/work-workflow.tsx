'use client';

import { motion } from 'framer-motion';
import { Plus, Users, ListTodo, Check, BarChart2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function WorkWorkflow() {
  const { t } = useLanguage();
  const steps = [
    {
      icon: <Plus className="w-6 h-6" />,
      color: 'bg-blue-600 text-white',
      title: t('work.workflow.s1.title'),
      desc: t('work.workflow.s1.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-600 text-white',
      title: t('work.workflow.s2.title'),
      desc: t('work.workflow.s2.desc')
    },
    {
      icon: <ListTodo className="w-6 h-6" />,
      color: 'bg-orange-400 text-white',
      title: t('work.workflow.s3.title'),
      desc: t('work.workflow.s3.desc')
    },
    {
      icon: <Check className="w-6 h-6" />,
      color: 'bg-green-500 text-white',
      title: t('work.workflow.s4.title'),
      desc: t('work.workflow.s4.desc')
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      color: 'bg-blue-500 text-white',
      title: t('work.workflow.s5.title'),
      desc: t('work.workflow.s5.desc')
    }
  ];

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            Quy trình làm việc với Topify Work
          </motion.h2>
        </div>

        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-8">
          
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2 relative w-full">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-gray-100 -z-10"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row items-center gap-6 lg:gap-2 w-full lg:w-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center w-full lg:w-[160px]"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${step.color} shadow-lg border-2 border-white relative z-10`}>
                    {step.icon}
                  </div>
                  <h4 className="text-[15px] font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed px-4 lg:px-0">
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

          {/* 3D Mascot side */}
          <div className="xl:w-[300px] shrink-0 hidden md:flex items-center justify-center relative mt-12 xl:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-64 h-64 animate-bounce" style={{ animationDuration: '3s' }}
            >
              {/* Speech Bubble */}
              <div className="absolute -top-12 -left-20 bg-blue-50 text-blue-700 text-sm font-bold py-3 px-5 rounded-2xl rounded-br-none shadow-lg border border-blue-100 w-48 text-center z-20">
                {t('work.workflow.bubble')}
              </div>
              
              <Image src="/topi2.png" alt="Mascot" width={256} height={256} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
              <div className="absolute -bottom-4 right-4 w-20 h-24 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col p-2 z-20 rotate-[-10deg]">
                <div className="w-full h-2 bg-blue-100 rounded mb-2"></div>
                <div className="flex-1 w-full flex items-end gap-1">
                   <div className="w-full bg-blue-500 rounded-t-sm" style={{height: '40%'}}></div>
                   <div className="w-full bg-blue-500 rounded-t-sm" style={{height: '70%'}}></div>
                   <div className="w-full bg-blue-500 rounded-t-sm" style={{height: '100%'}}></div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
