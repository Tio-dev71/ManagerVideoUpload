'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 xl:gap-6 items-center">
          {/* Left Content */}
          <div className="max-w-xl xl:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#5B3DF5] text-xs font-bold tracking-wide uppercase mb-8 shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.15]"
            >
              {t('hero.title1')}<br className="hidden md:block" /> {t('hero.title2')}<br className="hidden md:block" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] to-[#3B82F6]">
                {t('hero.title3')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-[15px] font-semibold text-white bg-[#5B3DF5] rounded-xl hover:bg-[#4F2FE0] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('hero.cta_primary')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-[15px] font-semibold text-gray-700 bg-transparent rounded-xl hover:bg-gray-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-3 group-hover:border-[#5B3DF5] group-hover:text-[#5B3DF5] transition-colors bg-white">
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
                <div className="text-left">
                  <div className="text-[#5B3DF5] font-bold">{t('hero.cta_secondary')}</div>
                  <div className="text-xs text-gray-500 font-normal">{t('hero.cta_secondary_desc')}</div>
                </div>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-[13px] text-gray-600 font-medium"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3DF5]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t('hero.feature1_title')}</div>
                  <div className="text-xs text-gray-500 font-normal mt-0.5">{t('hero.feature1_desc')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3DF5]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t('hero.feature2_title')}</div>
                  <div className="text-xs text-gray-500 font-normal mt-0.5">{t('hero.feature2_desc')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3DF5]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t('hero.feature3_title')}</div>
                  <div className="text-xs text-gray-500 font-normal mt-0.5">{t('hero.feature3_desc')}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Image Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative mt-12 lg:mt-0 z-20 hidden md:block w-full h-[450px] lg:h-[550px] xl:h-[600px]"
          >
            {/* The absolute positioning prevents the 860px width from breaking the grid layout */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform origin-center scale-[0.75] lg:scale-[0.7] xl:scale-[0.85] 2xl:scale-[0.95] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(255,192,203,0.15)] border-[1.5px] border-rose-100 bg-white w-[860px] h-[640px]">

              <div className="flex h-full w-full bg-[#FAFAFA]">
                {/* Sidebar */}
                <div className="w-[200px] bg-white border-r border-gray-100 flex flex-col pt-6 pb-4">
                  {/* Logo */}
                  <div className="flex items-center gap-2 px-5 mb-8">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#5B3DF5] to-[#3B82F6] flex items-center justify-center">
                      <span className="text-white font-bold text-xs leading-none">t</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">Topify</span>
                  </div>

                  {/* Menu */}
                  <div className="flex-1 flex flex-col gap-1 px-3">
                    <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50/80 rounded-lg text-[#5B3DF5]">
                      <div className="w-4 h-4 rounded bg-[#5B3DF5]/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#5B3DF5] rounded-sm"></div>
                      </div>
                      <span className="text-[13px] font-semibold">{t('hero.mockup.overview')}</span>
                    </div>
                    {[t('hero.mockup.channel'), t('hero.mockup.post'), t('hero.mockup.calendar'), t('hero.mockup.inbox'), t('hero.mockup.customer'), t('hero.mockup.work'), t('hero.mockup.report'), t('hero.mockup.automation'), t('hero.mockup.setting')].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-500">
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        <span className="text-[13px] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* User Profile */}
                  <div className="px-5 mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-blue-400"></div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-gray-900 leading-tight">{t('hero.mockup.user')}</div>
                      <div className="text-[11px] text-gray-500">{t('hero.mockup.role')}</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden bg-[#FAFAFA]">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{t('hero.mockup.overview')}</h2>
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-2">
                      01/05/2024 - 07/05/2024
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: t('hero.mockup.stat1'), val: '128', change: '+12.5%', color: 'text-emerald-500' },
                      { label: t('hero.mockup.stat2'), val: '24.5K', change: '+18.7%', color: 'text-emerald-500' },
                      { label: t('hero.mockup.stat3'), val: '410.3K', change: '+26.4%', color: 'text-emerald-500' },
                      { label: t('hero.mockup.stat4'), val: '356', change: '-5.2%', color: 'text-rose-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-[12px] text-gray-500 mb-2">{stat.label}</div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold text-gray-900 leading-none">{stat.val}</div>
                          <div className={`text-[10px] font-bold ${stat.color} leading-loose`}>{stat.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle Charts */}
                  <div className="grid grid-cols-5 gap-4">
                    {/* Donut Chart Card */}
                    <div className="col-span-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                      <div className="text-[13px] font-bold text-gray-900 mb-4">{t('hero.mockup.chart1')}</div>
                      <div className="flex-1 flex items-center justify-center gap-6">
                        <div className="relative w-28 h-28 rounded-full border-[18px] border-blue-500 border-t-[#5B3DF5] border-r-pink-500 border-b-rose-500 flex items-center justify-center">
                          <div className="text-sm font-bold text-gray-900">410.3K</div>
                          <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 rounded-full translate-x-2 -translate-y-2"></div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {[
                            { name: 'Facebook', pct: '40%', color: 'bg-blue-500' },
                            { name: 'TikTok', pct: '30%', color: 'bg-[#5B3DF5]' },
                            { name: 'Instagram', pct: '15%', color: 'bg-pink-500' },
                            { name: 'YouTube', pct: '10%', color: 'bg-rose-500' },
                            { name: t('hero.mockup.other'), pct: '5%', color: 'bg-gray-300' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px]">
                              <div className={`w-2 h-2 rounded-sm ${item.color}`}></div>
                              <span className="text-gray-600 w-16">{item.name}</span>
                              <span className="text-gray-900 font-bold">{item.pct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Line Chart Card */}
                    <div className="col-span-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[13px] font-bold text-gray-900">{t('hero.mockup.interaction')}</div>
                        <div className="px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-500 flex items-center gap-1">
                          {t('hero.mockup.last7days')}
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <div className="flex-1 relative w-full h-full mt-2">
                        {/* Simple SVG Line Chart */}
                        <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                          <path d="M 0 100 Q 50 80 100 85 T 200 50 T 300 60 T 400 30" fill="none" stroke="#5B3DF5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M 0 100 Q 50 80 100 85 T 200 50 T 300 60 T 400 30 L 400 120 L 0 120 Z" fill="url(#gradient)" opacity="0.1" />
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#5B3DF5" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          {/* Data points */}
                          <circle cx="0" cy="100" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="100" cy="85" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="200" cy="50" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="300" cy="60" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="400" cy="30" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                        </svg>
                        {/* Axis labels */}
                        <div className="absolute bottom-[-16px] left-0 w-full flex justify-between text-[9px] text-gray-400">
                          <span>01/05</span><span>02/05</span><span>03/05</span><span>04/05</span><span>05/05</span><span>06/05</span><span>07/05</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1 flex flex-col">
                    <div className="text-[13px] font-bold text-gray-900 mb-3">{t('hero.mockup.recent_posts')}</div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3 px-2">
                      <div className="w-[240px]">{t('hero.mockup.post')}</div>
                      <div className="w-[80px]">{t('hero.mockup.channel')}</div>
                      <div className="w-[120px]">{t('hero.mockup.time')}</div>
                      <div className="w-[80px]">{t('hero.mockup.status')}</div>
                      <div className="w-[60px] text-right">{t('hero.mockup.interaction')}</div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { title: t('hero.mockup.post1'), platforms: ['bg-blue-500', 'bg-black'], time: '07/05/2024 09:30', status: t('hero.mockup.posted'), val: '1.2K' },
                        { title: t('hero.mockup.post2'), platforms: ['bg-pink-500'], time: '07/05/2024 08:00', status: t('hero.mockup.posted'), val: '856' },
                        { title: t('hero.mockup.post3'), platforms: ['bg-red-500'], time: '06/05/2024 20:15', status: t('hero.mockup.posted'), val: '2.3K' }
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded-lg">
                          <div className="w-[240px] flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-200"></div>
                            <span className="text-[12px] font-semibold text-gray-900 truncate">{row.title}</span>
                          </div>
                          <div className="w-[80px] flex gap-1">
                            {row.platforms.map((c, j) => <div key={j} className={`w-4 h-4 rounded-full ${c}`}></div>)}
                          </div>
                          <div className="w-[120px] text-[11px] text-gray-600">{row.time}</div>
                          <div className="w-[80px]">
                            <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-semibold">{row.status}</span>
                          </div>
                          <div className="w-[60px] text-right text-[12px] font-bold text-gray-900">{row.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Decorative elements around mockup */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
