import { defaultInputs, type Inputs } from "@/lib/esg-engine";
import { buildReportDocx, reportFileName } from "@/lib/report-docx";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Inputs>;
  const inputs: Inputs = { ...defaultInputs, ...body };
  const buffer = await buildReportDocx(inputs);
  const name = reportFileName(inputs);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
    },
  });
}
