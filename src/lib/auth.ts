import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "esg_session";
const DAY = 60 * 60 * 24;

function secret() {
  return process.env.SESSION_SECRET || "hanxin-esg-session-v1";
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${key}`;
}

export function verifyPassword(password: string, stored: string) {
  const [kind, salt, key] = stored.split("$");
  if (kind !== "scrypt" || !salt || !key) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(key, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export type Session = { username: string; exp: number };

export function signSession(username: string) {
  const payload: Session = { username, exp: Date.now() + 14 * DAY * 1000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSessionToken(token: string | undefined | null): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (!payload.username || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function currentSession() {
  const jar = await cookies();
  return readSessionToken(jar.get(COOKIE)?.value);
}

export function sessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${14 * DAY}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

const BOUND_COOKIE = "esg_bound";

export type BoundCookie = {
  u: string;
  client: string;
  industry: string;
  capitalBillion: number;
  at: number;
};

function signToken(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function readToken<T>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

export function boundCaseCookie(payload: BoundCookie) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${BOUND_COOKIE}=${signToken(payload)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${400 * DAY}${secure}`;
}

export async function readBoundCookie(): Promise<BoundCookie | null> {
  const jar = await cookies();
  const payload = readToken<BoundCookie>(jar.get(BOUND_COOKIE)?.value);
  if (!payload?.u || !payload.client || !payload.industry || !(payload.capitalBillion > 0)) return null;
  return payload;
}

export function clearBoundCaseCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${BOUND_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}
