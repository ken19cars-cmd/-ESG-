import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { BoundCookie } from "@/lib/auth";
import { INDUSTRIES, type IndustryId } from "@/lib/industry-rules";
import { findMember, listMembers, saveMembers, type Member } from "@/lib/members";

export type BoundCase = {
  client: string;
  industry: IndustryId;
  capitalBillion: number;
  at: number;
};

type Overlay = Record<string, BoundCase | { cleared: true; at: number }>;

const file = path.join(process.cwd(), "data", "bound-cases.json");

function readOverlay(): Overlay {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Overlay;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverlay(overlay: Overlay) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(overlay, null, 2), "utf8");
}

export function isIndustryId(value: string): value is IndustryId {
  return INDUSTRIES.some((item) => item.id === value);
}

export function parseBoundCase(raw: unknown): BoundCase | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<BoundCase>;
  if (!row.client?.trim() || !row.industry || !isIndustryId(row.industry)) return null;
  if (!(Number(row.capitalBillion) > 0)) return null;
  return {
    client: row.client.trim(),
    industry: row.industry,
    capitalBillion: Number(row.capitalBillion),
    at: Number(row.at) || Date.now(),
  };
}

export function getBoundClearedAt(username: string) {
  const row = readOverlay()[username];
  if (row && "cleared" in row && row.cleared) return row.at;
  return 0;
}

export function getBoundCase(username: string): BoundCase | null {
  const row = readOverlay()[username];
  if (row && "cleared" in row && row.cleared) return null;
  const fromFile = parseBoundCase(row);
  if (fromFile) return fromFile;
  return parseBoundCase(findMember(username)?.boundCase);
}

export function resolveBoundCase(username: string, cookie: BoundCookie | null): BoundCase | null {
  const fromStore = getBoundCase(username);
  if (fromStore) return fromStore;
  const clearedAt = getBoundClearedAt(username);
  if (!cookie || cookie.u !== username || cookie.at <= clearedAt) return null;
  return parseBoundCase(cookie);
}

export function setBoundCase(username: string, bound: BoundCase) {
  const member = findMember(username);
  if (!member) throw Object.assign(new Error("請先登入。"), { status: 401 });
  const current = getBoundCase(username);
  if (member.role !== "admin" && current && current.client !== bound.client) {
    throw Object.assign(new Error("本帳號已綁定受評公司，不得更改。"), { status: 409 });
  }
  const overlay = readOverlay();
  overlay[username] = bound;
  try {
    writeOverlay(overlay);
  } catch {
    /* Vercel 等唯讀檔案系統時改以 cookie 保存。 */
  }
  try {
    const members = listMembers();
    const index = members.findIndex((item) => item.username === username);
    if (index >= 0) {
      const next: Member = { ...members[index], boundCase: bound };
      members[index] = next;
      saveMembers(members);
    }
  } catch {
    /* MEMBERS_JSON 環境無法回寫會員檔。 */
  }
  return bound;
}

export function clearBoundCase(username: string) {
  const overlay = readOverlay();
  overlay[username] = { cleared: true, at: Date.now() };
  try {
    writeOverlay(overlay);
  } catch {
    /* ignore */
  }
  try {
    const members = listMembers();
    const index = members.findIndex((item) => item.username === username);
    if (index >= 0) {
      const { boundCase: _removed, ...rest } = members[index];
      members[index] = rest;
      saveMembers(members);
    }
  } catch {
    /* ignore */
  }
}
