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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Automation History</h1>
        <p className="text-[var(--color-text-muted)]">Track automation activities and current running tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text)] shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Running Tasks</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.runningTasks}</div>
            <p className="text-xs text-neutral-500 mt-1">Active automated sequences</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text)] shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Total Comments</h3>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-neutral-500 mt-1">Comments posted by automation</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text)] shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Total Posts</h3>
            <Send className="h-4 w-4 text-purple-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-neutral-500 mt-1">Reels & Group posts published</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text)] shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
        </div>
        <div className="p-6 pt-0">
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No automation logs found.</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Profile ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Content</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Link</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle whitespace-nowrap text-neutral-500">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {log.profileId}
                      </td>
                      <td className="p-4 align-middle">
                        {formatAction(log.actionType)}
                      </td>
                      <td className="p-4 align-middle max-w-[300px] truncate" title={log.message || ''}>
                        {log.message || '-'}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {log.link ? (
                          <a href={log.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:underline">
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
