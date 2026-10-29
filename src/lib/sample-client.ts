export const years = ["2022", "2023", "2024", "2025"] as const;
export type Year = (typeof years)[number];

export type YearSlice = {
  scores: { overall: number; e: number; s: number; g: number };
  financial: { label: string; value: string; hint: string; key: "fin" | "map" | "score" }[];
  environment: { name: string; value: number; unit: string; yoy: number; target: string; bar: number }[];
  social: { name: string; value: string; note: string }[];
  governance: { name: string; value: string; status: string }[];
};

export const clientMeta = {
  name: "綠能精密股份有限公司",
  ticker: "示範 4808",
  industry: "電子零組件",
};

export const yearData: Record<Year, YearSlice> = {
  "2022": {
    scores: { overall: 68, e: 61, s: 70, g: 72 },
    financial: [
      { label: "營業收入", value: "107.2 億", hint: "年增 2.1%", key: "fin" },
      { label: "稅後淨利", value: "6.4 億", hint: "淨利率 6.0%", key: "fin" },
      { label: "研發費用", value: "3.5 億", hint: "占營收 3.3%", key: "map" },
      { label: "綠色資本支出", value: "0.7 億", hint: "設備汰換啟動", key: "map" },
    ],
    environment: [
      { name: "溫室氣體排放強度", value: 4.1, unit: "tCO2e / 百萬營收", yoy: -1.2, target: "基準年", bar: 48 },
      { name: "再生能源使用占比", value: 12, unit: "%", yoy: 1.0, target: "2027 達 40%", bar: 12 },
      { name: "用水密集度", value: 1.7, unit: "千噸 / 百萬營收", yoy: -0.4, target: "維持下降", bar: 42 },
      { name: "廢棄物回收率", value: 74, unit: "%", yoy: 0.8, target: "2026 達 85%", bar: 74 },
    ],
    social: [
      { name: "員工流動率", value: "14.8%", note: "接近同業中位數" },
      { name: "職安事件", value: "1 件", note: "已結案改善" },
      { name: "人均訓練時數", value: "18 小時", note: "內控課程為主" },
      { name: "供應商評鑑覆蓋", value: "72%", note: "關鍵供應商 80%" },
    ],
    governance: [
      { name: "獨立董事席次", value: "2 / 7", status: "待強化" },
      { name: "董事會出席率", value: "91%", status: "符合" },
      { name: "功能性委員會", value: "審計 / 薪酬", status: "建置中" },
      { name: "關係人交易揭露", value: "已揭露", status: "查核通過" },
      { name: "內部控制聲明", value: "改善事項 2 項", status: "追蹤中" },
      { name: "誠信經營訓練", value: "86% 完成", status: "進行中" },
    ],
  },
  "2023": {
    scores: { overall: 72, e: 66, s: 74, g: 75 },
    financial: [
      { label: "營業收入", value: "114.8 億", hint: "年增 7.1%", key: "fin" },
      { label: "稅後淨利", value: "7.3 億", hint: "淨利率 6.4%", key: "fin" },
      { label: "研發費用", value: "3.9 億", hint: "占營收 3.4%", key: "map" },
      { label: "綠色資本支出", value: "1.0 億", hint: "產線節能", key: "map" },
    ],
    environment: [
      { name: "溫室氣體排放強度", value: 3.8, unit: "tCO2e / 百萬營收", yoy: -7.3, target: "較基準年下降 8%", bar: 55 },
      { name: "再生能源使用占比", value: 18, unit: "%", yoy: 6.0, target: "2027 達 40%", bar: 18 },
      { name: "用水密集度", value: 1.6, unit: "千噸 / 百萬營收", yoy: -5.9, target: "維持下降", bar: 48 },
      { name: "廢棄物回收率", value: 77, unit: "%", yoy: 3.0, target: "2026 達 85%", bar: 77 },
    ],
    social: [
      { name: "員工流動率", value: "13.1%", note: "低於同業" },
      { name: "職安事件", value: "0 件重大", note: "失能傷害下降" },
      { name: "人均訓練時數", value: "22 小時", note: "加入永續課程" },
      { name: "供應商評鑑覆蓋", value: "81%", note: "關鍵供應商納入" },
    ],
    governance: [
      { name: "獨立董事席次", value: "3 / 7", status: "符合" },
      { name: "董事會出席率", value: "94%", status: "優於門檻" },
      { name: "功能性委員會", value: "審計 / 薪酬 / 永續", status: "完備" },
      { name: "關係人交易揭露", value: "已完整揭露", status: "查核通過" },
      { name: "內部控制聲明", value: "改善事項 1 項", status: "追蹤中" },
      { name: "誠信經營訓練", value: "94% 完成", status: "符合" },
    ],
  },
  "2024": {
    scores: { overall: 75, e: 70, s: 78, g: 77 },
    financial: [
      { label: "營業收入", value: "120.9 億", hint: "年增 5.3%", key: "fin" },
      { label: "稅後淨利", value: "8.2 億", hint: "淨利率 6.8%", key: "fin" },
      { label: "研發費用", value: "4.4 億", hint: "占營收 3.6%", key: "map" },
      { label: "綠色資本支出", value: "1.3 億", hint: "綠電合約啟動", key: "map" },
    ],
    environment: [
      { name: "溫室氣體排放強度", value: 3.5, unit: "tCO2e / 百萬營收", yoy: -7.9, target: "較基準年下降 12%", bar: 62 },
      { name: "再生能源使用占比", value: 23, unit: "%", yoy: 5.0, target: "2027 達 40%", bar: 23 },
      { name: "用水密集度", value: 1.5, unit: "千噸 / 百萬營收", yoy: -6.3, target: "維持下降", bar: 52 },
      { name: "廢棄物回收率", value: 80, unit: "%", yoy: 3.9, target: "2026 達 85%", bar: 80 },
    ],
    social: [
      { name: "員工流動率", value: "12.0%", note: "低於同業中位數" },
      { name: "職安事件", value: "0 件重大", note: "連續兩年" },
      { name: "人均訓練時數", value: "25 小時", note: "含內控與永續" },
      { name: "供應商評鑑覆蓋", value: "87%", note: "二階供應商試行" },
    ],
    governance: [
      { name: "獨立董事席次", value: "3 / 7", status: "符合" },
      { name: "董事會出席率", value: "96%", status: "優於門檻" },
      { name: "功能性委員會", value: "審計 / 薪酬 / 永續", status: "完備" },
      { name: "關係人交易揭露", value: "已完整揭露", status: "查核通過" },
      { name: "內部控制聲明", value: "無重大缺失", status: "查核通過" },
      { name: "誠信經營訓練", value: "98% 完成", status: "符合" },
    ],
  },
  "2025": {
    scores: { overall: 78, e: 74, s: 81, g: 80 },
    financial: [
      { label: "營業收入", value: "128.4 億", hint: "年增 6.2%", key: "fin" },
      { label: "稅後淨利", value: "9.1 億", hint: "淨利率 7.1%", key: "fin" },
      { label: "研發費用", value: "4.8 億", hint: "占營收 3.7%", key: "map" },
      { label: "綠色資本支出", value: "1.6 億", hint: "節能與再生能源", key: "map" },
    ],
    environment: [
      { name: "溫室氣體排放強度", value: 3.2, unit: "tCO2e / 百萬營收", yoy: -8.4, target: "較基準年下降 15%", bar: 68 },
      { name: "再生能源使用占比", value: 28, unit: "%", yoy: 5.0, target: "2027 達 40%", bar: 28 },
      { name: "用水密集度", value: 1.4, unit: "千噸 / 百萬營收", yoy: -6.7, target: "維持下降趨勢", bar: 55 },
      { name: "廢棄物回收率", value: 82, unit: "%", yoy: 2.5, target: "2026 達 85%", bar: 82 },
    ],
    social: [
      { name: "員工流動率", value: "11.2%", note: "低於同業中位數" },
      { name: "職安事件", value: "0 件重大", note: "失能傷害頻率下降" },
      { name: "人均訓練時數", value: "28 小時", note: "含永續與內控課程" },
      { name: "供應商評鑑覆蓋", value: "91%", note: "關鍵供應商全數納入" },
    ],
    governance: [
      { name: "獨立董事席次", value: "3 / 7", status: "符合" },
      { name: "董事會出席率", value: "97%", status: "優於門檻" },
      { name: "功能性委員會", value: "審計 / 薪酬 / 永續", status: "完備" },
      { name: "關係人交易揭露", value: "已完整揭露", status: "查核通過" },
      { name: "內部控制聲明", value: "無重大缺失", status: "查核通過" },
      { name: "誠信經營訓練", value: "100% 完成", status: "符合" },
    ],
  },
};

