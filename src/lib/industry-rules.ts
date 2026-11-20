/** 證交所／櫃買「編製與申報永續報告書作業辦法」第4條、第4條之1；年報準則 IFRS S1／S2 時程。 */

export type IndustryId =
  | "food"
  | "chemical"
  | "finance"
  | "cement"
  | "plastic"
  | "steel"
  | "energy"
  | "semiconductor"
  | "computer"
  | "opto"
  | "comm"
  | "component"
  | "channel"
  | "other_electronic"
  | "other";

export type AnnexItem = {
  no: string;
  text: string;
  kind: "qty" | "qual";
  unit: string;
  fill: "derived" | "input" | "qual";
  key?: string;
  extraKeys?: string[];
};

export const INDUSTRIES: { id: IndustryId; name: string; annex: string; gate: "always" | "capital20" | "none" }[] = [
  { id: "food", name: "食品工業", annex: "附表一之一", gate: "always" },
  { id: "chemical", name: "化學工業", annex: "附表一之二", gate: "always" },
  { id: "finance", name: "金融保險業", annex: "附表一之三", gate: "always" },
  { id: "cement", name: "水泥工業", annex: "附表一之四", gate: "capital20" },
  { id: "plastic", name: "塑膠工業", annex: "附表一之五", gate: "capital20" },
  { id: "steel", name: "鋼鐵工業", annex: "附表一之六", gate: "capital20" },
  { id: "energy", name: "油電燃氣業", annex: "附表一之七", gate: "capital20" },
  { id: "semiconductor", name: "半導體業", annex: "附表一之八", gate: "capital20" },
  { id: "computer", name: "電腦及週邊設備業", annex: "附表一之九", gate: "capital20" },
  { id: "opto", name: "光電業", annex: "附表一之十", gate: "capital20" },
  { id: "comm", name: "通信網路業", annex: "附表一之十一", gate: "capital20" },
  { id: "component", name: "電子零組件業", annex: "附表一之十二", gate: "capital20" },
  { id: "channel", name: "電子通路業", annex: "附表一之十三", gate: "capital20" },
  { id: "other_electronic", name: "其他電子業", annex: "附表一之十四", gate: "capital20" },
  { id: "other", name: "其他產業（非附表一列名）", annex: "—", gate: "none" },
];

