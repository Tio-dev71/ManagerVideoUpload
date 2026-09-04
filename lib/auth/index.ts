import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

const nextAuthResult = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'ToolAutoTop123456789!@#LongSecretString123',
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const userEmail = (credentials.email as string).toLowerCase().trim();
        const userPassword = credentials.password as string;

        // Check if user exists in DB
        const user = await prisma.user.findUnique({
          where: { email: userEmail }
        });

        if (!user || !user.password) {
          return null; // User not found or hasn't set a password (e.g. OAuth only)
        }

        // Verify password
        const passwordsMatch = await bcrypt.compare(userPassword, user.password);
        if (!passwordsMatch) {
          return null;
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
        token.role = (user as any).role;
        token.workspaceId = (user as any).workspaceId;
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

export const { handlers, auth, signIn, signOut } = nextAuthResult;

