import "server-only";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/constants";

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Enforces a role check inside a Server Action / route handler / service call.
 * Middleware only gates page navigation — every mutating server entrypoint
 * must call this too, since middleware can be bypassed by calling the
 * server function directly.
 */
export async function requireRole(...allowed: Role[]) {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!allowed.includes(session.user.role)) throw new ForbiddenError();
  return session.user;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session.user;
}

export const STAFF_ROLES: Role[] = ["admin", "manager"];
