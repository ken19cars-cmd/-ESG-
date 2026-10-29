import { OFFICIAL_FACTOR_KEYS, officialValues } from "@/lib/official-factors";

export type Inputs = {
  client: string;
  year: string;
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
};

export const defaultInputs: Inputs = {
  client: "綠能精密股份有限公司（示範）",
  year: "2025",
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
};

export const fieldCatalog: FieldDef[] = [
  { key: "execFinPoints", sheet: "pre", section: "底稿：高階考核表三大類配分（抄表，不要再拆KPI）", label: "考核表：財務／營運績效配分", unit: "%", why: "從高階主管績效考核表或薪酬辦法抄「財務／經營績效」那一大類的權重。客戶給 70 就填 70，不必再拆營收、EPS。", gri: "高階考核表；GRI 2-19" },
  { key: "execEsgPoints", sheet: "pre", section: "底稿：高階考核表三大類配分（抄表，不要再拆KPI）", label: "考核表：ESG／永續績效配分", unit: "%", why: "同一張表「永續／ESG」大類權重。客戶給 15 就填 15。沒有永續權重填 0。", gri: "高階考核表；GRI 2-19" },
  { key: "execOtherPoints", sheet: "pre", section: "底稿：高階考核表三大類配分（抄表，不要再拆KPI）", label: "考核表：其他配分", unit: "%", why: "個人職能、專案等其餘大類。三格加總通常為 100，高階ESG權重＝ESG配分÷合計。", gri: "高階考核表；GRI 2-19" },
  { key: "capexEnergySave", sheet: "pre", section: "底稿：綠色資本支出（年報沒有現成一格）", label: "節能設備資本支出", unit: "億元", why: "現金流量表只有購置固定資產總額。綠色占比要從資產增加明細把節能設備挑出來。", gri: "資產明細" },
  { key: "capexRenewable", sheet: "pre", section: "底稿：綠色資本支出（年報沒有現成一格）", label: "再生能源設備資本支出", unit: "億元", why: "太陽能、儲能等。沒有填 0。", gri: "資產明細" },
  { key: "capexPollution", sheet: "pre", section: "底稿：綠色資本支出（年報沒有現成一格）", label: "污染防治設備資本支出", unit: "億元", why: "廢水、廢氣、廢棄物處理設備。沒有填 0。", gri: "資產明細" },
  { key: "capexOtherGreen", sheet: "pre", section: "底稿：綠色資本支出（年報沒有現成一格）", label: "其他綠色資本支出", unit: "億元", why: "未列入上三項的綠色資產。沒有填 0。", gri: "資產明細" },
  { key: "revenueMillion", sheet: "fin", section: "財務分母", label: "合併營收", unit: "百萬元", why: "金管會要求排放／用水密集度分母與合併財報營收一致。直接抄合併綜合損益表。", gri: "金管會作業辦法；GRI 305-4" },
  { key: "totalCapex", sheet: "fin", section: "財務分母", label: "總資本支出", unit: "億元", why: "綠色投資占比的分母。直接抄現金流量表「購置不動產廠房及設備」。", gri: "現金流量表" },
  { key: "greenCapex", sheet: "fin", section: "財務分母", label: "綠色資本支出", unit: "億元", why: "年報沒有現成「綠色Capex」，由前置底稿四類加總帶入，不可手改。", gri: "投資揭露", fromPre: true },
  { key: "communitySpend", sheet: "fin", section: "財務分母", label: "社區／公益支出", unit: "億元", why: "直接填客戶CSR／帳上公益支出合計，不必再拆捐贈與社區投入。", gri: "GRI 203-1" },
  { key: "electricityKwh", sheet: "env", section: "能源與排放", label: "外購電力", unit: "kWh", why: "Scope 2 最主要活動數據。", gri: "GRI 302-1、305-2" },
  { key: "renewableKwh", sheet: "env", section: "能源與排放", label: "再生能源電力", unit: "kWh", why: "再生能源占比＝再生 ÷ 總用電，金管會／客戶常問。", gri: "GRI 302-1" },
  { key: "dieselLiter", sheet: "env", section: "能源與排放", label: "柴油用量", unit: "L", why: "鍋爐、發電機、車輛，Scope 1。", gri: "GRI 305-1" },
  { key: "gasolineLiter", sheet: "env", section: "能源與排放", label: "汽油用量", unit: "L", why: "公務車燃油，常被漏列。", gri: "GRI 305-1" },
  { key: "lngM3", sheet: "env", section: "能源與排放", label: "天然氣用量", unit: "m³", why: "製程／鍋爐 Scope 1。", gri: "GRI 305-1" },
  { key: "refrigerantKg", sheet: "env", section: "能源與排放", label: "冷媒逸散", unit: "kg", why: "空調冷媒 GWP 很高，屬 Scope 1。", gri: "GRI 305-1、305-6" },
  { key: "steamGj", sheet: "env", section: "能源與排放", label: "外購蒸汽", unit: "GJ", why: "若有外購熱能，計入能源與 Scope 2。", gri: "GRI 302-1" },
  { key: "scope3", sheet: "env", section: "能源與排放", label: "Scope 3（盤查）", unit: "tCO2e", why: "價值鏈排放；金管會逐步要求，先允許彙總輸入。", gri: "GRI 305-3" },
  { key: "intensityTarget", sheet: "env", section: "能源與排放", label: "排放密集度目標", unit: "tCO2e／百萬營收", why: "用來算達標與否與差距。", gri: "氣候目標" },
  { key: "waterKt", sheet: "env", section: "水與廢棄物", label: "取水量", unit: "千噸", why: "用水密集度分子。", gri: "GRI 303-3" },
  { key: "wastewaterKt", sheet: "env", section: "水與廢棄物", label: "放流水量", unit: "千噸", why: "耗水≈取水−放流（簡化）。", gri: "GRI 303-4、303-5" },
  { key: "wasteT", sheet: "env", section: "水與廢棄物", label: "廢棄物產生", unit: "噸", why: "回收率分母。", gri: "GRI 306-3" },
  { key: "wasteRecycledT", sheet: "env", section: "水與廢棄物", label: "廢棄物回收／再利用", unit: "噸", why: "回收率分子。", gri: "GRI 306-4" },
  { key: "wasteHazardT", sheet: "env", section: "水與廢棄物", label: "有害廢棄物", unit: "噸", why: "有害占比是報告書必列。", gri: "GRI 306" },
  { key: "noxT", sheet: "env", section: "水與廢棄物", label: "NOx 排放", unit: "噸", why: "空氣污染物，GRI 305-7。", gri: "GRI 305-7" },
  { key: "soxT", sheet: "env", section: "水與廢棄物", label: "SOx 排放", unit: "噸", why: "空氣污染物，GRI 305-7。", gri: "GRI 305-7" },
  { key: "efElectricity", sheet: "par", section: "係數參數（公告帶入，不可手改）", label: "電力排放係數", unit: "kgCO2e/kWh", why: "依案件年度向經濟部能源署電力排碳係數公告抓取並與內建庫比對。產業用戶用「產業盤查」係數。抓到的值與庫不一致就不覆蓋。", gri: "能源署電力排碳係數公告" },
  { key: "efDiesel", sheet: "par", section: "係數參數（公告帶入，不可手改）", label: "柴油係數", unit: "kgCO2e/L", why: "環境部係數管理表常用體積係數。官方頁多為 PDF，無法像電力新聞稿直接爬到 2.606；系統釘選 6.0.4 並做區間／PDF 關鍵字驗證。", gri: "環境部排放係數管理表" },
  { key: "efGasoline", sheet: "par", section: "係數參數（公告帶入，不可手改）", label: "汽油係數", unit: "kgCO2e/L", why: "同上，車用汽油體積係數。", gri: "環境部排放係數管理表" },
  { key: "efLng", sheet: "par", section: "係數參數（公告帶入，不可手改）", label: "天然氣係數", unit: "kgCO2e/m³", why: "同上，天然氣體積係數。", gri: "環境部排放係數管理表" },
  { key: "gwpRefrigerant", sheet: "par", section: "係數參數（公告帶入，不可手改）", label: "冷媒 GWP", unit: "倍", why: "由冷媒代碼＋盤查年度對 IPCC。2024 年起臺灣盤查用 AR5（R-134a＝1300），不是舊的 AR4 1430。", gri: "IPCC AR4／AR5；環境部盤查指引" },
  { key: "headcountEnd", sheet: "hr", section: "人力結構", label: "期末人數", unit: "人", why: "時點人數；多元占比常用期末。", gri: "GRI 2-7" },
  { key: "headcountAvg", sheet: "hr", section: "人力結構", label: "年平均人數", unit: "人", why: "流動率、人均訓練必須用平均人數，不能用期末。", gri: "GRI 401-1、404-1" },
  { key: "headcountFemale", sheet: "hr", section: "人力結構", label: "女性人數", unit: "人", why: "性別占比、薪酬比分母之一。", gri: "GRI 405-1" },
  { key: "headcountDisabled", sheet: "hr", section: "人力結構", label: "身障員工", unit: "人", why: "多元與評鑑常見項。", gri: "GRI 405-1" },
  { key: "contractors", sheet: "hr", section: "人力結構", label: "非員工工作者", unit: "人", why: "承攬商人數，GRI 2-8。", gri: "GRI 2-8" },
  { key: "newHires", sheet: "hr", section: "人力結構", label: "新進人數", unit: "人", why: "新進率分子。", gri: "GRI 401-1" },
  { key: "leavers", sheet: "hr", section: "人力結構", label: "離職人數", unit: "人", why: "流動率分子。", gri: "GRI 401-1" },
  { key: "trainingHours", sheet: "hr", section: "訓練與職安", label: "總訓練時數", unit: "小時", why: "直接填客戶人資給的年度總訓練時數，不用拆內訓／外訓。系統再除平均人數得人均。", gri: "GRI 404-1" },
  { key: "trainingFemaleHours", sheet: "hr", section: "訓練與職安", label: "女性訓練時數", unit: "小時", why: "拆性別人均訓練，報告書常要。", gri: "GRI 404-1" },
  { key: "trainingHoursTarget", sheet: "hr", section: "訓練與職安", label: "人均訓練目標", unit: "小時", why: "判斷訓練是否達標。", gri: "內部目標" },
  { key: "workHours", sheet: "hr", section: "訓練與職安", label: "總經歷工時", unit: "小時", why: "FR／SR／可記錄傷害率的分母。", gri: "GRI 403-9" },
  { key: "disablingInjuries", sheet: "hr", section: "訓練與職安", label: "失能傷害次數", unit: "次", why: "FR 分子。", gri: "GRI 403-9" },
  { key: "lostDays", sheet: "hr", section: "訓練與職安", label: "損失日數", unit: "日", why: "SR 分子。", gri: "GRI 403-9" },
  { key: "fatalities", sheet: "hr", section: "訓練與職安", label: "職災死亡", unit: "人", why: "重大職安，必須單獨揭露。", gri: "GRI 403-9" },
  { key: "recordableInjuries", sheet: "hr", section: "訓練與職安", label: "可記錄傷害", unit: "件", why: "TRIR＝件數×10^6÷工時。", gri: "GRI 403-9" },
  { key: "parentalDue", sheet: "hr", section: "權益與供應鏈", label: "育嬰應復職人數", unit: "人", why: "復職率分母。", gri: "GRI 401-3" },
  { key: "parentalReturn", sheet: "hr", section: "權益與供應鏈", label: "育嬰實際復職", unit: "人", why: "復職率分子。", gri: "GRI 401-3" },
  { key: "femaleManagers", sheet: "hr", section: "權益與供應鏈", label: "女性主管人數", unit: "人", why: "女性主管比。", gri: "GRI 405-1" },
  { key: "totalManagers", sheet: "hr", section: "權益與供應鏈", label: "主管總人數", unit: "人", why: "女性主管比分母。", gri: "GRI 405-1" },
  { key: "unionCovered", sheet: "hr", section: "權益與供應鏈", label: "團體協約涵蓋人數", unit: "人", why: "團體協約覆蓋率。", gri: "GRI 2-30" },
  { key: "humanRightsTrained", sheet: "hr", section: "權益與供應鏈", label: "人權／誠信受訓人數", unit: "人", why: "人權訓練覆蓋。", gri: "GRI 2-24" },
  { key: "supplierCount", sheet: "hr", section: "權益與供應鏈", label: "供應商家數", unit: "家", why: "評鑑覆蓋率分母。", gri: "GRI 308、414" },
  { key: "supplierScreened", sheet: "hr", section: "權益與供應鏈", label: "已ESG評鑑供應商", unit: "家", why: "環境／社會標準篩選覆蓋。", gri: "GRI 308-1、414-1" },
  { key: "boardSeats", sheet: "gov", section: "治理", label: "董事席次", unit: "席", why: "獨董比分母。", gri: "年報治理專章" },
  { key: "independentSeats", sheet: "gov", section: "治理", label: "獨立董事席次", unit: "席", why: "公開發行常見至少 3 席或 1/3。", gri: "證交法／評鑑" },
  { key: "boardMeetings", sheet: "gov", section: "治理", label: "董事會開會次數", unit: "次", why: "出席率分母＝次數×席次。", gri: "議事錄" },
  { key: "boardAttend", sheet: "gov", section: "治理", label: "董事出席人次合計", unit: "人次", why: "年報沒有現成「出席人次」。要從各次董事會議事錄把出席人數加總，再除以（席次×開會次數）才是出席率。", gri: "議事錄" },
  { key: "antiCorruptDue", sheet: "gov", section: "治理", label: "應受反貪腐訓練人數", unit: "人", why: "訓練覆蓋分母。", gri: "GRI 205-2" },
  { key: "antiCorruptDone", sheet: "gov", section: "治理", label: "已完成反貪腐訓練", unit: "人", why: "訓練覆蓋分子。", gri: "GRI 205-2" },
  { key: "legalFines", sheet: "gov", section: "治理", label: "重大裁罰金額", unit: "萬元", why: "直接填年報重大裁罰合計或法務提供的清單總額。確定沒有填 0。不必拆環保／職安。", gri: "GRI 2-27" },
  { key: "isoCert", sheet: "gov", section: "治理", label: "管理系統證書數", unit: "張", why: "ISO 14001／45001／27001 張數，質性佐證。", gri: "管理系統" },
  { key: "infoSecIncidents", sheet: "gov", section: "治理", label: "資安重大事件", unit: "件", why: "資安治理揭露。", gri: "GRI 418" },
  { key: "dueReview", sheet: "kpi", section: "績效薪酬", label: "應考核人數", unit: "人", why: "考核覆蓋率分母。", gri: "GRI 404-3" },
  { key: "doneReview", sheet: "kpi", section: "績效薪酬", label: "已考核人數", unit: "人", why: "考核覆蓋率分子。", gri: "GRI 404-3" },
  { key: "withEsgKpi", sheet: "kpi", section: "績效薪酬", label: "KPI含ESG指標人數", unit: "人", why: "永續是否寫進考核，不是業務達成率。", gri: "實務守則 §9" },
  { key: "esgWeight", sheet: "kpi", section: "績效薪酬", label: "高階ESG權重", unit: "%", why: "由考核表三大類配分算出：ESG配分÷（財務＋ESG＋其他）。不可手改。", gri: "GRI 2-19", fromPre: true },
  { key: "businessTarget", sheet: "kpi", section: "績效薪酬", label: "業務目標", unit: "億元", why: "財務KPI，不計入社會面分數。", gri: "內部績效" },
  { key: "businessActual", sheet: "kpi", section: "績效薪酬", label: "業務實際", unit: "億元", why: "與目標相除得業務達成率。", gri: "內部績效" },
  { key: "esgTargetScore", sheet: "kpi", section: "績效薪酬", label: "ESG KPI目標", unit: "分", why: "減碳／職安等永續目標分數。", gri: "GRI 2-19" },
  { key: "esgActualScore", sheet: "kpi", section: "績效薪酬", label: "ESG KPI實際", unit: "分", why: "永續KPI實際分數。", gri: "GRI 2-19" },
  { key: "bonusPool", sheet: "kpi", section: "績效薪酬", label: "變動獎金池", unit: "萬元", why: "試算 ESG 連動獎金。", gri: "薪酬委員會" },
  { key: "highestPay", sheet: "kpi", section: "績效薪酬", label: "最高個人年薪", unit: "萬元", why: "年報董事酬金是區間，GRI 2-21 要從薪資清冊排序取最高一人。這步在事務所底稿做完再填。", gri: "GRI 2-21" },
  { key: "medianPay", sheet: "kpi", section: "績效薪酬", label: "其他員工年薪中位數", unit: "萬元", why: "排除最高薪後，其餘員工年薪中位數，從薪資清冊計算，不是抄平均薪。", gri: "GRI 2-21" },
  { key: "femalePay", sheet: "kpi", section: "績效薪酬", label: "女性平均薪酬", unit: "萬元", why: "薪資清冊女性加總÷女性人數，年報通常沒有現成一格。", gri: "GRI 405-2" },
  { key: "malePay", sheet: "kpi", section: "績效薪酬", label: "男性平均薪酬", unit: "萬元", why: "薪資清冊男性加總÷男性人數。", gri: "GRI 405-2" },
];

