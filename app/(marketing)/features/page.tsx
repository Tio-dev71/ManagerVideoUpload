import { ShieldCheck, Zap, Bot, Layers } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Tự động hóa thông minh',
      description: 'Hệ thống tự động đăng video lên nhiều nền tảng, lên lịch và quản lý dễ dàng giúp tiết kiệm hàng giờ mỗi ngày.',
      icon: <Zap className="w-8 h-8 text-[#5B3DF5]" />
    },
    {
      title: 'Công nghệ Anti-detect (Chống khóa)',
      description: 'Giả lập 100% thao tác người thật bằng Trusted Clicks và độ trễ gõ phím ngẫu nhiên, giúp tài khoản luôn an toàn.',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />
    },
    {
      title: 'Bình luận bằng AI (Trí tuệ nhân tạo)',
      description: 'Tích hợp mô hình AI tiên tiến (Gemini, Deepseek, GPT) tự động đọc hiểu video và đưa ra bình luận siêu chân thật.',
      icon: <Bot className="w-8 h-8 text-blue-500" />
    },
    {
      title: 'Quản lý Đa luồng (Multithread)',
      description: 'Nuôi và điều khiển hàng trăm tài khoản Facebook chạy cùng lúc trên nhiều proxy khác nhau.',
      icon: <Layers className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-5xl flex items-center justify-center gap-3">
            Tính năng nổi bật
            <Zap className="w-10 h-10 text-[#5B3DF5]" />
          </h1>
          <p className="mt-4 text-xl text-[var(--color-muted-foreground)]">
            Khám phá những công cụ mạnh mẽ nhất giúp bạn tự động hóa hoàn toàn việc xây dựng thương hiệu trên mạng xã hội.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-apple p-8 flex flex-col items-start border border-[var(--color-border)] hover:border-[#5B3DF5] transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">{feature.title}</h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
