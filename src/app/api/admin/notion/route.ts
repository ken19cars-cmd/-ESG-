import { currentSession } from "@/lib/auth";
import { findMember } from "@/lib/members";
import { connectNotion, importMembersFromNotion, notionStatus, syncAllMembersToNotion } from "@/lib/notion-members";

async function requireAdmin() {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || member.role !== "admin") return null;
  return member;
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  return Response.json(notionStatus());
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "需要管理者登入。" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    token?: string;
    pageUrl?: string;
    action?: string;
  } | null;
  try {
    if (body?.action === "sync") {
      await importMembersFromNotion();
      const result = await syncAllMembersToNotion();
      return Response.json({ ...notionStatus(), ...result });
    }
    const token = body?.token?.trim() || process.env.NOTION_TOKEN || "";
    const pageUrl = body?.pageUrl?.trim() || process.env.NOTION_PARENT_PAGE_ID || process.env.NOTION_MEMBERS_DATABASE_ID || "";
    const config = await connectNotion(token, pageUrl);
    await syncAllMembersToNotion();
    return Response.json({
      ...notionStatus(),
      databaseId: config.databaseId,
      ok: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法連線 Notion。";
    return Response.json({ error: message, ...notionStatus() }, { status: 400 });
  }
}
