import Navbar from '@/components/marketing/navbar';
import HeroSection from '@/components/marketing/hero';
import FeaturesSection from '@/components/marketing/features';
import PlatformsSection from '@/components/marketing/platforms';
import CtaSection from '@/components/marketing/cta';
import Footer from '@/components/marketing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlatformsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
