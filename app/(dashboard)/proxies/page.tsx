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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-500" />
            Proxy Manager
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and assign HTTP/SOCKS proxies to profiles.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
          >
            Test All
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Bulk Import
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium">Host:Port</th>
                <th className="px-6 py-4 font-medium">Auth</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold dark:text-white">Bulk Import Proxies</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium mb-2 dark:text-neutral-300">
                Paste proxies (One per line)
              </label>
              <textarea
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                placeholder="host:port:user:pass&#10;192.168.1.1:8080:admin:12345"
                className="w-full h-48 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-neutral-200"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Supported formats: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">host:port</code> or <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">host:port:user:pass</code>
              </p>
            </div>
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-950/50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkInput.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
