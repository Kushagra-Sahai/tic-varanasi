import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@/lib/constants";

const { auth } = NextAuth(authConfig);

const ROUTE_ROLES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin", roles: ["admin", "manager"] },
  { prefix: "/driver-dashboard", roles: ["driver", "admin"] },
  { prefix: "/account", roles: ["customer", "admin", "manager"] },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const rule = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const role = req.auth?.user?.role;
  if (!role) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (!rule.roles.includes(role)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/driver-dashboard/:path*", "/account/:path*"],
};
