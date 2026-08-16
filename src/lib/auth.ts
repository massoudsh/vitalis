import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// احراز هویت با شماره موبایل + رمز عبور (طبق docs/ARCHITECTURE.md — ساختار
// آماده برای OTP موبایل در فاز بعد، فعلاً Credentials ساده).
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "شماره موبایل و رمز عبور",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        if (!user || !user.passwordHash || user.status !== "ACTIVE") {
          return null;
        }

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.fullName,
          role: user.role,
          facilityId: user.facilityId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.facilityId = user.facilityId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.facilityId = token.facilityId;
      return session;
    },
  },
};
