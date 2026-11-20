import { OFFICIAL_FACTOR_KEYS, officialValues } from "@/lib/official-factors";
import { annexInputKeys, topicFlags, type IndustryId } from "@/lib/industry-rules";

export type Inputs = {
  client: string;
  year: string;
  industry: IndustryId | "";
  capitalBillion: number;
  diningRevenuePct: number;
  moenvRegulated: boolean;
  esrsRequired: boolean;
  refrigerantCode: string;
  revenueMillion: number;
  rdExpense: number;
  energyExpense: number;
  electricityKwh: number;
  renewableKwh: number;
  dieselLiter: number;
  gasolineLiter: number;
  lngM3: number;
  refrigerantKg: number;
  steamGj: number;
  efElectricity: number;
  efDiesel: number;
  efGasoline: number;
  efLng: number;
  gwpRefrigerant: number;
  scope1Manual: number;
  scope2Manual: number;
  scope3: number;
  useActivityForGhg: boolean;
  waterKt: number;
  wastewaterKt: number;
  wasteT: number;
  wasteRecycledT: number;
  wasteHazardT: number;
  noxT: number;
  soxT: number;
  greenCapex: number;
  totalCapex: number;
  intensityTarget: number;
  headcountEnd: number;
  headcountAvg: number;
  headcountFemale: number;
  headcountDisabled: number;
  newHires: number;
  leavers: number;
  contractors: number;
  trainingHours: number;
  trainingFemaleHours: number;
  workHours: number;
  disablingInjuries: number;
  lostDays: number;
  fatalities: number;
  recordableInjuries: number;
  parentalDue: number;
  parentalReturn: number;
  femaleManagers: number;
  totalManagers: number;
  unionCovered: number;
  dueReview: number;
  doneReview: number;
  withEsgKpi: number;
  humanRightsTrained: number;
  supplierCount: number;
  supplierScreened: number;
  communitySpend: number;
  boardSeats: number;
  independentSeats: number;
  boardMeetings: number;
  boardAttend: number;
  antiCorruptDue: number;
  antiCorruptDone: number;
  legalFines: number;
  isoCert: number;
  infoSecIncidents: number;
  esgWeight: number;
  businessTarget: number;
  businessActual: number;
  esgTargetScore: number;
  esgActualScore: number;
  bonusPool: number;
  highestPay: number;
  medianPay: number;
  femalePay: number;
  malePay: number;
  trainingHoursTarget: number;
  execFinPoints: number;
  execEsgPoints: number;
  execOtherPoints: number;
  capexEnergySave: number;
  capexRenewable: number;
  capexPollution: number;
  capexOtherGreen: number;
  prevGhg12: number;
  prevRevenueMillion: number;
  eWasteTon: number;
  eWasteRecyclePct: number;
  antitrustLossWan: number;
  mainProductOutput: number;
  fuelGj: number;
  coalFuelPct: number;
  gasFuelPct: number;
  renewableFuelPct: number;
  selfGenGj: number;
  refineriesDense: number;
  foodSafetyAssessPct: number;
  healthSafetyIncidents: number;
  productRecallTimes: number;
  productRecallTon: number;
  responsibleSourcingPct: number;
  certifiedPlantProductPct: number;
  supplierAuditedCount: number;
  traceableProductPct: number;
  foodLabSpendThousand: number;
  soldProductTon: number;
  plantCount: number;
  dataBreaches: number;
  personalDataBreachPct: number;
  customersAffected: number;
  smeLoanCount: number;
  smeLoanBalanceMillion: number;
  financialEduPeople: number;
};

export const defaultInputs: Inputs = {
  client: "",
  year: "2025",
  industry: "",
  capitalBillion: 0,
  diningRevenuePct: 0,
  moenvRegulated: false,
  esrsRequired: false,
  refrigerantCode: "R-134a",
  revenueMillion: 12840,
  rdExpense: 4.8,
  energyExpense: 2.1,
  electricityKwh: 18600000,
  renewableKwh: 5208000,
  dieselLiter: 420000,
  gasolineLiter: 38000,
  lngM3: 210000,
  refrigerantKg: 42,
  steamGj: 1200,
  efElectricity: 0.474,
  efDiesel: 2.606,
  efGasoline: 2.263,
  efLng: 2.18,
  gwpRefrigerant: 1430,
  scope1Manual: 0,
  scope2Manual: 0,
  scope3: 18400,
  useActivityForGhg: true,
  waterKt: 18,
  wastewaterKt: 14.2,
  wasteT: 920,
  wasteRecycledT: 754,
  wasteHazardT: 36,
  noxT: 12.4,
  soxT: 3.1,
  greenCapex: 1.6,
  totalCapex: 6.4,
  intensityTarget: 3.5,
  headcountEnd: 1280,
  headcountAvg: 1264,
  headcountFemale: 486,
  headcountDisabled: 16,
  newHires: 148,
  leavers: 142,
  contractors: 94,
  trainingHours: 35392,
  trainingFemaleHours: 12800,
  workHours: 2550000,
  disablingInjuries: 0,
  lostDays: 0,
  fatalities: 0,
  recordableInjuries: 2,
  parentalDue: 18,
  parentalReturn: 17,
  femaleManagers: 42,
  totalManagers: 168,
  unionCovered: 0,
  dueReview: 1264,
  doneReview: 1264,
  withEsgKpi: 86,
  humanRightsTrained: 1200,
  supplierCount: 220,
  supplierScreened: 200,
  communitySpend: 0.12,
  boardSeats: 7,
  independentSeats: 3,
  boardMeetings: 8,
  boardAttend: 54,
  antiCorruptDue: 1280,
  antiCorruptDone: 1280,
  legalFines: 0,
  isoCert: 3,
  infoSecIncidents: 0,
  esgWeight: 15,
  businessTarget: 120,
  businessActual: 128.4,
  esgTargetScore: 100,
  esgActualScore: 92,
  bonusPool: 1800,
  highestPay: 1280,
  medianPay: 112,
  femalePay: 108,
  malePay: 116,
  trainingHoursTarget: 24,
  execFinPoints: 70,
  execEsgPoints: 15,
  execOtherPoints: 15,
  capexEnergySave: 0.8,
  capexRenewable: 0.5,
  capexPollution: 0.2,
  capexOtherGreen: 0.1,
  prevGhg12: 11240,
  prevRevenueMillion: 12110,
  eWasteTon: 12,
  eWasteRecyclePct: 86,
  antitrustLossWan: 0,
  mainProductOutput: 0,
  fuelGj: 0,
  coalFuelPct: 0,
  gasFuelPct: 0,
  renewableFuelPct: 0,
  selfGenGj: 0,
  refineriesDense: 0,
  foodSafetyAssessPct: 0,
  healthSafetyIncidents: 0,
  productRecallTimes: 0,
  productRecallTon: 0,
  responsibleSourcingPct: 0,
  certifiedPlantProductPct: 0,
  supplierAuditedCount: 0,
  traceableProductPct: 0,
  foodLabSpendThousand: 0,
  soldProductTon: 0,
  plantCount: 0,
  dataBreaches: 0,
  personalDataBreachPct: 0,
  customersAffected: 0,
  smeLoanCount: 0,
  smeLoanBalanceMillion: 0,
  financialEduPeople: 0,
};

export type FieldDef = {
  key: keyof Inputs;
  sheet: string;
  section: string;
  label: string;
  unit: string;
  why: string;
  gri: string;
  fromPre?: boolean;
  industryIds?: IndustryId[];
};

