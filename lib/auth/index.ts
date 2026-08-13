import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/db';

const nextAuthResult = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const userEmail = (credentials.email as string).toLowerCase().trim();
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().replace(/['"]/g, '').trim();

        // Check if email is in the allowed list
        let allowed = await prisma.allowedEmail.findUnique({
          where: { email: userEmail },
        });

        // Auto-seed admin if user is the designated admin
        if (userEmail === adminEmail) {
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
              }
            });
          }
        }

        if (!allowed) {
          return null;
        }

        // Check if user exists in DB
        let user = await prisma.user.findUnique({
          where: { email: userEmail }
        });

        if (!user) {
           user = await prisma.user.create({
             data: {
               email: userEmail,
               role: allowed.role,
               workspaceId: allowed.workspaceId,
             }
           });
        } else {
           user = await prisma.user.update({
             where: { id: user.id },
             data: {
               role: allowed.role,
               workspaceId: allowed.workspaceId,
             }
           });
        }

        return user;
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.workspaceId = user.workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, role: true, workspaceId: true },
        });
        session.user.id = token.id as string;
        session.user.role = dbUser?.role ?? 'STAFF';
        (session.user as any).workspaceId = dbUser?.workspaceId ?? null;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});

export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;

export const auth = async (...args: any[]) => {
  return (nextAuthResult.auth as any)(...args);
};
