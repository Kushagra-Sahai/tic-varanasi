import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Role } from "@/lib/constants";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Staff login: admin / manager / driver — email + password.
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
      },
    }),
    // Customer login: phone + OTP verified against OtpToken.
    Credentials({
      id: "otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined;
        const code = credentials?.code as string | undefined;
        if (!phone || !code) return null;

        const otp = await db.otpToken.findFirst({
          where: { phone, code, consumed: false, expiresAt: { gt: new Date() } },
          orderBy: { createdAt: "desc" },
        });
        if (!otp) return null;

        await db.otpToken.update({ where: { id: otp.id }, data: { consumed: true } });

        const user = await db.user.upsert({
          where: { phone },
          update: {},
          create: { phone, name: `Guest ${phone.slice(-4)}`, role: "customer" },
        });
        if (!user.isActive) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
      },
    }),
  ],
});