export const fieldCatalog: FieldDef[] = [
  { key: "execFinPoints", sheet: "kpi", section: "高階薪酬與永續連結（公司考核設計）", label: "財務／營運績效配分", unit: "%", why: "GRI 2-19 要求說明薪酬政策如何與目標連結；配分百分比是公司考核表上的權重，不是準則專名。", gri: "GRI 2-19" },
  { key: "execEsgPoints", sheet: "kpi", section: "高階薪酬與永續連結（公司考核設計）", label: "永續績效配分", unit: "%", why: "同上。用來算出高階薪酬中與永續相關之權重。", gri: "GRI 2-19" },
  { key: "execOtherPoints", sheet: "kpi", section: "高階薪酬與永續連結（公司考核設計）", label: "其他配分", unit: "%", why: "職能等其餘權重。權重＝永續配分÷三項合計。", gri: "GRI 2-19" },
  { key: "capexEnergySave", sheet: "fin", section: "氣候／環保相關資本支出（實務加總，非法規專名）", label: "節能設備資本支出", unit: "億元", why: "帳載固定資產增加。金管會氣候資訊要求揭露因應氣候之資本支出，準則未規定此分項名稱。", gri: "金管會氣候相關資訊" },
  { key: "capexRenewable", sheet: "fin", section: "氣候／環保相關資本支出（實務加總，非法規專名）", label: "再生能源設備資本支出", unit: "億元", why: "同上。再生能源設備投資屬氣候減緩相關資本支出之常見分項，非 GRI 專名。", gri: "金管會氣候相關資訊" },
  { key: "capexPollution", sheet: "fin", section: "氣候／環保相關資本支出（實務加總，非法規專名）", label: "污染防治設備資本支出", unit: "億元", why: "環保設備投資。非 GRI 專名；年報／報告書常見揭露。", gri: "年報環保支出實務" },
  { key: "capexOtherGreen", sheet: "fin", section: "氣候／環保相關資本支出（實務加總，非法規專名）", label: "其他氣候／環保資本支出", unit: "億元", why: "其餘可歸入氣候減緩、調適或污染防治之資本支出。加總名稱由本系統設定，非法規專名。", gri: "金管會氣候相關資訊" },
  { key: "revenueMillion", sheet: "fin", section: "財務分母", label: "合併營收", unit: "百萬元", why: "必要。合併綜合損益表之營業收入。金管會永續報告書作業辦法及 GRI 305-4 密集度可選營收作分母。", gri: "金管會作業辦法；GRI 305-4" },
  { key: "totalCapex", sheet: "fin", section: "財務分母", label: "購置不動產廠房及設備", unit: "億元", why: "現金流量表投資活動「購置不動產、廠房及設備」之數。本系統用作資本支出占比分母。", gri: "IAS 7／現金流量表" },
  { key: "greenCapex", sheet: "fin", section: "財務分母", label: "氣候／環保相關資本支出合計", unit: "億元", why: "本頁四項加總。非法規專名「綠色資本支出」；對應氣候資訊中之相關資本支出加總。", gri: "金管會氣候相關資訊", fromPre: true },
  { key: "communitySpend", sheet: "fin", section: "財務分母", label: "基礎設施投資與公益捐贈", unit: "億元", why: "GRI 203-1 為基礎設施投資與支援服務；捐贈常一併揭露，準則未強制使用「公益支出」一詞。", gri: "GRI 203-1" },
  { key: "electricityKwh", sheet: "env", section: "能源與排放", label: "外購電力", unit: "kWh", why: "電費單度數。屬範疇二用量；系統再×電力係數得到排放。詳見法規庫。", gri: "GRI 302-1、305-2" },
  { key: "renewableKwh", sheet: "env", section: "能源與排放", label: "再生能源電力", unit: "kWh", why: "綠電或憑證度數，用來算占外購電力的比例。詳見法規庫。", gri: "GRI 302-1" },
  { key: "dieselLiter", sheet: "env", section: "能源與排放", label: "柴油用量", unit: "L", why: "加油公升數（範疇一用量）。無柴油填 0。詳見法規庫「範疇一」。", gri: "GRI 305-1" },
  { key: "gasolineLiter", sheet: "env", section: "能源與排放", label: "汽油用量", unit: "L", why: "加油公升數（範疇一用量）。無汽油填 0。詳見法規庫「範疇一」。", gri: "GRI 305-1" },
  { key: "lngM3", sheet: "env", section: "能源與排放", label: "天然氣用量", unit: "m³", why: "天然氣立方公尺（範疇一用量）。無天然氣填 0。詳見法規庫「範疇一」。", gri: "GRI 305-1" },
  { key: "refrigerantKg", sheet: "env", section: "能源與排放", label: "冷媒逸散", unit: "kg", why: "補填或逸散公斤數（範疇一）。當年沒補填填 0。詳見法規庫。", gri: "GRI 305-1、305-6" },
  { key: "steamGj", sheet: "env", section: "能源與排放", label: "外購蒸汽", unit: "GJ", why: "向外購買的蒸汽熱值。屬範疇二。沒有外購蒸汽填 0。詳見法規庫。", gri: "GRI 302-1、305-2" },
  { key: "scope3", sheet: "env", section: "能源與排放", label: "範疇三（其他間接排放）", unit: "tCO2e", why: "GHG Protocol／GRI 305-3。請填已盤查彙總值，非本系統由活動數據推算。", gri: "GRI 305-3；GHG Protocol" },
  { key: "prevGhg12", sheet: "env", section: "上年對照（金管會兩年比較）", label: "上年範疇一＋二", unit: "tCO2e", why: "非必要。抄上年報告書已揭露之範疇一加範疇二。沒有上年就填 0，系統只出當年。", gri: "金管會作業辦法（最近兩年排放量）" },
  { key: "prevRevenueMillion", sheet: "env", section: "上年對照（金管會兩年比較）", label: "上年合併營收", unit: "百萬元", why: "非必要。與上年排放同一報導邊界。系統用它算出上年密集度，不必手填密集度。", gri: "金管會作業辦法（最近兩年密集度）" },
  { key: "eWasteTon", sheet: "ind", section: "附表一產業指標", label: "報廢產品及電子廢棄物重量", unit: "公噸", why: "作業辦法附表一之八至十四編號五。含下腳料賣出或其他回收處理者，應於報告書說明。", gri: "作業辦法第4條附表一之八至十四" },
  { key: "eWasteRecyclePct", sheet: "ind", section: "附表一產業指標", label: "電子廢棄物再循環百分比", unit: "%", why: "作業辦法附表一之八至十四編號五。", gri: "作業辦法第4條附表一之八至十四" },
  { key: "antitrustLossWan", sheet: "ind", section: "附表一產業指標", label: "反競爭行為訴訟之金錢損失", unit: "萬元", why: "作業辦法附表一之八至十四編號七。無事件填 0。", gri: "作業辦法第4條附表一之八至十四" },
  { key: "mainProductOutput", sheet: "ind", section: "附表一產業指標", label: "主要產品產量", unit: "依產品", why: "各產業附表一「依產品類別之主要產品產量」。單位依產品類型於報告書敘明。", gri: "作業辦法第4條附表一" },
  { key: "fuelGj", sheet: "ind", section: "附表一產業指標", label: "消耗燃料總量", unit: "GJ", why: "鋼鐵工業附表一之六編號二。", gri: "作業辦法第4條附表一之六" },
  { key: "coalFuelPct", sheet: "ind", section: "附表一產業指標", label: "燃料中煤炭百分比", unit: "%", why: "鋼鐵工業附表一之六編號二。", gri: "作業辦法第4條附表一之六" },
  { key: "gasFuelPct", sheet: "ind", section: "附表一產業指標", label: "燃料中天然氣百分比", unit: "%", why: "鋼鐵工業附表一之六編號二。", gri: "作業辦法第4條附表一之六" },
  { key: "renewableFuelPct", sheet: "ind", section: "附表一產業指標", label: "再生燃料百分比", unit: "%", why: "鋼鐵工業附表一之六編號二。", gri: "作業辦法第4條附表一之六" },
  { key: "selfGenGj", sheet: "ind", section: "附表一產業指標", label: "自發自用能源總量", unit: "GJ", why: "化學、塑膠、鋼鐵附表一。定義依再生能源發展條例或再生能源憑證實施辦法。", gri: "作業辦法第4條附表一" },
  { key: "refineriesDense", sheet: "ind", section: "附表一產業指標", label: "人口密集地區煉油廠數量", unit: "座", why: "油電燃氣業附表一之七編號一。", gri: "作業辦法第4條附表一之七" },
  { key: "foodSafetyAssessPct", sheet: "ind", section: "附表一產業指標", label: "食安評估改進所影響產品百分比", unit: "%", why: "食品工業附表一之一編號一。", gri: "作業辦法第4條附表一之一" },
  { key: "healthSafetyIncidents", sheet: "ind", section: "附表一產業指標", label: "健康安全／標示法規事件次數", unit: "次", why: "食品工業附表一之一編號二。", gri: "作業辦法第4條附表一之一" },
  { key: "productRecallTimes", sheet: "ind", section: "附表一產業指標", label: "產品下架次數", unit: "次", why: "食品工業附表一之一編號二。", gri: "作業辦法第4條附表一之一" },
  { key: "productRecallTon", sheet: "ind", section: "附表一產業指標", label: "下架產品總重量", unit: "公噸", why: "食品工業附表一之一編號二。", gri: "作業辦法第4條附表一之一" },
  { key: "responsibleSourcingPct", sheet: "ind", section: "附表一產業指標", label: "符合產品責任標準之採購百分比", unit: "%", why: "食品工業附表一之一編號三。", gri: "作業辦法第4條附表一之一" },
  { key: "certifiedPlantProductPct", sheet: "ind", section: "附表一產業指標", label: "通過食安驗證廠房所生產產品百分比", unit: "%", why: "食品工業附表一之一編號四。", gri: "作業辦法第4條附表一之一" },
  { key: "supplierAuditedCount", sheet: "ind", section: "附表一產業指標", label: "供應商稽核家數", unit: "家", why: "食品工業附表一之一編號五。", gri: "作業辦法第4條附表一之一" },
  { key: "traceableProductPct", sheet: "ind", section: "附表一產業指標", label: "可追溯追蹤產品百分比", unit: "%", why: "食品工業附表一之一編號六。", gri: "作業辦法第4條附表一之一" },
  { key: "foodLabSpendThousand", sheet: "ind", section: "附表一產業指標", label: "食品安全實驗室相關支出", unit: "仟元", why: "食品工業附表一之一編號七。系統另以營收計算占比。", gri: "作業辦法第4條附表一之一" },
  { key: "soldProductTon", sheet: "ind", section: "附表一產業指標", label: "售出產品重量", unit: "公噸", why: "食品工業附表一之一編號十。", gri: "作業辦法第4條附表一之一" },
  { key: "plantCount", sheet: "ind", section: "附表一產業指標", label: "生產設施場所數量", unit: "處", why: "食品工業附表一之一編號十。", gri: "作業辦法第4條附表一之一" },
  { key: "dataBreaches", sheet: "ind", section: "附表一產業指標", label: "資訊外洩事件數量", unit: "件", why: "金融保險業附表一之三編號一。", gri: "作業辦法第4條附表一之三" },
  { key: "personalDataBreachPct", sheet: "ind", section: "附表一產業指標", label: "與個資相關之外洩事件占比", unit: "%", why: "金融保險業附表一之三編號一。", gri: "作業辦法第4條附表一之三" },
  { key: "customersAffected", sheet: "ind", section: "附表一產業指標", label: "因資訊外洩受影響顧客數", unit: "人", why: "金融保險業附表一之三編號一。", gri: "作業辦法第4條附表一之三" },
  { key: "smeLoanCount", sheet: "ind", section: "附表一產業指標", label: "促進小型企業及社區發展之貸放件數", unit: "件", why: "金融保險業附表一之三編號二。", gri: "作業辦法第4條附表一之三" },
  { key: "smeLoanBalanceMillion", sheet: "ind", section: "附表一產業指標", label: "上述貸放餘額", unit: "百萬元", why: "金融保險業附表一之三編號二。", gri: "作業辦法第4條附表一之三" },
  { key: "financialEduPeople", sheet: "ind", section: "附表一產業指標", label: "弱勢族群金融教育參與人數", unit: "人", why: "金融保險業附表一之三編號三。", gri: "作業辦法第4條附表一之三" },
  { key: "intensityTarget", sheet: "env", section: "能源與排放", label: "溫室氣體排放密集度（公司目標）", unit: "tCO2e／百萬營收", why: "GRI 305-4 為密集度本身；目標值由組織自訂，非準則規定之法定數字。", gri: "GRI 305-4；TCFD 指標與目標" },
  { key: "waterKt", sheet: "env", section: "水與廢棄物", label: "取水量", unit: "千噸", why: "用水密集度分子；耗水＝取水−放流。", gri: "GRI 303-3" },
  { key: "wastewaterKt", sheet: "env", section: "水與廢棄物", label: "放流水量", unit: "千噸", why: "耗水計算減項。", gri: "GRI 303-4、303-5" },
  { key: "wasteT", sheet: "env", section: "水與廢棄物", label: "廢棄物產生", unit: "噸", why: "回收率、有害比分母。", gri: "GRI 306-3" },
  { key: "wasteRecycledT", sheet: "env", section: "水與廢棄物", label: "廢棄物回收／再利用", unit: "噸", why: "回收率分子。", gri: "GRI 306-4" },
  { key: "wasteHazardT", sheet: "env", section: "水與廢棄物", label: "有害廢棄物", unit: "噸", why: "有害廢棄物比分子。", gri: "GRI 306" },
  { key: "noxT", sheet: "env", section: "水與廢棄物", label: "NOx 排放", unit: "噸", why: "空氣污染物揭露。", gri: "GRI 305-7" },
  { key: "soxT", sheet: "env", section: "水與廢棄物", label: "SOx 排放", unit: "噸", why: "空氣污染物揭露。", gri: "GRI 305-7" },
  { key: "efElectricity", sheet: "par", section: "係數", label: "電力排放係數", unit: "kgCO2e/kWh", why: "來源：經濟部能源署當年度電力排碳係數（產業盤查）。", gri: "能源署公告" },
  { key: "efDiesel", sheet: "par", section: "係數", label: "柴油係數", unit: "kgCO2e/L", why: "來源：《溫室氣體排放係數管理表》6.0.4版。", gri: "環境部係數管理表" },
  { key: "efGasoline", sheet: "par", section: "係數", label: "汽油係數", unit: "kgCO2e/L", why: "來源：《溫室氣體排放係數管理表》6.0.4版。", gri: "環境部係數管理表" },
  { key: "efLng", sheet: "par", section: "係數", label: "天然氣係數", unit: "kgCO2e/m³", why: "來源：《溫室氣體排放係數管理表》6.0.4版。", gri: "環境部係數管理表" },
  { key: "gwpRefrigerant", sheet: "par", section: "係數", label: "冷媒 GWP", unit: "倍", why: "來源：IPCC（2024年起盤查採 AR5）。依冷媒代碼帶入。", gri: "IPCC；盤查作業指引" },
  { key: "headcountEnd", sheet: "hr", section: "人力結構", label: "報導期間結束日員工總數", unit: "人", why: "必要。GRI 2-7 員工總數。準則允許結束日或期間平均；本欄填結束日人數（人數，非約當全職）。", gri: "GRI 2-7" },
  { key: "headcountAvg", sheet: "hr", section: "人力結構", label: "報導期間平均員工數", unit: "人", why: "必要。GRI 2-7 允許的另一種時點。GRI 401-1 新進／離職、404-1 平均受訓時數實務上多用此數作分母。", gri: "GRI 2-7、401-1、404-1" },
  { key: "headcountFemale", sheet: "hr", section: "人力結構", label: "女性員工數（結束日）", unit: "人", why: "GRI 2-7／405-1 要求員工及治理單位依性別細分。須與結束日員工總數同一時點。", gri: "GRI 2-7、405-1" },
  { key: "headcountDisabled", sheet: "hr", section: "人力結構", label: "身心障礙員工數", unit: "人", why: "身心障礙者權益保障法用詞。GRI 405-1 為多元化類別，未強制使用「身障」簡稱。", gri: "GRI 405-1；身權法" },
  { key: "contractors", sheet: "hr", section: "人力結構", label: "非員工的工作者", unit: "人", why: "GRI 2-8 專名：Workers who are not employees（承攬、派遣等由組織控制工作的人）。", gri: "GRI 2-8" },
  { key: "newHires", sheet: "hr", section: "人力結構", label: "新進員工數", unit: "人", why: "GRI 401-1 新進員工總數。", gri: "GRI 401-1" },
  { key: "leavers", sheet: "hr", section: "人力結構", label: "離職員工數", unit: "人", why: "GRI 401-1 員工離職總數。報告書用「離職率」，不是人資口語「流動率」。", gri: "GRI 401-1" },
  { key: "trainingHours", sheet: "hr", section: "訓練與職安", label: "員工訓練總時數", unit: "小時", why: "GRI 404-1 平均每位員工受訓時數＝總時數÷平均員工數。", gri: "GRI 404-1" },
  { key: "trainingFemaleHours", sheet: "hr", section: "訓練與職安", label: "女性員工訓練時數", unit: "小時", why: "GRI 404-1 應依性別細分平均受訓時數。", gri: "GRI 404-1" },
  { key: "trainingHoursTarget", sheet: "hr", section: "訓練與職安", label: "平均受訓時數（內部目標）", unit: "小時", why: "公司自訂目標，非 GRI／金管會法定名詞。", gri: "內部目標（非準則專名）" },
  { key: "workHours", sheet: "hr", section: "訓練與職安", label: "總經歷工時", unit: "小時", why: "勞動部職業災害統計用語。失能傷害頻率、嚴重率之分母；亦作 GRI 403-9 工時分母。", gri: "勞動部職災統計；GRI 403-9" },
  { key: "disablingInjuries", sheet: "hr", section: "訓練與職安", label: "失能傷害次數", unit: "次", why: "勞動部職業災害統計：失能傷害頻率（FR）＝次數×10^6÷總經歷工時。GRI 403-9 口徑不完全相同。", gri: "勞動部職災統計" },
  { key: "lostDays", sheet: "hr", section: "訓練與職安", label: "失能傷害損失日數", unit: "日", why: "勞動部職業災害統計：失能傷害嚴重率（SR）＝損失日數×10^6÷總經歷工時。", gri: "勞動部職災統計" },
  { key: "fatalities", sheet: "hr", section: "訓練與職安", label: "職業傷害死亡人數", unit: "人", why: "GRI 403-9 應單獨揭露工作相關死亡人數。", gri: "GRI 403-9" },
  { key: "recordableInjuries", sheet: "hr", section: "訓練與職安", label: "可記錄之職業傷害件數", unit: "件", why: "GRI 403-9 recordable work-related injuries。TRIR 為美國 OSHA 常用率，非台灣職安法專名。", gri: "GRI 403-9" },
  { key: "parentalDue", sheet: "hr", section: "權益與供應鏈", label: "育嬰留職停薪到期應復職人數", unit: "人", why: "GRI 401-3：報導期間結束育嬰假、有權復職之員工。", gri: "GRI 401-3" },
  { key: "parentalReturn", sheet: "hr", section: "權益與供應鏈", label: "育嬰留職停薪後實際復職人數", unit: "人", why: "GRI 401-3：上述人員中實際復職人數。", gri: "GRI 401-3" },
  { key: "femaleManagers", sheet: "hr", section: "權益與供應鏈", label: "女性主管人數", unit: "人", why: "GRI 405-1 員工類別（如主管職）之性別細分。", gri: "GRI 405-1" },
  { key: "totalManagers", sheet: "hr", section: "權益與供應鏈", label: "主管職總人數", unit: "人", why: "與女性主管同一員工類別定義下的總數。", gri: "GRI 405-1" },
  { key: "unionCovered", sheet: "hr", section: "權益與供應鏈", label: "團體協約涵蓋人數", unit: "人", why: "GRI 2-30 團體協約涵蓋之員工百分比。", gri: "GRI 2-30" },
  { key: "humanRightsTrained", sheet: "hr", section: "權益與供應鏈", label: "接受人權政策相關訓練人數", unit: "人", why: "GRI 2-24 將人權政策嵌入作為。覆蓋率非準則規定之專名，分母由組織自訂。", gri: "GRI 2-24" },
  { key: "supplierCount", sheet: "hr", section: "權益與供應鏈", label: "供應商總數", unit: "家", why: "GRI 308-1／414-1 新供應商篩選之脈絡；總數用於計算採用環境／社會準則篩選的比例。", gri: "GRI 308-1、414-1" },
  { key: "supplierScreened", sheet: "hr", section: "權益與供應鏈", label: "已用環境或社會準則篩選之供應商", unit: "家", why: "GRI 308-1、414-1。本系統加總環境與社會篩選，非準則上的「ESG評鑑」專名。", gri: "GRI 308-1、414-1" },
  { key: "boardSeats", sheet: "gov", section: "治理", label: "董事席次", unit: "席", why: "必要。公司法／證交法董事會組成。年報應揭露。", gri: "公司法；年報應揭露事項" },
  { key: "independentSeats", sheet: "gov", section: "治理", label: "獨立董事席次", unit: "席", why: "證券交易法獨立董事。公司治理評鑑亦檢視席次與比率。", gri: "證交法" },
  { key: "boardMeetings", sheet: "gov", section: "治理", label: "董事會開會次數", unit: "次", why: "必要。公開發行公司董事會議事辦法；年報揭露開會次數。", gri: "董事會議事辦法" },
  { key: "boardAttend", sheet: "gov", section: "治理", label: "董事出席人次合計", unit: "人次", why: "各次議事錄出席加總。出席率＝人次÷（席次×開會次數），為評鑑／年報常用算法，GRI 未定此專名。", gri: "年報董事會運作" },
  { key: "antiCorruptDue", sheet: "gov", section: "治理", label: "應接受反貪腐訓練之人數", unit: "人", why: "GRI 205-2 反貪腐政策溝通與訓練，依治理單位／員工等類別揭露。", gri: "GRI 205-2" },
  { key: "antiCorruptDone", sheet: "gov", section: "治理", label: "已完成反貪腐訓練之人數", unit: "人", why: "GRI 205-2。", gri: "GRI 205-2" },
  { key: "legalFines", sheet: "gov", section: "治理", label: "重大違反法令之罰鍰", unit: "萬元", why: "GRI 2-27 法規遵循。金管會作業辦法亦要求揭露重大裁罰。", gri: "GRI 2-27；金管會作業辦法" },
  { key: "isoCert", sheet: "gov", section: "治理", label: "管理系統驗證件數", unit: "張", why: "例如 ISO 14001、45001、27001。件數加總非準則專名，屬實務揭露。", gri: "管理系統（非GRI專名）" },
  { key: "infoSecIncidents", sheet: "gov", section: "治理", label: "經證實之客戶個資申訴件數", unit: "件", why: "GRI 418-1 為有關侵犯顧客隱私及遺失顧客資料的實證申訴。非泛稱「資安重大事件」。", gri: "GRI 418-1" },
  { key: "dueReview", sheet: "kpi", section: "績效薪酬", label: "應接受定期績效考核之人數", unit: "人", why: "非必要。有人資考核資料再填。對應 GRI 404-3。", gri: "GRI 404-3" },
  { key: "doneReview", sheet: "kpi", section: "績效薪酬", label: "已接受定期績效考核之人數", unit: "人", why: "非必要。有考核完成人數再填。", gri: "GRI 404-3" },
  { key: "withEsgKpi", sheet: "kpi", section: "績效薪酬", label: "績效指標含永續項目之人數", unit: "人", why: "非必要。公司自己的考核設計，金管會未規定此欄。沒有就填 0。", gri: "永續發展實務守則（非專名）" },
  { key: "esgWeight", sheet: "kpi", section: "績效薪酬", label: "高階薪酬中永續相關權重", unit: "%", why: "非必要。由本頁配分算出。沒做永續連動薪酬可為 0。", gri: "GRI 2-19", fromPre: true },
  { key: "businessTarget", sheet: "kpi", section: "績效薪酬", label: "財務／營運目標（內部）", unit: "億元", why: "非必要。內部預算，不是永續報告書法定欄。沒有就填 0。", gri: "內部考核（非準則專名）" },
  { key: "businessActual", sheet: "kpi", section: "績效薪酬", label: "財務／營運實際（內部）", unit: "億元", why: "非必要。對應內部目標。沒有就填 0。", gri: "內部考核（非準則專名）" },
  { key: "esgTargetScore", sheet: "kpi", section: "績效薪酬", label: "永續績效目標分數（內部）", unit: "分", why: "非必要。公司自訂分數。沒有就填 0。", gri: "內部考核（非準則專名）" },
  { key: "esgActualScore", sheet: "kpi", section: "績效薪酬", label: "永續績效實際分數（內部）", unit: "分", why: "非必要。公司自訂分數。沒有就填 0。", gri: "內部考核（非準則專名）" },
  { key: "bonusPool", sheet: "kpi", section: "績效薪酬", label: "變動薪酬總額", unit: "萬元", why: "非必要。用來估算與永續連動的獎金。沒有就填 0。", gri: "GRI 2-19" },
  { key: "highestPay", sheet: "kpi", section: "績效薪酬", label: "組織最高薪酬個人之年度總薪酬", unit: "萬元", why: "非必要。GRI 2-21 才用到。敏感薪資拿不到就填 0。", gri: "GRI 2-21" },
  { key: "medianPay", sheet: "kpi", section: "績效薪酬", label: "其他員工年度總薪酬中位數", unit: "萬元", why: "非必要。GRI 2-21 分母。拿不到就填 0。", gri: "GRI 2-21" },
  { key: "femalePay", sheet: "kpi", section: "績效薪酬", label: "女性基本薪資加薪酬之平均", unit: "萬元", why: "非必要。GRI 405-2。拿不到就填 0。", gri: "GRI 405-2" },
  { key: "malePay", sheet: "kpi", section: "績效薪酬", label: "男性基本薪資加薪酬之平均", unit: "萬元", why: "非必要。GRI 405-2。拿不到就填 0。", gri: "GRI 405-2" },
];

