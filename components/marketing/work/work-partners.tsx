'use client';

export default function WorkPartners() {
  return (
    <div className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-900 mb-8">
          Hơn 10.000+ doanh nghiệp đã tin tưởng và sử dụng Topify
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
          
          {/* Sendo */}
          <div className="text-2xl font-bold tracking-tighter text-red-500">Sendo</div>
          
          {/* TiKi */}
          <div className="text-2xl font-black text-blue-500 italic tracking-tighter">TiKi</div>
          
          {/* VietinBank */}
          <div className="flex items-center gap-1">
            <div className="text-xl font-bold text-blue-800">VietinBank</div>
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white -ml-2 -mt-2"></div>
          </div>
          
          {/* Viettel */}
          <div className="text-2xl font-bold text-red-600">viettel</div>
          
          {/* PNJ */}
          <div className="text-2xl font-serif font-bold text-[#F3C456] tracking-widest">PNJ</div>
          
          {/* The Gioi Di Dong */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-black">
               <div className="w-2 h-2 rounded-full bg-black"></div>
            </div>
            <div className="text-lg font-bold text-black tracking-tighter">thegioididong</div>
          </div>

        </div>
      </div>
    </div>
  );
}
