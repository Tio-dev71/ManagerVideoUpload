'use client';

import Link from 'next/link';
import { useSession, SessionProvider } from 'next-auth/react';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';

function NavbarContent() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B3DF5] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">t</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Topify</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">
                Sản phẩm
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#5B3DF5] transition-transform group-hover:rotate-180" />
              </button>
              {/* Dropdown would go here - simplified for now */}
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 transform translate-y-2 group-hover:translate-y-0">
                <Link href="/products/analytics" className="block px-4 py-3 hover:bg-blue-50 rounded-lg group/item">
                  <p className="text-sm font-semibold text-gray-900 group-hover/item:text-[#5B3DF5]">Topify Analytics</p>
                  <p className="text-xs text-gray-500 mt-1">Phân tích dữ liệu thông minh</p>
                </Link>
                <Link href="/products/social" className="block px-4 py-3 hover:bg-blue-50 rounded-lg group/item">
                  <p className="text-sm font-semibold text-gray-900 group-hover/item:text-[#5B3DF5]">Topify Social</p>
                  <p className="text-xs text-gray-500 mt-1">Quản lý & đăng bài đa kênh</p>
                </Link>
                <Link href="/products/crm" className="block px-4 py-3 hover:bg-blue-50 rounded-lg group/item">
                  <p className="text-sm font-semibold text-gray-900 group-hover/item:text-[#5B3DF5]">Topify CRM</p>
                  <p className="text-xs text-gray-500 mt-1">Chăm sóc khách hàng đa kênh</p>
                </Link>
                <Link href="/products/work" className="block px-4 py-3 hover:bg-blue-50 rounded-lg group/item">
                  <p className="text-sm font-semibold text-gray-900 group-hover/item:text-[#5B3DF5]">Topify Work</p>
                  <p className="text-xs text-gray-500 mt-1">Quản trị công việc & đội nhóm</p>
                </Link>
              </div>
            </div>
            <Link href="#features" className="text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">Tính năng</Link>
            <Link href="#platforms" className="text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">Nền tảng</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">Bảng giá</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">
                Tài nguyên
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#5B3DF5] transition-transform group-hover:rotate-180" />
              </button>
            </div>
            <Link href="#about" className="text-gray-600 hover:text-[#5B3DF5] px-3 py-2 rounded-md text-[14px] font-medium transition-colors">Giới thiệu</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer text-sm font-medium pr-2 border-r border-gray-200">
              <Globe className="w-4 h-4" />
              <span>VI</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </div>

            {session ? (
              <Link href="/dashboard" className="bg-[#5B3DF5] text-white hover:bg-[#4F2FE0] px-5 py-2 rounded-lg text-sm font-semibold transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-[#5B3DF5] border border-blue-100 bg-blue-50 hover:bg-blue-100 px-5 py-2 rounded-lg text-sm font-semibold transition-all">
                  Đăng nhập
                </Link>
                <Link href="/login" className="bg-[#5B3DF5] text-white hover:bg-[#4F2FE0] px-5 py-2 rounded-lg text-sm font-semibold transition-all">
                  Dùng thử miễn phí
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="#products" className="text-gray-600 hover:text-rose-600 block px-3 py-2 rounded-md text-base font-medium">Sản phẩm</Link>
            <Link href="#features" className="text-gray-600 hover:text-rose-600 block px-3 py-2 rounded-md text-base font-medium">Tính năng</Link>
            <Link href="#platforms" className="text-gray-600 hover:text-rose-600 block px-3 py-2 rounded-md text-base font-medium">Nền tảng</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-rose-600 block px-3 py-2 rounded-md text-base font-medium">Bảng giá</Link>
          </div>
          <div className="px-4 py-4 border-t border-gray-100">
            {session ? (
              <Link href="/dashboard" className="block text-center w-full bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md">
                Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="block text-center w-full text-rose-600 border border-rose-600 bg-white px-5 py-2 rounded-full text-sm font-semibold">
                  Đăng nhập
                </Link>
                <Link href="/login" className="block text-center w-full bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
                  Dùng thử miễn phí
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  );
}
