import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { INDUSTRIES, type IndustryId } from "@/lib/industry-rules";
import { findMember, listMembers, memberQuota, saveMembers, type Member } from "@/lib/members";

type BoundCookie = {
  u: string;
  client: string;
  industry: string;
  capitalBillion: number;
  at: number;
};

export type BoundCase = {
  client: string;
  industry: IndustryId;
  capitalBillion: number;
  at: number;
};

type OverlayRow = { cases: BoundCase[] } | BoundCase | { cleared: true; at: number };
type Overlay = Record<string, OverlayRow>;

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

function casesFromRow(row: OverlayRow | undefined): BoundCase[] | "cleared" {
  if (!row) return [];
  if ("cleared" in row && row.cleared) return "cleared";
  if ("cases" in row && Array.isArray(row.cases)) {
    return row.cases.map(parseBoundCase).filter((item): item is BoundCase => Boolean(item));
  }
  const one = parseBoundCase(row);
  return one ? [one] : [];
}

export function getBoundClearedAt(username: string) {
  const row = readOverlay()[username];
  if (row && "cleared" in row && row.cleared) return row.at;
  return 0;
}

export function getBoundCases(username: string): BoundCase[] {
  const fromFile = casesFromRow(readOverlay()[username]);
  if (fromFile === "cleared") return [];
  if (fromFile.length) return fromFile;
  const member = findMember(username);
  const listed = (member?.boundCases || []).map(parseBoundCase).filter((item): item is BoundCase => Boolean(item));
  if (listed.length) return listed;
  const legacy = parseBoundCase(member?.boundCase);
  return legacy ? [legacy] : [];
}

export function getBoundCase(username: string): BoundCase | null {
  const cases = getBoundCases(username);
  return cases[cases.length - 1] ?? null;
}

export function resolveBoundCase(username: string, cookie: BoundCookie | null): BoundCase | null {
  const cases = getBoundCases(username);
  if (cookie?.u === username) {
    const hit = cases.find((item) => item.client === cookie.client);
    if (hit) return hit;
  }
  if (cases.length) return cases[cases.length - 1] ?? null;
  const clearedAt = getBoundClearedAt(username);
  if (!cookie || cookie.u !== username || cookie.at <= clearedAt) return null;
  return parseBoundCase(cookie);
}

export function setBoundCase(username: string, bound: BoundCase) {
  const member = findMember(username);
  if (!member) throw Object.assign(new Error("請先登入。"), { status: 401 });
  const current = getBoundCases(username);
  const index = current.findIndex((item) => item.client === bound.client);
  if (index >= 0) {
    current[index] = bound;
  } else if (member.role !== "admin" && current.length >= memberQuota(member)) {
    throw Object.assign(new Error("本帳號開通數量已滿，不得再新增受評公司。"), { status: 409 });
  } else {
    current.push(bound);
  }
  const overlay = readOverlay();
  overlay[username] = { cases: current };
  try {
    writeOverlay(overlay);
  } catch {
    /* Vercel 等唯讀檔案系統時改以 cookie 保存。 */
  }
  try {
    const members = listMembers();
    const memberIndex = members.findIndex((item) => item.username === username);
    if (memberIndex >= 0) {
      const next: Member = {
        ...members[memberIndex],
        boundCase: bound,
        boundCases: current,
      };
      members[memberIndex] = next;
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
      const { boundCase: _one, boundCases: _many, ...rest } = members[index];
      members[index] = rest;
      saveMembers(members);
    }
  } catch {
    /* ignore */
  }
}
