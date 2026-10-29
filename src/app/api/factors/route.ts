import { auditOfficialFactors } from "@/lib/official-factors";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const year = url.searchParams.get("year") || "2025";
  const refrigerant = url.searchParams.get("refrigerant") || "R-134a";
  const audit = await auditOfficialFactors(year, refrigerant);
  return Response.json(audit);
}
