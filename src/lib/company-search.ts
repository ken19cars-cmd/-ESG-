import tls from "node:tls";
import { INDUSTRIES, type IndustryId } from "@/lib/industry-rules";

export type CompanyHit = {
  name: string;
  taxId: string;
  capitalBillion: number | null;
  location: string;
  industry?: IndustryId;
  industryLabel?: string;
};

export type CompanySearchResult = {
  items: CompanyHit[];
  source: string;
  error?: string;
};

const GCIS_KEYWORD =
  "https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C";
const G0V_SEARCH = "https://company.g0v.ronny.tw/api/search";
const TWSE_LIST = "https://openapi.twse.com.tw/v1/opendata/t187ap03_L";
const TPEX_LIST = "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O";

const LISTED_SOURCE = "臺灣證券交易所／證券櫃檯買賣中心公開資訊（產業別依上市櫃分類）";
const GCIS_SOURCE = "經濟部商業發展署商工行政資料開放平臺";
const G0V_SOURCE = "經濟部商工登記（備援索引）";

const LISTED_TTL_MS = 12 * 60 * 60 * 1000;
const QUERY_TTL_MS = 10 * 60 * 1000;

/** 證交所產業別代碼 → 作業辦法附表一產業。其餘歸其他。 */
const TWSE_INDUSTRY: Record<string, IndustryId> = {
  "01": "cement",
  "02": "food",
  "03": "plastic",
  "10": "steel",
  "17": "finance",
  "21": "chemical",
  "23": "energy",
  "24": "semiconductor",
  "25": "computer",
  "26": "opto",
  "27": "comm",
  "28": "component",
  "29": "channel",
  "31": "other_electronic",
};

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

function industryLabel(id: IndustryId | undefined) {
  if (!id) return "";
  return INDUSTRIES.find((x) => x.id === id)?.name ?? "";
}

function fromTwseCode(code: string | undefined): IndustryId | undefined {
  if (!code) return undefined;
  const key = code.trim().padStart(2, "0");
  return TWSE_INDUSTRY[key] ?? "other";
}

function inferIndustry(labels: string[]): IndustryId | undefined {
  const t = labels.join(" ");
  if (!t.trim()) return undefined;
  const rules: [RegExp, IndustryId][] = [
    [/半導體|積體電路|晶圓/, "semiconductor"],
    [/水泥/, "cement"],
    [/鋼鐵|煉鋼/, "steel"],
    [/塑膠/, "plastic"],
    [/石油煉製|油電燃氣|燃氣供應|電力供應/, "energy"],
    [/化學材料|化學製品|基本化學/, "chemical"],
    [/食品製造|飲料製造/, "food"],
    [/銀行|保險|證券商|金融控股|金融保險/, "finance"],
    [/電腦及其週邊|電腦製造/, "computer"],
    [/光電材料|液晶|發光二極體/, "opto"],
    [/通信機械|電信/, "comm"],
    [/電子通路|電子材料批發/, "channel"],
    [/電子零組件/, "component"],
    [/電子/, "other_electronic"],
  ];
  for (const [re, id] of rules) if (re.test(t)) return id;
  return undefined;
}

function hitWithIndustry(hit: Omit<CompanyHit, "industryLabel">): CompanyHit {
  return { ...hit, industryLabel: industryLabel(hit.industry) };
}

function sortHits(items: CompanyHit[], q: string) {
  return [...items].sort((a, b) => {
    const score = (name: string) => (name === q ? 0 : name.startsWith(q) ? 1 : 2);
    const d = score(a.name) - score(b.name);
    if (d !== 0) return d;
    return a.name.localeCompare(b.name, "zh-Hant");
  });
}

type ListedRow = {
  name: string;
  short: string;
  taxId: string;
  industryCode: string;
  capitalYuan: number;
  location: string;
};

let listedAt = 0;
let listedLoad: Promise<ListedRow[]> | null = null;
const queryCache = new Map<string, { at: number; result: CompanySearchResult }>();

async function fetchJson(url: string, ms: number) {
  applySystemCa();
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HanxinESG/1.0 company-lookup",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(ms),
  });
  if (!res.ok) throw new Error("http");
  const text = await res.text();
  if (!text.trim() || text.trimStart().startsWith("<")) throw new Error("http");
  return JSON.parse(text);
}

async function loadListed(): Promise<ListedRow[]> {
  const [twse, tpex] = await Promise.allSettled([
    fetchJson(TWSE_LIST, 12000) as Promise<Record<string, string>[]>,
    fetchJson(TPEX_LIST, 12000) as Promise<Record<string, string>[]>,
  ]);
  const rows: ListedRow[] = [];
  if (twse.status === "fulfilled" && Array.isArray(twse.value)) {
    for (const row of twse.value) {
      const name = String(row["公司名稱"] ?? "").trim();
      if (!name) continue;
      rows.push({
        name,
        short: String(row["公司簡稱"] ?? "").trim(),
        taxId: String(row["營利事業統一編號"] ?? "").trim(),
        industryCode: String(row["產業別"] ?? "").trim(),
        capitalYuan: parseYuan(row["實收資本額"]),
        location: String(row["住址"] ?? "").trim(),
      });
    }
  }
  if (tpex.status === "fulfilled" && Array.isArray(tpex.value)) {
    for (const row of tpex.value) {
      const name = String(row.CompanyName ?? "").trim();
      if (!name) continue;
      rows.push({
        name,
        short: String(row.CompanyAbbreviation ?? "").trim(),
        taxId: String(row["UnifiedBusinessNo."] ?? "").trim(),
        industryCode: String(row.SecuritiesIndustryCode ?? "").trim(),
        capitalYuan: parseYuan(row["Paidin.Capital.NTDollars"]),
        location: String(row.Address ?? "").trim(),
      });
    }
  }
  if (!rows.length) throw new Error("listed");
  listedAt = Date.now();
  return rows;
}