type PreRule = {
  target: keyof Inputs;
  combine: "ratio" | "sum";
  allowAllZero?: boolean;
  formula: string;
  sources: (keyof Inputs)[];
};

export const preRules: PreRule[] = [
  {
    target: "esgWeight",
    combine: "ratio",
    formula: "ESG配分 ÷（財務配分＋ESG配分＋其他配分）×100%",
    sources: ["execFinPoints", "execEsgPoints", "execOtherPoints"],
  },
  {
    target: "greenCapex",
    combine: "sum",
    formula: "節能＋再生能源＋污染防治＋其他氣候／環保資本支出",
    sources: ["capexEnergySave", "capexRenewable", "capexPollution", "capexOtherGreen"],
  },
];

export function isLockedKey(key: keyof Inputs) {
  return preRules.some((r) => r.target === key) || OFFICIAL_FACTOR_KEYS.includes(key as (typeof OFFICIAL_FACTOR_KEYS)[number]);
}

const NEEDS: Partial<Record<keyof Inputs, (keyof Inputs)[]>> = {
  electricityKwh: ["efElectricity"],
  renewableKwh: ["electricityKwh"],
  dieselLiter: ["efDiesel"],
  gasolineLiter: ["efGasoline"],
  lngM3: ["efLng"],
  refrigerantKg: ["gwpRefrigerant"],
  wasteRecycledT: ["wasteT"],
  wasteHazardT: ["wasteT"],
  wastewaterKt: ["waterKt"],
  greenCapex: ["totalCapex"],
  intensityTarget: ["revenueMillion"],
  prevGhg12: ["prevRevenueMillion"],
  headcountFemale: ["headcountEnd"],
  headcountDisabled: ["headcountEnd"],
  newHires: ["headcountAvg"],
  leavers: ["headcountAvg"],
  trainingHours: ["headcountAvg"],
  trainingFemaleHours: ["headcountFemale"],
  recordableInjuries: ["workHours"],
  parentalReturn: ["parentalDue"],
  femaleManagers: ["totalManagers"],
  unionCovered: ["headcountEnd"],
  humanRightsTrained: ["headcountEnd"],
  supplierScreened: ["supplierCount"],
  independentSeats: ["boardSeats"],
  boardAttend: ["boardSeats", "boardMeetings"],
  antiCorruptDone: ["antiCorruptDue"],
  doneReview: ["dueReview"],
  withEsgKpi: ["headcountEnd"],
  businessActual: ["businessTarget"],
  esgActualScore: ["esgTargetScore"],
  femalePay: ["malePay"],
  highestPay: ["medianPay"],
};

