'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Film,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  RotateCcw,
  PlayCircle,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { STATUS_CONFIG, PLATFORM_CONFIG } from '@/lib/utils';

type StatusFilter = 'ALL' | 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';

interface PostItem {
  id: string;
  title: string;
  caption: string | null;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  videoAsset: { originalFileName: string; storageUrl: string };
  platforms: { platform: string; status: string }[];
  createdBy: { name: string | null; email: string };
}

const filterTabs: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Publishing', value: 'PUBLISHING' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Failed', value: 'FAILED' },
];

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      const res = await fetch(`/api/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error('Failed to delete post');
      }
    } catch {
      toast.error('Failed to delete post');
    }
  }

  async function retryPost(id: string) {
    try {
      const res = await fetch(`/api/posts/${id}/retry`, { method: 'POST' });
      if (res.ok) {
        toast.success('Retrying publish...');
        fetchPosts();
      } else {
        toast.error('Failed to retry');
      }
    } catch {
      toast.error('Failed to retry');
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Posts</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Manage all your scheduled and published reels
          </p>
        </div>
        <Link href="/create" className="btn-primary inline-flex items-center gap-2 text-[14px]">
          <Film className="w-4 h-4" />
          New Reel
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-[var(--color-muted)] p-1 rounded-xl overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`
                px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all
                ${filter === tab.value
                  ? 'bg-white text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input-apple !pl-9 py-2"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="card-apple overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-14 h-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton w-48 h-4 rounded" />
                  <div className="skeleton w-32 h-3 rounded" />
                </div>
                <div className="skeleton w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center">
            <PlayCircle className="w-14 h-14 text-[var(--color-muted-foreground)] mx-auto mb-4 opacity-30" />
            <p className="text-[16px] font-medium text-[var(--color-foreground)]">
              {filter !== 'ALL' ? `No ${filter.toLowerCase()} posts` : 'No posts yet'}
            </p>
            <p className="text-[14px] text-[var(--color-muted-foreground)] mt-1.5">
              {filter !== 'ALL'
                ? 'Try changing your filter'
                : 'Create your first reel to get started'}
            </p>
            {filter === 'ALL' && (
              <Link href="/create" className="btn-primary inline-flex items-center gap-2 mt-5 text-[14px]">
                <Film className="w-4 h-4" />
                Create Reel
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-apple">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Title</th>
                  <th>Created by</th>
                  <th>Platforms</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const statusConfig = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr key={post.id} className="group">
                      <td>
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-muted)] overflow-hidden flex-shrink-0">
                          <video
                            src={post.videoAsset.storageUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        </div>
                      </td>
                      <td>
                        <Link
                          href={`/posts/${post.id}`}
                          className="hover:text-[var(--color-primary)] transition-colors"
                        >
                          <p className="font-medium text-[14px] truncate max-w-[200px]">
                            {post.title}
                          </p>
                        </Link>
                      </td>
                      <td className="text-[13px] text-[var(--color-muted-foreground)]">
                        {post.createdBy.name || post.createdBy.email.split('@')[0]}
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          {post.platforms.map((p) => {
                            const config = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
                            return (
                              <span
                                key={p.platform}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                                style={{
                                  color: config?.color,
                                  backgroundColor: `${config?.color}14`,
                                }}
                              >
                                {config?.name?.split(' ')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="text-[13px] text-[var(--color-muted-foreground)]">
                        {post.scheduledAt
                          ? format(new Date(post.scheduledAt), 'MMM d, h:mm a')
                          : '—'}
                      </td>
                      <td>
                        <span className={`badge ${statusConfig?.color || ''}`}>
                          {statusConfig?.label || post.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/posts/${post.id}`}
                            className="p-1.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                          </Link>
                          {(post.status === 'FAILED' || post.status === 'PARTIAL_FAILED') && (
                            <button
                              onClick={() => retryPost(post.id)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Retry"
                            >
                              <RotateCcw className="w-4 h-4 text-amber-600" />
                            </button>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
