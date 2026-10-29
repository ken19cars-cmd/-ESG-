export const OFFICIAL_FACTOR_KEYS = [
  "efElectricity",
  "efDiesel",
  "efGasoline",
  "efLng",
  "gwpRefrigerant",
] as const;

export type OfficialFactorKey = (typeof OFFICIAL_FACTOR_KEYS)[number];

export type FactorCheck = {
  key: OfficialFactorKey | "fuelTableLive";
  title: string;
  expected: number | null;
  crawled: number | string | null;
  level: "通過" | "注意" | "異常";
  detail: string;
  url: string;
};

export type FactorAudit = {
  year: string;
  inventoryYear: string;
  gwpSet: "AR4" | "AR5";
  refrigerant: string;
  applied: Record<OfficialFactorKey, number>;
  checks: FactorCheck[];
  crawledAt: string;
};

const ELECTRICITY: Record<
  string,
  { value: number; label: string; url: string; parse: "industry" | "plain" }
> = {
  "2021": {
    value: 0.509,
    label: "110年度電力排碳係數",
    url: "https://www.moeaea.gov.tw/ecw/populace/content/ContentDesc.aspx?menu_id=26678",
    parse: "plain",
  },
  "2022": {
    value: 0.495,
    label: "111年度電力排碳係數",
    url: "https://www.moeaea.gov.tw/ecw/populace/content/ContentDesc.aspx?menu_id=26678",
    parse: "plain",
  },
  "2023": {
    value: 0.494,
    label: "112年度電力排碳係數",
    url: "https://www.moeaea.gov.tw/ecw/populace/content/ContentDesc.aspx?menu_id=26678",
    parse: "plain",
  },
  "2024": {
    value: 0.474,
    label: "113年度電力排碳係數（能源署 2025-04-14 公布）",
    url: "https://ea01.moeaea.gov.tw/e0406/01/News/Show?id=8ac752a793534a1e8ad17e3804b51969",
    parse: "plain",
  },
  "2025": {
    value: 0.466,
    label: "114年度產業盤查電力排碳係數（能源署；表燈營業／高低壓電力）",
    url: "https://serv.gcis.nat.gov.tw/biznetzero/Opendata/Index?id=da4d8c97c34e4b32b49c38b8cc61f8a9",
    parse: "industry",
  },
};

const FUEL = {
  efDiesel: 2.606,
  efGasoline: 2.263,
  efLng: 2.18,
  table: "溫室氣體排放係數管理表 6.0.4（移動／燃燒常用體積係數）",
  url: "https://ghgregistry.moenv.gov.tw/DPC.aspx?kind=2",
  pdf: "https://ghgregistry.moenv.gov.tw/upload/Tools/%E6%BA%AB%E5%AE%A4%E6%B0%A3%E9%AB%94%E6%8E%92%E6%94%BE%E4%BF%82%E6%95%B8%E7%B8%BD%E8%AA%AA%E6%98%8E%E5%8F%8A%E9%80%90%E9%A0%85%E8%AA%AA%E6%98%8E.pdf",
};

const GWP: Record<string, { AR4: number; AR5: number }> = {
  "R-134a": { AR4: 1430, AR5: 1300 },
  "R-410A": { AR4: 2088, AR5: 1924 },
  "R-32": { AR4: 675, AR5: 677 },
  "R-404A": { AR4: 3922, AR5: 3943 },
  "R-22": { AR4: 1810, AR5: 1760 },
};

export const REFRIGERANTS = Object.keys(GWP);

const RANGE: Record<OfficialFactorKey, [number, number]> = {
  efElectricity: [0.4, 0.55],
  efDiesel: [2.4, 2.8],
  efGasoline: [2.1, 2.5],
  efLng: [1.8, 2.5],
  gwpRefrigerant: [600, 4500],
};

export function gwpSetForYear(year: string): "AR4" | "AR5" {
  const y = Number(year);
  return Number.isFinite(y) && y >= 2024 ? "AR5" : "AR4";
}

export function resolveElectricityYear(year: string) {
  if (ELECTRICITY[year]) return year;
  const years = Object.keys(ELECTRICITY).sort();
  const y = Number(year);
  const older = years.filter((k) => Number(k) <= y);
  return older.at(-1) ?? years.at(-1) ?? "2025";
}

export function officialValues(year: string, refrigerant = "R-134a") {
  const inventoryYear = resolveElectricityYear(year);
  const elec = ELECTRICITY[inventoryYear];
  const set = gwpSetForYear(year);
  const gas = GWP[refrigerant] ?? GWP["R-134a"];
  return {
    inventoryYear,
    gwpSet: set,
    refrigerant: GWP[refrigerant] ? refrigerant : "R-134a",
    efElectricity: elec.value,
    efDiesel: FUEL.efDiesel,
    efGasoline: FUEL.efGasoline,
    efLng: FUEL.efLng,
    gwpRefrigerant: gas[set],
    electricityMeta: elec,
    fuelMeta: FUEL,
  };
}

function inRange(key: OfficialFactorKey, v: number) {
  const [lo, hi] = RANGE[key];
  return v >= lo && v <= hi;
}

function near(a: number, b: number, tol = 0.0005) {
  return Math.abs(a - b) <= tol;
}

function parseElectricity(html: string, mode: "industry" | "plain"): number | null {
  const text = html.replace(/\s+/g, " ");
  if (mode === "industry") {
    const m = text.match(/產業盤查使用之電力排碳係數[：:\s]*([0-9]\.[0-9]{3})/);
    if (m) return Number(m[1]);
  }
  const m =
    text.match(/電力排碳係數為\s*([0-9]\.[0-9]{3})/) ||
    text.match(/電力排碳係數\s*=\s*([0-9]\.[0-9]{3})/) ||
    text.match(/([0-9]\.[0-9]{3})\s*公斤\s*CO\s*2\s*e\s*\/\s*度/);
  return m ? Number(m[1]) : null;
}

