import { defaultInputs, type Inputs } from "@/lib/esg-engine";
import { buildReportDocx, reportFileName } from "@/lib/report-docx";
import { defaultReportStyle, styleFromPrompt } from "@/lib/report-style";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Inputs> & { stylePrompt?: string };
  const stylePrompt = typeof body.stylePrompt === "string" ? body.stylePrompt.trim() : "";
  const { stylePrompt: _ignored, ...fields } = body;
  const inputs: Inputs = { ...defaultInputs, ...fields };
  let style = defaultReportStyle;
  if (stylePrompt) {
    try {
      style = await styleFromPrompt(stylePrompt);
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
