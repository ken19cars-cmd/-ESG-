export type Inputs = {
  client: string;
  year: string;
  revenueMillion: number;
  electricityKwh: number;
  dieselLiter: number;
  efElectricity: number;
  efDiesel: number;
  scope1Manual: number;
  scope2Manual: number;
  useActivityForGhg: boolean;
  waterKt: number;
  wasteT: number;
  wasteRecycledT: number;
  greenCapex: number;
  totalCapex: number;
  intensityTarget: number;
  headcountEnd: number;
  headcountAvg: number;
  newHires: number;
  leavers: number;
  trainingHours: number;
  workHours: number;
  disablingInjuries: number;
  lostDays: number;
  dueReview: number;
  doneReview: number;
  withEsgKpi: number;
  esgWeight: number;
  businessTarget: number;
  businessActual: number;
  esgTargetScore: number;
  esgActualScore: number;
  bonusPool: number;
  highestPay: number;
  medianPay: number;
  trainingHoursTarget: number;
};

export const defaultInputs: Inputs = {
  client: "綠能精密股份有限公司（示範）",
  year: "2025",
  revenueMillion: 12840,
  electricityKwh: 18600000,
  dieselLiter: 420000,
  efElectricity: 0.474,
  efDiesel: 2.606,
  scope1Manual: 0,
  scope2Manual: 0,
  useActivityForGhg: true,
  waterKt: 18,
  wasteT: 920,
  wasteRecycledT: 754,
  greenCapex: 1.6,
  totalCapex: 6.4,
  intensityTarget: 3.5,
  headcountEnd: 1280,
  headcountAvg: 1264,
  newHires: 148,
  leavers: 142,
  trainingHours: 35392,
  workHours: 2550000,
  disablingInjuries: 0,
  lostDays: 0,
  dueReview: 1264,
  doneReview: 1264,
  withEsgKpi: 86,
  esgWeight: 15,
  businessTarget: 120,
  businessActual: 128.4,
  esgTargetScore: 100,
  esgActualScore: 92,
  bonusPool: 1800,
  highestPay: 1280,
  medianPay: 112,
  trainingHoursTarget: 24,
};

export type Metric = {
  id: string;
  group: string;
  name: string;
  value: string;
  unit: string;
  formula: string;
  basis: string;
  compute: true;
  flag?: "ok" | "warn" | "fail";
  note?: string;
};

export type Check = {
  id: string;
  level: "通過" | "注意" | "異常";
  title: string;
  detail: string;
  basis: string;
};

export const regulationCatalog = [
  {
    id: "fsc-report",
    name: "上市櫃公司編製與申報永續報告書作業辦法",
    version: "金管會（現行作業辦法）",
    asOf: "2026-10",
    point: "應依 GRI 編製；溫室氣體應揭露最近兩年排放量、密集度（噸CO2e／百萬元）及涵蓋範圍。",
    url: "https://law.moj.gov.tw/",
  },
  {
    id: "gri-2021",
    name: "GRI Standards",
    version: "GRI 1／2／3（2021）及主題準則",
    asOf: "2026-10",
    point: "人力：401、403、404、405；薪酬：2-19、2-21；排放：305；能源：302。",
    url: "https://www.globalreporting.org/",
  },
  {
    id: "ghg",
    name: "GHG Protocol／ISO 14064-1",
    version: "盤查邊界須與合併報表對齊",
    asOf: "2026-10",
    point: "Scope 1／2 得以活動數據 × 排放係數；密集度分母用合併營收。",
    url: "https://ghgprotocol.org/",
  },
  {
    id: "ef",
    name: "電力／燃油排放係數（可覆核）",
    version: "預設電力 0.474 kgCO2e/kWh、柴油 2.606 kgCO2e/L（可改）",
    asOf: "2026-10",
    point: "係數應以環境部／能源署当期公告為準，工作底稿須留版本。",
    url: "https://www.moenv.gov.tw/",
  },
  {
    id: "osh",
    name: "職業安全衛生相關頻率公式",
    version: "對應 GRI 403-9；可採每百萬工時",
    asOf: "2026-10",
    point: "失能傷害頻率 FR = 失能傷害次數 × 10^6 ÷ 總經歷工時。",
    url: "https://www.osha.gov.tw/",
  },
  {
    id: "twse-csr",
    name: "上市上櫃公司永續發展實務守則 §9",
    version: "證交所／櫃買中心",
    asOf: "2026-10",
    point: "員工績效考核宜與永續發展政策結合，並設立獎勵及懲戒制度。",
    url: "https://twse-regulation.twse.com.tw/",
  },
];

