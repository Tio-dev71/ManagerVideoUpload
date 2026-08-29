'use client';

import { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface Proxy {
  id: string;
  protocol: string;
  host: string;
  port: number;
  username: string | null;
  password: string | null;
  status: string;
}

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    try {
      const res = await fetch('/api/proxies');
      const data = await res.json();
      if (Array.isArray(data)) setProxies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkInput.trim()) return;

    // Parse format: host:port:user:pass or host:port
    const lines = bulkInput.split('\n').filter(l => l.trim());
    const newProxies = lines.map(line => {
      const parts = line.trim().split(':');
      if (parts.length >= 4) {
        return { protocol: 'http', host: parts[0], port: parts[1], username: parts[2], password: parts[3] };
      } else if (parts.length >= 2) {
        return { protocol: 'http', host: parts[0], port: parts[1] };
      }
      return null;
    }).filter(p => p !== null);

    if (newProxies.length === 0) {
      alert('No valid proxies found. Format: host:port or host:port:user:pass');
      return;
    }

    try {
      const res = await fetch('/api/proxies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProxies)
      });
      if (res.ok) {
        setBulkInput('');
        setShowModal(false);
        fetchProxies();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to import proxies');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--color-primary)]" />
            Proxy Manager
          </h1>
          <p className="page-subtitle">Manage and assign HTTP/SOCKS proxies to profiles.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {}}
            className="btn-secondary"
          >
            Test All
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 text-[14px]"
          >
            <Plus className="w-4 h-4" /> Bulk Import
          </button>
        </div>
      </div>

      <div className="card-apple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-[var(--color-foreground)]">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium">Host:Port</th>
                <th className="px-6 py-4 font-medium">Auth</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {proxies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No proxies found. Click "Bulk Import" to add some.
                  </td>
                </tr>
              ) : (
                proxies.map(proxy => (
                  <tr key={proxy.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="uppercase text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                        {proxy.protocol}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {proxy.host}:{proxy.port}
                    </td>
                    <td className="px-6 py-4">
                      {proxy.username ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4">
                      {proxy.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
                          <XCircle className="w-4 h-4" /> Unknown
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card-apple w-full max-w-lg overflow-hidden shadow-xl scale-100">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
              <h3 className="text-[16px] font-semibold text-[var(--color-foreground)]">Bulk Import Proxies</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[13px] font-medium mb-2 text-[var(--color-foreground)]">
                Paste proxies (One per line)
              </label>
              <textarea
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                placeholder="host:port:user:pass&#10;192.168.1.1:8080:admin:12345"
                className="input-apple w-full h-48 resize-none font-mono text-[13px]"
              />
              <p className="text-[12px] text-[var(--color-muted-foreground)] mt-2">
                Supported formats: <code className="bg-[var(--color-muted)] px-1.5 py-0.5 rounded text-[var(--color-primary)]">host:port</code> or <code className="bg-[var(--color-muted)] px-1.5 py-0.5 rounded text-[var(--color-primary)]">host:port:user:pass</code>
              </p>
            </div>
            <div className="p-6 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-muted)]">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkInput.trim()}
                className="btn-primary"
              >
                Import Proxies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
