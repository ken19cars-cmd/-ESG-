import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { hashPassword } from "@/lib/auth";
import { getIssuedPassword, setIssuedPassword } from "@/lib/member-credentials";
import { listMembers, memberQuota, saveMembers, type Member } from "@/lib/members";

const VERSION = "2022-06-28";
const file = path.join(process.cwd(), "data", "notion.json");

type NotionConfig = {
  token: string;
  databaseId: string;
  parentPageId?: string;
};

type NotionProperty = Record<string, unknown>;

function readFileConfig(): Partial<NotionConfig> {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<NotionConfig>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeFileConfig(config: NotionConfig) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(config, null, 2), "utf8");
}

export function getNotionConfig(): NotionConfig | null {
  const fromFile = readFileConfig();
  const token = process.env.NOTION_TOKEN || fromFile.token || "";
  const databaseId = process.env.NOTION_MEMBERS_DATABASE_ID || fromFile.databaseId || "";
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID || fromFile.parentPageId || "";
  if (!token) return null;
  return { token, databaseId, parentPageId };
}

export function notionReady() {
  const config = getNotionConfig();
  return Boolean(config?.token && config.databaseId);
}

export function parseNotionId(raw: string) {
  const text = raw.trim();
  const compact = text.match(/[0-9a-f]{32}/i)?.[0];
  const dashed = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
  const hex = (dashed || compact || "").replace(/-/g, "").toLowerCase();
  if (hex.length !== 32) return "";
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function notion(config: Pick<NotionConfig, "token">, method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Notion-Version": VERSION,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { message?: string; object?: string; id?: string } | null;
  if (!res.ok) {
    throw new Error(data?.message || `Notion API ${res.status}`);
  }
  return data as Record<string, unknown>;
}

function richText(text: string) {
  return { rich_text: [{ type: "text", text: { content: (text || "").slice(0, 1900) } }] };
}

function title(text: string) {
  return { title: [{ type: "text", text: { content: (text || "").slice(0, 1900) } }] };
}

function readRichText(prop: NotionProperty | undefined) {
  const items = (prop?.rich_text || prop?.title) as { plain_text?: string }[] | undefined;
  return (items || []).map((item) => item.plain_text || "").join("").trim();
}

async function boundClientNames(username: string) {
  const { getBoundCases } = await import("@/lib/bound-case");
  return getBoundCases(username).map((item) => item.client);
}

async function memberProperties(member: Member) {
  const clients = member.role === "admin" ? [] : await boundClientNames(member.username);
  const password = member.role === "admin" ? "" : getIssuedPassword(member.username);
  return {
    姓名: title(member.displayName || member.company || member.username),
    帳號: richText(member.username),
    密碼: richText(password),
    公司: richText(member.company),
    開通數量: { number: memberQuota(member) },
    已使用: { number: clients.length },
    受評公司: richText(clients.join("、")),
    方案: { select: { name: member.plan === "paid" ? "付費" : "免費" } },
    到期日: member.paidUntil ? { date: { start: member.paidUntil } } : { date: null },
  };
}

export async function connectNotion(token: string, parentOrDatabase: string) {
  const secret = token.trim();
  if (!secret.startsWith("ntn_") && !secret.startsWith("secret_")) {
    throw new Error("請貼上 Notion 內部整合密鑰（Internal Integration Secret）。");
  }
  const id = parseNotionId(parentOrDatabase);
  if (!id) throw new Error("請貼上 Notion 頁面或資料庫網址。");
  const inspect = await notion({ token: secret }, "GET", `https://api.notion.com/v1/pages/${id}`).catch(async () => {
    return notion({ token: secret }, "GET", `https://api.notion.com/v1/databases/${id}`);
  });
  let databaseId = "";
  let parentPageId = "";
  if (inspect.object === "database") {
    databaseId = String(inspect.id || id);
  } else {
    parentPageId = String(inspect.id || id);
    const created = await notion(
      { token: secret },
      "POST",
      "https://api.notion.com/v1/databases",
      {
        parent: { type: "page_id", page_id: parentPageId },
        title: [{ type: "text", text: { content: "翰欣ESG會員管理" } }],
        properties: {
          姓名: { title: {} },
          帳號: { rich_text: {} },
          密碼: { rich_text: {} },
          公司: { rich_text: {} },
          開通數量: { number: { format: "number" } },
          已使用: { number: { format: "number" } },
          受評公司: { rich_text: {} },
          方案: {
            select: {
              options: [
                { name: "免費", color: "gray" },
                { name: "付費", color: "green" },
              ],
            },
          },
          到期日: { date: {} },
        },
      },
    );
    databaseId = String(created.id || "");
  }
  if (!databaseId) throw new Error("無法建立或讀取 Notion 資料庫。");
  const config: NotionConfig = { token: secret, databaseId, parentPageId };
  try {
    writeFileConfig(config);
  } catch {
    /* Vercel 請改設環境變數 */
  }
  return config;
}

async function findPageId(config: NotionConfig, username: string) {
  const data = await notion(config, "POST", `https://api.notion.com/v1/databases/${config.databaseId}/query`, {
    filter: { property: "帳號", rich_text: { equals: username } },
    page_size: 1,
  });
  const results = (data.results as { id?: string }[]) || [];
  return results[0]?.id || "";
}

export async function upsertMemberToNotion(member: Member) {
  const config = getNotionConfig();
  if (!config?.databaseId) return { skipped: true as const };
  if (member.role === "admin") return { skipped: true as const };
  const properties = await memberProperties(member);
  const pageId = await findPageId(config, member.username);
  if (pageId) {
    await notion(config, "PATCH", `https://api.notion.com/v1/pages/${pageId}`, { properties });
    return { pageId };
  }
  const created = await notion(config, "POST", "https://api.notion.com/v1/pages", {
    parent: { database_id: config.databaseId },
    properties,
  });
  return { pageId: String(created.id || "") };
}

export async function syncAllMembersToNotion() {
  const config = getNotionConfig();
  if (!config?.databaseId) return { ok: false, error: "尚未連線 Notion。", count: 0 };
  let count = 0;
  for (const member of listMembers().filter((item) => item.role !== "admin")) {
    await upsertMemberToNotion(member);
    count += 1;
  }
  return { ok: true, count };
}

function notionPlan(name: string): "free" | "paid" {
  return name.includes("付費") ? "paid" : "free";
}

export async function importMembersFromNotion() {
  const config = getNotionConfig();
  if (!config?.databaseId) return { ok: false, count: 0 };
  const members = listMembers();
  let cursor: string | undefined;
  let count = 0;
  do {
    const data = await notion(config, "POST", `https://api.notion.com/v1/databases/${config.databaseId}/query`, {
      start_cursor: cursor,
      page_size: 100,
    });
    const results = (data.results as { properties?: Record<string, NotionProperty> }[]) || [];
    for (const page of results) {
      const props = page.properties || {};
      const username = readRichText(props["帳號"]);
      if (!username) continue;
      const existing = members.find((item) => item.username === username);
      if (existing?.role === "admin") continue;
      const displayName = readRichText(props["姓名"]);
      const company = readRichText(props["公司"]);
      const password = readRichText(props["密碼"]);
      const quotaRaw = props["開通數量"]?.number;
      const quota = typeof quotaRaw === "number" && quotaRaw > 0 ? Math.floor(quotaRaw) : 0;
      const planName = String((props["方案"]?.select as { name?: string } | undefined)?.name || "");
      const paidUntil = String((props["到期日"]?.date as { start?: string } | undefined)?.start || "").slice(0, 10);
      const plan = notionPlan(planName) || existing?.plan || "free";
      if (existing) {
        if (displayName) existing.displayName = displayName;
        if (company) existing.company = company;
        if (quota) existing.companyQuota = quota;
        if (planName) existing.plan = plan;
        if (paidUntil) existing.paidUntil = paidUntil;
        if (password.length >= 8 && password !== getIssuedPassword(username)) {
          existing.passwordHash = hashPassword(password);
          setIssuedPassword(username, password);
        }
      } else if (password.length >= 8) {
        members.push({
          username,
          passwordHash: hashPassword(password),
          company,
          taxId: "",
          role: "member",
          plan,
          paidUntil: plan === "paid" ? paidUntil : "",
          displayName,
          companyQuota: quota || 1,
        });
        setIssuedPassword(username, password);
      } else {
        continue;
      }
      count += 1;
    }
    cursor = data.has_more ? String(data.next_cursor || "") : undefined;
  } while (cursor);
  try {
    saveMembers(members);
  } catch {
    /* 環境無法回寫時，僅本次行程有效 */
  }
  return { ok: true, count };
}

export function notionStatus() {
  const config = getNotionConfig();
  return {
    connected: Boolean(config?.token && config.databaseId),
    databaseId: config?.databaseId || "",
    envLocked: Boolean(process.env.NOTION_TOKEN || process.env.NOTION_MEMBERS_DATABASE_ID),
  };
}
