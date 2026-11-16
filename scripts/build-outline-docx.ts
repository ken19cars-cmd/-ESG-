import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  PageOrientation,
  Paragraph,
  SectionType,
  TableOfContents,
  TextRun,
  VerticalAlignSection,
  convertMillimetersToTwip,
} from "docx";

const FONT = "Microsoft JhengHei";
const NAVY = "2C3B4E";

type Node = { title: string; children?: Node[] };

const outline: Node[] = [
  {
    title: "關於本報告書",
    children: [
      { title: "編撰原則與依循準則" },
      { title: "報導期間與發行週期" },
      { title: "報導邊界與範疇" },
      { title: "資訊重編" },
      { title: "內部審閱" },
      { title: "外部確信" },
      { title: "聯絡窗口" },
    ],
  },
  {
    title: "經營者的話",
    children: [{ title: "當年度策略與承諾" }, { title: "下一年度重點" }],
  },
  {
    title: "年度永續績效亮點",
    children: [
      { title: "治理" },
      { title: "環境" },
      { title: "社會" },
      { title: "外部肯定" },
    ],
  },
  {
    title: "第1章　永續治理與策略",
    children: [
      {
        title: "1.1 組織概況",
        children: [
          { title: "1.1.1 公司簡介與沿革" },
          { title: "1.1.2 產品、服務與價值鏈" },
          { title: "1.1.3 營運與財務績效" },
          { title: "1.1.4 外部倡議與公協會" },
        ],
      },
      {
        title: "1.2 永續治理架構",
        children: [
          { title: "1.2.1 董事會監督" },
          { title: "1.2.2 永續委員會" },
          { title: "1.2.3 策略藍圖與目標" },
        ],
      },
      {
        title: "1.3 重大主題與利害關係人",
        children: [
          { title: "1.3.1 利害關係人鑑別" },
          { title: "1.3.2 議合管道" },
          { title: "1.3.3 重大主題鑑別" },
          { title: "1.3.4 重大主題清單與管理方針" },
        ],
      },
    ],
  },
  {
    title: "第2章　公司治理與誠信經營",
    children: [
      {
        title: "2.1 公司治理",
        children: [
          { title: "2.1.1 治理架構" },
          { title: "2.1.2 董事會" },
          { title: "2.1.3 功能性委員會" },
        ],
      },
      {
        title: "2.2 誠信經營與法規遵循",
        children: [
          { title: "2.2.1 誠信經營" },
          { title: "2.2.2 反貪腐" },
          { title: "2.2.3 法令遵循" },
        ],
      },
      {
        title: "2.3 風險管理與內控",
        children: [
          { title: "2.3.1 風險管理" },
          { title: "2.3.2 內部控制" },
          { title: "2.3.3 資訊安全" },
        ],
      },
      { title: "2.4 稅務治理" },
    ],
  },
  {
    title: "第3章　氣候、能源與環境",
    children: [
      {
        title: "3.1 氣候治理",
        children: [
          { title: "3.1.1 治理" },
          { title: "3.1.2 策略" },
          { title: "3.1.3 風險管理" },
          { title: "3.1.4 指標與目標" },
        ],
      },
      {
        title: "3.2 溫室氣體",
        children: [
          { title: "3.2.1 盤查邊界與方法學" },
          { title: "3.2.2 Scope 1／2／3" },
          { title: "3.2.3 密集度與減量" },
        ],
      },
      {
        title: "3.3 能源管理",
        children: [
          { title: "3.3.1 能源消耗" },
          { title: "3.3.2 能源密集度" },
          { title: "3.3.3 再生能源與節能" },
        ],
      },
      {
        title: "3.4 水資源、廢棄物與污染防治",
        children: [
          { title: "3.4.1 水資源" },
          { title: "3.4.2 廢棄物" },
          { title: "3.4.3 污染防治" },
        ],
      },
      {
        title: "3.5 綠色產品與場域",
        children: [
          { title: "3.5.1 綠建築與健康建築" },
          { title: "3.5.2 低碳工法與循環材料" },
          { title: "3.5.3 基地台與電磁波管理" },
        ],
      },
    ],
  },
  {
    title: "第4章　產品品質、顧客與供應鏈",
    children: [
      {
        title: "4.1 產品與服務",
        children: [
          { title: "4.1.1 品質與安全" },
          { title: "4.1.2 研發與創新" },
          { title: "4.1.3 顧客健康與安全" },
        ],
      },
      {
        title: "4.2 顧客關係",
        children: [
          { title: "4.2.1 行銷與標示" },
          { title: "4.2.2 售後服務" },
          { title: "4.2.3 租戶與客戶關係" },
        ],
      },
      {
        title: "4.3 永續供應鏈",
        children: [
          { title: "4.3.1 供應商管理" },
          { title: "4.3.2 環境評估" },
          { title: "4.3.3 社會評估" },
          { title: "4.3.4 在地採購與綠色採購" },
        ],
      },
    ],
  },
  {
    title: "第5章　員工、人權與職業安全",
    children: [
      {
        title: "5.1 人力結構與勞動條件",
        children: [
          { title: "5.1.1 員工組成" },
          { title: "5.1.2 多元化與平等機會" },
          { title: "5.1.3 薪酬" },
          { title: "5.1.4 福利與勞資溝通" },
          { title: "5.1.5 團體協約" },
        ],
      },
      {
        title: "5.2 人才培育",
        children: [
          { title: "5.2.1 訓練" },
          { title: "5.2.2 職能發展與績效考核" },
        ],
      },
      {
        title: "5.3 人權管理",
        children: [{ title: "5.3.1 人權政策與申訴" }],
      },
      {
        title: "5.4 職業安全衛生",
        children: [
          { title: "5.4.1 職安衛管理系統" },
          { title: "5.4.2 危害辨識與健康促進" },
          { title: "5.4.3 職業傷害統計" },
        ],
      },
    ],
  },
  {
    title: "第6章　社會參與與社區",
    children: [
      { title: "6.1 社會關懷" },
      { title: "6.2 社區關係" },
      { title: "6.3 教育、文化與公共參與" },
    ],
  },
  {
    title: "附錄",
    children: [
      { title: "附錄一　GRI 內容索引" },
      { title: "附錄二　SASB 內容索引" },
      { title: "附錄三　TCFD 對照" },
      { title: "附錄四　SDGs 對照表" },
      { title: "附錄五　確信項目彙總表" },
      { title: "附錄六　確信報告" },
      { title: "附錄七　溫室氣體盤查聲明" },
      { title: "附錄八　重大主題補充資料" },
    ],
  },
];

