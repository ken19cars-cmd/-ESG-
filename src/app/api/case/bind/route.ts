import { boundCaseCookie, currentSession } from "@/lib/auth";
import { getBoundCase, isIndustryId, setBoundCase } from "@/lib/bound-case";
import { caseReady } from "@/lib/industry-rules";
import { findMember } from "@/lib/members";

export async function POST(req: Request) {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member) return Response.json({ error: "請先登入。" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    client?: string;
    industry?: string;
    capitalBillion?: number;
  } | null;
  const client = body?.client?.trim() ?? "";
  const industry = body?.industry ?? "";
  const capitalBillion = Number(body?.capitalBillion);
  if (!isIndustryId(industry) || !caseReady(client, "2025", capitalBillion, industry)) {
    return Response.json({ error: "請先填入公司名稱、選擇產業、輸入資本額（大於 0）。" }, { status: 400 });
  }
  try {
    const bound = setBoundCase(member.username, {
      client,
      industry,
      capitalBillion,
      at: Date.now(),
    });
    return Response.json(
      { bound },
      { headers: { "Set-Cookie": boundCaseCookie({ u: member.username, ...bound }) } },
    );
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? Number(error.status) : 400;
    const message = error instanceof Error ? error.message : "無法綁定案件。";
    return Response.json({ error: message }, { status: status || 400 });
  }
}

export async function GET() {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member) return Response.json({ error: "請先登入。" }, { status: 401 });
  return Response.json({ bound: getBoundCase(member.username) });
}