function listedRows() {
  const stale = listedAt > 0 && Date.now() - listedAt > LISTED_TTL_MS;
  if (!listedLoad || stale) {
    listedLoad = loadListed().catch((err) => {
      listedLoad = null;
      throw err;
    });
  }
  return listedLoad;
}

export function warmCompanyCache() {
  void listedRows().catch(() => undefined);
}

function searchListed(rows: ListedRow[], q: string): CompanyHit[] {
  const hits = rows.filter((row) => row.name.includes(q) || row.short.includes(q)).slice(0, 12);
  return sortHits(
    hits.map((row) =>
      hitWithIndustry({
        name: row.name,
        taxId: row.taxId,
        capitalBillion: yuanToBillion(row.capitalYuan),
        location: row.location,
        industry: fromTwseCode(row.industryCode),
      }),
    ),
    q,
  ).slice(0, 8);
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
  const filter = `Company_Name like '%${q}%' and Company_Status eq 01`;
  const url = `${GCIS_KEYWORD}?$format=json&$filter=${encodeURIComponent(filter)}&$skip=0&$top=8`;
  const body = (await fetchJson(url, 2500)) as GcisRow[] | GcisRow[][];
  const rows = Array.isArray(body) && Array.isArray(body[0]) ? (body[0] as GcisRow[]) : (body as GcisRow[]);
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((row) => row.Company_Name && (row.Company_Status === "01" || !row.Company_Status))
    .map((row) =>
      hitWithIndustry({
        name: String(row.Company_Name),
        taxId: String(row.Business_Accounting_NO ?? ""),
        capitalBillion: yuanToBillion(parseYuan(row.Paid_In_Capital_Amount) || parseYuan(row.Capital_Stock_Amount)),
        location: String(row.Company_Location ?? ""),
      }),
    );
}

type G0vRow = {
  公司名稱?: string;
  統一編號?: string;
  "實收資本額(元)"?: string | number;
  "資本總額(元)"?: string | number;
  公司所在地?: string;
  登記現況?: string;
  所營事業資料?: unknown;
  財政部?: { 行業?: unknown };
};

function g0vLabels(row: G0vRow): string[] {
  const out: string[] = [];
  const biz = row.所營事業資料;
  if (Array.isArray(biz)) {
    for (const item of biz) {
      if (Array.isArray(item) && typeof item[1] === "string") out.push(item[1]);
      else if (typeof item === "string") out.push(item);
    }
  }
  const trades = row.財政部?.行業;
  if (Array.isArray(trades)) {
    for (const item of trades) {
      if (Array.isArray(item) && typeof item[1] === "string") out.push(item[1]);
    }
  }
  return out;
}

async function searchG0v(q: string): Promise<CompanyHit[]> {
  const body = (await fetchJson(`${G0V_SEARCH}?q=${encodeURIComponent(q)}`, 2500)) as { data?: G0vRow[] };
  const rows = Array.isArray(body.data) ? body.data : [];
  return rows
    .filter((row) => row.公司名稱 && (!row.登記現況 || row.登記現況 === "核准設立"))
    .slice(0, 8)
    .map((row) => {
      const industry = inferIndustry(g0vLabels(row));
      return hitWithIndustry({
        name: String(row.公司名稱),
        taxId: String(row.統一編號 ?? ""),
        capitalBillion: yuanToBillion(parseYuan(row["實收資本額(元)"]) || parseYuan(row["資本總額(元)"])),
        location: String(row.公司所在地 ?? ""),
        industry,
      });
    });
}

async function searchRemote(q: string): Promise<CompanySearchResult> {
  try {
    const items = sortHits(await searchG0v(q), q);
    return { items, source: G0V_SOURCE };
  } catch {
    try {
      const items = sortHits(await searchGcis(q), q);
      return { items, source: GCIS_SOURCE };
    } catch {
      return { items: [], source: "", error: "無法連線公司登記資料，請改以完整名稱輸入。" };
    }
  }
}

export async function searchCompanies(raw: string): Promise<CompanySearchResult> {
  const q = sanitizeQuery(raw);
  if (q.length < 2) return { items: [], source: "" };
  const cached = queryCache.get(q);
  if (cached && Date.now() - cached.at < QUERY_TTL_MS) return cached.result;

  let listed: ListedRow[] = [];
  try {
    listed = await listedRows();
  } catch {
    listed = [];
  }
  const listedHits = listed.length ? searchListed(listed, q) : [];
  const result: CompanySearchResult = listedHits.length
    ? { items: listedHits, source: LISTED_SOURCE }
    : await searchRemote(q);

  if (result.items.length) {
    queryCache.set(q, { at: Date.now(), result });
    if (queryCache.size > 200) {
      const first = queryCache.keys().next().value;
      if (first) queryCache.delete(first);
    }
  }
  return result;
}
