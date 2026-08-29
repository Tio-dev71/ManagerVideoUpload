'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { FileSpreadsheet, Webhook, Code, ShoppingBag, Heart, MessageCircle } from 'lucide-react';

export default function CrmIntegrations() {
  const { t } = useLanguage();
  return (
    <div className="py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            {t('crm.integrations.title')}
          </h3>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-80">
          
          {/* Google Sheets */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
            <span className="font-bold text-gray-700 text-lg">Google Sheets</span>
          </div>

          {/* Zalo */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold tracking-tighter">Zalo</div>
          </div>

          {/* Webhook */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <Webhook className="w-8 h-8 text-pink-600" />
            <span className="font-bold text-gray-700 text-lg">Webhook</span>
          </div>

          {/* API */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="w-10 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">API</div>
            <span className="font-bold text-gray-700 text-lg">API</span>
          </div>

          {/* Shopee */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <ShoppingBag className="w-8 h-8 text-orange-500" />
            <span className="font-bold text-gray-700 text-lg">Shopee</span>
          </div>

          {/* Lazada */}
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <Heart className="w-8 h-8 text-blue-800 fill-orange-500" />
            <span className="font-bold text-gray-700 text-lg">Lazada</span>
          </div>

          <div className="text-sm font-bold text-gray-500 ml-4">
            {t('crm.integrations.more')}
          </div>

        </div>
      </div>
    </div>
  );
}
