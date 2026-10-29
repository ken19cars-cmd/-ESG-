export type Room = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tone: "room" | "core" | "public" | "service";
};

export type FloorPlan = {
  id: string;
  name: string;
  note: string;
  rooms: Room[];
};

export type RenderView = {
  id: string;
  name: string;
  caption: string;
  variant: "day" | "night" | "street" | "court";
};

export type Camera = {
  id: string;
  name: string;
  aim: string;
  status: "live" | "maintenance";
  lastFrame: string;
};

export type SitePhoto = {
  id: string;
  month: string;
  date: string;
  title: string;
  note: string;
  variant: "excavate" | "foundation" | "rebar" | "deck" | "facade" | "street";
};

export type WorkPackage = {
  name: string;
  planned: number;
  actual: number;
};

export type Milestone = {
  date: string;
  title: string;
  detail: string;
  state: "done" | "current" | "next";
};

export type Briefing = {
  id: string;
  date: string;
  title: string;
  audience: string;
  pages: number;
  slides: { heading: string; points: string[] }[];
};

export const projectCase = {
  developer: "澄築建設股份有限公司",
  builder: "北澄營造股份有限公司",
  architect: "衡序建築師事務所",
  authority: "新北市政府都市發展局",
  updatedAt: "2026-10-29 08:30",
  name: "板橋文化段捷運聯開都更案",
  caseNo: "新北都更字第 113-088 號（示範）",
  phase: "地上結構施工",
  summary:
    "本頁彙整基地資料、核定歷程、規劃圖說、工地畫面、施工照片、工期與說明會簡報，供主管機關與周邊居民查閱。",
  address: "新北市板橋區文化路一段與民生路口（示範基地）",
  facts: [
    ["基地面積", "3,286 平方公尺"],
    ["地號", "文化段 812、813、814 地號"],
    ["使用分區", "商業區（捷運開發區）"],
    ["建蔽率 / 容積率", "60% / 560%"],
    ["建築規模", "地上 29 層、地下 5 層"],
    ["樓地板面積", "48,920 平方公尺"],
    ["住宅 / 店面", "186 戶 / 8 戶"],
    ["公益與公共設施", "托育中心、公共通廊、廣場 860 平方公尺"],
    ["聯開介面", "連通板橋文化站 2 號出口"],
    ["開工 / 預定使用執照", "2025-08-18 / 2027-12"],
    ["實施者", "澄築建設股份有限公司"],
    ["營造廠 / 建築師", "北澄營造 / 衡序建築師事務所"],
  ],
  today: {
    workers: 186,
    cranes: "塔吊 2 台運轉中",
    monitor: "鄰房傾斜計正常",
    weather: "多雲 26°C",
    note: "12 至 16 樓樓板鋼筋綁紮，文化路側圍籬洗車槽開放。",
  },
  schedule: {
    startLabel: "2025-08 開工",
    endLabel: "2027-12 預定取得使用執照",
    elapsed: 46,
    planned: 54,
    actual: 48,
    varianceLabel: "較預定落後 6 個百分點",
    reason: "10 月連續降雨，地上結構樓層進度順延約 11 個工作天。追趕方式為 11 月起週六半日加班，不變更夜間施工時段。",
  },
  packages: [
    { name: "假設工程與圍籬", planned: 100, actual: 100 },
    { name: "拆除與地質改良", planned: 100, actual: 100 },
    { name: "基礎與地下結構", planned: 100, actual: 96 },
    { name: "地上結構", planned: 72, actual: 64 },
    { name: "外牆與門窗", planned: 18, actual: 11 },
    { name: "機電與消防", planned: 22, actual: 14 },
    { name: "景觀與公共開放空間", planned: 8, actual: 4 },
  ] satisfies WorkPackage[],
  milestones: [
    {
      date: "2023-11-16",
      title: "事業概要公聽會",
      detail: "於板橋區公所說明重建範圍、安置與開放空間。出席 96 人。",
      state: "done",
    },
    {
      date: "2024-06-21",
      title: "都市更新事業計畫核定",
      detail: "新北市政府核定事業計畫，公益設施含托育中心與公共通廊。",
      state: "done",
    },
    {
      date: "2024-12-09",
      title: "權利變換計畫核定",
      detail: "權利變換計畫核定，選配與差額價金說明會同步辦理。",
      state: "done",
    },
    {
      date: "2025-04-02",
      title: "既有建物拆除完成",
      detail: "拆除期間採低噪工法，每日 08:00 前完成洗街。",
      state: "done",
    },
    {
      date: "2025-08-18",
      title: "取得建照並開工",
      detail: "圍籬、洗車槽與交通維持計畫依核定圖說施作。",
      state: "done",
    },
    {
      date: "2026-03-02",
      title: "結構體出地面",
      detail: "地下五層完成，地上層開始逐層施作。",
      state: "done",
    },
    {
      date: "2026-10-29",
      title: "地上結構施工中",
      detail: "目前施作至 16 樓樓板。預定結構封頂為 2027 年 2 月。",
      state: "current",
    },
    {
      date: "2027-12",
      title: "預定取得使用執照",
      detail: "含公共開放空間點交與捷運通廊連通測試。",
      state: "next",
    },
  ] satisfies Milestone[],
  plans: [
    {
      id: "b1",
      name: "地下一層平面",
      note: "汽機車停車、機房與捷運連通預留。車道出入口設於民生路側，避開文化路公車停靠彎。",
      rooms: [
        { x: 36, y: 36, w: 250, h: 250, label: "停車區 A", tone: "room" },
        { x: 300, y: 36, w: 210, h: 150, label: "停車區 B", tone: "room" },
        { x: 300, y: 200, w: 120, h: 86, label: "機電", tone: "service" },
        { x: 430, y: 200, w: 80, h: 86, label: "梯廳", tone: "core" },
        { x: 524, y: 36, w: 80, h: 250, label: "車道", tone: "public" },
      ],
    },
    {
      id: "f1",
      name: "地面層平面",
      note: "沿街店面退縮留設騎樓，中央為住宅門廳，東側預留捷運站連通走廊。",
      rooms: [
        { x: 36, y: 36, w: 150, h: 110, label: "店面 A", tone: "room" },
        { x: 196, y: 36, w: 150, h: 110, label: "店面 B", tone: "room" },
        { x: 356, y: 36, w: 248, h: 70, label: "公共通廊", tone: "public" },
        { x: 196, y: 160, w: 170, h: 130, label: "住宅門廳", tone: "core" },
        { x: 380, y: 120, w: 224, h: 170, label: "廣場", tone: "public" },
        { x: 36, y: 160, w: 146, h: 130, label: "托育", tone: "service" },
      ],
    },
    {
      id: "typ",
      name: "標準層平面",
      note: "15 樓標準層。每層 8 戶，核心筒置中，南向為主採光面。",
      rooms: [
        { x: 36, y: 36, w: 180, h: 120, label: "A1 三房", tone: "room" },
        { x: 226, y: 36, w: 160, h: 120, label: "A2 兩房", tone: "room" },
        { x: 396, y: 36, w: 208, h: 120, label: "A3 三房", tone: "room" },
        { x: 230, y: 170, w: 180, h: 120, label: "梯廳核心", tone: "core" },
        { x: 36, y: 170, w: 184, h: 150, label: "B1 三房", tone: "room" },
        { x: 420, y: 170, w: 184, h: 150, label: "B2 三房", tone: "room" },
        { x: 36, y: 332, w: 270, h: 90, label: "C1 兩房", tone: "room" },
        { x: 316, y: 332, w: 288, h: 90, label: "C2 兩房", tone: "room" },
      ],
    },
    {
      id: "rf",
      name: "屋頂層平面",
      note: "設備置於核心筒上方，周邊為住戶屋頂花園，並配置太陽光電。",
      rooms: [
        { x: 180, y: 120, w: 200, h: 140, label: "設備", tone: "service" },
        { x: 36, y: 36, w: 520, h: 70, label: "太陽光電", tone: "public" },
        { x: 36, y: 280, w: 568, h: 100, label: "屋頂花園", tone: "public" },
        { x: 400, y: 140, w: 150, h: 110, label: "梯廳", tone: "core" },
      ],
    },
  ] satisfies FloorPlan[],
  renders: [
    {
      id: "day",
      name: "東南向日景",
      caption: "沿文化路看向量體。低樓層店面與上方住宅以水平線腳分開。",
      variant: "day",
    },
    {
      id: "night",
      name: "街角夜景",
      caption: "門廳與公共通廊保持夜間照明，減少圍牆閉鎖感。",
      variant: "night",
    },
    {
      id: "street",
      name: "街廓退縮",
      caption: "騎樓連續，公車停靠彎維持現況，施工期間不佔用人行道淨寬。",
      variant: "street",
    },
    {
      id: "court",
      name: "中庭與通廊",
      caption: "廣場連接捷運出口，托育中心面向中庭，避免直接臨路。",
      variant: "court",
    },
  ] satisfies RenderView[],
  cameras: [
    {
      id: "ne",
      name: "東北角全景",
      aim: "文化路與民生路口，觀看塔吊與出入口",
      status: "live",
      lastFrame: "",
    },
    {
      id: "gate",
      name: "工務所大門",
      aim: "人員進場與洗車槽",
      status: "live",
      lastFrame: "",
    },
    {
      id: "deck",
      name: "作業樓層",
      aim: "16 樓樓板鋼筋與模板",
      status: "live",
      lastFrame: "",
    },
    {
      id: "west",
      name: "西鄰監測",
      aim: "鄰房外牆與傾斜計",
      status: "maintenance",
      lastFrame: "今日 10:14",
    },
  ] satisfies Camera[],
  photos: [
    { id: "p1", month: "2026-07", date: "2026-07-08", title: "12 樓樓板澆置", note: "混凝土澆置自清晨 6:00 至 13:40，預拌車依交維路線進出。", variant: "deck" },
    { id: "p2", month: "2026-07", date: "2026-07-22", title: "文化路圍籬與洗街", note: "每日收工後沖洗車道，圍籬帆布更新案名與申訴電話。", variant: "street" },
    { id: "p3", month: "2026-08", date: "2026-08-06", title: "13 樓柱筋查驗", note: "結構技師會同查驗主筋號數與續接器。", variant: "rebar" },
    { id: "p4", month: "2026-08", date: "2026-08-19", title: "外牆預鑄試吊", note: "低樓層預鑄板於地面組裝，確認吊點後再吊升。", variant: "facade" },
    { id: "p5", month: "2026-09", date: "2026-09-03", title: "14 樓模板支撐", note: "支撐架依計算書搭設，通道維持 90 公分。", variant: "deck" },
    { id: "p6", month: "2026-09", date: "2026-09-17", title: "鄰房測點複測", note: "西鄰三點傾斜值均在管制值內。", variant: "street" },
    { id: "p7", month: "2026-10", date: "2026-10-09", title: "15 樓鋼筋綁紮", note: "風雨延後兩日，恢復後先完成柱位再進樓板。", variant: "rebar" },
    { id: "p8", month: "2026-10", date: "2026-10-28", title: "16 樓樓板作業", note: "本日出工 186 人，塔吊兩台，無異常事件。", variant: "deck" },
  ] satisfies SitePhoto[],
  briefings: [
    {
      id: "b113",
      date: "2023-11-16",
      title: "事業概要公聽會簡報",
      audience: "當地居民、板橋區公所",
      pages: 18,
      slides: [
        {
          heading: "重建範圍",
          points: ["文化段 3 筆土地，面積 3,286 平方公尺。", "現況為 5 層以下老舊住宅與沿街店面。"],
        },
        {
          heading: "未來使用",
          points: ["住宅 186 戶、店面 8 戶。", "劃設托育中心與 860 平方公尺廣場。"],
        },
        {
          heading: "居民關心事項",
          points: ["施工車輛不進入巷弄。", "安置協助由實施者窗口單一受理。"],
        },
      ],
    },
    {
      id: "b114",
      date: "2024-04-12",
      title: "權利變換說明會簡報",
      audience: "土地與合法建物所有權人",
      pages: 24,
      slides: [
        {
          heading: "分配原則",
          points: ["依權利價值選配住宅或店面。", "未選配部分以差額價金處理。"],
        },
        {
          heading: "時程",
          points: ["計畫核定後進入拆遷協調。", "開工目標為取得建照當月。"],
        },
      ],
    },
    {
      id: "b115",
      date: "2026-06-18",
      title: "施工期間交通維持說明",
      audience: "新北市政府、管委會與鄰房住戶",
      pages: 12,
      slides: [
        {
          heading: "車行動線",
          points: ["預拌車由民生路進、文化路出。", "上午 7:30 至 8:30、下午 17:00 至 18:30 不排車隊。"],
        },
        {
          heading: "人行維持",
          points: ["文化路側人行淨寬維持 1.5 公尺。", "圍籬轉角設置凸面鏡與警示燈。"],
        },
        {
          heading: "申訴",
          points: ["工務所白天有人值守。", "噪音、粉塵與積水於當日回覆處理情形。"],
        },
      ],
    },
    {
      id: "b116",
      date: "2026-10-20",
      title: "鄰房監測月報摘錄",
      audience: "都發局、鄰房住戶",
      pages: 9,
      slides: [
        {
          heading: "10 月監測",
          points: ["傾斜、沉陷均低於行動值。", "西鄰攝影機 10 月 29 日上午進行線路檢修。"],
        },
        {
          heading: "下月工項",
          points: ["持續施作 16、17 樓結構。", "週六加班事先於圍籬與本頁公告。"],
        },
      ],
    },
  ] satisfies Briefing[],
};

export const photoMonths = ["2026-07", "2026-08", "2026-09", "2026-10"];
