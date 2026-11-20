import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "member-credentials.json");

const DEMO_PASSWORDS: Record<string, string> = {
  admin: "HxAdmin-2026",
  "firm-free": "TryCalc-2026",
  "firm-paid": "Report-2026",
};

function readStore(): Record<string, string> {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, string>) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(store, null, 2), "utf8");
}

export function getIssuedPassword(username: string) {
  return readStore()[username] || DEMO_PASSWORDS[username] || "";
}

export function setIssuedPassword(username: string, password: string) {
  const store = readStore();
  store[username] = password;
  try {
    writeStore(store);
  } catch {
    /* Vercel 唯讀時僅本次同步使用明文，不落檔。 */
  }
}
