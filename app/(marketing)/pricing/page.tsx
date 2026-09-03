'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const PLANS = [
  {
    id: 'FREE',
    name: 'Gói Khởi đầu',
    price: 0,
    priceStr: 'Miễn phí',
    type: 'Cá nhân',
    features: [
      'Quản lý 1 Workspace',
      'Upload 10 video mỗi tháng',
      'Đăng bài lên 1 Fanpage',
      'Hỗ trợ tiêu chuẩn'
    ],
    buttonText: 'Bắt đầu miễn phí',
    popular: false
  },
  {
    id: 'PRO',
    name: 'Gói Chuyên nghiệp',
    price: 299000,
    priceStr: '299.000đ',
    type: 'Cá nhân & Nhóm nhỏ',
    features: [
      'Quản lý tối đa 3 Workspaces',
      'Upload 100 video mỗi tháng',
      'Đăng bài lên 5 Fanpage',
      'Lên lịch tự động',
      'Hỗ trợ ưu tiên'
    ],
    buttonText: 'Nâng cấp ngay',
    popular: true
  },
  {
    id: 'ENTERPRISE',
    name: 'Gói Doanh nghiệp',
    price: 999000,
    priceStr: '999.000đ',
    type: 'Đội ngũ & Công ty',
    features: [
      'Không giới hạn Workspaces',
      'Không giới hạn số lượng video',
      'Không giới hạn Fanpage',
      'Thêm thành viên không giới hạn',
      'Hỗ trợ riêng 24/7'
    ],
    buttonText: 'Nâng cấp ngay',
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-5xl flex items-center justify-center gap-3">
            Bảng giá dịch vụ
            <ShieldCheck className="w-10 h-10 text-[var(--color-primary)]" />
          </h1>
          <p className="mt-4 text-xl text-[var(--color-muted-foreground)]">
            Nâng cấp tài khoản Topify để mở khóa toàn bộ tính năng tự động đăng video Reels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan, index) => (
            <div 
              key={plan.id}
              className={\`card-apple p-8 relative flex flex-col \${
                plan.popular ? 'border-2 border-[var(--color-primary)] shadow-xl' : 'border border-[var(--color-border)]'
              }\`}
              style={{ animationDelay: \`\${index * 150}ms\` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-4">
                  <span className="bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    Phổ biến nhất
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{plan.name}</h3>
                <p className="text-[var(--color-muted-foreground)] text-sm mt-1">{plan.type}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-[var(--color-foreground)]">{plan.priceStr}</span>
                {plan.price > 0 && <span className="text-[var(--color-muted-foreground)]">/tháng</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[var(--color-foreground)] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link 
                  href={plan.price === 0 ? '/login' : \`/thanh-toan/sepay?plan=\${plan.id}&amount=\${plan.price}\`}
                  className={\`w-full flex justify-center items-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 \${
                    plan.popular 
                      ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                      : 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-border)]'
                  }\`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