const REQUIRED_KEYS = new Set<keyof Inputs>([
  "revenueMillion",
  "headcountEnd",
  "headcountAvg",
  "boardSeats",
  "boardMeetings",
]);

function blank(i: Inputs, key: keyof Inputs) {
  if (!REQUIRED_KEYS.has(key)) return false;
  const v = i[key];
  if (typeof v !== "number") return false;
  return v === 0;
}

export function labelOf(key: keyof Inputs) {
  return fieldCatalog.find((f) => f.key === key)?.label ?? String(key);
}

export function fieldVisible(f: FieldDef, i: Pick<Inputs, "industry" | "capitalBillion" | "diningRevenuePct">) {
  if (!i.industry) return f.sheet !== "ind";
  const flags = topicFlags(i.industry, i.capitalBillion, i.diningRevenuePct);
  if (f.sheet === "ind") {
    if (!flags.annex) return false;
    return annexInputKeys(i.industry, i.diningRevenuePct).includes(String(f.key));
  }
  if (f.key === "waterKt" || f.key === "wastewaterKt") return flags.water;
  if (f.key === "wasteT" || f.key === "wasteRecycledT" || f.key === "wasteHazardT") return flags.waste;
  if (f.key === "noxT" || f.key === "soxT") return flags.air;
  return true;
}