export const mapping = [
  { source: "合併財務報告 · 綜合損益表", indicator: "營收、淨利、研發費用", dim: "overview" },
  { source: "合併財務報告 · 資產負債表與附註", indicator: "E · 綠色資本支出、環保設備", dim: "E" },
  { source: "財務報告附註 · 能源／水電費、員工福利", indicator: "E／S · 密集度分母與人力資本", dim: "E" },
  { source: "營所稅結算與租稅優惠明細", indicator: "G · 有效稅率與資訊透明度", dim: "G" },
  { source: "公司年報 · 營運概況與風險", indicator: "綜合 · 產業與重大事件脈絡", dim: "overview" },
  { source: "公司年報 · 公司治理專章", indicator: "G · 董事會、委員會、關係人", dim: "G" },
  { source: "內部控制聲明書／內控專審", indicator: "G · 內控有效性、缺失追蹤", dim: "G" },
  { source: "董事會與永續委員會議事錄", indicator: "G · 出席率、永續治理", dim: "G" },
  { source: "永續報告書 · 重大主題與績效表", indicator: "E／S · 目標、實績、政策", dim: "E" },
  { source: "溫室氣體盤查清冊（ISO 14064）", indicator: "E · 排放量與再生能源", dim: "E" },
  { source: "職安衛年報與訓練時數", indicator: "S · 職安事件、人均訓練", dim: "S" },
  { source: "供應商評鑑與行為準則簽署", indicator: "S · 供應鏈覆蓋率", dim: "S" },
];

