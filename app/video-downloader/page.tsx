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
      
      {/* Hero Section with Gradient Background */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Free Video</span> Downloader
            </h1>
            <p className="text-lg leading-8 text-gray-600">
              Download your favorite videos from social media platforms instantly. No watermark, high quality, and completely free.
            </p>
          </div>
          
          <DownloaderClient />
        </div>
      </div>
      
      <main className="flex-1 bg-white">
        {/* Additional sections can go here in the future */}
      </main>
      <Footer />
    </div>
  );
}
