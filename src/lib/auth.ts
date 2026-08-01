import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { findUserByEmail, findOrCreateUserByPhone, consumeValidOtp } from "@/server/services/userService";
import type { Role } from "@/lib/constants";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // No adapter: sessions are JWT-only, so OAuth/Credentials profiles flow
  // straight into the jwt() callback without needing a persisted
  // Account/Session row. User records for Credentials sign-in are read from
  // the JSON store directly inside authorize() below.
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

        const user = await findUserByEmail(email);
        if (!user?.passwordHash || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
      },
    }),
    // Customer login: phone + OTP verified against the JSON otpTokens store.
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

        const otp = await consumeValidOtp(phone, code);
        if (!otp) return null;

        const user = await findOrCreateUserByPhone(phone);
        if (!user.isActive) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
      },
    }),
  ],
});
