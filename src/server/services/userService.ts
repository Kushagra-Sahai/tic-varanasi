import "server-only";
import { mutateCollection, newId, readCollection } from "@/lib/jsondb";
import type { OtpToken, User } from "@/lib/entities";

export async function findUserByEmail(email: string) {
  const users = await readCollection<User>("users");
  return users.find((u) => u.email === email) ?? null;
}

export async function findOrCreateUserByPhone(phone: string) {
  let result!: User;
  await mutateCollection<User>("users", (rows) => {
    const existing = rows.find((u) => u.phone === phone);
    if (existing) {
      result = existing;
      return rows;
    }
    const user: User = {
      id: newId(),
      name: `Guest ${phone.slice(-4)}`,
      email: null,
      phone,
      passwordHash: null,
      role: "customer",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    result = user;
    return [...rows, user];
  });
  return result;
}

export async function consumeValidOtp(phone: string, code: string) {
  let matched: OtpToken | null = null;
  await mutateCollection<OtpToken>("otpTokens", (rows) => {
    const now = new Date();
    const idx = rows.findIndex(
      (o) => o.phone === phone && o.code === code && !o.consumed && new Date(o.expiresAt) > now,
    );
    if (idx === -1) return rows;
    matched = rows[idx];
    const copy = [...rows];
    copy[idx] = { ...rows[idx], consumed: true };
    return copy;
  });
  return matched;
}

// Used by external services (e.g. an SMS gateway integration in M2) to issue a new code.
export async function createOtp(phone: string, code: string, ttlMinutes = 10) {
  const otp: OtpToken = {
    id: newId(),
    phone,
    code,
    expiresAt: new Date(Date.now() + ttlMinutes * 60_000).toISOString(),
    consumed: false,
    createdAt: new Date().toISOString(),
  };
  await mutateCollection<OtpToken>("otpTokens", (rows) => [...rows, otp]);
  return otp;
}
