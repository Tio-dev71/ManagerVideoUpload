'use client';

import { motion } from 'framer-motion';

const clients = [
  "Sendo", "Tiki", "VietinBank", "Viettel", "PNJ", "TheGioiDiDong"
];

export default function ClientMarquee() {
  return (
    <div className="mb-24 text-center">
      <p className="text-sm font-bold text-gray-800 mb-8">
        Hơn 10.000+ doanh nghiệp đã tin tưởng và sử dụng Topify
      </p>
      <div className="relative overflow-hidden w-full max-w-full flex py-6">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div
          className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
            <motion.div 
              key={i} 
              className="text-xl md:text-3xl font-bold text-gray-400 cursor-pointer transition-colors duration-300 hover:text-[#5B3DF5]"
              whileHover={{ 
                scale: 1.15,
                y: -8,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="hover:drop-shadow-[0_0_15px_rgba(91,61,245,0.6)] transition-all duration-300 block">
                {client}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
