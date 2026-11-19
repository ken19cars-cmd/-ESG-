import { currentSession } from "@/lib/auth";
import { findMember, isPaid } from "@/lib/members";
import { auditOfficialFactors } from "@/lib/official-factors";

export async function GET(req: Request) {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || !isPaid(member)) {
    return Response.json({ error: "需升級為訂閱會員。" }, { status: 402 });
  }
  const url = new URL(req.url);
  const year = url.searchParams.get("year") || "2025";
  const refrigerant = url.searchParams.get("refrigerant") || "R-134a";
  const audit = await auditOfficialFactors(year, refrigerant);
  return Response.json(audit);
}
