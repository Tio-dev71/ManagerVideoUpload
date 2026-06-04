'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Link2,
  Zap,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { STATUS_CONFIG, PLATFORM_CONFIG } from '@/lib/utils';

interface DashboardStats {
  scheduled: number;
  published: number;
  failed: number;
  total: number;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  platforms: { platform: string; status: string }[];
  createdBy: { name: string | null; email: string };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({ scheduled: 0, published: 0, failed: 0, total: 0 });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasConnections, setHasConnections] = useState(true);

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, postsRes] = await Promise.all([
          fetch('/api/posts/stats'),
          fetch('/api/posts?limit=5'),
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setRecentPosts(postsData.posts || []);
        }

        // Check social connections
        if (isAdmin) {
          const connRes = await fetch('/api/social/status');
          if (connRes.ok) {
            const connData = await connRes.json();
            setHasConnections(connData.connected > 0);
          }
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAdmin]);

  const statCards = [
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Total Posts',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Manage your video posts across all platforms
        </p>
      </div>

      {/* Onboarding banner — Admin only, no connections */}
      {isAdmin && !hasConnections && !loading && (
        <div className="card-apple p-6 border-[var(--color-primary)] border-opacity-30 bg-gradient-to-r from-blue-50/80 to-purple-50/50">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] font-semibold mb-1">Connect your channels</h3>
              <p className="text-[14px] text-[var(--color-muted-foreground)] mb-4">
                Connect your social accounts to start posting videos automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/settings"
                  className="btn-primary inline-flex items-center gap-2 text-[14px] py-2 px-4"
                >
                  <Zap className="w-4 h-4" />
                  Connect Meta
                </Link>
                <Link
                  href="/settings"
                  className="btn-secondary inline-flex items-center gap-2 text-[14px] py-2 px-4"
                >
                  Connect YouTube
                </Link>
                <Link
                  href="/settings"
                  className="btn-secondary inline-flex items-center gap-2 text-[14px] py-2 px-4"
                >
                  Connect Google Drive
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card-apple p-5">
            {loading ? (
              <div className="space-y-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="skeleton w-16 h-8 rounded-lg" />
                <div className="skeleton w-20 h-4 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-[28px] font-semibold tracking-tight">{card.value}</p>
                <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">{card.label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href="/create"
        className="block card-apple card-apple-interactive p-6 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-foreground)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold">Create New Reel</h3>
              <p className="text-[13px] text-[var(--color-muted-foreground)]">
                Upload a video and schedule it for Facebook, Instagram, or YouTube
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[19px] font-semibold">Recent Posts</h2>
          <Link
            href="/posts"
            className="text-[14px] text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card-apple overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton w-48 h-4 rounded" />
                    <div className="skeleton w-32 h-3 rounded" />
                  </div>
                  <div className="skeleton w-20 h-6 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="p-12 text-center">
              <PlayCircle className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-3 opacity-40" />
              <p className="text-[15px] font-medium text-[var(--color-foreground)]">No posts yet</p>
              <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                Create your first reel to get started
              </p>
              <Link href="/create" className="btn-primary inline-flex items-center gap-2 mt-4 text-[14px]">
                <PlusCircle className="w-4 h-4" />
                Create Reel
              </Link>
            </div>
          ) : (
            <table className="table-apple">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Platforms</th>
                  <th>Schedule</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => {
                  const statusConfig = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr key={post.id}>
                      <td>
                        <Link href={`/posts/${post.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                          <p className="font-medium text-[14px] truncate max-w-[200px]">{post.title}</p>
                          <p className="text-[12px] text-[var(--color-muted-foreground)]">
                            by {post.createdBy.name || post.createdBy.email.split('@')[0]}
                          </p>
                        </Link>
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          {post.platforms.map((p) => {
                            const config = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
                            return (
                              <span
                                key={p.platform}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: config?.color }}
                                title={config?.name}
                              />
                            );
                          })}
                        </div>
                      </td>
                      <td className="text-[13px] text-[var(--color-muted-foreground)]">
                        {post.scheduledAt
                          ? formatDistanceToNow(new Date(post.scheduledAt), { addSuffix: true })
                          : 'Immediate'}
                      </td>
                      <td>
                        {statusConfig && (
                          <span className={`badge ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
