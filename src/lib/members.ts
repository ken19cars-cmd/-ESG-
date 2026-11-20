import { readFileSync, writeFileSync } from "fs";
import path from "path";

export type Member = {
  username: string;
  passwordHash: string;
  company: string;
  taxId: string;
  role: "admin" | "member";
  plan: "free" | "paid";
  paidUntil: string;
  boundCase?: {
    client: string;
    industry: string;
    capitalBillion: number;
    at: number;
  } | null;
};

const file = path.join(process.cwd(), "data", "members.json");

function fromEnv(): Member[] | null {
  const raw = process.env.MEMBERS_JSON;
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Member[];
  return Array.isArray(parsed) ? parsed : null;
}

export function listMembers(): Member[] {
  const env = fromEnv();
  if (env) return env;
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Member[];
  return Array.isArray(parsed) ? parsed : [];
}

export function findMember(username: string) {
  return listMembers().find((member) => member.username === username) ?? null;
}

export function isPaid(member: Pick<Member, "plan" | "paidUntil">) {
  if (member.plan !== "paid" || !member.paidUntil) return false;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
  return member.paidUntil >= today;
}

export function saveMembers(members: Member[]) {
  if (process.env.MEMBERS_JSON) {
    throw new Error("此環境的會員名單由 MEMBERS_JSON 提供，請改環境變數後重新部署。");
  }
  writeFileSync(file, JSON.stringify(members, null, 2), "utf8");
}

export function publicMember(member: Member) {
  return {
    username: member.username,
    company: member.company,
    taxId: member.taxId,
    role: member.role,
    plan: member.plan,
    paidUntil: member.paidUntil,
    paid: isPaid(member),
    boundClient: member.boundCase?.client || "",
  };
}
