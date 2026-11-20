import { hashPassword } from "@/lib/auth";
import { currentSession } from "@/lib/auth";
import { setIssuedPassword } from "@/lib/member-credentials";
import { findMember, listMembers, memberQuota, publicMember, saveMembers, type Member } from "@/lib/members";
import { importMembersFromNotion, upsertMemberToNotion } from "@/lib/notion-members";

async function requireAdmin() {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || member.role !== "admin") return null;
  return member;
}

function memberRow(member: Member) {
  const cases = member.boundCases?.length ? member.boundCases : member.boundCase ? [member.boundCase] : [];
  return {
    ...publicMember(member),
    displayName: member.displayName || "",
    companyQuota: memberQuota(member),
    boundUsed: cases.length,
    boundClient: cases.map((item) => item.client).join("、"),
  };
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  try {
    await importMembersFromNotion().catch(() => null);
    return Response.json({
      members: listMembers().map(memberRow),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法讀取會員";
    return Response.json({ error: message, members: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Partial<Member> & { password?: string } | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  if (!username || password.length < 8) {
    return Response.json({ error: "帳號必填，密碼至少 8 碼。" }, { status: 400 });
  }
  const members = listMembers();
  if (members.some((item) => item.username === username)) {
    return Response.json({ error: "這個帳號已經存在。" }, { status: 400 });
  }
  const quota = Math.max(1, Math.floor(Number(body?.companyQuota) || 1));
  const next: Member = {
    username,
    passwordHash: hashPassword(password),
    company: body?.company?.trim() || username,
    taxId: body?.taxId?.trim() || "",
    role: "member",
    plan: body?.plan === "paid" ? "paid" : "free",
    paidUntil: body?.plan === "paid" ? body?.paidUntil || "" : "",
    displayName: body?.displayName?.trim() || "",
    companyQuota: quota,
  };
  try {
    saveMembers([...members, next]);
    setIssuedPassword(username, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法儲存會員。";
    return Response.json({ error: message }, { status: 501 });
  }
  await upsertMemberToNotion(next).catch(() => null);
  return Response.json({ member: memberRow(next) });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    username?: string;
    plan?: string;
    paidUntil?: string;
    displayName?: string;
    company?: string;
    companyQuota?: number;
    password?: string;
    clearBoundCase?: boolean;
  } | null;
  const username = body?.username?.trim() ?? "";
  const members = listMembers();
  const index = members.findIndex((item) => item.username === username);
  if (index < 0) return Response.json({ error: "找不到這個帳號。" }, { status: 404 });
  const current = members[index];
  if (body?.clearBoundCase) {
    const { clearBoundCase } = await import("@/lib/bound-case");
    clearBoundCase(username);
    const unlocked = findMember(username) ?? { ...current, boundCase: null, boundCases: [] };
    await upsertMemberToNotion(unlocked).catch(() => null);
    return Response.json({ member: memberRow(unlocked) });
  }
  if (current.role === "admin") return Response.json({ error: "不能改管理者自己的方案。" }, { status: 400 });
  const plan = body?.plan === "paid" ? "paid" : body?.plan === "free" ? "free" : current.plan;
  const quotaRaw = body?.companyQuota;
  const quota = quotaRaw === undefined ? memberQuota(current) : Math.max(1, Math.floor(Number(quotaRaw) || 1));
  const password = body?.password?.trim() || "";
  members[index] = {
    ...current,
    plan,
    paidUntil: plan === "paid" ? body?.paidUntil || current.paidUntil : "",
    displayName: body?.displayName === undefined ? current.displayName : body.displayName.trim(),
    company: body?.company === undefined ? current.company : body.company.trim() || current.company,
    companyQuota: quota,
    ...(password.length >= 8 ? { passwordHash: hashPassword(password) } : {}),
  };
  try {
    saveMembers(members);
    if (password.length >= 8) setIssuedPassword(username, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法儲存會員。";
    return Response.json({ error: message }, { status: 501 });
  }
  await upsertMemberToNotion(members[index]).catch(() => null);
  return Response.json({ member: memberRow(members[index]) });
}