export const sourceVisuals = [
  {
    title: "合併財務報告",
    src: "/samples/fin-report-cover.jpg",
    tab: "dossier" as const,
    blurb: "簽證後的合併財務報告，營收、淨利、研發由此入板。",
  },
  {
    title: "綜合損益表",
    src: "/samples/income-statement.jpg",
    tab: "map" as const,
    blurb: "損益表與附註提供研發、員工福利與能源相關費用。",
  },
  {
    title: "公司年報",
    src: "/samples/annual-report-spread.jpg",
    tab: "dossier" as const,
    blurb: "年報治理專章對到董事會、委員會與關係人揭露。",
  },
  {
    title: "內部控制聲明書",
    src: "/samples/internal-control.jpg",
    tab: "G" as const,
    blurb: "內控聲明與專審結果對到治理面有效性。",
  },
  {
    title: "永續報告書",
    src: "/samples/esg-report-cover.jpg",
    tab: "report" as const,
    blurb: "報告書績效表對到環境與社會指標、目標。",
  },
  {
    title: "溫室氣體盤查清冊",
    src: "/samples/ghg-inventory.jpg",
    tab: "E" as const,
    blurb: "盤查排放量除以合併營收，得出排放強度。",
  },
];

export const annualDossiers = [
  {
    group: "財務簽證",
    note: "會計師法定核心工作",
    image: "/samples/fin-report-cover.jpg",
    items: [
      { name: "個體／合併財務報告", detail: "營收、淨利、研發、折舊與資本支出的入帳基礎。" },
      { name: "財務報告附註", detail: "員工福利、退休金、關係人交易、或有負債、能源相關費用。" },
      { name: "營所稅與未分配盈餘申報", detail: "有效稅率、租稅優惠，補治理面資訊透明度。" },
    ],
  },
  {
    group: "年報與治理",
    note: "公開發行公司年度揭露",
    image: "/samples/annual-report-spread.jpg",
    items: [
      { name: "公司年報", detail: "營運、風險、董監薪酬、治理專章，儀表板的敘事骨架。" },
      { name: "公司治理評鑑自評資料", detail: "獨立董事席次、委員會設置、資訊申報時效。" },
      { name: "內部控制聲明書／內控專案審查", detail: "內控是否有效，缺失是否關閉。" },
      { name: "董事會、審計／薪酬／永續委員會議事錄", detail: "出席率、永續議題是否真正進董事會。" },
    ],
  },
  {
    group: "永續編製與確信",
    note: "事務所可做成套服務",
    image: "/samples/esg-report-cover.jpg",
    items: [
      { name: "永續報告書（ESG Report）", detail: "重大主題、E／S 績效、政策與目標；可確信後再上板。" },
      { name: "溫室氣體盤查清冊", detail: "Scope 1／2（及關鍵 Scope 3）對到排放強度。" },
      { name: "永續資訊確信報告", detail: "把報告書數字變成可對董事會說明的查核軌跡。" },
    ],
  },
  {
    group: "營運佐證底稿",
    note: "財報與報告書之間的橋",
    image: "/samples/ghg-inventory.jpg",
    items: [
      { name: "綠色資本支出與綠電合約", detail: "設備、PPA、憑證，對到環境投資。" },
      { name: "職安衛與訓練紀錄", detail: "失能傷害、人均訓練時數。" },
      { name: "供應商評鑑與行為準則", detail: "社會面供應鏈覆蓋率。" },
    ],
  },
];

