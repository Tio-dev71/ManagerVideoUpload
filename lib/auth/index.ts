import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      
      // Check if email is in the allowed list
      const allowed = await prisma.allowedEmail.findUnique({
        where: { email: user.email },
      });

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
