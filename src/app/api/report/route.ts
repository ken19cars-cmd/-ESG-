import { currentSession } from "@/lib/auth";
import { defaultInputs, type Inputs } from "@/lib/esg-engine";
import { findMember, isPaid } from "@/lib/members";
import { buildReportDocx, reportFileName } from "@/lib/report-docx";
import { defaultReportStyle, styleFromPrompt } from "@/lib/report-style";

export async function POST(req: Request) {
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member || !isPaid(member)) {
    return Response.json({ error: "需升級為訂閱會員。" }, { status: 402 });
  }
  const body = (await req.json().catch(() => ({}))) as Partial<Inputs> & { stylePrompt?: string; styleImage?: string };
  const stylePrompt = typeof body.stylePrompt === "string" ? body.stylePrompt.trim() : "";
  const styleImage = typeof body.styleImage === "string" ? body.styleImage : "";
  const { stylePrompt: _prompt, styleImage: _image, ...fields } = body;
  const inputs: Inputs = { ...defaultInputs, ...fields };
  let style = defaultReportStyle;
  if (stylePrompt || styleImage.startsWith("data:image/")) {
    try {
      style = await styleFromPrompt(stylePrompt, styleImage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "美編說明無法套用。";
      return Response.json({ error: message }, { status: 400 });
    }
  }
  const buffer = await buildReportDocx(inputs, style);
  const name = reportFileName(inputs);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
    },
  });
}