export const indicatorSources: Record<string, string> = {
  營業收入: "合併綜合損益表",
  稅後淨利: "合併綜合損益表",
  研發費用: "綜合損益表／研發投入附註",
  綠色資本支出: "資產負債表、現金流量表與環保設備明細",
  溫室氣體排放強度: "盤查清冊排放量 ÷ 合併營收",
  再生能源使用占比: "盤查清冊與綠電／憑證明細",
  用水密集度: "永續報告書環境績效 × 合併營收",
  廢棄物回收率: "永續報告書廢棄物統計",
  員工流動率: "年報人力資源＋附註員工福利",
  職安事件: "職安衛年報／永續報告書社會績效",
  人均訓練時數: "訓練時數底稿／永續報告書",
  供應商評鑑覆蓋: "供應商評鑑紀錄／永續報告書",
  獨立董事席次: "年報治理專章、公司章程",
  董事會出席率: "董事會議事錄",
  功能性委員會: "年報＋委員會組織規程",
  關係人交易揭露: "財務報告附註＋年報",
  內部控制聲明: "內控聲明書／內控專審報告",
  誠信經營訓練: "誠信經營守則執行紀錄",
};

export const reportService = {
  title: "永續報告書製作與確信",
  pitch:
    "事務所不只出財報，也可以幫客戶把同一套年度資料編成永續報告書，再同步更新這張儀表板。數字先跟財報對得上，再對外揭露。",
  packages: [
    {
      name: "基準建置",
      body: "重大性分析、資料盤點、與財報科目對帳，完成第一本可對外的報告書架構。",
    },
    {
      name: "年度更新",
      body: "配合簽證時程收集績效、重編報告書，並把今年實績寫進儀表板。",
    },
    {
      name: "有限確信",
      body: "就關鍵 ESG 指標出具確信報告，讓董事會與投資人看得到查核軌跡。",
    },
  ],
  frameworks: ["GRI Standards", "金管會永續報告書指引", "IFRS S1／S2（氣候）", "ISO 14064 盤查", "公司治理評鑑"],
};

export const reportSample = {
  cover: "/samples/esg-report-cover.jpg",
  spread: "/samples/annual-report-spread.jpg",
  client: "綠能精密股份有限公司 2025 永續報告書（示範摘錄）",
  chapters: [
    { no: "01", title: "關於報告書", body: "報導期間 2025.1.1–12.31；邊界與合併財報一致；依 GRI 與金管會指引編製。" },
    { no: "02", title: "重大主題", body: "氣候與能源、產品責任、職業安全、供應鏈、誠信經營。對應董事會討論紀錄。" },
    { no: "03", title: "環境績效", body: "排放強度 3.2 tCO2e／百萬營收；再生能源 28%；與盤查清冊、綠電合約一致。" },
    { no: "04", title: "社會績效", body: "流動率 11.2%、重大職安 0 件、人均訓練 28 小時；來源為人資與職安底稿。" },
    { no: "05", title: "治理績效", body: "獨董 3／7、永續委員會已設置、內控無重大缺失；與年報治理專章一致。" },
    { no: "06", title: "與財務資訊對照", body: "綠色資本支出 1.6 億、研發 4.8 億，可回溯合併財報與附註，避免兩套數字。" },
  ],
  quote:
    "本報告書環境與社會績效業經會計師依確信準則執行有限確信，財務數字與 2025 年度合併財務報告相符。",
};

export const trend = [
  { year: "2022", e: 61, s: 70, g: 72 },
  { year: "2023", e: 66, s: 74, g: 75 },
  { year: "2024", e: 70, s: 78, g: 77 },
  { year: "2025", e: 74, s: 81, g: 80 },
] as const;
