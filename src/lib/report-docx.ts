import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { ChartRun } from "docx/charts";
import { compute, derived, type Inputs } from "@/lib/esg-engine";
import { griIndex, reportDraft } from "@/lib/report-draft";

const FONT = "Microsoft JhengHei";
const NAVY = "2C3B4E";
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "888888" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function run(text: string, opts: { bold?: boolean; size?: number; color?: string } = {}) {
  return new TextRun({ text, font: FONT, bold: opts.bold, size: opts.size ?? 22, color: opts.color });
}

function p(text: string, opts?: { heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel]; center?: boolean }) {
  return new Paragraph({
    heading: opts?.heading,
    alignment: opts?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 160 },
    children: [run(text, { bold: Boolean(opts?.heading), size: opts?.heading ? 28 : 22 })],
  });
}

function cell(text: string, header = false) {
  return new TableCell({
    borders: BORDERS,
    shading: header ? { fill: NAVY } : undefined,
    width: { size: 25, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [run(text, { bold: header, color: header ? "FFFFFF" : "111111", size: 20 })],
      }),
    ],
  });
}

function table(headers: string[], rows: string[][]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => cell(h, true)) }),
      ...rows.map((r) => new TableRow({ children: r.map((c) => cell(c)) })),
    ],
  });
}

function nums(metrics: ReturnType<typeof compute>["metrics"], ids: string[]) {
  return ids.map((id) => {
    const m = metrics.find((x) => x.id === id);
    const v = m && Number.isFinite(m.raw) ? m.raw : 0;
    return { name: m?.name ?? id, value: v };
  });
}

function bar(title: string, items: { name: string; value: number }[]) {
  const rows = items.filter((x) => Number.isFinite(x.value));
  if (rows.length === 0) return p("（無數值）");
  return new Paragraph({
    spacing: { before: 120, after: 200 },
    children: [
      new ChartRun({
        type: "bar",
        title,
        legend: false,
        font: { name: FONT },
        categories: rows.map((r) => r.name),
        series: [{ name: "數值", values: rows.map((r) => r.value), color: "4A6B8A" }],
        transformation: { width: 540, height: Math.min(420, 80 + rows.length * 28) },
      }),
    ],
  });
}

export async function buildReportDocx(inputs: Inputs) {
  const d = derived(inputs);
  const result = compute(inputs);
  const blocks = reportDraft(d, result.metrics);
  const index = griIndex(result.metrics);
  const env = nums(result.metrics, ["s1", "s2", "int", "ren", "en"]);
  const water = nums(result.metrics, ["wint", "wuse", "rec", "haz"]);
  const social = nums(result.metrics, ["turn", "hire", "tr", "fr", "sr", "trir", "par", "fm"]);
  const gov = nums(result.metrics, ["ind", "att", "ac", "rev", "ek", "eh", "pay"]);
  const s1 = Math.max(0, result.metrics.find((m) => m.id === "s1")?.raw ?? 0);
  const s2 = Math.max(0, result.metrics.find((m) => m.id === "s2")?.raw ?? 0);

  const children = [
    p(`${d.client}`, { center: true, heading: HeadingLevel.TITLE }),
    p(`${d.year} 永續報告書　績效底稿`, { center: true, heading: HeadingLevel.HEADING_1 }),
    p("翰欣科技 ESG 計算系統　依 GRI Standards 2021、上市櫃永續報告書作業辦法運算"),
    p("目錄", { heading: HeadingLevel.HEADING_1 }),
    p("一、關於本報告書"),
    p("二、環境績效"),
    p("三、社會績效"),
    p("四、治理與薪酬"),
    p("五、勾稽結果"),
    p("附錄、GRI 內容索引（績效項）"),
    p("一、關於本報告書", { heading: HeadingLevel.HEADING_1 }),
    table(
      ["項目", "內容", "對應"],
      [
        ["組織名稱", d.client, "GRI 2-1"],
        ["報導期間", `${d.year}年1月1日至12月31日`, "GRI 2-3"],
        ["依循準則", "GRI Standards 2021；上市櫃公司編製與申報永續報告書作業辦法", "GRI 1"],
      ],
    ),
  ];

  for (const block of blocks.filter((b) => b.chapter !== "關於本報告書")) {
    children.push(p(block.chapter, { heading: HeadingLevel.HEADING_1 }));
    children.push(p(block.gri));
    children.push(table(["項目", "數值", "單位", "對應"], block.rows.map((r) => [r.name, r.value, r.unit, r.gri])));
    if (block.chapter.startsWith("5 環境—能源")) {
      children.push(bar("環境指標", env));
      if (s1 + s2 > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 200 },
            children: [
              new ChartRun({
                type: "pie",
                title: "Scope 1／2 結構（tCO2e）",
                font: { name: FONT },
                categories: ["Scope 1", "Scope 2"],
                series: [{ name: "tCO2e", values: [s1, s2] }],
                transformation: { width: 480, height: 280 },
              }),
            ],
          }),
        );
      }
    }
    if (block.chapter.startsWith("5 環境—水")) children.push(bar("水與廢棄物指標", water));
    if (block.chapter.startsWith("6 社會—人力")) children.push(bar("社會／職安指標", social));
    if (block.chapter.startsWith("4 治理—薪酬")) children.push(bar("治理／薪酬指標", gov));
  }

  children.push(p("五、勾稽結果", { heading: HeadingLevel.HEADING_1 }));
  children.push(
    table(
      ["等級", "項目", "說明", "依據"],
      result.checks.map((c) => [c.level, c.title, c.detail, c.basis]),
    ),
  );
  children.push(p("附錄、GRI 內容索引（績效項）", { heading: HeadingLevel.HEADING_1 }));
  children.push(table(["揭露", "主題", "數值", "章節"], index.map((r) => [r.gri, r.topic, r.value, r.chapter])));

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
        headers: {
          default: new Header({
            children: [new Paragraph({ children: [run(`${d.client}　${d.year} 永續報告書底稿`, { size: 18, color: "555555" })] })],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [run("翰欣科技 ESG 計算系統　", { size: 16, color: "555555" }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16 })],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export function reportFileName(inputs: Inputs) {
  const name = `${inputs.client}_${inputs.year}_永續報告書底稿.docx`.replace(/[\\/:*?"<>|]/g, "");
  return name;
}
