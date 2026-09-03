'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const code = searchParams.get('code');

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="card-apple overflow-hidden border border-[var(--color-border)] shadow-xl p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Đang chờ xác nhận</h1>
        
        <p className="text-[var(--color-muted-foreground)] mb-8">
          Hệ thống đang kiểm tra giao dịch của mã <strong className="text-[var(--color-foreground)]">{code}</strong>. 
          Quá trình này có thể mất từ 1-3 phút.
        </p>
        
        <div className="bg-[var(--color-secondary)] p-4 rounded-xl text-sm text-left mb-8 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-[var(--color-foreground)]">Nếu bạn đã chuyển khoản thành công, tài khoản sẽ tự động được nâng cấp lên gói <strong>{plan}</strong>.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-[var(--color-foreground)]">Vui lòng kiểm tra lại trạng thái ở trang Bảng điều khiển (Dashboard) sau vài phút.</span>
          </div>
        </div>

        <Link href="/dashboard" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all duration-200">
          Về Bảng điều khiển
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-[400px] bg-[var(--color-secondary)] rounded-2xl"></div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
