import { currentSession } from "@/lib/auth";
import { fieldSource } from "@/lib/field-sources";
import { findMember, isPaid } from "@/lib/members";

export async function GET(req: Request) {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || !isPaid(member)) {
    return Response.json({ error: "需升級為訂閱會員。" }, { status: 402 });
  }
  const gri = new URL(req.url).searchParams.get("gri") ?? "";
  const why = new URL(req.url).searchParams.get("why") ?? "";
  const source = fieldSource(gri, why);
  return Response.json({ blocks: source.blocks, english: source.english });
}