function n(v: number) {
  if (!Number.isFinite(v)) return 0;
  return v;
}

function fmt(v: number, d = 2) {
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("zh-TW", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}

export function compute(i: Inputs) {
  const scope1FromActivity = (n(i.dieselLiter) * n(i.efDiesel)) / 1000;
  const scope2FromActivity = (n(i.electricityKwh) * n(i.efElectricity)) / 1000;
  const scope1 = i.useActivityForGhg ? scope1FromActivity : n(i.scope1Manual);
  const scope2 = i.useActivityForGhg ? scope2FromActivity : n(i.scope2Manual);
  const ghg = scope1 + scope2;
  const intensity = n(i.revenueMillion) === 0 ? NaN : ghg / n(i.revenueMillion);
  const intensityGap = n(i.intensityTarget) === 0 ? NaN : n(i.intensityTarget) - intensity;
  const intensityHit =
    Number.isFinite(intensity) && n(i.intensityTarget) > 0 ? intensity <= n(i.intensityTarget) : false;
  const waterInt = n(i.revenueMillion) === 0 ? NaN : n(i.waterKt) / n(i.revenueMillion);
  const recycle = n(i.wasteT) === 0 ? NaN : (n(i.wasteRecycledT) / n(i.wasteT)) * 100;
  const greenRatio = n(i.totalCapex) === 0 ? NaN : (n(i.greenCapex) / n(i.totalCapex)) * 100;
  const turnover = n(i.headcountAvg) === 0 ? NaN : (n(i.leavers) / n(i.headcountAvg)) * 100;
  const hireRate = n(i.headcountAvg) === 0 ? NaN : (n(i.newHires) / n(i.headcountAvg)) * 100;
  const trainPer = n(i.headcountAvg) === 0 ? NaN : n(i.trainingHours) / n(i.headcountAvg);
  const trainHit = Number.isFinite(trainPer) && trainPer >= n(i.trainingHoursTarget);
  const fr = n(i.workHours) === 0 ? NaN : (n(i.disablingInjuries) * 1_000_000) / n(i.workHours);
  const sr = n(i.workHours) === 0 ? NaN : (n(i.lostDays) * 1_000_000) / n(i.workHours);
  const reviewPct = n(i.dueReview) === 0 ? NaN : (n(i.doneReview) / n(i.dueReview)) * 100;
  const esgKpiPct = n(i.headcountEnd) === 0 ? NaN : (n(i.withEsgKpi) / n(i.headcountEnd)) * 100;
  const bizHit = n(i.businessTarget) === 0 ? NaN : (n(i.businessActual) / n(i.businessTarget)) * 100;
  const esgHit = n(i.esgTargetScore) === 0 ? NaN : (n(i.esgActualScore) / n(i.esgTargetScore)) * 100;
  const w = Math.min(Math.max(n(i.esgWeight), 0), 100) / 100;
  const weighted = (1 - w) * (bizHit || 0) + w * (esgHit || 0);
  const esgBonus = n(i.bonusPool) * w * ((esgHit || 0) / 100);
  const payRatio = n(i.medianPay) === 0 ? NaN : n(i.highestPay) / n(i.medianPay);

  const metrics: Metric[] = [
    {
      id: "s1",
      group: "E 環境",
      name: "Scope 1 排放",
      value: fmt(scope1, 1),
      unit: "tCO2e",
      formula: i.useActivityForGhg ? "柴油(L) × 柴油係數 ÷ 1000" : "人工輸入盤查值",
      basis: "ISO 14064-1／GHG Protocol",
      compute: true,
      flag: "ok",
    },
    {
      id: "s2",
      group: "E 環境",
      name: "Scope 2 排放",
      value: fmt(scope2, 1),
      unit: "tCO2e",
      formula: i.useActivityForGhg ? "電力(kWh) × 電力係數 ÷ 1000" : "人工輸入盤查值",
      basis: "ISO 14064-1／GHG Protocol",
      compute: true,
    },
    {
      id: "ghg",
      group: "E 環境",
      name: "Scope 1+2 合計",
      value: fmt(ghg, 1),
      unit: "tCO2e",
      formula: "S1 + S2",
      basis: "金管會：最近兩年排放量",
      compute: true,
    },
    {
      id: "int",
      group: "E 環境",
      name: "排放密集度",
      value: fmt(intensity, 4),
      unit: "tCO2e／百萬營收",
      formula: "(S1+S2) ÷ 合併營收(百萬)",
      basis: "金管會作業辦法；GRI 305-4",
      compute: true,
      flag: intensityHit ? "ok" : "warn",
      note: intensityHit ? "低於或等於目標" : "高於目標或目標未設",
    },
    {
      id: "intgap",
      group: "E 環境",
      name: "密集度目標差距",
      value: fmt(intensityGap, 4),
      unit: "tCO2e／百萬營收",
      formula: "目標 − 實際（正數為優於目標）",
      basis: "氣候目標進度揭露",
      compute: true,
    },
    {
      id: "water",
      group: "E 環境",
      name: "用水密集度",
      value: fmt(waterInt, 4),
      unit: "千噸／百萬營收",
      formula: "取水 ÷ 合併營收(百萬)",
      basis: "GRI 303 × 財報分母",
      compute: true,
    },
    {
      id: "rec",
      group: "E 環境",
      name: "廢棄物回收率",
      value: fmt(recycle, 1),
      unit: "%",
      formula: "回收量 ÷ 產生量 × 100",
      basis: "GRI 306",
      compute: true,
    },
    {
      id: "green",
      group: "E 環境",
      name: "綠色資本支出比",
      value: fmt(greenRatio, 1),
      unit: "%",
      formula: "綠色資本支出 ÷ 總資本支出 × 100",
      basis: "可對現金流量表／資產增加",
      compute: true,
    },
    {
      id: "turn",
      group: "S 人力",
      name: "員工流動率",
      value: fmt(turnover, 2),
      unit: "%",
      formula: "離職人數 ÷ 平均人數 × 100",
      basis: "GRI 401-1（分母用平均人數）",
      compute: true,
    },
    {
      id: "hire",
      group: "S 人力",
      name: "新進率",
      value: fmt(hireRate, 2),
      unit: "%",
      formula: "新進人數 ÷ 平均人數 × 100",
      basis: "GRI 401-1",
      compute: true,
    },
    {
      id: "train",
      group: "S 人力",
      name: "人均訓練時數",
      value: fmt(trainPer, 1),
      unit: "小時",
      formula: "總訓練時數 ÷ 平均人數",
      basis: "GRI 404-1",
      compute: true,
      flag: trainHit ? "ok" : "warn",
    },
    {
      id: "fr",
      group: "S 職安",
      name: "失能傷害頻率 FR",
      value: fmt(fr, 3),
      unit: "次／百萬工時",
      formula: "失能傷害次數 × 10^6 ÷ 總經歷工時",
      basis: "GRI 403-9",
      compute: true,
    },
    {
      id: "sr",
      group: "S 職安",
      name: "傷害嚴重率 SR",
      value: fmt(sr, 3),
      unit: "日／百萬工時",
      formula: "損失日數 × 10^6 ÷ 總經歷工時",
      basis: "職安揭露慣例／GRI 403-9",
      compute: true,
    },
    {
      id: "rev",
      group: "S 績效KPI",
      name: "績效考核覆蓋率",
      value: fmt(reviewPct, 1),
      unit: "%",
      formula: "已考核人數 ÷ 應考核人數 × 100",
      basis: "GRI 404-3",
      compute: true,
      flag: reviewPct >= 100 ? "ok" : "warn",
    },
    {
      id: "esgcover",
      group: "S 績效KPI",
      name: "納入ESG KPI員工比",
      value: fmt(esgKpiPct, 1),
      unit: "%",
      formula: "有ESG指標人數 ÷ 期末人數 × 100",
      basis: "永續發展實務守則 §9",
      compute: true,
      flag: esgKpiPct >= 5 ? "ok" : "warn",
      note: "業務完成率不列入此值",
    },
    {
      id: "biz",
      group: "S 績效KPI",
      name: "業務目標達成率",
      value: fmt(bizHit, 1),
      unit: "%",
      formula: "實際業績 ÷ 業務目標 × 100",
      basis: "財務構面KPI（非GRI社會指標）",
      compute: true,
      note: "僅作薪酬加權輸入，不當作S分數",
    },
    {
      id: "esghit",
      group: "S 績效KPI",
      name: "ESG KPI達成率",
      value: fmt(esgHit, 1),
      unit: "%",
      formula: "ESG實際分數 ÷ ESG目標 × 100",
      basis: "GRI 2-19 薪酬與永續連結",
      compute: true,
    },
    {
      id: "wtd",
      group: "S 績效KPI",
      name: "加權績效達成率",
      value: fmt(weighted, 1),
      unit: "%",
      formula: "(1−ESG權重)×業務達成率 + ESG權重×ESG達成率",
      basis: "高階／單位績效獎金計算",
      compute: true,
    },
    {
      id: "bonus",
      group: "G 薪酬",
      name: "ESG連動獎金試算",
      value: fmt(esgBonus, 0),
      unit: "萬元",
      formula: "獎金池 × ESG權重 × ESG達成率",
      basis: "GRI 2-19；薪酬委員會底稿",
      compute: true,
    },
    {
      id: "pay",
      group: "G 薪酬",
      name: "最高薪／中位數比",
      value: fmt(payRatio, 2),
      unit: "倍",
      formula: "最高個人年薪 ÷ 其他員工年薪中位數",
      basis: "GRI 2-21",
      compute: true,
    },
  ];

  const checks: Check[] = [];
  if (n(i.revenueMillion) <= 0) {
    checks.push({
      id: "rev0",
      level: "異常",
      title: "合併營收未輸入",
      detail: "密集度分母為 0，環境指標無法計算。",
      basis: "金管會密集度單位：噸CO2e／百萬元",
    });
  }
  if (i.useActivityForGhg && (n(i.efElectricity) <= 0 || n(i.efDiesel) <= 0)) {
    checks.push({
      id: "ef0",
      level: "異常",
      title: "排放係數為 0",
      detail: "請改為環境部／能源署當期公告係數並留下版本。",
      basis: "係數版本須可覆核",
    });
  }
  if (n(i.wasteRecycledT) > n(i.wasteT) && n(i.wasteT) > 0) {
    checks.push({
      id: "waste",
      level: "異常",
      title: "回收量大於產生量",
      detail: "廢棄物回收率超過 100%，請核對底稿。",
      basis: "GRI 306 數量勾稽",
    });
  }
  if (n(i.doneReview) > n(i.dueReview)) {
    checks.push({
      id: "revn",
      level: "異常",
      title: "已考核人數大於應考核人數",
      detail: "GRI 404-3 覆蓋率分母錯誤。",
      basis: "GRI 404-3",
    });
  }
  if (n(i.headcountAvg) <= 0) {
    checks.push({
      id: "avg",
      level: "異常",
      title: "平均人數未輸入",
      detail: "流動率、新進率、人均訓練無法計算。勿用單一期末人數當分母。",
      basis: "GRI 401-1、404-1",
    });
  }
  if (n(i.esgWeight) < 10) {
    checks.push({
      id: "w",
      level: "注意",
      title: "高階ESG薪酬權重偏低",
      detail: `目前 ${i.esgWeight}%。實務常見高階變動薪酬ESG權重約 10–20%。`,
      basis: "GRI 2-19；永續發展實務守則 §9",
    });
  }
  if (n(i.withEsgKpi) === 0) {
    checks.push({
      id: "nokpi",
      level: "注意",
      title: "尚未把永續指標寫進員工KPI",
      detail: "業務完成率可輸入，但不會自動變成社會面分數。請至少對永續相關單位設定ESG KPI。",
      basis: "永續發展實務守則 §9",
    });
  }
  if (!intensityHit && Number.isFinite(intensity)) {
    checks.push({
      id: "intw",
      level: "注意",
      title: "排放密集度未達目標",
      detail: `實際 ${fmt(intensity, 4)}，目標 ${fmt(i.intensityTarget, 4)}。`,
      basis: "氣候目標進度",
    });
  }
  if (n(i.workHours) > 0 && n(i.headcountAvg) > 0) {
    const hoursPer = n(i.workHours) / n(i.headcountAvg);
    if (hoursPer < 1400 || hoursPer > 2800) {
      checks.push({
        id: "hrs",
        level: "注意",
        title: "總工時與人數比不合理",
        detail: `人均經歷工時約 ${fmt(hoursPer, 0)} 小時，請核對職安年報工時。`,
        basis: "GRI 403-9 分母",
      });
    }
  }
  if (checks.length === 0) {
    checks.push({
      id: "ok",
      level: "通過",
      title: "勾稽未發現異常",
      detail: "分母、係數與人數關係可進入覆核。係數仍請對照當期公告。",
      basis: "工作底稿覆核",
    });
  }

  return { scope1, scope2, ghg, intensity, metrics, checks };
}
