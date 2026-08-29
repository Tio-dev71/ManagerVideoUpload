'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Home, CheckSquare, Users, TrendingUp, Share2, LayoutGrid, CheckCircle2, ListTodo, Columns, Calendar, UserPlus, Target, PieChart, FolderOpen, Settings, Bell } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function WorkHero() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-20 lg:pt-28 lg:pb-32">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-50/60 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            {t('breadcrumb.home')}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            {t('breadcrumb.products')}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-bold">Topify Work</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl pr-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {t('work.hero.tag')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 tracking-tight mb-4 leading-[1.1]"
            >
              Topify <span className="text-blue-600">Work</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[22px] md:text-2xl font-bold text-gray-800 mb-6 leading-snug"
              dangerouslySetInnerHTML={{ __html: t('work.hero.title') }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[17px] text-gray-600 mb-10 max-w-xl leading-relaxed"
            >
              {t('work.hero.desc')}
            </motion.p>

            {/* 4 Feature Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 gap-x-6 gap-y-8 mb-12"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 mb-3">
                  <Users className="w-5 h-5 fill-blue-600/20" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('work.hero.f1.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('work.hero.f1.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 mb-3">
                  <CheckSquare className="w-5 h-5 fill-blue-600/20" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('work.hero.f2.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('work.hero.f2.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('work.hero.f3.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('work.hero.f3.desc')}</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 mb-3">
                  <Share2 className="w-5 h-5 fill-blue-600/20" />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{t('work.hero.f4.title')}</h4>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t('work.hero.f4.desc')}</p>
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
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('work.hero.btn_free')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-bold text-blue-600 bg-white border-2 border-blue-600/10 rounded-xl hover:bg-blue-50 transition-all group"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2 border-blue-600 group-hover:scale-110 transition-transform">
                  <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
                {t('work.hero.btn_demo')}
              </button>
            </motion.div>
          </div>

          {/* Right Mockup */}
          <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] xl:h-[650px] mt-8 lg:mt-0 flex items-center justify-center">
            
            {/* Mascot Placeholder */}
            <div className="absolute -bottom-8 lg:-bottom-12 left-10 lg:left-0 xl:-left-12 w-56 h-72 z-40 drop-shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-full h-full bg-blue-500/20 rounded-full blur-2xl absolute -z-10 bottom-0 scale-75"></div>
              <Image src="/topi1.png" alt="Mascot" width={224} height={288} className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
            </div>

            {/* Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute w-[950px] h-[850px] bg-white rounded-2xl shadow-[0_30px_100px_rgba(37,99,235,0.15)] border border-gray-100 flex overflow-hidden origin-center scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.55] xl:scale-[0.65] 2xl:scale-[0.7]"
            >
              {/* Sidebar */}
              <div className="w-[180px] bg-[#f8fafc] border-r border-gray-100 flex flex-col pt-6 shrink-0">
                <div className="px-5 mb-8 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">t</div>
                  <span className="font-bold text-gray-900 text-sm">Topify Work</span>
                </div>
                <div className="px-3 flex flex-col gap-1">
                  {[
                    { n: t('work.mockup.menu.overview'), i: <LayoutGrid className="w-4 h-4"/>, act: true },
                    { n: t('work.mockup.menu.tasks'), i: <ListTodo className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.projects'), i: <FolderOpen className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.kanban'), i: <Columns className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.calendar'), i: <Calendar className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.assign'), i: <UserPlus className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.teams'), i: <Users className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.okr'), i: <Target className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.reports'), i: <PieChart className="w-4 h-4"/> },
                    { n: t('work.mockup.menu.settings'), i: <Settings className="w-4 h-4"/> },
                  ].map((it, idx) => (
                    <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${it.act ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-gray-600 font-medium hover:bg-gray-100 cursor-pointer'}`}>
                      {it.i} {it.n}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-white p-8 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{t('work.mockup.menu.overview')}</h2>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium border border-gray-100 flex items-center gap-2 cursor-pointer">
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
                    { n: t('work.mockup.stats.total_tasks'), v: '128', d: '+12.5%', c: 'text-green-500' },
                    { n: t('work.mockup.stats.completed'), v: '96', d: '+75%', c: 'text-green-500' },
                    { n: t('work.mockup.stats.in_progress'), v: '24', d: '18.8%', c: 'text-blue-500' },
                    { n: t('work.mockup.stats.overdue'), v: '8', d: '6.2%', c: 'text-red-500' },
                  ].map((st, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                      <div className="text-sm font-semibold text-gray-500 mb-3">{st.n}</div>
                      <div className="flex justify-between items-end gap-3">
                        <div className="text-3xl font-bold text-gray-900 leading-none">{st.v}</div>
                        <div className={`text-[10px] font-bold flex items-center ${st.c}`}>
                          {st.d.includes('+') ? '↑' : ''} {st.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-[1fr_1.2fr] gap-6 mb-6">
                  {/* Donut Chart ({t('work.mockup.charts.task_progress')}) */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[280px]">
                    <div className="text-sm font-bold text-gray-900 mb-6">{t('work.mockup.charts.task_progress')}</div>
                    <div className="flex items-center gap-6 h-full pb-4">
                      <div className="w-[120px] h-[120px] relative shrink-0">
                         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="25" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#2563eb" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="54.95" /> {/* 75% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#38bdf8" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="178.47" className="origin-center rotate-[270deg]" /> {/* 18.8% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#f43f5e" strokeWidth="25" strokeDasharray="219.8" strokeDashoffset="206.17" className="origin-center rotate-[337deg]" /> {/* 6.2% */}
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-2xl font-bold text-blue-600">75%</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1 w-full justify-center">
                        {[
                          { l: t('work.mockup.stats.completed'), c: 'bg-blue-600', p: '75%' },
                          { l: t('work.mockup.stats.in_progress'), c: 'bg-sky-400', p: '18.8%' },
                          { l: t('work.mockup.charts.not_started'), c: 'bg-gray-300', p: '4.7%' },
                          { l: t('work.mockup.stats.overdue'), c: 'bg-red-500', p: '6.2%' }
                        ].map((lg, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${lg.c}`}></div>
                              <span className="text-gray-600 font-medium">{lg.l}</span>
                            </div>
                            <span className="font-bold text-gray-900">{lg.p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bar Chart ({t('work.mockup.charts.team_performance')}) */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[280px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm font-bold text-gray-900">{t('work.mockup.charts.team_performance')}</div>
                      <div className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500 border border-gray-100 cursor-pointer">7 ngày qua ▾</div>
                    </div>
                    <div className="flex-1 relative w-full h-full pb-6 pl-8">
                      {/* Y axis */}
                      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-1">
                         <span>300</span><span>200</span><span>100</span><span>0</span>
                      </div>
                      {/* Bars */}
                      <div className="w-full h-full border-b border-gray-100 flex items-end justify-around px-2 relative">
                        {/* Grid lines */}
                        <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-100 w-full"></div>
                        <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-gray-100 w-full"></div>
                        <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-gray-100 w-full"></div>
                        
                        {/* Data bars */}
                        <div className="w-8 bg-blue-600 rounded-t-sm relative z-10" style={{ height: '70%' }}></div>
                        <div className="w-8 bg-blue-600 rounded-t-sm relative z-10" style={{ height: '80%' }}></div>
                        <div className="w-8 bg-blue-600 rounded-t-sm relative z-10" style={{ height: '55%' }}></div>
                        <div className="w-8 bg-blue-600 rounded-t-sm relative z-10" style={{ height: '40%' }}></div>
                        <div className="w-8 bg-blue-600 rounded-t-sm relative z-10" style={{ height: '75%' }}></div>
                      </div>
                      <div className="absolute bottom-0 left-8 right-0 flex justify-around text-[10px] font-bold text-gray-500 mt-2">
                        <span>Minh Anh</span><span>Quốc Bảo</span><span>Thu Hằng</span><span>Tuấn Kiệt</span><span>Hoài Nam</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-900">{t('work.mockup.table.upcoming_tasks')}</div>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                          <th className="px-6 py-3">{t('work.mockup.table.task')}</th>
                          <th className="px-6 py-3">{t('work.mockup.table.assignee')}</th>
                          <th className="px-6 py-3">{t('work.mockup.table.deadline')}</th>
                          <th className="px-6 py-3">{t('work.mockup.table.priority')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-600">
                        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-xs">{t('work.mockup.table.task1')}</div>
                                <div className="text-[10px] text-gray-500">{t('work.mockup.table.proj1')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-xs font-medium text-gray-900">Minh Anh</td>
                          <td className="px-6 py-3 text-[11px] font-medium text-gray-500">02/05/2024</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded">{t('work.mockup.table.priority_high')}</span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <LayoutGrid className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-xs">{t('work.mockup.table.task2')}</div>
                                <div className="text-[10px] text-gray-500">{t('work.mockup.table.proj2')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-xs font-medium text-gray-900">Tuấn Kiệt</td>
                          <td className="px-6 py-3 text-[11px] font-medium text-gray-500">03/05/2024</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded">{t('work.mockup.table.priority_medium')}</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <PieChart className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-xs">{t('work.mockup.table.task3')}</div>
                                <div className="text-[10px] text-gray-500">{t('work.mockup.table.proj1')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-xs font-medium text-gray-900">Thu Hằng</td>
                          <td className="px-6 py-3 text-[11px] font-medium text-gray-500">05/05/2024</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded">{t('work.mockup.table.priority_low')}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
                    <div className="text-xs font-bold text-blue-600 cursor-pointer hover:underline flex items-center">
                      {t('work.mockup.table.view_all')} <ArrowRight className="w-3 h-3 ml-1" />
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
