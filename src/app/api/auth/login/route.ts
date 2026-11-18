import { sessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { findMember, isPaid, publicMember } from "@/lib/members";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  const member = findMember(username);
  if (!member || !verifyPassword(password, member.passwordHash)) {
    return Response.json({ error: "帳號或密碼不正確。" }, { status: 401 });
  }
  return Response.json(
    { member: publicMember(member), paid: isPaid(member) },
    { headers: { "Set-Cookie": sessionCookie(signSession(member.username)) } },
  );
}
