'use client';

import { motion } from 'framer-motion';
import { Mail, Globe, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

const integrations = [
  {
    name: 'Facebook',
    desc: 'Page, Group, Ads',
    icon: <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    </div>,
  },
  {
    name: 'TikTok',
    desc: 'Ads & Organic',
    icon: <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
      {/* SVG for TikTok */}
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.32 6.32 0 0 0 6.32 6.32 6.32 6.32 0 0 0 6.32-6.32V8.33a8.39 8.39 0 0 0 4.18 1.15V6.03a6.21 6.21 0 0 1-2.23-.34z" />
      </svg>
    </div>,
  },
  {
    name: 'Google Analytics 4',
    desc: 'Website & App',
    icon: <div className="w-10 h-10 rounded-full bg-[#F9AB00] flex items-center justify-center text-white">
      <Globe className="w-5 h-5" />
    </div>,
  },
  {
    name: 'YouTube',
    desc: 'Channel & Video',
    icon: <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
      </svg>
    </div>,
  },
  {
    name: 'Zalo OA',
    desc: 'Official Account',
    icon: <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">Zalo</div>,
  },
  {
    name: 'Email Marketing',
    desc: 'Campaigns',
    icon: <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Mail className="w-5 h-5" /></div>,
  },
  {
    name: 'Khác',
    desc: 'API, CRM, POS...',
    icon: <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal className="w-5 h-5" /></div>,
  },
];

export default function AnalyticsIntegrations() {
  return (
    <div className="bg-gray-50/50 py-24 relative overflow-hidden border-y border-gray-100">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Dữ liệu toàn diện – Phân tích đa chiều
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[220px]"
            >
              {item.icon}
              <div>
                <div className="font-bold text-gray-900 text-[15px] leading-tight mb-1">{item.name}</div>
                <div className="text-xs text-gray-500 font-medium">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