const ELECTRONICS: AnnexItem[] = [
  { no: "一", text: "消耗能源總量、外購電力百分比及再生能源使用率", kind: "qty", unit: "GJ、%", fill: "derived", key: "en" },
  { no: "二", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
  { no: "三", text: "所產生有害廢棄物之重量及回收百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
  { no: "四", text: "說明職業災害類別、人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
  { no: "五", text: "產品生命週期管理：報廢產品及電子廢棄物之重量以及再循環之百分比", kind: "qty", unit: "公噸、%", fill: "input", key: "eWasteTon", extraKeys: ["eWasteRecyclePct"] },
  { no: "六", text: "與使用關鍵材料相關的風險管理之描述", kind: "qual", unit: "—", fill: "qual" },
  { no: "七", text: "因與反競爭行為條例相關的法律訴訟而造成的金錢損失總額", kind: "qty", unit: "萬元", fill: "input", key: "antitrustLossWan" },
  { no: "八", text: "依產品類別之主要產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
];

const ANNEX: Record<IndustryId, AnnexItem[]> = {
  food: [
    { no: "一", text: "為改善食品衛生、安全與品質，而針對從業人員、作業場所、設施衛生管理及其品保制度等方面進行之評估與改進及所影響之主要產品與服務類別與百分比", kind: "qty", unit: "%", fill: "input", key: "foodSafetyAssessPct" },
    { no: "二", text: "違反有關產品與服務之健康與安全法規及未遵循產品與服務之資訊與標示法規之事件類別與次數、產品下架次數及下架產品總重量", kind: "qty", unit: "次、公噸", fill: "input", key: "productRecallTimes", extraKeys: ["healthSafetyIncidents", "productRecallTon"] },
    { no: "三", text: "採購符合國際認可之產品責任標準者占整體採購之百分比", kind: "qty", unit: "%", fill: "input", key: "responsibleSourcingPct" },
    { no: "四", text: "經獨立第三方驗證符合國際認證之食品安全管理系統標準之廠房所生產產品之百分比", kind: "qty", unit: "%", fill: "input", key: "certifiedPlantProductPct" },
    { no: "五", text: "對供應商進行稽核之家數及百分比、稽核項目及結果", kind: "qty", unit: "家、%", fill: "input", key: "supplierAuditedCount" },
    { no: "六", text: "依法規要求或自願進行產品追溯與追蹤管理之情形及相關產品占所有產品之百分比", kind: "qty", unit: "%", fill: "input", key: "traceableProductPct" },
    { no: "七", text: "依法規要求或自願設置食品安全實驗室之情形、測試項目、測試結果、相關支出及其占營業收入淨額之百分比", kind: "qty", unit: "仟元、%", fill: "input", key: "foodLabSpendThousand" },
    { no: "八", text: "消耗能源總量、外購電力百分比、再生能源使用率", kind: "qty", unit: "GJ、%", fill: "derived", key: "en" },
    { no: "九", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "十", text: "售出產品重量、生產設施場所數量", kind: "qty", unit: "公噸、處", fill: "input", key: "soldProductTon", extraKeys: ["plantCount"] },
  ],
  chemical: [
    { no: "一", text: "消耗能源總量、外購電力百分比、再生能源使用率及自發自用能源總量", kind: "qty", unit: "GJ、%", fill: "derived", key: "en", extraKeys: ["selfGenGj"] },
    { no: "二", text: "總取水量、總耗水量、依法規要求或自願揭露之廢（污）水排放量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "三", text: "產品生產過程所製造之有害廢棄物總量及回收百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
    { no: "四", text: "說明職業災害人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
    { no: "五", text: "對當地社區具有顯著實際或潛在負面衝擊之營運活動", kind: "qual", unit: "—", fill: "qual" },
    { no: "六", text: "企業本身及其供應商為降低對環境或社會之負面衝擊所採取之具體、有效機制及作為", kind: "qual", unit: "—", fill: "qual" },
    { no: "七", text: "依產品類別之產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
  ],
  finance: [
    { no: "一", text: "資訊外洩事件數量、與個資相關的資訊外洩事件占比、因資訊外洩事件而受影響的顧客數", kind: "qty", unit: "件、%、人", fill: "input", key: "dataBreaches", extraKeys: ["personalDataBreachPct", "customersAffected"] },
    { no: "二", text: "對促進小型企業及社區發展的貸放件數及貸放餘額", kind: "qty", unit: "件、百萬元", fill: "input", key: "smeLoanCount", extraKeys: ["smeLoanBalanceMillion"] },
    { no: "三", text: "對缺少銀行服務之弱勢族群提供金融教育之參與人數", kind: "qty", unit: "人", fill: "input", key: "financialEduPeople" },
    { no: "四", text: "各經營業務為創造環境效益或社會效益所設計之產品與服務", kind: "qual", unit: "—", fill: "qual" },
  ],
  cement: [
    { no: "一", text: "消耗能源總量、外購電力百分比及再生能源使用率", kind: "qty", unit: "GJ、%", fill: "derived", key: "en" },
    { no: "二", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "三", text: "所產生廢棄物之重量，有害廢棄物之百分比及回收之百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
    { no: "四", text: "說明職業災害人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
    { no: "五", text: "依產品類別之主要產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
  ],
  plastic: [
    { no: "一", text: "消耗能源總量、外購電力百分比、再生能源使用率及自發自用能源總量", kind: "qty", unit: "GJ、%", fill: "derived", key: "en", extraKeys: ["selfGenGj"] },
    { no: "二", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "三", text: "所產生有害廢棄物之重量及回收百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
    { no: "四", text: "說明職業災害人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
    { no: "五", text: "依產品類別之主要產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
  ],
  steel: [
    { no: "一", text: "消耗能源總量、外購電力百分比、再生能源使用率及自發自用能源總量", kind: "qty", unit: "GJ、%", fill: "derived", key: "en", extraKeys: ["selfGenGj"] },
    { no: "二", text: "消耗燃料總量、煤炭百分比、天然氣百分比及再生燃料百分比", kind: "qty", unit: "GJ、%", fill: "input", key: "fuelGj", extraKeys: ["coalFuelPct", "gasFuelPct", "renewableFuelPct"] },
    { no: "三", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "四", text: "所產生廢棄物之重量、有害廢棄物之百分比及回收百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
    { no: "五", text: "說明職業災害人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
    { no: "六", text: "依產品類別之主要產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
  ],
  energy: [
    { no: "一", text: "在人口密集地區的煉油廠數量", kind: "qty", unit: "座", fill: "input", key: "refineriesDense" },
    { no: "二", text: "總取水量及總耗水量", kind: "qty", unit: "千立方公尺", fill: "derived", key: "wuse" },
    { no: "三", text: "所產生有害廢棄物之重量及回收百分比", kind: "qty", unit: "公噸、%", fill: "derived", key: "haz" },
    { no: "四", text: "說明職業災害人數及比率", kind: "qty", unit: "數量、%", fill: "derived", key: "fr" },
    { no: "五", text: "重大事件之風險管理政策", kind: "qual", unit: "—", fill: "qual" },
    { no: "六", text: "依產品類別之主要產品產量", kind: "qty", unit: "依產品類型", fill: "input", key: "mainProductOutput" },
  ],
  semiconductor: ELECTRONICS,
  computer: ELECTRONICS,
  opto: ELECTRONICS,
  comm: ELECTRONICS,
  component: ELECTRONICS,
  channel: ELECTRONICS,
  other_electronic: ELECTRONICS,
  other: [],
};

export type StandardCode = "GRI" | "TCFD" | "SASB" | "IFRS" | "ESRS";

/** Official ESRS topical standards. Names only; no invented metrics. */
export const ESRS_TOPICS: { code: string; name: string }[] = [
  { code: "ESRS 1", name: "一般規定（雙重重大性）" },
  { code: "ESRS 2", name: "一般揭露（治理、策略、影響／風險／機會）" },
  { code: "ESRS E1", name: "氣候變遷" },
  { code: "ESRS E2", name: "污染" },
  { code: "ESRS E3", name: "水與海洋資源" },
  { code: "ESRS E4", name: "生物多樣性與生態系統" },
  { code: "ESRS E5", name: "資源使用與循環經濟" },
  { code: "ESRS S1", name: "自身勞動力" },
  { code: "ESRS S2", name: "價值鏈工作者" },
  { code: "ESRS S3", name: "受影響社區" },
  { code: "ESRS S4", name: "消費者與最終使用者" },
  { code: "ESRS G1", name: "商業行為" },
];

export type FrameworkCard = {
  code: StandardCode;
  short: string;
  title: string;
  status: "適用" | "分階段" | "依產業" | "不適用" | "自願";
  chipNote: string;
  industries: string;
  detail: string;
};

const SASB_INDUSTRIES =
  "食品、化學、金融保險（一律＋會計師確信）；水泥、塑膠、鋼鐵、油電燃氣、半導體、電腦及週邊、光電、通信網路、電子零組件、電子通路、其他電子業（實收資本額≥20億）";

export function industryOptionHint(id: IndustryId): string {
  if (id === "food" || id === "chemical" || id === "finance") return "SASB強制＋確信";
  if (id === "cement" || id === "steel") return "SASB≥20億／TCFD提前";
  if (id === "other") return "GRI＋TCFD；SASB自願";
  return "SASB資本額≥20億";
}

export function industryMeta(id: IndustryId | "") {
  if (!id) return { id: "other" as IndustryId, name: "尚未選擇", annex: "—", gate: "none" as const };
  return INDUSTRIES.find((x) => x.id === id) ?? INDUSTRIES[INDUSTRIES.length - 1];
}

export function effectiveIndustry(industry: IndustryId | "", diningRevenuePct: number): IndustryId {
  if (industry === "food" || industry === "chemical" || industry === "finance") return industry;
  if (diningRevenuePct >= 50) return "food";
  return industry || "other";
}

/** 作業辦法第4條第1項第2款：餐飲收入達50%才改走食品附表一。食品／化學／金融保險本業已強制，不必再填。 */
export function diningGateRelevant(industry: IndustryId | "") {
  return industry !== "" && industry !== "food" && industry !== "chemical" && industry !== "finance";
}

/** 年報 IFRS S1／S2 第三階段：資本額已達20億即納入，環境部納管只在未達20億時才改變時程。 */
export function moenvGateRelevant(capitalBillion: number) {
  return !(Number.isFinite(capitalBillion) && capitalBillion >= 20);
}

export function annexApplies(industry: IndustryId | "", capitalBillion: number, diningRevenuePct: number) {
  if (!industry) {
    const meta = industryMeta("");
    return { applies: false, id: "other" as IndustryId, meta, reason: "尚未選擇產業。" };
  }
  const id = effectiveIndustry(industry, diningRevenuePct);
  const meta = industryMeta(id);
  if (meta.gate === "always") {
    const reason =
      id === "chemical"
        ? "作業辦法第4條第1項第1款：化學工業應依附表一之二加強揭露，並應取得會計師確信。"
        : id === "finance"
          ? "作業辦法第4條第1項第1款：金融保險業應依附表一之三加強揭露，並應取得會計師確信。"
          : industry === "food"
            ? "作業辦法第4條第1項第1款：食品工業應依附表一之一加強揭露，並應取得會計師確信。"
            : "作業辦法第4條第1項第2款：餐飲收入占全部營業收入達百分之五十者，應依附表一之一加強揭露，並應取得會計師確信。";
    return { applies: true, id, meta, reason };
  }
  if (meta.gate === "capital20" && capitalBillion >= 20) {
    return { applies: true, id, meta, reason: "作業辦法第4條第3項：實收資本額二十億元以上之水泥、塑膠、鋼鐵、油電燃氣及電子相關產業，應依附表一加強揭露。" };
  }
  if (meta.gate === "capital20") {
    return { applies: false, id, meta, reason: "所選產業列於附表一之四至十四，但實收資本額未達二十億元，作業辦法未強制依附表一揭露。" };
  }
  return { applies: false, id, meta, reason: "非作業辦法第4條列名產業。第3條仍可參考 SASB 準則揭露行業指標。" };
}

export function annexItems(industry: IndustryId | "", diningRevenuePct: number): AnnexItem[] {
  if (!industry) return [];
  return ANNEX[effectiveIndustry(industry, diningRevenuePct)] ?? [];
}

export function annexInputKeys(industry: IndustryId | "", diningRevenuePct: number): string[] {
  const keys: string[] = [];
  for (const item of annexItems(industry, diningRevenuePct)) {
    if (item.fill === "input" && item.key) keys.push(item.key);
    if (item.extraKeys) keys.push(...item.extraKeys);
  }
  return [...new Set(keys)];
}

/** 本產業模組要不要帶水、廢棄物、空氣污染物、附表一。GRI／TCFD 能源與排放全體都留。 */
export function topicFlags(industry: IndustryId | "", capitalBillion: number, diningRevenuePct: number) {
  if (!industry) {
    return { water: false, waste: false, air: false, annex: false, annexCode: "—" };
  }
  const annex = annexApplies(industry, capitalBillion, diningRevenuePct);
  const items = annex.applies ? annexItems(industry, diningRevenuePct) : [];
  const derived = new Set(items.filter((item) => item.fill === "derived").map((item) => item.key));
  const id = annex.id;
  const processAir = id === "chemical" || id === "cement" || id === "steel" || id === "energy" || id === "plastic";
  if (annex.applies) {
    return {
      water: derived.has("wuse"),
      waste: derived.has("haz"),
      air: processAir,
      annex: true,
      annexCode: annex.meta.annex,
    };
  }
  return {
    water: true,
    waste: true,
    air: processAir || id === "other",
    annex: false,
    annexCode: "—",
  };
}

export function caseReady(client: string, year: string, capitalBillion: number, industry: IndustryId | "") {
  return client.trim().length > 0 && year.trim().length > 0 && Number.isFinite(capitalBillion) && capitalBillion > 0 && industry !== "";
}

export function assuranceRequired(industry: IndustryId | "", diningRevenuePct: number) {
  const id = effectiveIndustry(industry, diningRevenuePct);
  return id === "food" || id === "chemical" || id === "finance";
}

/** 年報「永續相關財務資訊」專章適用 IFRS S1／S2 的時程。115年9月調整後，第三階段門檻改為資本額二十億元以上。 */
export function ifrsStage(capitalBillion: number, moenvRegulated: boolean) {
  if (capitalBillion >= 100) {
    return { stage: "第一階段", apply: "115會計年度起編製，116年申報", detail: "實收資本額一百億元以上。年報新增永續相關財務資訊專章，適用金管會認可之 IFRS S1、S2。" };
  }
  if (capitalBillion >= 50) {
    return { stage: "第二階段", apply: "116會計年度起編製，117年申報", detail: "實收資本額五十億元以上未達一百億元。" };
  }
  if (capitalBillion >= 20 || moenvRegulated) {
    return { stage: "第三階段", apply: "117會計年度起編製，118年申報", detail: "115年9月調整後：實收資本額二十億元以上，或環境部納管應盤查及查驗者。接軌前二年得先揭露氣候相關資訊。" };
  }
  return { stage: "未達強制適用門檻", apply: "—", detail: "資本額未達二十億元且非環境部納管者，仍須揭露氣候相關治理、風險管理、範疇一及二等基本資訊；完整 S1／S2 非強制。" };
}

export function frameworkCards(opts: {
  industry: IndustryId | "";
  capitalBillion: number;
  diningRevenuePct: number;
  moenvRegulated: boolean;
  esrsRequired?: boolean;
}): FrameworkCard[] {
  if (!opts.industry) return [];
  const annex = annexApplies(opts.industry, opts.capitalBillion, opts.diningRevenuePct);
  const ifrs = ifrsStage(opts.capitalBillion, opts.moenvRegulated);
  const steelOrCement = opts.industry === "steel" || opts.industry === "cement";
  const sasbStatus: FrameworkCard["status"] = annex.applies ? "適用" : annex.meta.gate === "none" ? "自願" : "不適用";
  const esrsOn = Boolean(opts.esrsRequired);
  return [
    {
      code: "GRI",
      short: "GRI",
      title: "永續報告書基本盤",
      status: "適用",
      chipNote: "全體上市櫃",
      industries: "全體上市櫃（不限產業）",
      detail: "作業辦法第3條：每年依 GRI 通用準則、行業準則及重大主題準則編製前一年度永續報告書。SASB 於第3條為「並可參考」，非全體強制。",
    },
    {
      code: "TCFD",
      short: "TCFD",
      title: "氣候相關資訊專章（附表二）",
      status: "分階段",
      chipNote: steelOrCement ? "全體專章 · 本業提前" : "全體專章 · 鋼鐵／水泥提前",
      industries: steelOrCement
        ? "全體上市櫃必設專章。本產業（鋼鐵／水泥）範疇一、二盤查與確信時程較其他產業提前。"
        : "全體上市櫃必設專章（項目參採 TCFD 四大核心）。盤查、確信、減碳目標依資本額分階段，不限產業；鋼鐵、水泥提前。",
      detail: "作業辦法第4條之1。已於年報適用永續揭露準則者，得不再適用本條。",
    },
    {
      code: "SASB",
      short: "SASB",
      title: "產業別加強揭露（附表一）",
      status: sasbStatus,
      chipNote: annex.applies
        ? `本業強制 · ${annex.meta.annex}`
        : annex.meta.gate === "none"
          ? "本業自願"
          : "本業未達20億門檻",
      industries: SASB_INDUSTRIES,
      detail: annex.applies
        ? `${annex.meta.annex}　${annex.reason}${assuranceRequired(opts.industry, opts.diningRevenuePct) ? " 食品、化學、金融保險業之附表一應取得會計師確信。" : ""}`
        : annex.reason,
    },
    {
      code: "IFRS",
      short: "IFRS S1／S2",
      title: "年報永續相關財務資訊",
      status: ifrs.stage.startsWith("第") ? "分階段" : "不適用",
      chipNote: ifrs.stage.startsWith("第") ? `${ifrs.stage} · 不依產業` : "未達門檻 · 不依產業",
      industries: "不依產業；依實收資本額（100億／50億／20億）及環境部納管分三階段。揭露在股東會年報專章，不是永續報告書本文。",
      detail: `${ifrs.stage}。${ifrs.apply}。${ifrs.detail} 年報已揭露 SASB 行業指標者，永續報告書得不再適用附表一。`,
    },
    {
      code: "ESRS",
      short: "ESRS",
      title: "歐洲永續報導準則",
      status: esrsOn ? "適用" : "不適用",
      chipNote: esrsOn ? "已勾選 · 歐盟強制" : "歐盟強制 · 若有需要請勾選",
      industries: "歐盟《企業永續報導指令》（CSRD）適用企業，含符合條件之第三國企業。非我國上市櫃一律強制。",
      detail: esrsOn
        ? "本案件已勾選 ESRS。應依 ESRS 1、ESRS 2 及重大之環境（E1–E5）、社會（S1–S4）、治理（G1）主題準則揭露。量化項目與既有 GRI／氣候欄位對應者，仍由本系統計算；質化敘述不由本系統代寫。"
        : "歐盟強制。受評公司如因在歐盟上市、屬歐盟大企業或 CSRD 第三國企業範圍而須編製 ESRS 報告，請於案件設定勾選。未勾選者不納入本案件法源。",
    },
  ];
}
