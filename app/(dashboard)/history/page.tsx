'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Activity, MessageSquare, Send, ExternalLink } from 'lucide-react';

interface AutomationLog {
  id: string;
  profileId: string;
  accountName: string | null;
  actionType: string;
  link: string | null;
  message: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [stats, setStats] = useState({ runningTasks: 0, totalComments: 0, totalPosts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/automation-logs?limit=100');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-neutral-500">You do not have permission to view the automation history.</p>
      </div>
    );
  }

  const formatAction = (type: string) => {
    switch (type) {
      case 'COMMENT': return <span className="inline-flex items-center gap-1 text-blue-500"><MessageSquare className="w-3 h-3" /> Comment</span>;
      case 'POST_REEL':
      case 'POST_GROUP':
      case 'POST': return <span className="inline-flex items-center gap-1 text-green-500"><Send className="w-3 h-3" /> Post</span>;
      default: return <span className="text-neutral-500">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Automation History</h1>
          <p className="page-subtitle">Track automation activities and current running tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-apple">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--color-foreground)]">Running Tasks</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.runningTasks}</div>
            <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">Active automated sequences</p>
          </div>
        </div>
        
        <div className="card-apple">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--color-foreground)]">Total Comments</h3>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.totalComments}</div>
            <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">Comments posted by automation</p>
          </div>
        </div>

        <div className="card-apple">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--color-foreground)]">Total Posts</h3>
            <Send className="h-4 w-4 text-purple-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.totalPosts}</div>
            <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">Reels & Group posts published</p>
          </div>
        </div>
      </div>

      <div className="card-apple overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h3 className="text-[16px] font-semibold text-[var(--color-foreground)]">Recent Activity</h3>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="text-center py-8 text-[var(--color-muted-foreground)]">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-muted-foreground)]">No automation logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] text-[var(--color-foreground)]">
                <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">Profile ID</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Content</th>
                    <th className="px-6 py-4 font-medium text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--color-muted)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[var(--color-muted-foreground)]">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {log.profileId}
                      </td>
                      <td className="px-6 py-4">
                        {formatAction(log.actionType)}
                      </td>
                      <td className="px-6 py-4 max-w-[300px] truncate" title={log.message || ''}>
                        {log.message || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {log.link ? (
                          <a href={log.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline">
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
