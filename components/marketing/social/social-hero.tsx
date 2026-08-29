'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Home, LayoutGrid, Clock, TrendingUp, CheckSquare, Layers, Calendar, Image as ImageIcon, FileText, Users, Settings, Search, Bell } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SocialHero() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-20 lg:pt-28 lg:pb-28">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-50/60 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
          <span className="text-gray-900 font-bold">Topify Social</span>
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
              <LayoutGrid className="w-3.5 h-3.5" />
              {t('social.hero.tag')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 tracking-tight mb-4 leading-[1.1]"
            >
              Topify <span className="text-[#5B3DF5]">Social</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[22px] md:text-2xl font-bold text-gray-800 mb-6 leading-snug"
              dangerouslySetInnerHTML={{ __html: t('social.hero.title') }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[17px] text-gray-600 mb-10 max-w-xl leading-relaxed"
            >
              {t('social.hero.desc')}
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
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('social.hero.f1.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('social.hero.f1.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('social.hero.f2.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('social.hero.f2.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('social.hero.f3.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('social.hero.f3.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-[#5B3DF5] mb-3">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('social.hero.f4.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('social.hero.f4.desc')}</p>
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
                {t('social.hero.btn_free')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold text-[#5B3DF5] bg-white border-2 border-[#5B3DF5]/10 rounded-xl hover:bg-blue-50 transition-all group"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2 border-[#5B3DF5] group-hover:scale-110 transition-transform">
                  <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
                {t('social.hero.btn_demo')}
              </button>
            </motion.div>
          </div>

          {/* Right Mockup */}
          <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] xl:h-[650px] mt-8 lg:mt-0 flex items-center justify-center">
            
            {/* Mascot Placeholder */}
            <div className="absolute bottom-4 sm:bottom-12 lg:bottom-16 left-0 lg:-left-12 xl:-left-20 w-48 sm:w-56 h-64 sm:h-72 z-40 drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full bg-blue-500/20 rounded-full blur-2xl absolute -z-10 bottom-0 scale-75"></div>
              <Image src="/topi1.png" alt="Mascot" width={224} height={288} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
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
                  <span className="font-bold text-gray-900 text-sm">Topify</span>
                </div>
                <div className="px-3 flex flex-col gap-1">
                  {[
                    { n: t('social.mockup.menu.overview'), i: <LayoutGrid className="w-4 h-4"/>, act: true },
                    { n: t('social.mockup.menu.channels'), i: <Layers className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.posts'), i: <FileText className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.calendar'), i: <Calendar className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.assets'), i: <ImageIcon className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.reports'), i: <TrendingUp className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.team'), i: <Users className="w-4 h-4"/> },
                    { n: t('social.mockup.menu.settings'), i: <Settings className="w-4 h-4"/> },
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
                  <h2 className="text-2xl font-bold text-gray-900">{t('social.mockup.menu.overview')}</h2>
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
                    { n: t('social.mockup.stats.channels'), v: '23', d: '+12%', c: 'text-green-500' },
                    { n: t('social.mockup.stats.posts'), v: '1.284', d: '+18%', c: 'text-green-500' },
                    { n: t('social.mockup.stats.engagement'), v: '215.6K', d: '-20%', c: 'text-red-500', isDown: true },
                    { n: t('social.mockup.stats.reach'), v: '456.8K', d: '+21%', c: 'text-green-500' },
                  ].map((st, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="text-sm font-semibold text-gray-500 mb-3">{st.n}</div>
                      <div className="flex items-end gap-3">
                        <div className="text-3xl font-bold text-gray-900 leading-none">{st.v}</div>
                        <div className={`text-xs font-bold flex items-center bg-opacity-10 px-2 py-0.5 rounded-full ${st.isDown ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {st.isDown ? '↓' : '↑'} {st.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-[1.2fr_1fr] gap-6 mb-6">
                  {/* Line Chart */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[280px]">
                    <div className="text-sm font-bold text-gray-900 mb-6">{t('social.mockup.chart1.title')}</div>
                    <div className="flex gap-4 text-[10px] font-bold text-gray-500 mb-4 justify-center">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('social.mockup.stats.reach')}</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div> {t('social.mockup.stats.engagement')}</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> {t('social.mockup.chart1.legend.clicks')}</div>
                    </div>
                    <div className="flex-1 relative w-full h-full pb-6 pl-8">
                      {/* Y axis */}
                      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-1">
                         <span>60K</span><span>40K</span><span>20K</span><span>0</span>
                      </div>
                      {/* Lines */}
                      <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="0" x2="400" y2="0" stroke="#f1f5f9" strokeWidth="2" />
                        <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="2" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="2" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="2" />

                        {/* Data Lines */}
                        <path d="M 0 100 L 50 120 L 100 80 L 150 110 L 200 60 L 250 90 L 300 130 L 350 40 L 400 70" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 0 130 L 50 110 L 100 120 L 150 140 L 200 110 L 250 130 L 300 90 L 350 120 L 400 100" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 0 80 L 50 60 L 100 90 L 150 50 L 200 70 L 250 40 L 300 60 L 350 30 L 400 20" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] font-bold text-gray-500">
                        <span>01/05</span><span>05/05</span><span>09/05</span><span>13/05</span><span>17/05</span><span>21/05</span><span>25/05</span><span>29/05</span>
                      </div>
                    </div>
                  </div>

                  {/* Donut Chart */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[280px]">
                    <div className="text-sm font-bold text-gray-900 mb-6">{t('social.mockup.chart2.title')}</div>
                    <div className="flex flex-col md:flex-row items-center gap-6 h-full pb-4">
                      <div className="w-[140px] h-[140px] relative">
                         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="25" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="131.88" /> {/* 40% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#5B3DF5" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="153.86" className="origin-center rotate-[144deg]" /> {/* 30% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="175.84" className="origin-center rotate-[252deg]" /> {/* 20% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="197.82" className="origin-center rotate-[324deg]" /> {/* 10% */}
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-xl font-bold text-gray-900">215.6K</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1 w-full">
                        {[
                          { l: 'Facebook', c: 'bg-blue-500', p: '40%' },
                          { l: 'TikTok', c: 'bg-[#5B3DF5]', p: '30%' },
                          { l: 'Instagram', c: 'bg-pink-500', p: '20%' },
                          { l: 'YouTube', c: 'bg-red-500', p: '10%' }
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

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <div className="text-sm font-bold text-gray-900">{t('social.mockup.table.title')}</div>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                          <th className="px-6 py-3">{t('social.mockup.table.col_post')}</th>
                          <th className="px-6 py-3">{t('social.mockup.table.col_channel')}</th>
                          <th className="px-6 py-3">{t('social.mockup.table.col_time')}</th>
                          <th className="px-6 py-3">{t('social.mockup.table.col_status')}</th>
                          <th className="px-6 py-3 text-right">{t('social.mockup.table.col_engagement')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-600">
                        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0"></div>
                            {t('social.mockup.table.post1')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">f</div>
                              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">t</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">20/05/2024 09:30</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">{t('social.mockup.table.status_published')}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">1.2K</td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0"></div>
                            {t('social.mockup.table.post2')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">i</div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">19/05/2024 08:00</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">{t('social.mockup.table.status_published')}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">856</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0"></div>
                            {t('social.mockup.table.post3')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold">▶</div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">18/05/2024 20:15</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">{t('social.mockup.table.status_published')}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">2.3K</td>
                        </tr>
                      </tbody>
                    </table>
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