const ALLOW_ZERO = new Set<keyof Inputs>([
  "fatalities",
  "lostDays",
  "disablingInjuries",
  "legalFines",
  "unionCovered",
  "infoSecIncidents",
  "scope1Manual",
  "scope2Manual",
  "steamGj",
  "communitySpend",
  "execEsgPoints",
  "execOtherPoints",
  "capexOtherGreen",
  "capexRenewable",
  "capexPollution",
]);

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
    formula: "節能＋再生能源＋污染防治＋其他綠色資本支出",
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

function blank(i: Inputs, key: keyof Inputs) {
  const v = i[key];
  if (typeof v !== "number") return false;
  if (ALLOW_ZERO.has(key)) return false;
  return v === 0;
}

export function labelOf(key: keyof Inputs) {
  return fieldCatalog.find((f) => f.key === key)?.label ?? String(key);
}

function preMissing(i: Inputs, rule: PreRule): string[] {
  if (rule.combine === "ratio") {
    const msgs: string[] = [];
    if (blank(i, "execFinPoints")) msgs.push(`${labelOf("execFinPoints")}尚未輸入`);
    const total = n(i.execFinPoints) + n(i.execEsgPoints) + n(i.execOtherPoints);
    if (total === 0) msgs.push("高階考核表配分合計尚未輸入");
    return msgs;
  }
  const allZero = rule.sources.every((k) => n(i[k]) === 0);
  if (allZero && rule.allowAllZero) return [];
  if (allZero) return rule.sources.filter((k) => blank(i, k)).map((k) => `${labelOf(k)}尚未輸入`);
  return [];
}

