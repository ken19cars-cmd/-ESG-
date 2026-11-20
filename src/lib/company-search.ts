import tls from "node:tls";

export type CompanyHit = {
  name: string;
  taxId: string;
  capitalBillion: number | null;
  location: string;
};

export type CompanySearchResult = {
  items: CompanyHit[];
  source: string;
  error?: string;
};

const GCIS_KEYWORD =
  "https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C";
const G0V_SEARCH = "https://company.g0v.ronny.tw/api/search";

const GCIS_SOURCE = "經濟部商業發展署商工行政資料開放平臺";
const G0V_SOURCE = "經濟部商工登記（備援索引）";

type TlsCa = typeof tls & {
  getCACertificates?: (type?: string) => string[];
  setDefaultCACertificates?: (certs: readonly string[]) => void;
};

let systemCaApplied = false;
function applySystemCa() {
  if (systemCaApplied) return;
  systemCaApplied = true;
  try {
    const api = tls as TlsCa;
    const bundled = api.getCACertificates?.("default") ?? [];
    const system = api.getCACertificates?.("system") ?? [];
    if (system.length) api.setDefaultCACertificates?.([...bundled, ...system]);
  } catch {
    /* Vercel 等環境沒有作業系統憑證庫時，維持 Node 內建 CA。 */
  }
}

function sanitizeQuery(raw: string) {
  return raw.replace(/['"\\;$]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
}

function yuanToBillion(n: number) {
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round((n / 100_000_000) * 10) / 10;
}

function parseYuan(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function sortHits(items: CompanyHit[], q: string) {
  return [...items].sort((a, b) => {
    const aStart = a.name.startsWith(q) ? 0 : 1;
    const bStart = b.name.startsWith(q) ? 0 : 1;
    if (aStart !== bStart) return aStart - bStart;
    return a.name.localeCompare(b.name, "zh-Hant");
  });
}

type GcisRow = {
  Company_Name?: string;
  Business_Accounting_NO?: string;
  Paid_In_Capital_Amount?: number | string;
  Capital_Stock_Amount?: number | string;
  Company_Location?: string;
  Company_Status?: string;
};

async function searchGcis(q: string): Promise<CompanyHit[]> {
  applySystemCa();
  const filter = `Company_Name like '%${q}%' and Company_Status eq 01`;
  const url = `${GCIS_KEYWORD}?$format=json&$filter=${encodeURIComponent(filter)}&$skip=0&$top=8`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.includes("json")) {
    throw new Error("gcis");
  }
  const text = await res.text();
  if (!text.trim()) return [];
  const body = JSON.parse(text) as GcisRow[] | GcisRow[][];
  const rows = Array.isArray(body) && Array.isArray(body[0]) ? (body[0] as GcisRow[]) : (body as GcisRow[]);
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((row) => row.Company_Name && (row.Company_Status === "01" || !row.Company_Status))
    .map((row) => ({
      name: String(row.Company_Name),
      taxId: String(row.Business_Accounting_NO ?? ""),
      capitalBillion: yuanToBillion(parseYuan(row.Paid_In_Capital_Amount) || parseYuan(row.Capital_Stock_Amount)),
      location: String(row.Company_Location ?? ""),
    }));
}

type G0vRow = {
  公司名稱?: string;
  統一編號?: string;
  "實收資本額(元)"?: string | number;
  "資本總額(元)"?: string | number;
  公司所在地?: string;
  登記現況?: string;
};

async function searchG0v(q: string): Promise<CompanyHit[]> {
  applySystemCa();
  const url = `${G0V_SEARCH}?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("g0v");
  const body = (await res.json()) as { data?: G0vRow[] };
  const rows = Array.isArray(body.data) ? body.data : [];
  return rows
    .filter((row) => row.公司名稱 && (!row.登記現況 || row.登記現況 === "核准設立"))
    .slice(0, 8)
    .map((row) => ({
      name: String(row.公司名稱),
      taxId: String(row.統一編號 ?? ""),
      capitalBillion: yuanToBillion(parseYuan(row["實收資本額(元)"]) || parseYuan(row["資本總額(元)"])),
      location: String(row.公司所在地 ?? ""),
    }));
}

export async function searchCompanies(raw: string): Promise<CompanySearchResult> {
  const q = sanitizeQuery(raw);
  if (q.length < 2) return { items: [], source: "" };
  try {
    const items = sortHits(await searchGcis(q), q);
    return { items, source: GCIS_SOURCE };
  } catch {
    try {
      const items = sortHits(await searchG0v(q), q);
      return { items, source: G0V_SOURCE };
    } catch {
      return { items: [], source: "", error: "無法連線經濟部商工登記，請改以完整名稱輸入。" };
    }
  }
}
