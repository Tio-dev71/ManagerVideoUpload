'use client';

import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AnalyticsCta() {
  const { t } = useLanguage();
  return (
    <div className="bg-white py-16 pb-8">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative bg-[#2A3FD7] rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Gradients & Patterns */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5B3DF5] rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 px-8 py-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t('analytics.cta.title1')}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
                {t('analytics.cta.title2')}
              </h3>

              {/* Checkmarks */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10 text-white/90 font-medium text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  {t('analytics.cta.check1')}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  {t('analytics.cta.check2')}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  {t('analytics.cta.check3')}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-blue-900 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-0.5 group">
                  <Play className="w-4 h-4 mr-2 text-blue-600 group-hover:text-blue-700 transition-colors" fill="currentColor" />
                  {t('analytics.cta.btn_demo')}
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-white bg-black/20 hover:bg-black/30 backdrop-blur border border-white/10 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
                >
                  {t('analytics.cta.btn_free')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Mascot Placeholder */}
            <div className="w-[300px] h-[300px] shrink-0 relative lg:translate-y-6 hidden md:flex items-center justify-center">
              <div className="w-72 h-72 md:w-72 md:h-72 relative flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s' }}>
                <Image src="/topi2.png" alt="Mascot" width={288} height={288} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
