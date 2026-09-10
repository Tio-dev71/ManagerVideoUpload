import { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';

interface Proxy {
  id: string;
  protocol: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  status: string;
  createdAt: string;
}

export default function Proxies() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    try {
      const res = await api.get('/proxies');
      if (Array.isArray(res.data)) setProxies(res.data);
    } catch (e) {
      console.error(e);
      toast.error('Không thể tải danh sách proxy');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProxies = async () => {
    if (!rawInput.trim()) return;
    setAdding(true);
    try {
      const lines = rawInput.split('\n').filter(l => l.trim());
      const proxiesToCreate = lines.map(line => {
        // Hỗ trợ các định dạng:
        // 1. host:port:user:pass
        // 2. host:port
        // 3. protocol://user:pass@host:port (hoặc http://host:port)
        let protocol = 'http';
        let host = '';
        let port = '';
        let username = '';
        let password = '';

        if (line.includes('://')) {
          const parts = line.split('://');
          protocol = parts[0];
          const rest = parts[1];
          if (rest.includes('@')) {
            const [auth, target] = rest.split('@');
            const [u, p] = auth.split(':');
            const [h, po] = target.split(':');
            username = u;
            password = p;
            host = h;
            port = po;
          } else {
            const [h, po] = rest.split(':');
            host = h;
            port = po;
          }
        } else {
          const parts = line.split(':');
          if (parts.length >= 2) {
            host = parts[0];
            port = parts[1];
          }
          if (parts.length >= 4) {
            username = parts[2];
            password = parts[3];
          }
        }

        return { protocol, host, port, username, password };
      }).filter(p => p.host && p.port);

      if (proxiesToCreate.length === 0) {
        toast.error('Không tìm thấy proxy hợp lệ trong dữ liệu nhập');
        setAdding(false);
        return;
      }

      const res = await api.post('/proxies', proxiesToCreate);
      setRawInput('');
      setShowAddModal(false);
      toast.success(`Thêm thành công ${res.data.count || 1} proxy`);
      fetchProxies();
    } catch (e: any) {
      console.error(e);
      toast.error(`Lỗi: ${e.response?.data?.error || 'Không thể thêm proxy'}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá proxy này không?')) return;
    try {
      await api.delete(`/proxies?id=${id}`);
      fetchProxies();
      toast.success('Đã xoá proxy');
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi xoá proxy');
    }
  };

  const testProxy = async (proxy: Proxy) => {
    try {
      toast.loading('Đang kiểm tra proxy...', { id: `test-${proxy.id}` });
      const res = await api.post('/proxies/test', {
        protocol: proxy.protocol,
        host: proxy.host,
        port: proxy.port,
        username: proxy.username,
        password: proxy.password
      });

      if (res.data.success) {
        toast.success(`Proxy hoạt động tốt (Ping: ${res.data.ping}ms)`, { id: `test-${proxy.id}` });
      } else {
        toast.error(`Lỗi: ${res.data.error}`, { id: `test-${proxy.id}` });
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Proxy không phản hồi', { id: `test-${proxy.id}` });
    }
  };

  const formatProxyString = (p: Proxy) => {
    if (p.username && p.password) {
      return `${p.protocol}://${p.username}:***@${p.host}:${p.port}`;
    }
    return `${p.protocol}://${p.host}:${p.port}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--color-primary)]" />
            Proxies
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý proxy để gán cho các tài khoản Facebook
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm Proxy
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="card-apple overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500">Proxy</th>
                <th className="px-6 py-4 font-medium text-gray-500">Host</th>
                <th className="px-6 py-4 font-medium text-gray-500">Port</th>
                <th className="px-6 py-4 font-medium text-gray-500">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proxies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Chưa có proxy nào. Vui lòng thêm proxy để bắt đầu.
                  </td>
                </tr>
              ) : (
                proxies.map((proxy) => (
                  <tr key={proxy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs truncate max-w-[200px]">
                      {formatProxyString(proxy)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{proxy.host}</td>
                    <td className="px-6 py-4 text-gray-600">{proxy.port}</td>
                    <td className="px-6 py-4">
                      {proxy.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> HOẠT ĐỘNG
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <AlertCircle className="w-3.5 h-3.5" /> KHÔNG KHẢ DỤNG
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => testProxy(proxy)}
                        className="px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition-colors"
                        title="Kiểm tra kết nối"
                      >
                        Kiểm tra
                      </button>
                      <button
                        onClick={() => handleDelete(proxy.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden scale-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[16px] font-semibold">Nhập Proxy</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-gray-500 mb-3">
                Dán danh sách proxy, mỗi proxy một dòng.<br />
                Định dạng hỗ trợ: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[var(--color-primary)] font-mono text-[12px]">host:port:user:pass</code> hoặc <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[var(--color-primary)] font-mono text-[12px]">http://user:pass@host:port</code>
              </p>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="192.168.1.1:8080:username:password&#10;192.168.1.2:8080"
                className="w-full h-48 resize-none font-mono text-[13px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-[14px] font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddProxies}
                disabled={adding || !rawInput.trim()}
                className="px-4 py-2 text-white bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 rounded-xl text-[14px] font-medium transition-colors"
              >
                {adding ? 'Đang thêm...' : 'Thêm Proxy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
