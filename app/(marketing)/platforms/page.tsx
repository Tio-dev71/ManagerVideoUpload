import { MonitorPlay, Smartphone, Globe, LayoutGrid } from 'lucide-react';

export default function PlatformsPage() {
  const platforms = [
    {
      name: 'Facebook',
      description: 'Hỗ trợ tự động đăng Reels, đăng bài Fanpage, Group, tự động seeding tương tác, tự động mời vào nhóm.',
      icon: <Globe className="w-10 h-10 text-blue-600" />
    },
    {
      name: 'Instagram (Sắp ra mắt)',
      description: 'Tự động đăng Instagram Reels, tương tác qua lại tự nhiên, tăng độ uy tín cho tài khoản Instagram.',
      icon: <Smartphone className="w-10 h-10 text-pink-500" />
    },
    {
      name: 'TikTok (Sắp ra mắt)',
      description: 'Giải pháp tự động hóa đăng video hàng loạt lên TikTok, cày view, tương tác mồi cho nội dung mới.',
      icon: <MonitorPlay className="w-10 h-10 text-gray-900 dark:text-white" />
    },
    {
      name: 'YouTube Shorts (Sắp ra mắt)',
      description: 'Nuôi tài khoản và tự động đẩy hàng loạt video ngắn lên Youtube Shorts chuẩn SEO.',
      icon: <LayoutGrid className="w-10 h-10 text-red-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-5xl flex items-center justify-center gap-3">
            Nền tảng hỗ trợ
            <Globe className="w-10 h-10 text-[#5B3DF5]" />
          </h1>
          <p className="mt-4 text-xl text-[var(--color-muted-foreground)]">
            Hệ sinh thái công cụ hỗ trợ xây dựng thương hiệu đa kênh nhanh chóng và an toàn nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className="card-apple p-8 flex flex-col items-center text-center border border-[var(--color-border)] hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-full mb-6 shadow-sm">
                {platform.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">{platform.name}</h3>
              <p className="text-[var(--color-muted-foreground)] text-sm leading-relaxed">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
