export type ReportStyle = {
  font: string;
  header: string;
  headerText: string;
  accent: string[];
  paper: string;
  text: string;
  border: string;
  caption: string;
};

export const defaultReportStyle: ReportStyle = {
  font: "Microsoft JhengHei",
  header: "2C3B4E",
  headerText: "FFFFFF",
  accent: ["4A6B8A", "6B4A3A", "3A5A6B", "5A6B4A", "8A6B4A"],
  paper: "F4F6F8",
  text: "111111",
  border: "888888",
  caption: "2C3B4E",
};

const FONTS = ["Microsoft JhengHei", "PMingLiU", "DFKai-SB", "Microsoft YaHei"];

function hex(value: unknown, fallback: string) {
  const raw = String(value ?? "").replace("#", "").trim();
  return /^[0-9A-Fa-f]{6}$/.test(raw) ? raw.toUpperCase() : fallback;
}

export async function styleFromPrompt(prompt: string, imageDataUrl = ""): Promise<ReportStyle> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("尚未設定 OPENAI_API_KEY，無法依美編說明調整色調。請先在伺服器環境變數設定，或把美編說明與參考圖留白後匯出。");
  }
  const image = imageDataUrl.startsWith("data:image/") ? imageDataUrl : "";
  if (image.length > 2_500_000) {
    throw new Error("參考圖太大，請換一張較小的圖片。");
  }
  const text = prompt.trim().slice(0, 800) || "依照參考圖的主色、輔色與留白，決定報告書配色。";
  const userContent = image
    ? [
        { type: "text", text },
        { type: "image_url", image_url: { url: image } },
      ]
    : text;
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_STYLE_MODEL || "gpt-4o-mini";
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你只決定 Word 報告書的視覺樣式，不改任何數字。若有參考圖，依圖中的主色、輔色、底色取色，不要描述圖中的文字或數字。回傳 JSON：" +
            '{"font":"Microsoft JhengHei","header":"2C3B4E","headerText":"FFFFFF","accent":["4A6B8A","6B4A3A","3A5A6B","5A6B4A","8A6B4A"],"paper":"F4F6F8","text":"111111","border":"888888","caption":"2C3B4E"}。' +
            "font 只能是 Microsoft JhengHei、PMingLiU、DFKai-SB、Microsoft YaHei。顏色是六碼十六進位、不要 #。accent 必須五個顏色，用於圖表系列。對比要夠，淺底深字。",
        },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error("美編服務沒有回應，請稍後再匯出，或把美編說明留白。");
  }
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(content) as Partial<ReportStyle>;
  const accent = Array.isArray(parsed.accent) ? parsed.accent.map((item, i) => hex(item, defaultReportStyle.accent[i] ?? "4A6B8A")) : defaultReportStyle.accent;
  return {
    font: FONTS.includes(String(parsed.font)) ? String(parsed.font) : defaultReportStyle.font,
    header: hex(parsed.header, defaultReportStyle.header),
    headerText: hex(parsed.headerText, defaultReportStyle.headerText),
    accent: accent.slice(0, 5).concat(defaultReportStyle.accent).slice(0, 5),
    paper: hex(parsed.paper, defaultReportStyle.paper),
    text: hex(parsed.text, defaultReportStyle.text),
    border: hex(parsed.border, defaultReportStyle.border),
    caption: hex(parsed.caption, defaultReportStyle.caption),
  };
}
