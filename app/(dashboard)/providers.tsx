'use client';

import { SessionProvider } from 'next-auth/react';

const localAdminSession = {
  user: {
    id: 'local-super-admin',
    name: 'Local Super Admin',
    email: 'thond.topmedia.vn@gmail.com',
    role: 'SUPER_ADMIN' as const,
  },
  expires: '2099-01-01T00:00:00.000Z',
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider session={localAdminSession}>{children}</SessionProvider>;
}
