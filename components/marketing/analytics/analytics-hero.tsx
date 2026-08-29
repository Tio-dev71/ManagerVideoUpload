'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Home, BarChart3, PieChart, Lightbulb, FileText, Bell, Search, Users } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AnalyticsHero() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-20 lg:pt-28 lg:pb-28">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-50/60 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10 font-medium">
          <Link href="/" className="hover:text-[#5B3DF5] transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            {t('breadcrumb.home')}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link href="/products" className="hover:text-[#5B3DF5] transition-colors">
            {t('breadcrumb.products')}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-bold">Topify Analytics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl pr-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#5B3DF5] text-xs font-bold tracking-wide uppercase mb-6 shadow-sm"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {t('analytics.hero.tag')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 tracking-tight mb-4 leading-[1.1]"
            >
              Topify <span className="text-[#5B3DF5]">Analytics</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[22px] md:text-2xl font-bold text-gray-800 mb-6 leading-snug"
              dangerouslySetInnerHTML={{ __html: t('analytics.hero.title') }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[17px] text-gray-600 mb-10 max-w-xl leading-relaxed"
            >
              {t('analytics.hero.desc')}
            </motion.p>

            {/* 4 Feature Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 gap-x-6 gap-y-8 mb-12"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('analytics.hero.f1.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('analytics.hero.f1.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <PieChart className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('analytics.hero.f2.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('analytics.hero.f2.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('analytics.hero.f3.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('analytics.hero.f3.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('analytics.hero.f4.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('analytics.hero.f4.desc')}</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-semibold text-white bg-[#5B3DF5] rounded-xl hover:bg-[#4F2FE0] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('analytics.hero.btn_free')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold text-[#5B3DF5] bg-white border-2 border-[#5B3DF5]/10 rounded-xl hover:bg-blue-50 transition-all group"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2 border-[#5B3DF5] group-hover:scale-110 transition-transform">
                  <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
                {t('analytics.hero.btn_demo')}
              </button>
            </motion.div>
          </div>

          {/* Right Mockup */}
          <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] xl:h-[650px] mt-8 lg:mt-0 flex items-center justify-center">

            {/* Mascot Placeholder */}
            <div className="absolute bottom-4 sm:bottom-12 lg:bottom-16 left-0 lg:-left-12 xl:-left-20 w-48 sm:w-56 h-64 sm:h-72 z-40 drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full bg-blue-500/20 rounded-full blur-2xl absolute -z-10 bottom-0 scale-75"></div>
              <Image src="/topi1.png" alt="Mascot" width={250} height={250} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
            </div>

            {/* Dashboard Mockup - Scaled down to fit completely within the container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute w-[950px] h-[850px] bg-white rounded-2xl shadow-[0_30px_100px_rgba(8,112,184,0.15)] border border-gray-100 flex overflow-hidden origin-center scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.55] xl:scale-[0.65] 2xl:scale-[0.7]"
            >
              {/* Sidebar */}
              <div className="w-[180px] bg-[#f8fafc] border-r border-gray-100 flex flex-col pt-6 shrink-0">
                <div className="px-5 mb-8 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-[#5B3DF5] to-blue-500 flex items-center justify-center text-white font-bold text-sm">t</div>
                  <span className="font-bold text-gray-900 text-sm">Topify Analytics</span>
                </div>
                <div className="px-3 flex flex-col gap-1">
                  {[
                    { n: t('analytics.mockup.menu.overview'), i: <BarChart3 className="w-4 h-4" />, act: true },
                    { n: t('analytics.mockup.menu.reports'), i: <FileText className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.channels'), i: <PieChart className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.campaigns'), i: <Lightbulb className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.content'), i: <FileText className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.customers'), i: <Users className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.revenue'), i: <BarChart3 className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.orders'), i: <FileText className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.compare'), i: <PieChart className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.alerts'), i: <Bell className="w-4 h-4" /> },
                    { n: t('analytics.mockup.menu.settings'), i: <FileText className="w-4 h-4" /> },
                  ].map((it, idx) => (
                    <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${it.act ? 'bg-white text-[#5B3DF5] font-bold shadow-sm' : 'text-gray-600 font-medium'}`}>
                      {it.i} {it.n}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-white p-8 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{t('analytics.mockup.menu.overview')}</h2>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium border border-gray-100">
                      01/05/2024 - 31/05/2024
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 relative">
                      <Bell className="w-4 h-4" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      A
                    </div>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { n: t('analytics.mockup.stats.revenue'), v: '2.45B', d: '+18.6%', c: 'text-green-500' },
                    { n: t('analytics.mockup.stats.visits'), v: '356.8K', d: '+12.3%', c: 'text-green-500' },
                    { n: t('analytics.mockup.stats.orders'), v: '3.152', d: '+15.2%', c: 'text-green-500' },
                    { n: t('analytics.mockup.stats.conversion'), v: '2.85%', d: '+8.7%', c: 'text-green-500' },
                  ].map((st, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="text-sm font-semibold text-gray-500 mb-3">{st.n}</div>
                      <div className="flex items-end gap-3">
                        <div className="text-3xl font-bold text-gray-900 leading-none">{st.v}</div>
                        <div className={`text-xs font-bold flex items-center ${st.c}`}>
                          ↑ {st.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                  {/* Left Col */}
                  <div className="flex flex-col gap-6">
                    {/* Donut Chart */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1">
                      <div className="text-sm font-bold text-gray-900 mb-6">{t('analytics.mockup.chart1.title')}</div>
                      <div className="flex items-center gap-8">
                        {/* Donut svg */}
                        <div className="w-[180px] h-[180px] relative">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#5B3DF5" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="100.48" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="188.4" className="origin-center rotate-[216deg]" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="226.08" className="origin-center rotate-[100deg]" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">356.8K</span>
                            <span className="text-[11px] font-semibold text-gray-500">{t('analytics.mockup.chart1.subtitle')}</span>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-col gap-3 flex-1">
                          {[
                            { l: 'Facebook', c: 'bg-[#5B3DF5]', p: '40.2%' },
                            { l: 'TikTok', c: 'bg-pink-500', p: '25.6%' },
                            { l: 'Google', c: 'bg-blue-500', p: '18.7%' },
                            { l: 'Zalo', c: 'bg-cyan-500', p: '8.4%' },
                            { l: 'Email', c: 'bg-purple-500', p: '4.1%' },
                            { l: t('analytics.mockup.chart1.other'), c: 'bg-gray-300', p: '3.0%' }
                          ].map((lg, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-sm ${lg.c}`}></div>
                                <span className="text-gray-600 font-medium">{lg.l}</span>
                              </div>
                              <span className="font-bold text-gray-900">{lg.p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[240px] flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-sm font-bold text-gray-900">{t('analytics.mockup.chart2.title')}</div>
                        <div className="flex gap-4 text-[10px] font-bold text-gray-500">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5B3DF5]"></div> {t('analytics.mockup.chart2.legend.views')}</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400"></div> {t('analytics.mockup.chart2.legend.engagement')}</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-400"></div> {t('analytics.mockup.chart2.legend.conversion')}</div>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between px-2 gap-4 pb-6 border-b border-gray-100 relative">
                        {/* Y axis */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-gray-400">
                          <span>30K</span><span>20K</span><span>10K</span><span>0</span>
                        </div>
                        <div className="w-8"></div> {/* spacer */}
                        {[
                          [80, 45, 20], [60, 35, 15], [90, 50, 25], [70, 40, 20], [50, 25, 10]
                        ].map((bars, i) => (
                          <div key={i} className="flex items-end gap-1.5 h-full pt-4">
                            <div className="w-3.5 bg-[#5B3DF5] rounded-t-sm" style={{ height: `${bars[0]}%` }}></div>
                            <div className="w-3.5 bg-blue-400 rounded-t-sm" style={{ height: `${bars[1]}%` }}></div>
                            <div className="w-3.5 bg-teal-400 rounded-t-sm" style={{ height: `${bars[2]}%` }}></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between px-2 pt-3 text-[10px] font-bold text-gray-500 ml-10">
                        <span>{t('analytics.mockup.chart2.x.post1')}</span><span>{t('analytics.mockup.chart2.x.post2')}</span><span>{t('analytics.mockup.chart2.x.post3')}</span><span>{t('analytics.mockup.chart2.x.post4')}</span><span>{t('analytics.mockup.chart2.x.post5')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Col */}
                  <div className="flex flex-col gap-6">
                    {/* Line Chart */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 flex flex-col">
                      <div className="text-sm font-bold text-gray-900 mb-6">{t('analytics.mockup.chart3.title')}</div>
                      <div className="flex-1 relative w-full h-full pb-6 pl-8">
                        {/* Y axis */}
                        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-1">
                          <span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span>
                        </div>
                        {/* Lines */}
                        <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                          {/* Grid lines */}
                          <line x1="0" y1="0" x2="400" y2="0" stroke="#f1f5f9" strokeWidth="2" />
                          <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="2" />
                          <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="2" />
                          <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="2" />
                          <line x1="0" y1="200" x2="400" y2="200" stroke="#f1f5f9" strokeWidth="2" />

                          {/* Data Lines */}
                          <path d="M 0 160 L 80 120 L 160 140 L 240 80 L 320 100 L 400 40" fill="none" stroke="#5B3DF5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M 0 180 L 80 160 L 160 170 L 240 130 L 320 150 L 400 90" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M 0 140 L 80 150 L 160 110 L 240 120 L 320 80 L 400 110" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Points for line 1 */}
                          <circle cx="0" cy="160" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="80" cy="120" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="160" cy="140" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="240" cy="80" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="320" cy="100" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                          <circle cx="400" cy="40" r="4" fill="#5B3DF5" stroke="white" strokeWidth="2" />
                        </svg>
                        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] font-bold text-gray-500">
                          <span>01/05</span><span>08/05</span><span>15/05</span><span>22/05</span><span>29/05</span><span>31/05</span>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart 2 */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[200px]">
                      <div className="text-sm font-bold text-gray-900 mb-6">{t('analytics.mockup.chart4.title')}</div>
                      <div className="flex items-center gap-8 h-full pb-4">
                        <div className="w-[120px] h-[120px] relative">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="25" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="65.94" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#5B3DF5" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="153.86" className="origin-center rotate-[240deg]" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-4 flex-1">
                          {[
                            { l: 'Mobile', c: 'bg-blue-500', p: '68.7%' },
                            { l: 'Desktop', c: 'bg-[#5B3DF5]', p: '27.3%' },
                            { l: 'Tablet', c: 'bg-pink-500', p: '4.0%' }
                          ].map((lg, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-sm ${lg.c}`}></div>
                                <span className="text-gray-600 font-medium">{lg.l}</span>
                              </div>
                              <span className="font-bold text-gray-900">{lg.p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
