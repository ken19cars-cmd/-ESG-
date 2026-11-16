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

function cell(text: string, header = false, widthPct = 25) {
  return new TableCell({
    borders: BORDERS,
    shading: header ? { fill: NAVY } : { fill: "F4F6F8" },
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [run(text, { bold: header, color: header ? "FFFFFF" : "111111", size: 18 })],
      }),
    ],
  });
}

function table(headers: string[], rows: string[][], widths?: number[]) {
  const w = widths ?? headers.map(() => Math.round(100 / headers.length));
  return new Table({
    width: { size: 72, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h, i) => cell(h, true, w[i])) }),
      ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, false, w[i])) })),
    ],
  });
}

function cap(text: string) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [run(text, { bold: true, size: 20, color: NAVY })],
  });
}

export async function buildReportDocx(inputs: Inputs) {
  const d = derived(inputs);
  const result = compute(inputs);
  const blocks = reportDraft(d, result.metrics);
  const index = griIndex(result.metrics);
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
    p("附錄、GRI 內容索引"),
    p("一、關於本報告書", { heading: HeadingLevel.HEADING_1 }),
    cap("表　報導基礎"),
    table(
      ["項目", "內容"],
      [
        ["組織名稱", d.client],
        ["報導期間", `${d.year}年1月1日至12月31日`],
        ["依循準則", "GRI Standards 2021；上市櫃公司編製與申報永續報告書作業辦法"],
      ],
      [28, 72],
    ),
  ];

  const yearCol = `${d.year}年`;
  for (const block of blocks.filter((b) => b.chapter !== "關於本報告書")) {
    children.push(p(block.chapter, { heading: HeadingLevel.HEADING_1 }));
    children.push(cap(`表　${block.chapter.replace(/^\d+\s/, "")}`));
    children.push(
      table(
        ["項目", yearCol],
        block.rows.map((r) => [r.unit && r.unit !== "—" ? `${r.name}(${r.unit})` : r.name, r.value]),
        [70, 30],
      ),
    );
    if (block.chapter.startsWith("5 環境—能源") && s1 + s2 > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [
            new ChartRun({
              type: "pie",
              title: "",
              font: { name: FONT },
              categories: ["範疇一", "範疇二"],
              series: [{ name: "公噸CO2e", values: [s1, s2], color: "6B4A3A" }],
              transformation: { width: 320, height: 200 },
            }),
          ],
        }),
      );
      children.push(cap("圖　範疇一與範疇二排放結構"));
    }
  }

  children.push(p("附錄、GRI 內容索引", { heading: HeadingLevel.HEADING_1 }));
  children.push(cap("表A-1　GRI內容索引"));
  children.push(
    table(
      ["GRI準則", "揭露項目", "章節"],
      index.filter((r) => r.gri.startsWith("GRI") || r.gri.startsWith("金管會") || r.gri.startsWith("證交法")).map((r) => [r.gri, r.topic, r.chapter]),
      [28, 44, 28],
    ),
  );

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
