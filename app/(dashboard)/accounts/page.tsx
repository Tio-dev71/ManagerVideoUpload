'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, AlertCircle, CheckCircle2, Play, Users, Key } from 'lucide-react';
import { toast } from 'sonner';
import { TOTP } from 'totp-generator';

interface FbAccount {
  id: string;
  name: string;
  uid: string | null;
  status: 'LIVE' | 'CHECKPOINT' | 'DEAD';
  profileId: string;
  twoFactorCode?: string | null;
  createdAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<FbAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRunningMultiple, setIsRunningMultiple] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/facebook-accounts');
      const data = await res.json();
      if (Array.isArray(data)) setAccounts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccounts = async () => {
    if (!rawInput.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/facebook-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawAccounts: rawInput }),
      });
      if (res.ok) {
        setRawInput('');
        setShowAddModal(false);
        fetchAccounts();
      } else {
        const errorText = await res.text();
        alert('Failed to import: ' + errorText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await fetch(`/api/facebook-accounts?id=${id}`, { method: 'DELETE' });
      // Remove from selected
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckLive = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/facebook-accounts/check-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAccounts();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleTestLogin = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/facebook-accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchAccounts();
      } else {
        const data = await res.json();
        console.error('Login failed:', data.error);
        // We log to console instead of alert so it doesn't block the Run All loop.
        // If they want to see the error, they can look at the browser which is left open now.
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRunSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsRunningMultiple(true);

    for (const id of selectedIds) {
      await handleTestLogin(id);
      // Optional: Add a small delay between launches to prevent CPU spikes
      await new Promise(r => setTimeout(r, 2000)); 
    }

    setIsRunningMultiple(false);
    alert('Đã chạy xong danh sách tài khoản được chọn!');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === accounts.length && accounts.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(accounts.map(acc => acc.id)); // Select all
    }
  };

  const toggleSelectAccount = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleGet2FA = async (account: FbAccount) => {
    if (!account.twoFactorCode) {
      toast.error('Không tìm thấy mã 2FA secret cho tài khoản này.');
      return;
    }
    
    try {
      const { otp } = await TOTP.generate(account.twoFactorCode.replace(/\s+/g, ''));
      navigator.clipboard.writeText(otp);
      toast.success(`Đã copy mã 2FA: ${otp}`);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tạo mã 2FA, kiểm tra lại secret key.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--color-primary)]" />
            Facebook Accounts
          </h1>
          <p className="page-subtitle">
            Manage your profiles for automated marketing and posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSelected}
            disabled={selectedIds.length === 0 || isRunningMultiple}
            className="btn-secondary flex items-center gap-2 text-[14px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-transparent"
          >
            {isRunningMultiple ? (
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            Chạy tất cả đã chọn
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 text-[14px]"
          >
            <Plus className="w-4 h-4" />
            Add Accounts
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
            <thead className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                    checked={selectedIds.length === accounts.length && accounts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-medium text-[var(--color-muted-foreground)]">Name</th>
                <th className="px-6 py-4 font-medium text-[var(--color-muted-foreground)]">UID</th>
                <th className="px-6 py-4 font-medium text-[var(--color-muted-foreground)]">Status</th>
                <th className="px-6 py-4 font-medium text-[var(--color-muted-foreground)]">Profile Path</th>
                <th className="px-6 py-4 font-medium text-[var(--color-muted-foreground)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No accounts found. Add some accounts to get started.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedIds.includes(acc.id)}
                        onChange={() => toggleSelectAccount(acc.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium dark:text-neutral-200">{acc.name}</td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 font-mono">{acc.uid || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {acc.status === 'LIVE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> LIVE
                        </span>
                      )}
                      {acc.status === 'CHECKPOINT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <AlertCircle className="w-3.5 h-3.5" /> CHECKPOINT
                        </span>
                      )}
                      {acc.status === 'DEAD' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                          <Shield className="w-3.5 h-3.5" /> DEAD
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-mono text-xs truncate max-w-[150px]">
                      {acc.profileId}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {processingId === acc.id ? (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleCheckLive(acc.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Check Live Status"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            {acc.twoFactorCode && (
                              <button
                                onClick={() => handleGet2FA(acc)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                                title="Get 2FA Code"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleTestLogin(acc.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Test Login"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(acc.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
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
          <div className="card-apple w-full max-w-lg shadow-xl overflow-hidden scale-100">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h3 className="text-[16px] font-semibold text-[var(--color-foreground)]">Import Accounts</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-[var(--color-muted-foreground)] mb-3">
                Paste your accounts below. 1 account per line.<br />
                Format: <code className="bg-[var(--color-muted)] px-1.5 py-0.5 rounded text-[var(--color-primary)] font-mono text-[12px]">UID|Pass|2FA|Email</code>
              </p>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="100012345678|Password123|JBSWY3DPEHPK3PXP"
                className="input-apple w-full h-48 resize-none font-mono text-[13px]"
              />
            </div>
            <div className="px-6 py-4 bg-[var(--color-muted)] border-t border-[var(--color-border)] flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccounts}
                disabled={adding || !rawInput.trim()}
                className="btn-primary"
              >
                {adding ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
