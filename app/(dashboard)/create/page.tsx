'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Film,
  X,
  Loader2,
  Calendar,
  Send,
  Clock,
  Info,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { isAllowedVideoType, formatFileSize, PLATFORM_CONFIG } from '@/lib/utils';

type Platform = 'FACEBOOK_REELS' | 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS';
type PublishMode = 'now' | 'schedule';

interface UploadedVideo {
  id: string;
  originalFileName: string;
  titleFromFileName: string;
  storageUrl: string;
  size: number;
  mimeType: string;
  // User editable
  title: string;
}

export default function CreateReelPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState<UploadedVideo[]>([]);

  // Global Form state
  const [caption, setCaption] = useState('');
  const [firstComment, setFirstComment] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [publishMode, setPublishMode] = useState<PublishMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle file upload
  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => {
      if (!isAllowedVideoType(f.type)) {
        toast.error(`Invalid file type: ${f.name}`);
        return false;
      }
      if (f.size > 2000 * 1024 * 1024) {
        toast.error(`File too large: ${f.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgress(Math.round(((i) / validFiles.length) * 100));

      const formData = new FormData();
      formData.append('video', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          setVideos((prev) => [...prev, { ...result, title: result.titleFromFileName }]);
          successCount++;
        } else {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            toast.error(`Failed: ${errorJson.error || res.statusText}`);
          } catch {
            toast.error(`Failed: ${res.statusText}`);
          }
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      if (successCount > 0) toast.success(`Uploaded ${successCount} video(s)`);
    }, 500);

  }, []);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload]
  );

  const togglePlatform = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateVideoTitle = (id: string, newTitle: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, title: newTitle } : v));
  };

  // Submit all
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videos.length === 0) {
      toast.error('Please upload at least one video.');
      return;
    }
    if (platforms.length === 0) {
      toast.error('Please select at least one platform.');
      return;
    }
    if (publishMode === 'schedule' && !scheduledAt) {
      toast.error('Please select a schedule date and time.');
      return;
    }

    setSubmitting(true);
    let successCount = 0;

    for (const video of videos) {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: video.title.trim() || video.titleFromFileName,
            caption: caption.trim() || null,
            firstComment: firstComment.trim() || null,
            hashtags: hashtags.trim() || null,
            videoAssetId: video.id,
            platforms,
            publishMode,
            scheduledAt: publishMode === 'schedule' ? new Date(scheduledAt).toISOString() : null,
          }),
        });

        if (res.ok) {
          successCount++;
        } else {
          const error = await res.json();
          toast.error(`Error with ${video.originalFileName}: ${error.error}`);
        }
      } catch (error: any) {
        toast.error(`Failed to create post for ${video.originalFileName}`);
      }
    }

    setSubmitting(false);

    if (successCount > 0) {
      toast.success(
        publishMode === 'now'
          ? `Publishing ${successCount} reel(s)!`
          : `Scheduled ${successCount} reel(s)!`
      );
      router.push('/posts');
    }
  };

  const showYouTubeWarning = platforms.includes('YOUTUBE_SHORTS');

  return (
    <div className="max-w-[720px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Create Reels</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Upload multiple videos to publish in bulk
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Zone */}
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-10 h-10 mx-auto text-[var(--color-primary)] animate-spin" />
              <div>
                <p className="text-[15px] font-medium">Uploading videos...</p>
                <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                  {uploadProgress}% complete
                </p>
              </div>
              <div className="w-full max-w-[240px] mx-auto h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-muted)] flex items-center justify-center">
                <Upload className="w-7 h-7 text-[var(--color-muted-foreground)]" />
              </div>
              <div>
                <p className="text-[15px] font-medium">
                  Drop videos here or <span className="text-[var(--color-primary)]">browse</span>
                </p>
                <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                  Upload multiple MP4, MOV, or WebM (up to 2GB each)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video Previews */}
        {videos.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-[14px] font-medium">Uploaded Videos ({videos.length})</h3>
            <div className="grid gap-3">
              {videos.map(v => (
                <div key={v.id} className="card-apple p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-black flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <video src={v.storageUrl} className="w-full h-full object-cover" muted />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => updateVideoTitle(v.id, e.target.value)}
                      className="input-apple py-1.5 px-3 text-[13px] w-full mb-1"
                      placeholder="Video Title"
                      required
                    />
                    <p className="text-[12px] text-[var(--color-muted-foreground)]">
                      {formatFileSize(v.size)} • {v.mimeType.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(v.id)}
                    className="p-2 rounded-xl hover:bg-[var(--color-muted)] transition-colors text-red-500"
                    title="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Fields */}
        {videos.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Caption */}
            <div>
              <label className="block text-[14px] font-medium mb-1.5">
                Caption / Description (Applies to all)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input-apple min-h-[80px] resize-y"
                placeholder="Write a caption for your reels..."
                rows={3}
              />
            </div>

            {/* First Comment */}
            <div>
              <label className="flex items-center gap-2 text-[14px] font-medium mb-1.5">
                <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
                Auto First Comment (Applies to all)
              </label>
              <textarea
                value={firstComment}
                onChange={(e) => setFirstComment(e.target.value)}
                className="input-apple min-h-[60px] resize-y"
                placeholder="Write a comment to post immediately after publishing..."
                rows={2}
              />
              <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1.5">
                Automatically pins/posts this comment to YouTube Shorts and Facebook Reels.
              </p>
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-[14px] font-medium mb-1.5">
                Hashtags (Applies to all)
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="input-apple"
                placeholder="#viral #trending #reels"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-[14px] font-medium mb-3">
                Select Platforms
              </label>
              <div className="flex flex-wrap gap-3">
                {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG[keyof typeof PLATFORM_CONFIG]][]).map(
                  ([key, config]) => {
                    const selected = platforms.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => togglePlatform(key)}
                        className={`platform-chip ${selected ? 'selected bg-opacity-10' : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'}`}
                        style={selected ? { color: config.color, backgroundColor: `${config.color}14` } : {}}
                      >
                        <Film className="w-4 h-4" />
                        {config.name}
                      </button>
                    );
                  }
                )}
              </div>

              {showYouTubeWarning && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-amber-700">
                    For YouTube Shorts, use vertical video under 60 seconds for best results.
                  </p>
                </div>
              )}
            </div>

            {/* Publish Mode */}
            <div>
              <label className="block text-[14px] font-medium mb-3">
                Publish Mode
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPublishMode('now')}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${publishMode === 'now' ? 'border-[var(--color-foreground)] bg-[var(--color-foreground)] text-white' : 'border-[var(--color-border)] bg-white hover:border-gray-300'}`}
                >
                  <Send className={`w-5 h-5 mb-2 ${publishMode === 'now' ? 'text-white' : 'text-[var(--color-muted-foreground)]'}`} />
                  <p className="text-[14px] font-medium">Post Now</p>
                  <p className={`text-[12px] mt-0.5 ${publishMode === 'now' ? 'text-gray-300' : 'text-[var(--color-muted-foreground)]'}`}>Publish immediately</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPublishMode('schedule')}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${publishMode === 'schedule' ? 'border-[var(--color-foreground)] bg-[var(--color-foreground)] text-white' : 'border-[var(--color-border)] bg-white hover:border-gray-300'}`}
                >
                  <Calendar className={`w-5 h-5 mb-2 ${publishMode === 'schedule' ? 'text-white' : 'text-[var(--color-muted-foreground)]'}`} />
                  <p className="text-[14px] font-medium">Schedule</p>
                  <p className={`text-[12px] mt-0.5 ${publishMode === 'schedule' ? 'text-gray-300' : 'text-[var(--color-muted-foreground)]'}`}>Pick date & time</p>
                </button>
              </div>
            </div>

            {/* Schedule DateTime */}
            {publishMode === 'schedule' && (
              <div className="animate-fade-in">
                <label className="block text-[14px] font-medium mb-1.5">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="input-apple"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || platforms.length === 0}
                className="btn-primary w-full py-3.5 text-[15px] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {publishMode === 'now' ? 'Publishing All...' : 'Scheduling All...'}
                  </>
                ) : publishMode === 'now' ? (
                  <>
                    <Send className="w-4 h-4" />
                    Publish All {videos.length} Video(s)
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Schedule All {videos.length} Video(s)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
