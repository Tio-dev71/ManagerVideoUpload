'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Film,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Send,
  Calendar,
  User,
  Loader2,
  Info,
  MessageCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { STATUS_CONFIG, PLATFORM_CONFIG } from '@/lib/utils';

interface PostDetail {
  id: string;
  title: string;
  caption: string | null;
  hashtags: string | null;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  videoAsset: {
    originalFileName: string;
    storageUrl: string;
    size: number;
    mimeType: string;
    source: string;
  };
  platforms: {
    id: string;
    platform: string;
    status: string;
    externalPostId: string | null;
    errorMessage: string | null;
  }[];
  logs: {
    id: string;
    platform: string;
    level: string;
    message: string;
    metadata: any;
    createdAt: string;
  }[];
  createdBy: { name: string | null; email: string };
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  // Auto-refresh when publishing
  useEffect(() => {
    if (post && (post.status === 'PENDING' || post.status === 'PUBLISHING')) {
      const interval = setInterval(() => {
        fetchPost();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [post?.status]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        toast.error('Post not found');
        router.push('/posts');
      }
    } catch {
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await fetch(`/api/posts/${params.id}/retry`, { method: 'POST' });
      if (res.ok) {
        toast.success('Retrying publish...');
        fetchPost();
      } else {
        toast.error('Failed to retry');
      }
    } catch {
      toast.error('Failed to retry');
    } finally {
      setRetrying(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        router.push('/posts');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in">
        <div className="skeleton w-32 h-6 rounded" />
        <div className="skeleton w-full h-48 rounded-2xl" />
        <div className="skeleton w-full h-32 rounded-2xl" />
      </div>
    );
  }

  if (!post) return null;

  const statusConfig = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG];
  const canRetry = post.status === 'FAILED' || post.status === 'PARTIAL_FAILED';

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'INFO': return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      default: return <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-[14px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-[13px] text-[var(--color-muted-foreground)]">
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.createdBy.name || post.createdBy.email}
            </span>
            <span>•</span>
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>
        <span className={`badge text-[13px] ${statusConfig?.color}`}>
          {statusConfig?.label || post.status}
        </span>
      </div>

      {/* Video + Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video */}
        <div className="card-apple overflow-hidden">
          <div className="aspect-[9/16] max-h-[400px] bg-black rounded-t-2xl overflow-hidden">
            <video
              src={post.videoAsset.storageUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-4">
            <p className="text-[13px] text-[var(--color-muted-foreground)]">
              {post.videoAsset.originalFileName}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {post.caption && (
            <div className="card-apple p-5">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">
                Caption
              </h3>
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{post.caption}</p>
            </div>
          )}

          {post.hashtags && (
            <div className="card-apple p-5">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">
                Hashtags
              </h3>
              <p className="text-[14px] text-[var(--color-primary)]">{post.hashtags}</p>
            </div>
          )}

          {post.firstComment && (
            <div className="card-apple p-5">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                First Comment
              </h3>
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{post.firstComment}</p>
            </div>
          )}

          <div className="card-apple p-5">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-3">
              Schedule
            </h3>
            <div className="flex items-center gap-2">
              {post.scheduledAt ? (
                <>
                  <Calendar className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="text-[14px]">
                    {format(new Date(post.scheduledAt), 'MMMM d, yyyy h:mm a')}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="text-[14px]">Immediate</span>
                </>
              )}
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[14px] text-emerald-600">
                  Published {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canRetry && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="btn-primary flex items-center gap-2 text-[14px]"
              >
                {retrying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                Retry
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn-secondary flex items-center gap-2 text-[14px] text-red-500 hover:bg-red-50 hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div>
        <h2 className="text-[17px] font-semibold mb-3">Platform Status</h2>
        <div className="grid gap-3">
          {post.platforms.map((platform) => {
            const config = PLATFORM_CONFIG[platform.platform as keyof typeof PLATFORM_CONFIG];
            const pStatus = STATUS_CONFIG[platform.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={platform.id} className="card-apple p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${config?.color}14` }}
                  >
                    <Film className="w-5 h-5" style={{ color: config?.color }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">{config?.name}</p>
                    {platform.externalPostId && (
                      <p className="text-[12px] text-[var(--color-muted-foreground)]">
                        ID: {platform.externalPostId}
                      </p>
                    )}
                    {platform.errorMessage && (
                      <p className="text-[12px] text-red-500 mt-0.5 max-w-[400px] truncate">
                        {platform.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`badge ${pStatus?.color}`}>
                  {pStatus?.label || platform.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Publish Logs */}
      {post.logs.length > 0 && (
        <div>
          <h2 className="text-[17px] font-semibold mb-3">Publish Logs</h2>
          <div className="card-apple divide-y divide-[var(--color-border)]">
            {post.logs.map((log) => {
              const config = PLATFORM_CONFIG[log.platform as keyof typeof PLATFORM_CONFIG];
              return (
                <div key={log.id} className="p-4 flex items-start gap-3">
                  {getLogIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[12px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          color: config?.color,
                          backgroundColor: `${config?.color}14`,
                        }}
                      >
                        {config?.name?.split(' ')[0]}
                      </span>
                      <span className="text-[12px] text-[var(--color-muted-foreground)]">
                        {format(new Date(log.createdAt), 'h:mm:ss a')}
                      </span>
                    </div>
                    <p className={`text-[13px] ${log.level === 'ERROR' ? 'text-red-600' : 'text-[var(--color-foreground)]'}`}>
                      {log.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
