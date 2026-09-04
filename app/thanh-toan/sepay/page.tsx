'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, QrCode } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function SePayCheckoutContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const plan = searchParams.get('plan') || 'PRO';
  const amount = searchParams.get('amount') || '0';
  
  const [code, setCode] = useState('');

  useEffect(() => {
    // Generate a unique code for the transaction: TPF + UserID + Timestamp (short)
    if (session?.user?.email) {
      // In a real app, you would create an Order record in DB first and use the Order ID
      // Here we just generate a random code prefixed with TPF
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setCode(`TPF${randomSuffix}`);
    } else {
      setCode(`TPF${Math.floor(10000 + Math.random() * 90000)}`);
    }
  }, [session]);

  const bankId = process.env.NEXT_PUBLIC_BANK_ID || 'MB';
  const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || '0123456789';
  const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'NGUYEN VAN A';
  
  // Create a VietQR image via SePay or VietQR
  const qrUrl = accountNo && code
    ? `https://qr.sepay.vn/img?bank=${bankId}&acc=${accountNo}&amount=${amount}&des=${code}`
    : '';

  const amountStr = parseInt(amount).toLocaleString('vi-VN');

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Quay lại bảng điều khiển
        </Link>
      </div>

      <div className="card-apple overflow-hidden border border-[var(--color-border)] shadow-xl">
        <div className="bg-[var(--color-primary)] p-6 text-center text-white">
          <QrCode className="mx-auto mb-3 h-12 w-12 opacity-90" />
          <h1 className="text-xl font-bold">Thanh toán chuyển khoản</h1>
          <p className="text-sm opacity-90 mt-1">Quét mã QR qua ứng dụng ngân hàng</p>
        </div>

        <div className="p-6">
          <div className="mb-6 space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] p-5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted-foreground)]">Ngân hàng:</span>
              <span className="font-bold text-[var(--color-foreground)]">{bankId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted-foreground)]">Số tài khoản:</span>
              <span className="font-bold text-[var(--color-foreground)]">{accountNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted-foreground)]">Chủ tài khoản:</span>
              <span className="font-bold text-[var(--color-foreground)]">{accountName}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-4">
              <span className="text-[var(--color-muted-foreground)]">Số tiền:</span>
              <span className="text-xl font-extrabold text-[var(--color-primary)]">{amountStr} ₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted-foreground)]">Nội dung (Bắt buộc):</span>
              <span className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-md font-mono font-bold text-amber-800 dark:text-amber-500 text-base">
                {code || 'Đang tạo...'}
              </span>
            </div>
          </div>

          {qrUrl ? (
            <div className="text-center mb-6">
              <div className="relative mx-auto mb-3 inline-block rounded-2xl border-4 border-[var(--color-border)] shadow-md bg-white p-2">
                <img src={qrUrl} alt="VietQR Code" className="h-64 w-64 rounded-xl object-contain" />
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Mở ứng dụng ngân hàng bất kỳ để quét mã
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 mb-6">
              Đang khởi tạo mã QR...
            </div>
          )}
          
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-700 dark:text-blue-400">
            <span className="font-bold block mb-1">Lưu ý:</span> 
            Hệ thống sẽ tự động xác nhận giao dịch trong vòng 1-3 phút. Bạn không cần làm gì thêm sau khi chuyển tiền thành công.
          </div>
        </div>

        <div className="bg-[var(--color-secondary)] p-4 border-t border-[var(--color-border)]">
          <Link href={`/thanh-toan/ket-qua?plan=${plan}&code=${code}`} className="w-full block">
            <button className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200">
              <RefreshCw className="h-4 w-4" />
              Tôi đã chuyển khoản xong
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SePayCheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-[600px] bg-[var(--color-secondary)] rounded-2xl"></div>}>
        <SePayCheckoutContent />
      </Suspense>
    </div>
  );
}
