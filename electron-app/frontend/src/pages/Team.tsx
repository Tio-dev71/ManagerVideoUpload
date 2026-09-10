import { useState, useEffect } from 'react';
import { Users, Plus, Shield, ShieldAlert, Mail, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  invitedBy?: {
    name: string | null;
    email: string;
  };
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      if (res.data?.members) {
        setMembers(res.data.members);
      }
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập trang Nhân sự (Yêu cầu Admin)');
      } else {
        toast.error('Không thể tải danh sách nhân sự');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setAdding(true);
    try {
      await api.post('/team', { email: newEmail });
      toast.success('Đã thêm nhân sự mới');
      setNewEmail('');
      setShowModal(false);
      fetchTeam();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Lỗi khi thêm nhân sự');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (id: string, email: string) => {
    if (!confirm(`Bạn có chắc muốn xoá ${email} khỏi đội ngũ?`)) return;

    try {
      await api.delete(`/team?id=${id}`);
      toast.success('Đã xoá nhân sự');
      fetchTeam();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Lỗi khi xoá nhân sự');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await api.patch('/team', { id, role: newRole });
      toast.success('Đã cập nhật quyền');
      fetchTeam();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Lỗi cập nhật quyền');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Quản lý Nhân sự
          </h1>
          <p className="text-sm text-gray-500 mt-1">Thêm và quản lý quyền truy cập của các thành viên trong đội ngũ</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> Thêm thành viên
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-900">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Thành viên</th>
                <th className="px-6 py-4 font-medium">Quyền hạn (Role)</th>
                <th className="px-6 py-4 font-medium">Người thêm</th>
                <th className="px-6 py-4 font-medium">Ngày thêm</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Chưa có thành viên nào.
                  </td>
                </tr>
              ) : (
                members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none cursor-pointer ${
                          member.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="ADMIN">Quản trị viên (Admin)</option>
                        <option value="STAFF">Nhân viên (Staff)</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {member.invitedBy ? member.invitedBy.email : 'Hệ thống'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.email)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá thành viên"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Thêm nhân sự mới</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Email nhân viên
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nhanvien@congty.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">Người này sẽ có thể đăng nhập bằng email này với quyền Nhân viên (Staff).</p>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {adding ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
