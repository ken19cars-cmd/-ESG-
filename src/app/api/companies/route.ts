import { currentSession } from "@/lib/auth";
import { searchCompanies, warmCompanyCache } from "@/lib/company-search";
import { findMember } from "@/lib/members";

warmCompanyCache();

export async function GET(req: Request) {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member) {
    return Response.json({ error: "請先登入。" }, { status: 401 });
  }
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const result = await searchCompanies(q);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
