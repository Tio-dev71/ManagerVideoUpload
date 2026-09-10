import { useState, useEffect } from 'react';
import { Activity, Play, MessageSquare, PlusSquare, History as HistoryIcon, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';

interface AutomationLog {
  id: string;
  profileId: string;
  accountName: string | null;
  actionType: string;
  link: string | null;
  message: string | null;
  createdAt: string;
}

interface HistoryStats {
  runningTasks: number;
  totalComments: number;
  totalPosts: number;
}

export default function History() {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [stats, setStats] = useState<HistoryStats>({ runningTasks: 0, totalComments: 0, totalPosts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/automation-logs?page=${pageNumber}&limit=50`);
      setLogs(res.data.logs);
      setStats(res.data.stats);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải lịch sử');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'COMMENT': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><MessageSquare className="w-3 h-3" /> Comment</span>;
      case 'POST_REEL': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"><Play className="w-3 h-3" /> Đăng Reel</span>;
      case 'ADD_FRIEND': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><PlusSquare className="w-3 h-3" /> Thêm bạn</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{type}</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-purple-600" />
            Lịch sử hoạt động
          </h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi nhật ký chạy tự động hoá của các tài khoản</p>
        </div>
        <button
          onClick={() => fetchLogs(page)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <RefreshCcw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tiến trình đang chạy</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.runningTasks}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng Comment</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalComments}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng bài đăng (Reel/Post)</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Thời gian</th>
                <th className="px-6 py-4 font-medium">Tài khoản</th>
                <th className="px-6 py-4 font-medium">Hành động</th>
                <th className="px-6 py-4 font-medium">Nội dung / Kết quả</th>
                <th className="px-6 py-4 font-medium">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chưa có lịch sử hoạt động nào</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.accountName || log.profileId}
                    </td>
                    <td className="px-6 py-4">
                      {getActionLabel(log.actionType)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={log.message || ''}>
                      {log.message || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {log.link ? (
                        <a href={log.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                          <LinkIcon className="w-3.5 h-3.5" /> Xem
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