function headingLevel(depth: number) {
  if (depth === 0) return HeadingLevel.HEADING_1;
  if (depth === 1) return HeadingLevel.HEADING_2;
  return HeadingLevel.HEADING_3;
}

function tocEntries(nodes: Node[], depth = 0): { title: string; level: number }[] {
  const out: { title: string; level: number }[] = [];
  for (const n of nodes) {
    out.push({ title: n.title, level: depth + 1 });
    if (n.children) out.push(...tocEntries(n.children, depth + 1));
  }
  return out;
}

function headings(nodes: Node[], depth = 0): Paragraph[] {
  const out: Paragraph[] = [];
  for (const n of nodes) {
    out.push(
      new Paragraph({
        heading: headingLevel(depth),
        children: [new TextRun({ text: n.title, font: FONT })],
      }),
    );
    if (n.children) out.push(...headings(n.children, depth + 1));
  }
  return out;
}

const pageSize = {
  // docx 在 landscape 時會對調寬高：此處傳 A3 直式尺寸，寫入後為 420×297 橫式
  width: convertMillimetersToTwip(297),
  height: convertMillimetersToTwip(420),
  orientation: PageOrientation.LANDSCAPE,
};

const pageMargin = {
  top: convertMillimetersToTwip(16),
  bottom: convertMillimetersToTwip(16),
  left: convertMillimetersToTwip(20),
  right: convertMillimetersToTwip(20),
};

function sectionProps(extra: { type?: (typeof SectionType)[keyof typeof SectionType]; verticalAlign?: (typeof VerticalAlignSection)[keyof typeof VerticalAlignSection] } = {}) {
  return {
    type: extra.type,
    verticalAlign: extra.verticalAlign,
    page: { size: pageSize, margin: pageMargin },
  };
}

function footer() {
  return {
    default: new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22, color: "666666" })],
        }),
      ],
    }),
  };
}

function tocStyle(id: string, name: string, left: number) {
  return {
    id,
    name,
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    paragraph: {
      spacing: { after: 80 },
      indent: { left, right: 0 },
    },
    run: { font: FONT, size: 28 },
  };
}

async function main() {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 28 } } },
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          quickFormat: true,
          run: { font: FONT, size: 28 },
          paragraph: { spacing: { after: 120, line: 360 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { outlineLevel: 0, spacing: { before: 0, after: 200 } },
          run: { font: FONT, size: 48, bold: true, color: NAVY },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { outlineLevel: 1, spacing: { before: 240, after: 80 } },
          run: { font: FONT, size: 32, bold: true, color: "3D4F61" },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { outlineLevel: 2, spacing: { before: 120, after: 60 } },
          run: { font: FONT, size: 28, bold: true, color: "4A5A6A" },
        },
        tocStyle("TOC1", "TOC 1", 0),
        tocStyle("TOC2", "TOC 2", 360),
        tocStyle("TOC3", "TOC 3", 720),
      ],
    },
    sections: [
      {
        properties: sectionProps({ verticalAlign: VerticalAlignSection.CENTER }),
        footers: footer(),
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: "永續報告書", font: FONT, bold: true, size: 96, color: NAVY })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "組織名稱", font: FONT, size: 56, color: NAVY })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "報導年度", font: FONT, size: 56, color: NAVY })],
          }),
        ],
      },
      {
        properties: sectionProps({ type: SectionType.NEXT_PAGE, verticalAlign: VerticalAlignSection.TOP }),
        footers: footer(),
        children: [
          new Paragraph({
            spacing: { after: 240 },
            children: [new TextRun({ text: "目錄", font: FONT, bold: true, size: 48, color: NAVY })],
          }),
          new TableOfContents("目錄", {
            hyperlink: true,
            headingStyleRange: "1-3",
            beginDirty: true,
            cachedEntries: tocEntries(outline),
          }),
        ],
      },
      ...outline.map((chapter) => ({
        properties: sectionProps({ type: SectionType.NEXT_PAGE, verticalAlign: VerticalAlignSection.TOP }),
        footers: footer(),
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: chapter.title, font: FONT })],
          }),
          ...(chapter.children ? headings(chapter.children, 1) : []),
        ],
      })),
    ],
  });

  console.log("packing");
  const buf = await Packer.toBuffer(doc);
  console.log("packed", buf.length);
  const targets = [
    "C:\\Users\\K\\Projects\\hanxin-esg\\templates\\永續報告書大綱_A3橫式.docx",
    "D:\\110.03.02健翔\\作業參考資料\\ESG\\永續報告書刊物\\永續報告書大綱_A3橫式_新.docx",
  ];
  for (const p of targets) {
    mkdirSync(dirname(p), { recursive: true });
    try {
      writeFileSync(p, buf);
      console.log("OK", p, buf.length);
    } catch (e) {
      console.log("FAIL", p, (e as Error).message);
    }
  }
}

void main();
