import { Users, Target, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
            Giới thiệu Topify
          </h1>
          <p className="mt-4 text-xl text-[var(--color-muted-foreground)]">
            Chúng tôi tạo ra giải pháp tự động hóa giúp hàng ngàn doanh nghiệp tiết kiệm thời gian và bứt phá doanh thu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 max-w-6xl mx-auto">
          <div className="order-2 md:order-1 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-[var(--color-muted-foreground)] text-lg mb-4 leading-relaxed">
              Topify được sinh ra với mục tiêu giúp cho việc xây dựng thương hiệu trên mạng xã hội trở nên dễ dàng và hoàn toàn tự động.
            </p>
            <p className="text-[var(--color-muted-foreground)] text-lg leading-relaxed">
              Bằng cách ứng dụng các công nghệ tiên tiến nhất về Trí tuệ nhân tạo (AI) và Giả lập hành vi người thật (Anti-detect), chúng tôi tự hào mang lại hiệu suất kinh ngạc mà vẫn đảm bảo an toàn tuyệt đối cho người dùng.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative w-full max-w-md aspect-square bg-blue-50 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-[var(--color-border)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B3DF5]/20 to-purple-500/20"></div>
              <Rocket className="w-32 h-32 text-[#5B3DF5]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card-apple p-8 text-center border border-[var(--color-border)]" style={{ animationDelay: '400ms' }}>
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-[#5B3DF5]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">+5,000 Người dùng</h3>
            <p className="text-[var(--color-muted-foreground)]">Đã và đang tin tưởng sử dụng dịch vụ của Topify mỗi ngày.</p>
          </div>
          
          <div className="card-apple p-8 text-center border border-[var(--color-border)]" style={{ animationDelay: '500ms' }}>
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">Chất lượng là cốt lõi</h3>
            <p className="text-[var(--color-muted-foreground)]">Luôn cập nhật thuật toán mới nhất để phần mềm chạy mượt mà, ổn định.</p>
          </div>

          <div className="card-apple p-8 text-center border border-[var(--color-border)]" style={{ animationDelay: '600ms' }}>
            <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">Hỗ trợ 24/7</h3>
            <p className="text-[var(--color-muted-foreground)]">Đội ngũ kĩ thuật viên nhiệt tình, sẵn sàng gỡ rối mọi vấn đề của khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
