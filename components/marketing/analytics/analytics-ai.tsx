'use client';

import { motion } from 'framer-motion';
import { Sparkles, BellRing, TrendingUp, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AnalyticsAi() {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-50/30 py-24 relative overflow-hidden">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {t('analytics.ai.title')}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Features Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{t('analytics.ai.f1.title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t('analytics.ai.f1.desc')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{t('analytics.ai.f2.title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t('analytics.ai.f2.desc')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{t('analytics.ai.f3.title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t('analytics.ai.f3.desc')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{t('analytics.ai.f4.title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t('analytics.ai.f4.desc')}</p>
              </div>
            </motion.div>

          </div>

          {/* Right Mascot Illustration */}
          <div className="w-full lg:w-[400px] xl:w-[500px] h-[300px] relative flex items-center justify-center shrink-0">
             {/* Decorative Background */}
             <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl scale-75"></div>
             
             {/* Replace with actual image when available */}
             <div className="w-64 h-64 relative flex items-center justify-center animate-pulse" style={{ animationDuration: '4s' }}>
                <Image src="/topi1.png" alt="Mascot" width={256} height={256} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#5B3DF5] z-20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-6 -left-2 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-red-500 z-20">
                  <TrendingUp className="w-10 h-10" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
