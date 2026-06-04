'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Users,
  Settings,
  LogOut,
  Play,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Reel', href: '/create', icon: PlusCircle },
  { name: 'Posts', href: '/posts', icon: Calendar },
];

const adminNavigation = [
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

import { ThemeToggle } from '@/components/theme-toggle';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';
  const allNavItems = [...navigation, ...(isAdmin ? adminNavigation : [])];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-white border border-[var(--color-border)] shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r border-[var(--color-sidebar-border)] dark:bg-neutral-950 dark:border-neutral-800
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b border-[var(--color-sidebar-border)] dark:border-neutral-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
              <Image src="/tiodevlogo.png" alt="AutoReel Logo" width={36} height={36} className="rounded-xl object-cover" />
            </div>
            {!collapsed && (
              <span className="text-[15px] font-semibold truncate dark:text-white">
                AutoReel
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[var(--color-muted)] dark:hover:bg-neutral-800 transition-colors ${collapsed ? 'rotate-180' : ''}`}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--color-muted-foreground)] dark:text-neutral-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {allNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium
                    transition-all duration-200 group
                    ${active
                      ? 'bg-[var(--color-foreground)] text-white shadow-sm dark:bg-white dark:text-neutral-950'
                      : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }
                    ${collapsed ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-white dark:text-neutral-950' : ''}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {isAdmin && !collapsed && (
            <div className="mt-4 pt-4 border-t border-[var(--color-sidebar-border)] dark:border-neutral-800">
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] dark:text-neutral-500">
                Admin
              </p>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className={`p-3 border-t border-[var(--color-sidebar-border)] dark:border-neutral-800 ${collapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {session?.user?.email?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate dark:text-neutral-200">
                  {session?.user?.name || session?.user?.email?.split('@')[0]}
                </p>
                <p className="text-[11px] text-[var(--color-muted-foreground)] dark:text-neutral-500 truncate">
                  {session?.user?.role === 'ADMIN' ? 'Admin' : 'Staff'}
                </p>
              </div>
            )}
            {!collapsed && (
              <div className="flex items-center gap-1 ml-auto">
                <ThemeToggle />
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-muted)] dark:hover:bg-neutral-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-[var(--color-muted-foreground)] dark:text-neutral-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