export function missingOnRow(i: Inputs, key: keyof Inputs): string[] {
  const msgs: string[] = [];
  const rule = preRules.find((r) => r.target === key);
  if (rule) msgs.push(...preMissing(i, rule));
  else if (blank(i, key)) msgs.push(`${labelOf(key)}尚未輸入`);
  if (blank(i, key) && fieldCatalog.find((f) => f.key === key)?.sheet === "pre") {
    if (!msgs.includes(`${labelOf(key)}尚未輸入`)) msgs.push(`${labelOf(key)}尚未輸入`);
  }
  for (const dep of NEEDS[key] ?? []) {
    if (rule?.sources.includes(dep)) continue;
    if (blank(i, dep)) msgs.push(`${labelOf(dep)}尚未輸入`);
  }
  return [...new Set(msgs)];
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

export const regulationCatalog = [
  { id: "fsc-report", name: "上市櫃公司編製與申報永續報告書作業辦法", version: "金管會", asOf: "2026-10", point: "依 GRI；溫室氣體最近兩年排放量、密集度（噸CO2e／百萬元）及涵蓋範圍。", url: "https://law.moj.gov.tw/" },
  { id: "gri-2021", name: "GRI Standards 2021", version: "GRI 1／2／3 及主題準則", asOf: "2026-10", point: "2-7、2-21、2-27、205、302–306、401、403–405、308、414。", url: "https://www.globalreporting.org/" },
  { id: "ghg", name: "GHG Protocol／ISO 14064-1", version: "邊界對齊合併報表", asOf: "2026-10", point: "活動數據 × 係數 → Scope 1／2；Scope 3 可彙總。", url: "https://ghgprotocol.org/" },
  { id: "ef", name: "排放係數／GWP", version: "可覆核參數表", asOf: "2026-10", point: "電力、油氣、冷媒係數以環境部／IPCC 當期為準。", url: "https://www.moenv.gov.tw/" },
  { id: "osh", name: "職安頻率", version: "每百萬工時", asOf: "2026-10", point: "FR／SR／TRIR＝件數×10^6÷總工時。", url: "https://www.osha.gov.tw/" },
  { id: "twse-csr", name: "永續發展實務守則 §9", version: "證交所／櫃買", asOf: "2026-10", point: "績效考核宜結合永續政策。", url: "https://twse-regulation.twse.com.tw/" },
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
  const scope1 = i.useActivityForGhg ? scope1Act : n(i.scope1Manual);
  const scope2 = i.useActivityForGhg ? scope2Act : n(i.scope2Manual);
  const ghg12 = scope1 + scope2;
  const ghg123 = ghg12 + n(i.scope3);
  const intensity = n(i.revenueMillion) === 0 ? NaN : ghg12 / n(i.revenueMillion);
  const renewPct = n(i.electricityKwh) === 0 ? NaN : (n(i.renewableKwh) / n(i.electricityKwh)) * 100;
  const energyGj = (n(i.electricityKwh) * 0.0036) + n(i.steamGj) + n(i.dieselLiter) * 0.0386 + n(i.gasolineLiter) * 0.0342;
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

  const metrics: Metric[] = [
    M("s1", "E 環境", "Scope 1", scope1, "tCO2e", "油氣係數＋冷媒×GWP", "GRI 305-1"),
    M("s2", "E 環境", "Scope 2", scope2, "tCO2e", "電力kWh × 電力係數", "GRI 305-2"),
    M("s12", "E 環境", "Scope 1+2", ghg12, "tCO2e", "S1+S2", "金管會排放量"),
    M("s3", "E 環境", "Scope 1+2+3", ghg123, "tCO2e", "加 Scope 3 彙總", "GRI 305-3"),
    M("int", "E 環境", "排放密集度", intensity, "tCO2e／百萬營收", "(S1+S2)÷合併營收", "金管會；GRI 305-4", { flag: intensityHit ? "ok" : "warn" }),
    M("ren", "E 環境", "再生能源電力比", renewPct, "%", "再生kWh÷總用電", "GRI 302-1"),
    M("en", "E 環境", "能源使用", energyGj, "GJ", "電／蒸汽／油氣熱值加總", "GRI 302-1"),
    M("eni", "E 環境", "能源密集度", energyInt, "GJ／百萬營收", "能源GJ÷營收", "GRI 302-3"),
    M("wint", "E 環境", "用水密集度", waterInt, "千噸／百萬營收", "取水÷營收", "GRI 303"),
    M("wuse", "E 環境", "耗水量(簡化)", waterUse, "千噸", "取水−放流", "GRI 303-5"),
    M("rec", "E 環境", "廢棄物回收率", recycle, "%", "回收÷產生", "GRI 306"),
    M("haz", "E 環境", "有害廢棄物比", haz, "%", "有害÷產生", "GRI 306"),
    M("grn", "E 環境", "綠色資本支出比", greenRatio, "%", "綠色Capex÷總Capex", "投資揭露"),
    M("turn", "S 人力", "流動率", turnover, "%", "離職÷平均人數", "GRI 401-1"),
    M("hire", "S 人力", "新進率", hireRate, "%", "新進÷平均人數", "GRI 401-1"),
    M("fem", "S 人力", "女性占比", femalePct, "%", "女性÷期末", "GRI 405-1"),
    M("dis", "S 人力", "身障占比", disPct, "%", "身障÷期末", "GRI 405-1"),
    M("tr", "S 人力", "人均訓練", trainPer, "小時", "總時數÷平均人數", "GRI 404-1"),
    M("trf", "S 人力", "女性人均訓練", trainF, "小時", "女性時數÷女性人數", "GRI 404-1"),
    M("fr", "S 職安", "FR 失能傷害頻率", fr, "／百萬工時", "失能次數×10^6÷工時", "GRI 403-9"),
    M("sr", "S 職安", "SR 嚴重率", sr, "／百萬工時", "損失日×10^6÷工時", "GRI 403-9"),
    M("trir", "S 職安", "TRIR", trir, "／百萬工時", "可記錄傷害×10^6÷工時", "GRI 403-9"),
    M("par", "S 權益", "育嬰復職率", parental, "%", "復職÷應復職", "GRI 401-3"),
    M("fm", "S 權益", "女性主管比", femMgr, "%", "女性主管÷主管", "GRI 405-1"),
    M("un", "S 權益", "團體協約覆蓋", union, "%", "涵蓋÷期末", "GRI 2-30"),
    M("hrt", "S 權益", "人權訓練覆蓋", hrTrain, "%", "受訓÷期末", "GRI 2-24"),
    M("sup", "S 供應鏈", "供應商ESG評鑑覆蓋", supp, "%", "已評鑑÷供應商", "GRI 308／414"),
    M("rev", "S 績效KPI", "考核覆蓋率", reviewPct, "%", "已考核÷應考核", "GRI 404-3"),
    M("ek", "S 績效KPI", "納入ESG KPI員工比", esgKpiPct, "%", "有ESG KPI÷期末", "實務守則§9"),
    M("biz", "S 績效KPI", "業務目標達成率", bizHit, "%", "實際÷目標（非S分數）", "內部績效"),
    M("eh", "S 績效KPI", "ESG KPI達成率", esgHit, "%", "ESG實際÷目標", "GRI 2-19"),
    M("wtd", "S 績效KPI", "加權績效達成率", weighted, "%", "(1-w)×業務 + w×ESG", "獎金"),
    M("bon", "G 薪酬", "ESG連動獎金", esgBonus, "萬元", "獎金池×權重×ESG達成", "GRI 2-19"),
    M("pay", "G 薪酬", "最高薪／中位數", payRatio, "倍", "最高÷中位數", "GRI 2-21"),
    M("gp", "G 薪酬", "女／男薪酬比", genderPay, "倍", "女性均薪÷男性均薪", "GRI 405-2"),
    M("ind", "G 治理", "獨立董事比", indPct, "%", "獨董÷席次", "證交法／評鑑"),
    M("att", "G 治理", "董事會出席率", attend, "%", "出席人次÷(席次×次數)", "議事錄"),
    M("ac", "G 治理", "反貪腐訓練覆蓋", anti, "%", "完成÷應訓", "GRI 205-2"),
  ];

  const checks: Check[] = [];
  if (n(i.revenueMillion) <= 0) checks.push({ id: "rev0", level: "異常", title: "合併營收未輸入", detail: "密集度無法計算。", basis: "金管會" });
  if (n(i.wasteRecycledT) > n(i.wasteT) && n(i.wasteT) > 0) checks.push({ id: "w1", level: "異常", title: "回收>產生", detail: "廢棄物勾稽失敗。", basis: "GRI 306" });
  if (n(i.doneReview) > n(i.dueReview)) checks.push({ id: "r1", level: "異常", title: "已考核>應考核", detail: "404-3 分母錯誤。", basis: "GRI 404-3" });
  if (n(i.headcountFemale) > n(i.headcountEnd)) checks.push({ id: "f1", level: "異常", title: "女性人數>期末", detail: "人力結構勾稽失敗。", basis: "GRI 2-7" });
  if (n(i.independentSeats) > n(i.boardSeats)) checks.push({ id: "b1", level: "異常", title: "獨董>席次", detail: "治理結構錯誤。", basis: "年報" });
  if (n(i.headcountAvg) <= 0) checks.push({ id: "a1", level: "異常", title: "平均人數未輸入", detail: "流動率／訓練無法算。", basis: "GRI 401" });
  if (n(i.renewableKwh) > n(i.electricityKwh) && n(i.electricityKwh) > 0) checks.push({ id: "re", level: "異常", title: "再生電>總用電", detail: "能源結構錯誤。", basis: "GRI 302" });
  if ((indPct || 0) < 33 && n(i.independentSeats) < 3) checks.push({ id: "indw", level: "注意", title: "獨董可能不足", detail: `獨董 ${fmt(indPct, 0)}%、${i.independentSeats} 席。`, basis: "公開發行實務" });
  if (n(i.esgWeight) < 10) checks.push({ id: "w", level: "注意", title: "高階ESG權重偏低", detail: `目前 ${i.esgWeight}%。`, basis: "GRI 2-19" });
  if (!intensityHit && Number.isFinite(intensity)) checks.push({ id: "intw", level: "注意", title: "密集度未達目標", detail: `實際 ${fmt(intensity, 4)}。`, basis: "氣候目標" });
  if (n(i.fatalities) > 0) checks.push({ id: "fat", level: "異常", title: "有職災死亡", detail: "必須在報告書重大事件揭露。", basis: "GRI 403-9" });
  if (checks.length === 0) checks.push({ id: "ok", level: "通過", title: "勾稽未發現異常", detail: "可進入覆核；係數仍應對當期公告。", basis: "底稿" });

  return { scope1, scope2, ghg12, intensity, renewPct, metrics, checks };
}
