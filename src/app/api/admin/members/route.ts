import { hashPassword } from "@/lib/auth";
import { currentSession } from "@/lib/auth";
import { clearBoundCase, getBoundCase } from "@/lib/bound-case";
import { findMember, listMembers, publicMember, saveMembers, type Member } from "@/lib/members";

async function requireAdmin() {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || member.role !== "admin") return null;
  return member;
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  return Response.json({
    members: listMembers().map((member) => ({
      ...publicMember(member),
      boundClient: getBoundCase(member.username)?.client || "",
    })),
  });
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
  const next: Member = {
    username,
    passwordHash: hashPassword(password),
    company: body?.company?.trim() || username,
    taxId: body?.taxId?.trim() || "",
    role: "member",
    plan: body?.plan === "paid" ? "paid" : "free",
    paidUntil: body?.plan === "paid" ? body?.paidUntil || "" : "",
  };
  try {
    saveMembers([...members, next]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法儲存會員。";
    return Response.json({ error: message }, { status: 501 });
  }
  return Response.json({ member: publicMember(next) });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    username?: string;
    plan?: string;
    paidUntil?: string;
    clearBoundCase?: boolean;
  } | null;
  const username = body?.username?.trim() ?? "";
  const members = listMembers();
  const index = members.findIndex((item) => item.username === username);
  if (index < 0) return Response.json({ error: "找不到這個帳號。" }, { status: 404 });
  const current = members[index];
  if (body?.clearBoundCase) {
    clearBoundCase(username);
    return Response.json({
      member: { ...publicMember(findMember(username) ?? current), boundClient: "" },
    });
  }
  if (current.role === "admin") return Response.json({ error: "不能改管理者自己的方案。" }, { status: 400 });
  const plan = body?.plan === "paid" ? "paid" : "free";
  members[index] = {
    ...current,
    plan,
    paidUntil: plan === "paid" ? body?.paidUntil || current.paidUntil : "",
  };
  try {
    saveMembers(members);
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法儲存會員。";
    return Response.json({ error: message }, { status: 501 });
  }
  return Response.json({ member: publicMember(members[index]) });
}
