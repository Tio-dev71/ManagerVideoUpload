import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@/lib/db';

const nextAuthResult = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || 'smtp://localhost:2525',
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=true',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().replace(/['"]/g, '').trim();
      const userEmail = user.email.toLowerCase().trim();

      // Check if email is in the allowed list
      let allowed = await prisma.allowedEmail.findUnique({
        where: { email: userEmail },
      });

      // Auto-seed admin if user is the designated admin
      if (userEmail === adminEmail) {
        if (!user.id) {
          return true; // Allow sending magic link without seeding yet
        }

        if (!allowed) {
          const workspace = await prisma.workspace.upsert({
            where: { id: 'default-workspace' },
            update: {},
            create: { id: 'default-workspace', name: 'Default Workspace' },
          });

          allowed = await prisma.allowedEmail.create({
            data: {
              email: userEmail,
              role: 'SUPER_ADMIN',
              workspaceId: workspace.id,
              invitedById: user.id,
            }
          });
        }
      }

      if (!allowed) {
        return false;
      }

      // Update user role and workspace to match allowed email
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: allowed.role,
            workspaceId: allowed.workspaceId,
          },
        });
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true, workspaceId: true },
        });
        session.user.id = user.id;
        session.user.role = dbUser?.role ?? 'STAFF';
        (session.user as any).workspaceId = dbUser?.workspaceId ?? null;
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
  trustHost: true,
});

export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;

export const auth = async (...args: any[]) => {
  // Always return mock SUPER_ADMIN in local development to avoid DB requirement & flickering
  if (process.env.NODE_ENV !== 'production') {
    return {
      user: {
        id: 'local-super-admin',
        name: 'Local Super Admin',
        email: 'thond.topmedia.vn@gmail.com',
        role: 'SUPER_ADMIN',
      },
      expires: '2099-01-01T00:00:00.000Z',
    };
  }
  return (nextAuthResult.auth as any)(...args);
};
