import ClientMarquee from '@/components/marketing/shared/client-marquee';
import SocialHero from '@/components/marketing/social/social-hero';
import SocialFeatures from '@/components/marketing/social/social-features';
import SocialCta from '@/components/marketing/social/social-cta';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Topify Social - Quản lý mạng xã hội đa kênh',
  description: 'Topify Social giúp bạn quản lý nhiều kênh mạng xã hội tập trung tại một nơi, lên lịch đăng bài, theo dõi hiệu quả và tối ưu nội dung.',
};

export default function SocialPage() {
  return (
    <>
      <SocialHero />
      <SocialFeatures />
      <SocialCta />
      {/* Partner Logos at the very bottom as seen in design */}
      <div className="bg-white pt-8 pb-16">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
          <ClientMarquee />
        </div>
      </div>
    </>
  );
}