async function fetchText(url: string): Promise<{ ok: boolean; text: string; status: number }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      cache: "no-store",
      headers: {
        "user-agent": "HanxinESGFactorAudit/1.0 (CPA workbench; official factor verification)",
        accept: "text/html,application/xhtml+xml,application/pdf,*/*",
      },
    });
    const buf = await res.arrayBuffer();
    const utf = new TextDecoder("utf-8").decode(buf);
    const latin = new TextDecoder("latin1").decode(buf.slice(0, Math.min(buf.byteLength, 1_500_000)));
    return { ok: res.ok, text: `${utf}\n${latin}`, status: res.status };
  } catch {
    return { ok: false, text: "", status: 0 };
  } finally {
    clearTimeout(t);
  }
}

export async function auditOfficialFactors(year: string, refrigerant = "R-134a"): Promise<FactorAudit> {
  const pack = officialValues(year, refrigerant);
  const checks: FactorCheck[] = [];

  const page = await fetchText(pack.electricityMeta.url);
  const crawledElec = page.ok ? parseElectricity(page.text, pack.electricityMeta.parse) : null;
  if (crawledElec == null) {
    checks.push({
      key: "efElectricity",
      title: "電力排放係數",
      expected: pack.efElectricity,
      crawled: page.ok ? "頁面讀到但無法解析數字" : "未能連到公告頁",
      level: "注意",
      detail: `改用內建庫 ${pack.efElectricity}（${pack.electricityMeta.label}）。請點來源人工複核。`,
      url: pack.electricityMeta.url,
    });
  } else if (!near(crawledElec, pack.efElectricity)) {
    checks.push({
      key: "efElectricity",
      title: "電力排放係數",
      expected: pack.efElectricity,
      crawled: crawledElec,
      level: "異常",
      detail: `公告頁解析為 ${crawledElec}，內建庫為 ${pack.efElectricity}。系統不覆蓋，請會計師核對後再決定。`,
      url: pack.electricityMeta.url,
    });
  } else if (!inRange("efElectricity", crawledElec)) {
    checks.push({
      key: "efElectricity",
      title: "電力排放係數",
      expected: pack.efElectricity,
      crawled: crawledElec,
      level: "異常",
      detail: `抓到 ${crawledElec} 超出合理區間 0.40–0.55，疑似解析錯頁，不代入。`,
      url: pack.electricityMeta.url,
    });
  } else {
    checks.push({
      key: "efElectricity",
      title: "電力排放係數",
      expected: pack.efElectricity,
      crawled: crawledElec,
      level: "通過",
      detail: `與${pack.electricityMeta.label}一致。`,
      url: pack.electricityMeta.url,
    });
  }

  const pdf = await fetchText(FUEL.pdf);
  const liveFuel = pdf.ok && (pdf.text.includes("74100") || pdf.text.includes("74,100") || pdf.text.includes("69,300"));
  checks.push({
    key: "fuelTableLive",
    title: "燃油係數表是否仍為現行",
    expected: null,
    crawled: liveFuel ? "PDF 含柴油／汽油 IPCC 係數 74,100／69,300" : pdf.ok ? "PDF 連到但關鍵字不符" : "未能下載係數總說明 PDF",
    level: liveFuel ? "通過" : "注意",
    detail: liveFuel
      ? "環境部係數總說明仍看得到柴油 74,100、汽油 69,300 kgCO2/TJ，體積係數沿用管理表釘選值。"
      : "燃油沒有穩定 HTML 可爬到 2.606 這種體積係數。系統用管理表 6.0.4 釘選值，並做區間勾稽。",
    url: FUEL.url,
  });

  (["efDiesel", "efGasoline", "efLng"] as const).forEach((key) => {
    const v = pack[key];
    const ok = inRange(key, v);
    checks.push({
      key,
      title: key === "efDiesel" ? "柴油係數" : key === "efGasoline" ? "汽油係數" : "天然氣係數",
      expected: v,
      crawled: liveFuel ? "總說明 PDF 可連線；體積係數取管理表釘選" : "未自 HTML 抓到體積係數",
      level: ok ? (liveFuel ? "通過" : "注意") : "異常",
      detail: ok
        ? `${FUEL.table}：${v}。來源無法像電力係數一樣從新聞稿直接解析到小數，故釘選＋區間 ${RANGE[key][0]}–${RANGE[key][1]} 驗證。`
        : `${v} 超出區間，拒絕帶入。`,
      url: FUEL.url,
    });
  });

  const gwpOk = inRange("gwpRefrigerant", pack.gwpRefrigerant);
  checks.push({
    key: "gwpRefrigerant",
    title: "冷媒 GWP",
    expected: pack.gwpRefrigerant,
    crawled: `${pack.gwpSet} ${pack.refrigerant}`,
    level: gwpOk ? "通過" : "異常",
    detail: `依盤查年度採用 IPCC ${pack.gwpSet}（臺灣 113 年起盤查改 AR5）。${pack.refrigerant}＝${pack.gwpRefrigerant}。不是手填 1430。`,
    url: "https://ghgregistry.moenv.gov.tw/",
  });

  return {
    year,
    inventoryYear: pack.inventoryYear,
    gwpSet: pack.gwpSet,
    refrigerant: pack.refrigerant,
    applied: {
      efElectricity: pack.efElectricity,
      efDiesel: pack.efDiesel,
      efGasoline: pack.efGasoline,
      efLng: pack.efLng,
      gwpRefrigerant: pack.gwpRefrigerant,
    },
    checks,
    crawledAt: new Date().toISOString(),
  };
}
