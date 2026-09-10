'use client';

import { useState } from 'react';
import { Download, Link as LinkIcon, Loader2, Video, Music, AlertCircle } from 'lucide-react';

interface MediaInfo {
  url: string;
  quality?: string;
  extension?: string;
  type?: string;
  size?: string;
}

interface DownloaderResponse {
  title?: string;
  thumbnail?: string;
  picture?: string;
  medias?: MediaInfo[];
  links?: MediaInfo[];
  error?: string;
  [key: string]: any;
}

export default function DownloaderClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DownloaderResponse | null>(null);
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch video details');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getMediaList = (data: DownloaderResponse): MediaInfo[] => {
    if (data.medias && Array.isArray(data.medias)) return data.medias;
    if (data.links && Array.isArray(data.links)) return data.links;
    
    const possibleLinks: MediaInfo[] = [];
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && data[key].startsWith('http') && (data[key].includes('.mp4') || data[key].includes('.mp3'))) {
        possibleLinks.push({ url: data[key], quality: key });
      }
    });
    return possibleLinks;
  };

  const medias = result ? getMediaList(result) : [];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="card-apple p-6">
        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your video link here (YouTube, Facebook, TikTok, etc.)"
              className="input-apple !pl-10 !py-3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url}
            className="btn-primary px-6 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Fetching...
              </>
            ) : (
              <>
                <Download className="-ml-1 mr-2 h-5 w-5" />
                Start
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && !error && (
        <div className="card-apple p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            {(result.thumbnail || result.picture) && (
              <div className="w-full md:w-5/12 flex-shrink-0">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
                  <img
                    src={result.thumbnail || result.picture}
                    alt={result.title || "Video thumbnail"}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            
            {/* Details */}
            <div className="flex-1 space-y-6">
              {result.title && (
                <h3 className="text-xl font-semibold text-neutral-900 line-clamp-3">
                  {result.title}
                </h3>
              )}
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                  Download Options
                </h4>
                
                {medias.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {medias.map((media, idx) => {
                      const isVideo = media.extension !== 'mp3' && !media.type?.includes('audio');
                      return (
                        <div
                          key={idx}
                          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-card)] transition-all gap-4"
                        >
                          <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div className="p-2.5 rounded-xl bg-[var(--color-muted)] group-hover:bg-[var(--color-primary-soft)] text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                              {isVideo ? <Video className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                            </div>
                            <div className="truncate">
                              <p className="text-[14px] font-medium text-[var(--color-foreground)] truncate">
                                {media.quality || media.type || media.extension || 'Download File'}
                              </p>
                              {(media.extension || media.size) && (
                                <p className="text-[12px] text-[var(--color-muted-foreground)] mt-0.5">
                                  {[media.extension, media.size].filter(Boolean).join(' • ')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <a
                            href={`/api/proxy-download?url=${encodeURIComponent(media.url)}&filename=video-${Date.now()}`}
                            download
                            className="btn-secondary py-2 text-[13px] w-full sm:w-auto"
                          >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Tải về
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500 italic">
                    No direct download links found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