export function visibleCatalog(i: Pick<Inputs, "industry" | "capitalBillion" | "diningRevenuePct">) {
  return fieldCatalog.filter((f) => fieldVisible(f, i));
}

function preMissing(_i: Inputs, _rule: PreRule): string[] {
  return [];
}

export function missingOnRow(i: Inputs, key: keyof Inputs): string[] {
  if (!REQUIRED_KEYS.has(key)) return [];
  if (!blank(i, key)) return [];
  return [`${labelOf(key)}尚未輸入`];
}

export function derived(i: Inputs): Inputs {
  const out: Inputs = { ...i };
  const execTotal = n(i.execFinPoints) + n(i.execEsgPoints) + n(i.execOtherPoints);
  out.esgWeight = execTotal > 0 ? (n(i.execEsgPoints) / execTotal) * 100 : 0;
  out.greenCapex = n(i.capexEnergySave) + n(i.capexRenewable) + n(i.capexPollution) + n(i.capexOtherGreen);
  const o = officialValues(i.year, i.refrigerantCode);
  out.efElectricity = o.efElectricity;
  out.efDiesel = o.efDiesel;
  out.efGasoline = o.efGasoline;
  out.efLng = o.efLng;
  out.gwpRefrigerant = o.gwpRefrigerant;
  return out;
}

export function preResults(i: Inputs) {
  const d = derived(i);
  const execTotal = n(d.execFinPoints) + n(d.execEsgPoints) + n(d.execOtherPoints);
  const unit = (target: keyof Inputs) => fieldCatalog.find((f) => f.key === target)?.unit ?? "";
  return preRules.map((rule) => {
    const raw = d[rule.target];
    const num = typeof raw === "number" ? raw : NaN;
    const emptyRatio = rule.combine === "ratio" && execTotal === 0;
    return {
      name: fieldCatalog.find((f) => f.key === rule.target)?.label ?? String(rule.target),
      value: emptyRatio || !Number.isFinite(num) ? "—" : `${fmt(num, 2)} ${unit(rule.target)}`,
      formula: rule.formula,
      missing: preMissing(i, rule),
    };
  });
}

