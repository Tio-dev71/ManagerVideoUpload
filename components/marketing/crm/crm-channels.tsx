'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe, MoreHorizontal } from 'lucide-react';

export default function CrmChannels() {
  const { t } = useLanguage();
  return (
    <div className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t('crm.channels.title')}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-x-12 gap-y-10">
          
          {/* Facebook */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              f
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Facebook</div>
              <div className="text-xs text-gray-500 mt-1">{t('crm.channels.f1')}</div>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              i
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Instagram</div>
              <div className="text-xs text-gray-500 mt-1">{t('crm.channels.f2')}</div>
            </div>
          </div>

          {/* TikTok */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold shadow-md">
              t
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">TikTok</div>
              <div className="text-xs text-gray-500 mt-1">{t('crm.channels.f3')}</div>
            </div>
          </div>

          {/* Zalo */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-[22px] font-bold shadow-md leading-none tracking-tighter">
              Zalo
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Zalo</div>
              <div className="text-xs text-gray-500 mt-1">{t('crm.channels.f4')}</div>
            </div>
          </div>

          {/* Website */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-md">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Website</div>
              <div className="text-xs text-gray-500 mt-1">{t('crm.channels.f5')}</div>
            </div>
          </div>

          {/* Other */}
          <div className="flex flex-col items-center text-center gap-3 w-[120px]">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              <MoreHorizontal className="w-6 h-6" />
            </div>
            <div className="flex-1 flex items-center mt-1">
              <div className="text-xs text-gray-500">{t('crm.channels.f6')}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
