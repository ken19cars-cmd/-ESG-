export const POLICY_CATEGORIES = [
  { id: "charter", label: "公司章程" },
  { id: "finance", label: "財務規範" },
  { id: "internal", label: "內控制度" },
  { id: "board", label: "董事會議事規範" },
  { id: "integrity", label: "誠信經營守則" },
  { id: "other", label: "其他內規" },
] as const;

export type PolicyCategoryId = (typeof POLICY_CATEGORIES)[number]["id"];

export type InternalPolicyDoc = {
  id: string;
  category: PolicyCategoryId;
  name: string;
  mime: string;
  size: number;
  at: number;
  /** 小檔才保留，供之後擴充文字勾稽；大檔僅留清單。 */
  dataUrl?: string;
};

export type PolicyCheck = {
  id: string;
  level: "異常" | "注意" | "通過";
  title: string;
  detail: string;
  basis: string;
};

const MAX_STORE_BYTES = 1_200_000;
const ACCEPT =
  ".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/png,image/jpeg,image/webp";

export const POLICY_ACCEPT = ACCEPT;

function storageKey(username: string, client: string) {
  return `hanxin-esg-policies:${username}:${client || "_draft"}`;
}

export function policyCategoryLabel(id: PolicyCategoryId) {
  return POLICY_CATEGORIES.find((item) => item.id === id)?.label || id;
}

export function loadInternalPolicies(username: string, client: string): InternalPolicyDoc[] {
  try {
    const raw = localStorage.getItem(storageKey(username, client));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InternalPolicyDoc[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInternalPolicies(username: string, client: string, docs: InternalPolicyDoc[]) {
  try {
    localStorage.setItem(storageKey(username, client), JSON.stringify(docs));
  } catch {
    /* quota / private mode */
  }
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export async function readPolicyFile(
  file: File,
  category: PolicyCategoryId,
): Promise<InternalPolicyDoc> {
  const base: InternalPolicyDoc = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    category,
    name: file.name,
    mime: file.type || "application/octet-stream",
    size: file.size,
    at: Date.now(),
  };
  if (file.size > MAX_STORE_BYTES) return base;
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("讀取失敗"));
    reader.readAsDataURL(file);
  });
  return { ...base, dataUrl };
}

export function policyChecks(docs: InternalPolicyDoc[], caseReady: boolean): PolicyCheck[] {
  if (!caseReady) return [];
  const has = (id: PolicyCategoryId) => docs.some((doc) => doc.category === id);
  const checks: PolicyCheck[] = [];
  if (!has("charter")) {
    checks.push({
      id: "pol-charter",
      level: "注意",
      title: "未上傳公司章程",
      detail: "治理席次、董事會職權等欄位，後續可對照章程條文擴充勾稽。",
      basis: "公司內規底稿",
    });
  }
  if (!has("finance")) {
    checks.push({
      id: "pol-finance",
      level: "注意",
      title: "未上傳財務規範",
      detail: "財務分母、資本支出與內部授權額度，建議備財務規範供檢核。",
      basis: "公司內規底稿",
    });
  }
  if (!has("internal") && !has("board") && !has("integrity")) {
    checks.push({
      id: "pol-gov",
      level: "注意",
      title: "未上傳治理相關內規",
      detail: "建議至少上傳內控制度、董事會議事規範或誠信經營守則之一。",
      basis: "公司內規底稿",
    });
  }
  if (docs.length > 0 && checks.length === 0) {
    checks.push({
      id: "pol-ok",
      level: "通過",
      title: "內規底稿已備齊建議項目",
      detail: `已上傳 ${docs.length} 份文件，可作為擴充勾稽／檢核對照。`,
      basis: "公司內規底稿",
    });
  } else if (docs.length > 0) {
    checks.unshift({
      id: "pol-partial",
      level: "通過",
      title: `已上傳 ${docs.length} 份內規底稿`,
      detail: "可依缺漏項目再補件，擴充治理與財務勾稽依據。",
      basis: "公司內規底稿",
    });
  }
  return checks;
}