export type Metric = {
  id: string;
  group: string;
  name: string;
  value: string;
  raw: number;
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

export type ReportFigureRow = { label: string; value: number; color: string };
export type ReportFigure = {
  id: string;
  title: string;
  kind: "bar" | "pie";
  unit: string;
  rows: ReportFigureRow[];
};

const FIG = {
  ink: "4A6B8A",
  brown: "6B4A3A",
  teal: "3A5A6B",
  olive: "5A6B4A",
  gold: "8A6B4A",
} as const;

function fig(id: string, title: string, kind: ReportFigure["kind"], unit: string, rows: ReportFigureRow[]): ReportFigure {
  return { id, title, kind, unit, rows: rows.filter((r) => Number.isFinite(r.value)) };
}

export const regulationCatalog = [
  { id: "fsc-report", name: "上市櫃公司編製與申報永續報告書作業辦法", version: "金管會／證交所／櫃買", asOf: "2026-05", point: "第3條全體依 GRI；第4條產業別附表一（參採 SASB）；第4條之1氣候專章附表二（參採 TCFD）。", url: "https://twse-regulation.twse.com.tw/TW/law/DAT0201.aspx?FLCODE=FL075209" },
  { id: "ifrs-s1s2", name: "公開發行公司年報應行記載事項準則（IFRS S1／S2）", version: "金管會", asOf: "2026-09", point: "自115會計年度起分三階段於年報「永續相關財務資訊」專章適用 IFRS S1、S2。", url: "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400033" },
  { id: "gri-2021", name: "GRI Standards 2021", version: "GRI 1／2／3 及主題準則", asOf: "2026-10", point: "2-7、2-21、2-27、205、302–306、401、403–405、308、414。", url: "https://www.globalreporting.org/how-to-use-the-gri-standards/gri-standards-traditional-chinese-translations/" },
  { id: "esrs", name: "ESRS（歐洲永續報導準則）", version: "歐盟 CSRD／Delegated Regulation (EU) 2023/2772", asOf: "2026-07", point: "歐盟強制。案件設定勾選後納入本案件法源。ESRS 1、2 及 E1–E5、S1–S4、G1。", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2772" },
  { id: "ghg", name: "GHG Protocol／ISO 14064-1", version: "邊界對齊合併報表", asOf: "2026-10", point: "活動數據（用量）× 係數＝範疇一／二排放。下方有中文說明。", url: "https://ghgprotocol.org/corporate-standard" },
  { id: "ef", name: "排放係數／GWP", version: "可覆核參數表", asOf: "2026-10", point: "電力、油氣、冷媒係數以環境部／IPCC 當期為準。", url: "https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg030025/ch07/type3/gov60/num16/Eg.htm" },
  { id: "osh", name: "職安頻率", version: "每百萬工時", asOf: "2026-10", point: "FR／SR／TRIR＝件數×10^6÷總工時。", url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=6&pcode=N0070004" },
  { id: "twse-csr", name: "永續發展實務守則 §9", version: "證交所／櫃買", asOf: "2026-10", point: "績效考核宜結合永續政策。", url: "https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=FL052368&FLNO=9" },
];

function n(v: unknown) {
  const x = typeof v === "number" ? v : Number(v);
  return Number.isFinite(x) ? x : 0;
}
export function fmt(v: number, d = 2) {
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("zh-TW", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}

function M(
  id: string,
  group: string,
  name: string,
  raw: number,
  unit: string,
  formula: string,
  basis: string,
  extra?: Partial<Metric>,
): Metric {
  return { id, group, name, raw, value: fmt(raw, extra?.flag === "ok" ? 2 : 2), unit, formula, basis, compute: true, ...extra };
}

export function compute(raw: Inputs) {
  const i = derived(raw);
  const s1Fuel = (n(i.dieselLiter) * n(i.efDiesel) + n(i.gasolineLiter) * n(i.efGasoline) + n(i.lngM3) * n(i.efLng)) / 1000;
  const s1Ref = (n(i.refrigerantKg) * n(i.gwpRefrigerant)) / 1000;
  const scope1Act = s1Fuel + s1Ref;
  const scope2Act = (n(i.electricityKwh) * n(i.efElectricity)) / 1000;
  const scope1 = scope1Act;
  const scope2 = scope2Act;
  const ghg12 = scope1 + scope2;
  const ghg123 = ghg12 + n(i.scope3);
  const intensity = n(i.revenueMillion) === 0 ? NaN : ghg12 / n(i.revenueMillion);
  const renewPct = n(i.electricityKwh) === 0 ? NaN : (n(i.renewableKwh) / n(i.electricityKwh)) * 100;
  const elecGj = n(i.electricityKwh) * 0.0036;
  const dieselGj = n(i.dieselLiter) * 0.0386;
  const gasGj = n(i.gasolineLiter) * 0.0342;
  const lngGj = n(i.lngM3) * 0.0378;
  const energyGj = elecGj + n(i.steamGj) + dieselGj + gasGj + lngGj;
  const energyInt = n(i.revenueMillion) === 0 ? NaN : energyGj / n(i.revenueMillion);
  const waterInt = n(i.revenueMillion) === 0 ? NaN : n(i.waterKt) / n(i.revenueMillion);
  const waterUse = n(i.waterKt) - n(i.wastewaterKt);
  const recycle = n(i.wasteT) === 0 ? NaN : (n(i.wasteRecycledT) / n(i.wasteT)) * 100;
  const haz = n(i.wasteT) === 0 ? NaN : (n(i.wasteHazardT) / n(i.wasteT)) * 100;
  const greenRatio = n(i.totalCapex) === 0 ? NaN : (n(i.greenCapex) / n(i.totalCapex)) * 100;
  const turnover = n(i.headcountAvg) === 0 ? NaN : (n(i.leavers) / n(i.headcountAvg)) * 100;
  const hireRate = n(i.headcountAvg) === 0 ? NaN : (n(i.newHires) / n(i.headcountAvg)) * 100;
  const femalePct = n(i.headcountEnd) === 0 ? NaN : (n(i.headcountFemale) / n(i.headcountEnd)) * 100;
  const disPct = n(i.headcountEnd) === 0 ? NaN : (n(i.headcountDisabled) / n(i.headcountEnd)) * 100;
  const trainPer = n(i.headcountAvg) === 0 ? NaN : n(i.trainingHours) / n(i.headcountAvg);
  const trainF = n(i.headcountFemale) === 0 ? NaN : n(i.trainingFemaleHours) / n(i.headcountFemale);
  const fr = n(i.workHours) === 0 ? NaN : (n(i.disablingInjuries) * 1e6) / n(i.workHours);
  const sr = n(i.workHours) === 0 ? NaN : (n(i.lostDays) * 1e6) / n(i.workHours);
  const trir = n(i.workHours) === 0 ? NaN : (n(i.recordableInjuries) * 1e6) / n(i.workHours);
  const parental = n(i.parentalDue) === 0 ? NaN : (n(i.parentalReturn) / n(i.parentalDue)) * 100;
  const femMgr = n(i.totalManagers) === 0 ? NaN : (n(i.femaleManagers) / n(i.totalManagers)) * 100;
  const union = n(i.headcountEnd) === 0 ? NaN : (n(i.unionCovered) / n(i.headcountEnd)) * 100;
  const hrTrain = n(i.headcountEnd) === 0 ? NaN : (n(i.humanRightsTrained) / n(i.headcountEnd)) * 100;
  const supp = n(i.supplierCount) === 0 ? NaN : (n(i.supplierScreened) / n(i.supplierCount)) * 100;
  const reviewPct = n(i.dueReview) === 0 ? NaN : (n(i.doneReview) / n(i.dueReview)) * 100;
  const esgKpiPct = n(i.headcountEnd) === 0 ? NaN : (n(i.withEsgKpi) / n(i.headcountEnd)) * 100;
  const bizHit = n(i.businessTarget) === 0 ? NaN : (n(i.businessActual) / n(i.businessTarget)) * 100;
  const esgHit = n(i.esgTargetScore) === 0 ? NaN : (n(i.esgActualScore) / n(i.esgTargetScore)) * 100;
  const w = Math.min(Math.max(n(i.esgWeight), 0), 100) / 100;
  const weighted = (1 - w) * (bizHit || 0) + w * (esgHit || 0);
  const esgBonus = n(i.bonusPool) * w * ((esgHit || 0) / 100);
  const payRatio = n(i.medianPay) === 0 ? NaN : n(i.highestPay) / n(i.medianPay);
  const genderPay = n(i.malePay) === 0 ? NaN : n(i.femalePay) / n(i.malePay);
  const indPct = n(i.boardSeats) === 0 ? NaN : (n(i.independentSeats) / n(i.boardSeats)) * 100;
  const attend = n(i.boardSeats) * n(i.boardMeetings) === 0 ? NaN : (n(i.boardAttend) / (n(i.boardSeats) * n(i.boardMeetings))) * 100;
  const anti = n(i.antiCorruptDue) === 0 ? NaN : (n(i.antiCorruptDone) / n(i.antiCorruptDue)) * 100;
  const intensityHit = Number.isFinite(intensity) && intensity <= n(i.intensityTarget);
  const prevYearLabel = Number.isFinite(Number(i.year)) ? String(Number(i.year) - 1) : "上年";
  const yearLabel = i.year || "本年";
  const prevGhg12 = n(i.prevGhg12);
  const prevRev = n(i.prevRevenueMillion);
  const prevIntensity = prevRev === 0 ? NaN : prevGhg12 / prevRev;
  const ghgYoy = prevGhg12 === 0 ? NaN : ((ghg12 - prevGhg12) / prevGhg12) * 100;
  const intYoy = !Number.isFinite(prevIntensity) || prevIntensity === 0 || !Number.isFinite(intensity) ? NaN : ((intensity - prevIntensity) / prevIntensity) * 100;

  const metrics: Metric[] = [
    M("s1", "E 環境", "範疇一直接排放", scope1, "tCO2e", "油氣係數＋冷媒×GWP", "GRI 305-1；GHG Protocol"),
    M("s2", "E 環境", "範疇二能源間接排放", scope2, "tCO2e", "電力kWh × 電力係數", "GRI 305-2；GHG Protocol"),
    M("s12", "E 環境", "範疇一＋二", ghg12, "tCO2e", "S1+S2", "金管會作業辦法"),
    M("s3o", "E 環境", "範疇三其他間接排放", n(i.scope3), "tCO2e", "盤查彙總（不由活動數據推算）", "GRI 305-3"),
    M("s3", "E 環境", "範疇一＋二＋三", ghg123, "tCO2e", "S1+S2+範疇三彙總", "GRI 305-3"),
    M("int", "E 環境", "溫室氣體排放密集度", intensity, "tCO2e／百萬營收", "(S1+S2)÷合併營收", "金管會；GRI 305-4", { flag: intensityHit ? "ok" : "warn" }),
    M("p12", "E 環境", "上年範疇一＋二", prevGhg12, "tCO2e", "上年報告書已揭露數", "金管會作業辦法"),
    M("pint", "E 環境", "上年排放密集度", prevIntensity, "tCO2e／百萬營收", "上年S1+S2÷上年營收", "金管會作業辦法"),
    M("gyoy", "E 環境", "範疇一＋二較上年", ghgYoy, "%", "(本年−上年)÷上年", "金管會兩年比較"),
    M("iyoy", "E 環境", "密集度較上年", intYoy, "%", "(本年密集度−上年)÷上年", "金管會兩年比較"),
    M("ren", "E 環境", "再生能源占外購電力", renewPct, "%", "再生kWh÷外購電力", "GRI 302-1"),
    M("elecShare", "E 環境", "外購電力占能源總量", energyGj === 0 ? NaN : (elecGj / energyGj) * 100, "%", "外購電力GJ÷能源總量", "作業辦法附表一"),
    M("en", "E 環境", "組織內能源消耗", energyGj, "GJ", "電／蒸汽／油氣熱值加總", "GRI 302-1"),
    M("foodlab", "E 產業", "食安實驗室支出占營收", n(i.revenueMillion) === 0 ? NaN : n(i.foodLabSpendThousand) / (n(i.revenueMillion) * 10), "%", "支出(仟元)÷營收(百萬元×1,000)×100", "作業辦法附表一之一"),
    M("saudit", "S 產業", "供應商稽核百分比", n(i.supplierCount) === 0 ? NaN : (n(i.supplierAuditedCount) / n(i.supplierCount)) * 100, "%", "稽核家數÷供應商總數", "作業辦法附表一之一"),
    M("eni", "E 環境", "能源密集度", energyInt, "GJ／百萬營收", "能源GJ÷營收", "GRI 302-3"),
    M("wint", "E 環境", "取水密集度", waterInt, "千噸／百萬營收", "取水÷營收", "GRI 303-3"),
    M("wuse", "E 環境", "耗水（取水減放流，簡化）", waterUse, "千噸", "取水−放流，非完整水平衡", "GRI 303-5（簡化）"),
    M("rec", "E 環境", "從處置移轉之廢棄物占比", recycle, "%", "回收再利用÷產生", "GRI 306-4"),
    M("haz", "E 環境", "有害廢棄物占產生量", haz, "%", "有害÷產生", "廢棄物清理法；GRI 306-3"),
    M("wastI", "E 環境", "廢棄物密集度", n(i.revenueMillion) === 0 ? NaN : n(i.wasteT) / n(i.revenueMillion), "噸／百萬營收", "產生量÷營收", "GRI 306-3（密集度實務）"),
    M("ghge", "E 環境", "範疇一＋二每人排放", n(i.headcountAvg) === 0 ? NaN : ghg12 / n(i.headcountAvg), "tCO2e／人", "(S1+S2)÷平均員工數", "GRI 305-4（分母為人數）"),
    M("csp", "S 權益", "公益與基礎設施支出占營收", n(i.revenueMillion) === 0 ? NaN : (n(i.communitySpend) * 100) / n(i.revenueMillion) * 100, "%", "支出(億)×100÷營收(百萬)×100%", "GRI 203-1（占比實務）"),
    M("grn", "E 環境", "氣候／環保資本支出占比", greenRatio, "%", "相關Capex÷購置不動產廠房設備", "金管會氣候資訊（實務比）"),
    M("turn", "S 人力", "員工離職率", turnover, "%", "離職÷平均員工數", "GRI 401-1"),
    M("hire", "S 人力", "新進員工率", hireRate, "%", "新進÷平均員工數", "GRI 401-1"),
    M("fem", "S 人力", "女性占結束日員工", femalePct, "%", "女性÷結束日員工總數", "GRI 405-1"),
    M("dis", "S 人力", "身心障礙者占結束日員工", disPct, "%", "身障÷結束日員工總數", "GRI 405-1；身權法"),
    M("tr", "S 人力", "平均每位員工受訓時數", trainPer, "小時", "總時數÷平均員工數", "GRI 404-1"),
    M("trf", "S 人力", "女性平均受訓時數", trainF, "小時", "女性時數÷女性員工數", "GRI 404-1"),
    M("trhit", "S 人力", "平均受訓時數達標率", n(i.trainingHoursTarget) === 0 || !Number.isFinite(trainPer) ? NaN : (trainPer / n(i.trainingHoursTarget)) * 100, "%", "實際平均時數÷內部目標", "內部目標（非準則專名）"),
    M("male", "S 人力", "男性占結束日員工", n(i.headcountEnd) === 0 ? NaN : ((n(i.headcountEnd) - n(i.headcountFemale)) / n(i.headcountEnd)) * 100, "%", "(結束日總數−女性)÷結束日總數", "GRI 405-1"),
    M("fr", "S 職安", "失能傷害頻率", fr, "／百萬工時", "失能次數×10^6÷總經歷工時", "勞動部職災統計"),
    M("sr", "S 職安", "失能傷害嚴重率", sr, "／百萬工時", "損失日×10^6÷總經歷工時", "勞動部職災統計"),
    M("trir", "S 職安", "可記錄職業傷害率（OSHA TRIR）", trir, "／百萬工時", "可記錄傷害×10^6÷工時", "GRI 403-9；OSHA（非職安法專名）"),
    M("par", "S 權益", "育嬰留停後復職率", parental, "%", "復職÷應復職", "GRI 401-3"),
    M("fm", "S 權益", "女性占主管職", femMgr, "%", "女性主管÷主管職", "GRI 405-1"),
    M("un", "S 權益", "團體協約涵蓋比率", union, "%", "涵蓋÷結束日員工總數", "GRI 2-30"),
    M("hrt", "S 權益", "人權訓練覆蓋（自訂）", hrTrain, "%", "受訓÷結束日員工總數", "GRI 2-24（比率自訂）"),
    M("sup", "S 供應鏈", "以環境或社會準則篩選之供應商比率", supp, "%", "已篩選÷供應商總數", "GRI 308-1／414-1"),
    M("rev", "S 績效KPI", "定期績效考核比率", reviewPct, "%", "已考核÷應考核", "GRI 404-3"),
    M("ek", "S 績效KPI", "考核含永續指標之員工比（自訂）", esgKpiPct, "%", "有永續KPI÷結束日員工總數", "實務守則（非專名）"),
    M("biz", "S 績效KPI", "財務／營運目標達成率（內部）", bizHit, "%", "實際÷目標", "內部考核"),
    M("eh", "S 績效KPI", "永續績效目標達成率（內部）", esgHit, "%", "永續實際÷目標", "內部考核"),
    M("wtd", "S 績效KPI", "加權績效達成率（內部）", weighted, "%", "(1-w)×財務 + w×永續", "內部考核"),
    M("bon", "G 薪酬", "與永續績效連動之變動薪酬（估算）", esgBonus, "萬元", "變動薪酬×權重×永續達成", "GRI 2-19（估算）"),
    M("pay", "G 薪酬", "最高薪酬對中位數之倍數", payRatio, "倍", "最高÷中位數", "GRI 2-21"),
    M("gp", "G 薪酬", "女性對男性薪酬比", genderPay, "倍", "女性平均÷男性平均", "GRI 405-2"),
    M("ind", "G 治理", "獨立董事席次比率", indPct, "%", "獨董÷席次", "證交法／評鑑"),
    M("att", "G 治理", "董事會出席率", attend, "%", "出席人次÷(席次×次數)", "年報董事會運作"),
    M("ac", "G 治理", "反貪腐訓練比率", anti, "%", "完成÷應訓", "GRI 205-2"),
  ];

  const flags = topicFlags(i.industry, i.capitalBillion, i.diningRevenuePct);
  const checks: Check[] = [];
  if (n(i.revenueMillion) <= 0) checks.push({ id: "rev0", level: "異常", title: "合併營收未輸入", detail: "密集度與占比無法計算。", basis: "金管會" });
  if (n(i.greenCapex) > n(i.totalCapex) && n(i.totalCapex) >= 0) checks.push({ id: "capex", level: "異常", title: "氣候／環保資本支出大於購置總額", detail: `氣候／環保 ${fmt(n(i.greenCapex), 2)} 億，購置不動產廠房及設備 ${fmt(n(i.totalCapex), 2)} 億。前者是後者的一部分，不能更大。`, basis: "現金流量表勾稽" });
  if (flags.waste && n(i.wasteRecycledT) > n(i.wasteT) && n(i.wasteT) > 0) checks.push({ id: "w1", level: "異常", title: "回收>產生", detail: "廢棄物勾稽失敗。", basis: "GRI 306" });
  if (n(i.doneReview) > n(i.dueReview)) checks.push({ id: "r1", level: "異常", title: "已考核>應考核", detail: "404-3 分母錯誤。", basis: "GRI 404-3" });
  if (n(i.headcountFemale) > n(i.headcountEnd)) checks.push({ id: "f1", level: "異常", title: "女性員工數大於結束日員工總數", detail: "人力結構勾稽失敗。", basis: "GRI 2-7" });
  if (n(i.independentSeats) > n(i.boardSeats)) checks.push({ id: "b1", level: "異常", title: "獨董>席次", detail: "治理結構錯誤。", basis: "年報" });
  if (n(i.headcountAvg) <= 0) checks.push({ id: "a1", level: "異常", title: "平均員工數未輸入", detail: "離職率／平均受訓時數無法算。", basis: "GRI 401" });
  if (n(i.renewableKwh) > n(i.electricityKwh) && n(i.electricityKwh) > 0) checks.push({ id: "re", level: "異常", title: "再生電>總用電", detail: "能源結構錯誤。", basis: "GRI 302" });
  if ((indPct || 0) < 33 && n(i.independentSeats) < 3) checks.push({ id: "indw", level: "注意", title: "獨董可能不足", detail: `獨董 ${fmt(indPct, 0)}%、${i.independentSeats} 席。`, basis: "公開發行實務" });
  if (n(i.esgWeight) < 10) checks.push({ id: "w", level: "注意", title: "高階薪酬中永續權重偏低", detail: `目前 ${i.esgWeight}%。`, basis: "GRI 2-19" });
  if (!intensityHit && Number.isFinite(intensity)) checks.push({ id: "intw", level: "注意", title: "密集度未達目標", detail: `實際 ${fmt(intensity, 4)}。`, basis: "氣候目標" });
  if (n(i.fatalities) > 0) checks.push({ id: "fat", level: "異常", title: "有職災死亡", detail: "必須在報告書重大事件揭露。", basis: "GRI 403-9" });
  if (prevGhg12 === 0 && prevRev === 0) {
    checks.push({ id: "yoy", level: "注意", title: "未填上年排放／營收", detail: "金管會作業辦法要最近兩年排放量與密集度。沒有上年就只出當年圖。", basis: "金管會作業辦法" });
  }
  if (flags.annex && i.industry === "steel" && n(i.coalFuelPct) + n(i.gasFuelPct) + n(i.renewableFuelPct) > 100.05) {
    checks.push({ id: "fuel", level: "異常", title: "鋼鐵燃料占比合計超過100%", detail: "煤炭、天然氣、再生燃料百分比應為燃料結構，合計不可超過100%。", basis: "作業辦法附表一之六" });
  }
  if (checks.length === 0) checks.push({ id: "ok", level: "通過", title: "勾稽未發現異常", detail: "可進入覆核；係數仍應對當期公告。", basis: "底稿" });

  const maleN = Math.max(0, n(i.headcountEnd) - n(i.headcountFemale));
  const yoyFigures: ReportFigure[] = [];
  if (prevGhg12 > 0 || ghg12 > 0) {
    yoyFigures.push(
      fig("yoyGhg", "圖　範疇一＋二　最近兩年", "bar", "tCO2e", [
        { label: `${prevYearLabel}年`, value: prevGhg12, color: FIG.ink },
        { label: `${yearLabel}年`, value: ghg12, color: FIG.brown },
      ]),
    );
  }
  if (Number.isFinite(prevIntensity) && Number.isFinite(intensity)) {
    yoyFigures.push(
      fig("yoyInt", "圖　排放密集度　最近兩年", "bar", "tCO2e／百萬營收", [
        { label: `${prevYearLabel}年`, value: prevIntensity, color: FIG.ink },
        { label: `${yearLabel}年`, value: intensity, color: FIG.teal },
      ]),
    );
  }
  const figures: ReportFigure[] = [
    ...yoyFigures,
    fig("ghg", "圖　溫室氣體排放結構", "pie", "tCO2e", [
      { label: "範疇一", value: scope1, color: FIG.brown },
      { label: "範疇二", value: scope2, color: FIG.teal },
      { label: "範疇三", value: n(i.scope3), color: FIG.ink },
    ]),
    fig("energy", "圖　組織內能源消耗", "bar", "GJ", [
      { label: "電力", value: elecGj, color: FIG.ink },
      { label: "蒸汽", value: n(i.steamGj), color: FIG.teal },
      { label: "柴油", value: dieselGj, color: FIG.brown },
      { label: "汽油", value: gasGj, color: FIG.gold },
      { label: "天然氣", value: lngGj, color: FIG.olive },
    ]),
    fig("elec", "圖　外購電力結構", "pie", "kWh", [
      { label: "再生能源", value: n(i.renewableKwh), color: FIG.olive },
      { label: "非再生電力", value: Math.max(0, n(i.electricityKwh) - n(i.renewableKwh)), color: FIG.ink },
    ]),
    ...(flags.water
      ? [
          fig("water", "圖　取水／放流／耗水", "bar", "千噸", [
            { label: "取水", value: n(i.waterKt), color: FIG.teal },
            { label: "放流", value: n(i.wastewaterKt), color: FIG.ink },
            { label: "耗水", value: waterUse, color: FIG.brown },
          ]),
        ]
      : []),
    ...(flags.waste
      ? [
          fig("waste", "圖　廢棄物", "bar", "噸", [
            { label: "產生", value: n(i.wasteT), color: FIG.ink },
            { label: "回收再利用", value: n(i.wasteRecycledT), color: FIG.olive },
            { label: "有害", value: n(i.wasteHazardT), color: FIG.brown },
          ]),
        ]
      : []),
    ...(flags.air
      ? [
          fig("air", "圖　空氣污染物", "bar", "噸", [
            { label: "NOx", value: n(i.noxT), color: FIG.brown },
            { label: "SOx", value: n(i.soxT), color: FIG.ink },
          ]),
        ]
      : []),
    fig("capex", "圖　資本支出", "pie", "億元", [
      { label: "氣候／環保", value: n(i.greenCapex), color: FIG.olive },
      { label: "其他購置", value: Math.max(0, n(i.totalCapex) - n(i.greenCapex)), color: FIG.ink },
    ]),
    fig("gender", "圖　員工性別結構", "pie", "人", [
      { label: "女性", value: n(i.headcountFemale), color: FIG.teal },
      { label: "男性", value: maleN, color: FIG.ink },
    ]),
    fig("hr", "圖　人力比率", "bar", "%", [
      { label: "女性占比", value: femalePct, color: FIG.teal },
      { label: "新進率", value: hireRate, color: FIG.olive },
      { label: "離職率", value: turnover, color: FIG.brown },
      { label: "女性主管占比", value: femMgr, color: FIG.ink },
    ]),
    fig("osh", "圖　職業傷害頻率", "bar", "／百萬工時", [
      { label: "FR", value: fr, color: FIG.brown },
      { label: "SR", value: sr, color: FIG.ink },
      { label: "TRIR", value: trir, color: FIG.teal },
    ]),
    fig("gov", "圖　治理與供應鏈比率", "bar", "%", [
      { label: "獨董席次比", value: indPct, color: FIG.ink },
      { label: "董事會出席率", value: attend, color: FIG.teal },
      { label: "反貪腐訓練", value: anti, color: FIG.olive },
      { label: "供應商篩選", value: supp, color: FIG.gold },
      { label: "績效考核", value: reviewPct, color: FIG.brown },
    ]),
  ];

  return { scope1, scope2, ghg12, intensity, renewPct, metrics, checks, figures };
}
