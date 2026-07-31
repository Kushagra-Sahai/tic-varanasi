import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/lib/constants";

/**
 * Edge-safe subset of the NextAuth config: no Prisma adapter, no
 * bcrypt/DB-touching providers. Middleware runs on the Edge runtime by
 * default and can't load Prisma's native engine, so it only needs this to
 * decode the session JWT. The full config (auth.ts) extends this with the
 * adapter and providers for use in route handlers / Server Actions / RSC.
 */
export const authConfig: NextAuthConfig = {
  // Required for self-hosted deployments behind a reverse proxy (Nginx/Cloudflare
  // on the Hostinger VPS target) where the Host header isn't auto-trusted the
  // way it is on Vercel. Safe here since Nginx is configured to set the
  // correct Host/X-Forwarded-* headers in front of this app.
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user.role ?? "customer") as Role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
