'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SocialCta() {
  const { t } = useLanguage();
  return (
    <div className="bg-white py-16">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-[#5B3DF5] to-[#4F2FE0] rounded-[32px] overflow-hidden">
          
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-[-20%] right-[10%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-10 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Content */}
            <div className="max-w-2xl text-left z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight"
                dangerouslySetInnerHTML={{ __html: t('social.cta.title') }}
              />

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10"
              >
                {[
                  t('social.cta.check1'),
                  t('social.cta.check2'),
                  t('social.cta.check3')
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-blue-100 text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-[#5B3DF5] bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  {t('social.cta.btn_demo')}
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-white bg-[#37239C] rounded-xl hover:bg-[#2C1C7D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('social.cta.btn_free')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>

            {/* Mascot Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative w-full lg:w-[450px] h-[300px] flex items-center justify-center shrink-0 z-10"
            >
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s' }}>
                <Image src="/topi1.png" alt="Mascot" width={384} height={384} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
