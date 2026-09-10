import { Metadata } from 'next';
import DownloaderClient from './downloader-client';

export const metadata: Metadata = {
  title: 'Video Downloader - Topify',
  description: 'Download videos from Facebook, TikTok, YouTube and more.',
};

import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';

export default function DownloaderPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-4">
            Free Video Downloader
          </h1>
          <p className="text-lg text-gray-600">
            Download your favorite videos from social media platforms instantly. No watermark, high quality, and completely free.
          </p>
        </div>
        <DownloaderClient />
      </div>
      </main>
      <Footer />
    </div>
  );
}
