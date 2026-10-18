import type { NextAuthConfig } from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Nodemailer({
      server: 'smtp://placeholder',
      from: process.env.EMAIL_FROM ?? 'SurfaceRepair <no-reply@surfacerepair.in>',
      maxAge: 10 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await sendEmail({
          to: identifier,
          subject: 'Sign in to SurfaceRepair.in',
          text: `Click this link to sign in to SurfaceRepair.in:\n\n${url}\n\nThis link expires in 10 minutes.`,
          html: `<p>Click this link to sign in:</p><p><a href="${url}">${url}</a></p><p>Expires in 10 minutes.</p>`,
        });
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
    verifyRequest: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const emailNormalized = user.email.trim().toLowerCase();
      const staff = await db.staffUser.findUnique({ where: { emailNormalized } });
      if (!staff || !staff.isActive) return false;
      await db.staffUser.update({
        where: { id: staff.id },
        data: { lastLoginAt: new Date() },
      });
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const emailNormalized = user.email.trim().toLowerCase();
        const staff = await db.staffUser.findUnique({ where: { emailNormalized } });
        if (staff) {
          token.staffId = staff.id;
          token.role = staff.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.staffId) {
        session.user = {
          ...session.user,
          id: token.staffId as string,
          role: token.role as 'OWNER' | 'STAFF',
        };
      }
      return session;
    },
  },
  trustHost: true,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: 'OWNER' | 'STAFF';
    };
  }
}
