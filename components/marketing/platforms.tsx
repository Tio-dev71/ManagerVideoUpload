'use client';

import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Facebook',
    desc: 'Page, Group, Profile',
    icon: (
      <svg className="w-10 h-10 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    desc: 'Business Account',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
        <path d="M12.525.025c-1.31-.02-2.71.02-3.95.07V16.34c0 1.25-.87 2.37-2.09 2.58-1.5.25-2.92-.85-3.03-2.37-.12-1.5.85-2.85 2.33-3.12.38-.07.76-.06 1.13.02v-4.14c-.69-.11-1.39-.14-2.1-.06-3.15.35-5.6 3.12-5.59 6.29.02 3.65 3 6.64 6.64 6.64 3.41 0 6.21-2.58 6.55-5.95.04-.42.06-.85.06-1.27V8.62c1.45 1.05 3.23 1.7 5.09 1.77v-4.08c-1.58-.08-3.06-.77-4.12-1.89-1.02-1.08-1.58-2.54-1.61-4.08h-2.33Z" fill="#000000"/>
        <path d="M12.525.025c-1.31-.02-2.71.02-3.95.07V16.34c0 1.25-.87 2.37-2.09 2.58-1.5.25-2.92-.85-3.03-2.37-.12-1.5.85-2.85 2.33-3.12.38-.07.76-.06 1.13.02v-4.14c-.69-.11-1.39-.14-2.1-.06-3.15.35-5.6 3.12-5.59 6.29.02 3.65 3 6.64 6.64 6.64 3.41 0 6.21-2.58 6.55-5.95.04-.42.06-.85.06-1.27V8.62c1.45 1.05 3.23 1.7 5.09 1.77v-4.08c-1.58-.08-3.06-.77-4.12-1.89-1.02-1.08-1.58-2.54-1.61-4.08h-2.33Z" fill="url(#tiktok-grad)"/>
        <defs>
          <linearGradient id="tiktok-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69C9D0" />
            <stop offset="0.5" stopColor="#010101" />
            <stop offset="1" stopColor="#EE1D52" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    desc: 'Business Account',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        <defs>
          <linearGradient id="ig-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f09433" />
            <stop offset="0.3" stopColor="#e6683c" />
            <stop offset="0.6" stopColor="#dc2743" />
            <stop offset="0.8" stopColor="#cc2366" />
            <stop offset="1" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    desc: 'Channel',
    icon: (
      <svg className="w-10 h-10 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Zalo',
    desc: 'Official Account',
    icon: (
      <svg className="w-10 h-10 text-[#0068FF]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 3.067 1.157 5.86 3.06 7.973-.24 1.838-.99 4.02-1.045 4.182-.045.14.004.298.118.397.115.1.282.126.425.065 0 0 3.585-1.505 5.312-1.927C9.176 23.518 10.552 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.176 16.5h-5.26c-.347 0-.63-.284-.63-.633v-.735c0-.348.283-.63.63-.63h3.504l-3.97-4.887c-.105-.13-.153-.296-.135-.462.018-.166.1-.318.232-.423L12 8.35h4.743c.348 0 .63.284.63.633v.736c0 .348-.282.63-.63.63H13.62l3.666 4.51c.11.135.162.308.14.48-.02.17-.11.32-.248.423-.11.082-.245.127-.384.127z"/>
      </svg>
    ),
  },
];

export default function PlatformsSection() {
  return (
    <div id="platforms" className="bg-white py-24 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#5B3DF5] text-xs font-bold tracking-wide uppercase mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            NỀN TẢNG HỖ TRỢ
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900 mb-6 leading-[1.2]">
            Kết nối tất cả <span className="text-[#5B3DF5]">nền tảng</span> bạn đang sử dụng
          </h3>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-[0_15px_30px_rgba(8,112,184,0.06)] transition-all duration-300"
            >
              <div className="mb-4">
                {platform.icon}
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{platform.name}</h4>
              <p className="text-[11px] text-gray-500 leading-tight">{platform.desc}</p>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#5B3DF5] flex items-center justify-center mb-3 shadow-sm font-bold text-lg">
              ...
            </div>
            <h4 className="font-bold text-[#5B3DF5] text-sm mb-1">Xem thêm</h4>
            <p className="text-[11px] text-blue-600/70 leading-tight">+10 nền tảng khác</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
