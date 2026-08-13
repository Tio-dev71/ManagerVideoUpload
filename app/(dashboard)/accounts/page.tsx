'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, AlertCircle, CheckCircle2, Play, Users } from 'lucide-react';

interface FbAccount {
  id: string;
  name: string;
  uid: string | null;
  status: 'LIVE' | 'CHECKPOINT' | 'DEAD';
  profileId: string;
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Facebook Accounts
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your profiles for automated marketing and posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSelected}
            disabled={selectedIds.length === 0 || isRunningMultiple}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {isRunningMultiple ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            Chạy tất cả đã chọn
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Accounts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedIds.length === accounts.length && accounts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-medium text-neutral-500 dark:text-neutral-400">Name</th>
                <th className="px-6 py-4 font-medium text-neutral-500 dark:text-neutral-400">UID</th>
                <th className="px-6 py-4 font-medium text-neutral-500 dark:text-neutral-400">Status</th>
                <th className="px-6 py-4 font-medium text-neutral-500 dark:text-neutral-400">Profile Path</th>
                <th className="px-6 py-4 font-medium text-neutral-500 dark:text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <h3 className="text-lg font-bold dark:text-white">Import Accounts</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-500 mb-3">
                Paste your accounts below. 1 account per line.<br />
                Format: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">UID|Pass|2FA</code>
              </p>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="100012345678|Password123|JBSWY3DPEHPK3PXP"
                className="w-full h-48 p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-neutral-200"
              />
            </div>
            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccounts}
                disabled={adding || !rawInput.trim()}
                className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
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
