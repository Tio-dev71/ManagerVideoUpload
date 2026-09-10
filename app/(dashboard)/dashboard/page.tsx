'use client';

import { useSession } from '@/lib/supabase/useSession';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Key, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck,
  CreditCard,
  MonitorSmartphone,
  Video,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface LicenseData {
  licenseKey: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  usage: {
    videosUploaded: number;
  };
}

const PLAN_LIMITS = {
  FREE: { videos: 10, workspaces: 1, fanpages: 1 },
  PRO: { videos: 100, workspaces: 3, fanpages: 5 },
  ENTERPRISE: { videos: 'Không giới hạn', workspaces: 'Không giới hạn', fanpages: 'Không giới hạn' },
};

const PLAN_NAMES = {
  FREE: 'Khởi đầu (Miễn phí)',
  PRO: 'Chuyên nghiệp',
  ENTERPRISE: 'Doanh nghiệp',
};

export default function AccountPortalPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    async function fetchLicense() {
      try {
        const res = await fetch('/api/user/license');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải thông tin bản quyền');
      } finally {
        setLoading(false);
      }
    }
    fetchLicense();
  }, []);

  const handleCopy = () => {
    if (data?.licenseKey) {
      navigator.clipboard.writeText(data.licenseKey);
      setCopied(true);
      toast.success('Đã sao chép License Key');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getUsagePercentage = () => {
    if (!data) return 0;
    if (data.plan === 'ENTERPRISE') return 0;
    const limit = PLAN_LIMITS[data.plan].videos as number;
    return Math.min(100, (data.usage.videosUploaded / limit) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-2 sm:p-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-foreground)]">
          Tổng quan Tài khoản
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Quản lý khóa bản quyền và gói cước hệ thống của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* License Key Card */}
        <div className="card-apple p-6 border border-[var(--color-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold">License Key (Khoá đăng nhập)</h2>
                <p className="text-[13px] text-[var(--color-muted-foreground)]">
                  Sử dụng mã này để đăng nhập vào Desktop App. Tuyệt đối không chia sẻ mã này cho người khác.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="h-12 bg-gray-100 animate-pulse rounded-xl mt-6"></div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={data?.licenseKey || ''}
                      readOnly
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[15px] font-mono tracking-widest text-[var(--color-foreground)] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className="btn-secondary h-[46px] px-4 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Đã copy' : 'Copy'}
                  </button>
                </div>
                <div className="flex justify-between items-center px-1">
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="text-[13px] text-purple-600 font-medium hover:underline"
                  >
                    {showKey ? 'Ẩn mã' : 'Hiển thị mã'}
                  </button>
                  <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Mã hóa an toàn AES-256
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-5 border-t border-[var(--color-border)]">
            <Link 
              href="/download" 
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <MonitorSmartphone className="w-5 h-5" />
              Tải Desktop App (Windows/macOS)
            </Link>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="card-apple p-6 border border-[var(--color-border)] bg-gradient-to-br from-white to-gray-50 dark:from-[var(--color-card)] dark:to-[var(--color-background)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-[17px] font-semibold">Gói cước của bạn</h2>
            </div>
            {loading ? (
              <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <span className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase
                ${data?.plan === 'PRO' ? 'bg-blue-100 text-blue-700' 
                : data?.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'}
              `}>
                {PLAN_NAMES[data?.plan || 'FREE']}
              </span>
            )}
          </div>

          {!loading && data && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[13px] mb-2 font-medium">
                  <span className="text-[var(--color-muted-foreground)]">Sử dụng tháng này</span>
                  <span className={getUsagePercentage() >= 90 ? 'text-red-500' : 'text-[var(--color-foreground)]'}>
                    {data.usage.videosUploaded} / {PLAN_LIMITS[data.plan].videos} Videos
                  </span>
                </div>
                {data.plan !== 'ENTERPRISE' && (
                  <div className="w-full bg-[var(--color-border)] rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        getUsagePercentage() >= 90 ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${getUsagePercentage()}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)]">
                  <Video className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-[12px] text-[var(--color-muted-foreground)] uppercase font-semibold">Tải lên</p>
                  <p className="text-[15px] font-medium">{PLAN_LIMITS[data.plan].videos} video/tháng</p>
                </div>
                <div className="bg-white dark:bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)]">
                  <Users className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-[12px] text-[var(--color-muted-foreground)] uppercase font-semibold">Tài khoản FB</p>
                  <p className="text-[15px] font-medium">{PLAN_LIMITS[data.plan].fanpages} Fanpage</p>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  href="/pricing"
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-primary)] text-[var(--color-primary)] font-medium text-[14px] rounded-xl flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  Nâng cấp gói cước
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
