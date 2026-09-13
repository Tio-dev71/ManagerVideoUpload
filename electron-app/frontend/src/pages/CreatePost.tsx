import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Film,
  X,
  Loader2,
  Calendar,
  Send,
  Clock,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';
import { PLATFORM_CONFIG } from '../lib/utils';

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
  caption: string;
  firstComment: string;
  hashtags: string;
}

const isAllowedVideoType = (type: string) => {
  return ['video/mp4', 'video/quicktime', 'video/webm'].includes(type);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState<UploadedVideo[]>([]);

  // Global Form state
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [publishMode, setPublishMode] = useState<PublishMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle file upload
  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => {
      if (!isAllowedVideoType(f.type)) {
        toast.error(`Định dạng không hợp lệ: ${f.name}`);
        return false;
      }
      if (f.size > 2000 * 1024 * 1024) {
        toast.error(`File quá lớn (Tối đa 2GB): ${f.name}`);
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
        const res = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.status === 200 || res.status === 201) {
          const result = res.data;
          setVideos((prev) => [
            ...prev,
            {
              ...result,
              title: result.titleFromFileName || file.name,
              caption: '',
              firstComment: '',
              hashtags: '',
            },
          ]);
          successCount++;
        }
      } catch (error: any) {
        toast.error(`Lỗi tải lên: ${error.response?.data?.error || file.name}`);
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      if (successCount > 0) toast.success(`Đã tải lên ${successCount} video`);
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

  const updateVideoField = (id: string, field: keyof UploadedVideo, value: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  // Submit all
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videos.length === 0) {
      toast.error('Vui lòng tải lên ít nhất 1 video.');
      return;
    }
    if (platforms.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 nền tảng.');
      return;
    }
    if (publishMode === 'schedule' && !scheduledAt) {
      toast.error('Vui lòng chọn ngày và giờ đăng.');
      return;
    }

    setSubmitting(true);
    let successCount = 0;

    for (const video of videos) {
      try {
        const res = await api.post('/posts', {
          title: video.title.trim() || video.titleFromFileName,
          caption: video.caption.trim() || null,
          firstComment: video.firstComment.trim() || null,
          hashtags: video.hashtags.trim() || null,
          videoAssetId: video.id,
          platforms,
          publishMode,
          scheduledAt: publishMode === 'schedule' ? new Date(scheduledAt).toISOString() : null,
        });

        if (res.status === 200 || res.status === 201) {
          successCount++;
        }
      } catch (error: any) {
        toast.error(`Lỗi tạo bài viết cho ${video.originalFileName}: ${error.response?.data?.error || 'Lỗi không xác định'}`);
      }
    }

    setSubmitting(false);

    if (successCount > 0) {
      toast.success(
        publishMode === 'now'
          ? `Đang đăng ${successCount} video!`
          : `Đã lên lịch ${successCount} video!`
      );
      navigate('/posts');
    }
  };

  const showYouTubeWarning = platforms.includes('YOUTUBE_SHORTS');

  return (
    <div className="max-w-[720px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="page-header mb-8">
        <div>
          <h1 className="page-title">Tạo bài đăng</h1>
          <p className="page-subtitle">
            Tải lên video và lên lịch đăng bài hàng loạt
          </p>
        </div>
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
                <p className="text-[15px] font-medium">Đang tải video lên...</p>
                <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                  {uploadProgress}% hoàn thành
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
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-muted)] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload className="w-7 h-7 text-[var(--color-muted-foreground)]" />
              </div>
              <div>
                <p className="text-[15px] font-medium">
                  Kéo thả video vào đây hoặc <span className="text-[var(--color-primary)] cursor-pointer">chọn tệp</span>
                </p>
                <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                  Hỗ trợ MP4, MOV, WebM (Tối đa 2GB mỗi file)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video Previews */}
        {videos.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-[16px] font-medium border-b border-[var(--color-border)] pb-2">
              Chi tiết video ({videos.length})
            </h3>
            <div className="grid gap-6">
              {videos.map(v => (
                <div key={v.id} className="card-apple p-5 space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => removeVideo(v.id)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="Xoá video"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4 pr-10">
                    <div className="w-24 h-24 rounded-lg bg-black flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <video src={v.storageUrl} className="w-full h-full object-cover" muted />
                    </div>
                    <div className="flex-1 space-y-3 min-w-0">
                      <div>
                        <input
                          type="text"
                          value={v.title}
                          onChange={(e) => updateVideoField(v.id, 'title', e.target.value)}
                          className="input-apple py-2 px-3 text-[14px] font-medium w-full"
                          placeholder="Tiêu đề video"
                          required
                        />
                        <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">
                          {formatFileSize(v.size)} • {(v.mimeType || 'video/mp4').split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <textarea
                        value={v.caption}
                        onChange={(e) => updateVideoField(v.id, 'caption', e.target.value)}
                        className="input-apple min-h-[80px] resize-y text-[13px] py-2"
                        placeholder="Nội dung bài viết..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={v.hashtags}
                        onChange={(e) => updateVideoField(v.id, 'hashtags', e.target.value)}
                        className="input-apple text-[13px] py-2"
                        placeholder="#viral #trending"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={v.firstComment}
                        onChange={(e) => updateVideoField(v.id, 'firstComment', e.target.value)}
                        className="input-apple text-[13px] py-2"
                        placeholder="Tự động bình luận đầu tiên..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Settings */}
        {videos.length > 0 && (
          <div className="space-y-6 animate-fade-in border-t border-[var(--color-border)] pt-6">
            
            {/* Platform Selection */}
            <div>
              <label className="block text-[14px] font-medium mb-3">
                Chọn nền tảng
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
                        className={`platform-chip px-4 py-2 rounded-xl text-sm flex items-center gap-2 border transition-all ${selected ? 'border-transparent' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        style={selected ? { color: config.color, backgroundColor: `${config.color}14`, borderColor: `${config.color}30` } : {}}
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
                    Đối với YouTube Shorts, hãy sử dụng video dọc dưới 60 giây để có kết quả tốt nhất.
                  </p>
                </div>
              )}
            </div>

            {/* Publish Mode */}
            <div>
              <label className="block text-[14px] font-medium mb-3">
                Chế độ đăng
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPublishMode('now')}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${publishMode === 'now' ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border)] bg-white hover:border-gray-300'}`}
                >
                  <Send className={`w-5 h-5 mb-2 ${publishMode === 'now' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'}`} />
                  <p className="text-[14px] font-medium">Đăng ngay</p>
                  <p className={`text-[12px] mt-0.5 ${publishMode === 'now' ? 'text-[var(--color-primary)] opacity-80' : 'text-[var(--color-muted-foreground)]'}`}>Xuất bản ngay lập tức</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPublishMode('schedule')}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${publishMode === 'schedule' ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border)] bg-white hover:border-gray-300'}`}
                >
                  <Calendar className={`w-5 h-5 mb-2 ${publishMode === 'schedule' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'}`} />
                  <p className="text-[14px] font-medium">Lên lịch</p>
                  <p className={`text-[12px] mt-0.5 ${publishMode === 'schedule' ? 'text-[var(--color-primary)] opacity-80' : 'text-[var(--color-muted-foreground)]'}`}>Chọn ngày & giờ</p>
                </button>
              </div>
            </div>

            {/* Schedule DateTime */}
            {publishMode === 'schedule' && (
              <div className="animate-fade-in">
                <label className="block text-[14px] font-medium mb-1.5">
                  Ngày & Giờ lên lịch
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="input-apple w-full py-2 px-3"
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
                    {publishMode === 'now' ? 'Đang xuất bản...' : 'Đang lên lịch...'}
                  </>
                ) : publishMode === 'now' ? (
                  <>
                    <Send className="w-4 h-4" />
                    Đăng ngay {videos.length} Video
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Lên lịch {videos.length} Video
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
