import Link from 'next/link';

interface HeroProductProps {
  titleStart: string;
  titleHighlight: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageComponent?: React.ReactNode;
}

export function HeroProduct({
  titleStart,
  titleHighlight,
  description,
  primaryButtonText = "Dùng thử miễn phí",
  primaryButtonLink = "/login",
  secondaryButtonText = "Liên hệ tư vấn",
  secondaryButtonLink = "/contact",
  imageComponent
}: HeroProductProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.15]">
              {titleStart}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] to-[#3B82F6]">
                {titleHighlight}
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={primaryButtonLink}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-white bg-[#5B3DF5] hover:bg-[#4F2FE0] text-[15px] font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
              >
                {primaryButtonText}
              </Link>
              <Link 
                href={secondaryButtonLink}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[15px] font-semibold transition-all"
              >
                {secondaryButtonText}
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Hủy bất cứ lúc nào</span>
              </div>
            </div>
          </div>
          
          {/* Image/Mockup Component */}
          <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-200/60 shadow-2xl shadow-indigo-500/5 flex items-center justify-center overflow-hidden">
            {imageComponent ? (
              imageComponent
            ) : (
              <div className="text-gray-400 font-medium">Dashboard Mockup (Placeholder)</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
