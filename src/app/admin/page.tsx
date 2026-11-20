"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  username: string;
  company: string;
  taxId: string;
  role: string;
  plan: "free" | "paid";
  paidUntil: string;
  paid: boolean;
  displayName?: string;
  companyQuota?: number;
  boundUsed?: number;
  boundClient?: string;
};

type NotionState = { connected?: boolean; databaseId?: string; envLocked?: boolean; error?: string };

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [notion, setNotion] = useState<NotionState>({});
  const [notionForm, setNotionForm] = useState({ token: "", pageUrl: "" });
  const [notionBusy, setNotionBusy] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    company: "",
    displayName: "",
    companyQuota: "1",
    taxId: "",
    plan: "free",
    paidUntil: "",
  });

  async function load() {
    const res = await fetch("/api/admin/members", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/login?next=/admin");
      return;
    }
    const data = (await res.json().catch(() => null)) as { members?: Row[]; error?: string } | null;
    if (!res.ok) {
      setError(data?.error || "無法讀取會員");
      return;
    }
    setMembers(data?.members || []);
    const notionRes = await fetch("/api/admin/notion", { cache: "no-store" });
    const notionData = (await notionRes.json().catch(() => null)) as NotionState | null;
    if (notionRes.ok && notionData) setNotion(notionData);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        companyQuota: Number(form.companyQuota) || 1,
      }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(data?.error || "無法建立帳號");
      return;
    }
    setForm({ username: "", password: "", company: "", displayName: "", companyQuota: "1", taxId: "", plan: "free", paidUntil: "" });
    await load();
  }

  async function save(row: Row) {
    setError("");
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: row.username,
        plan: row.plan,
        paidUntil: row.paidUntil,
        displayName: row.displayName,
        company: row.company,
        companyQuota: row.companyQuota,
      }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) setError(data?.error || "無法更新");
    await load();
  }

  async function unlockCase(row: Row) {
    setError("");
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: row.username, clearBoundCase: true }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) setError(data?.error || "無法解除鎖定");
    await load();
  }

  async function connectNotion(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotionBusy(true);
    try {
      const res = await fetch("/api/admin/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notionForm),
      });
      const data = (await res.json().catch(() => null)) as NotionState & { error?: string };
      if (!res.ok) {
        setError(data?.error || "無法連線 Notion");
        return;
      }
      setNotion(data);
      setNotionForm({ token: "", pageUrl: "" });
      await load();
    } finally {
      setNotionBusy(false);
    }
  }

  async function syncNotion() {
    setError("");
    setNotionBusy(true);
    try {
      const res = await fetch("/api/admin/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const data = (await res.json().catch(() => null)) as NotionState & { error?: string; count?: number };
      if (!res.ok) {
        setError(data?.error || "無法同步 Notion");
        return;
      }
      setNotion(data);
      await load();
    } finally {
      setNotionBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2f5] p-6 text-[14px] text-[#243044]">
      <div className="mx-auto max-w-6xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold">會員與付費開通</h1>
          <a href="/workbench" className="underline">
            回計算系統
          </a>
        </div>
        <p className="mt-1 text-[12px] text-[#555]">
          開通數量＝此帳號可填寫幾家受評公司的 ESG 資料。付費到期日用西元，例如 2027-12-31。
        </p>
        {error && <p className="mt-2 text-[#a40000]">{error}</p>}

        <form onSubmit={connectNotion} className="mt-4 grid gap-2 border border-[#ccc] p-3 md:grid-cols-2">
          <p className="md:col-span-2 text-[13px] font-semibold">Notion 會員管理</p>
          <p className="md:col-span-2 text-[12px] text-[#555]">
            {notion.connected
              ? `已連線資料庫 ${notion.databaseId}`
              : "請至 notion.so/my-integrations 建立內部整合，將密鑰與「要放會員表的 Notion 頁面」網址貼上。系統會建立「翰欣ESG會員管理」資料庫，欄位含帳號、密碼、公司、姓名、開通數量。"}
          </p>
          <input
            placeholder="Notion 內部整合密鑰"
            className="border px-2 py-1"
            type="password"
            value={notionForm.token}
            onChange={(e) => setNotionForm({ ...notionForm, token: e.target.value })}
          />
          <input
            placeholder="Notion 頁面或資料庫網址"
            className="border px-2 py-1"
            value={notionForm.pageUrl}
            onChange={(e) => setNotionForm({ ...notionForm, pageUrl: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-3">
            <button className="border border-[#2c3b4e] bg-[#2c3b4e] px-3 py-1 text-white disabled:bg-[#9aa4ad]" type="submit" disabled={notionBusy}>
              {notion.connected ? "重新連線並同步" : "連線並建立資料庫"}
            </button>
            {notion.connected ? (
              <button type="button" className="border px-3 py-1" disabled={notionBusy} onClick={() => void syncNotion()}>
                立即同步
              </button>
            ) : null}
          </div>
        </form>

        <form onSubmit={create} className="mt-4 grid gap-2 border border-[#ccc] p-3 md:grid-cols-3">
          <input placeholder="帳號" className="border px-2 py-1" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input placeholder="密碼（至少 8 碼）" className="border px-2 py-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input placeholder="公司" className="border px-2 py-1" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input placeholder="姓名" className="border px-2 py-1" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          <input
            placeholder="開通數量"
            type="number"
            min={1}
            className="border px-2 py-1"
            value={form.companyQuota}
            onChange={(e) => setForm({ ...form, companyQuota: e.target.value })}
          />
          <input placeholder="統編" className="border px-2 py-1" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
          <select className="border px-2 py-1" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
            <option value="free">免費</option>
            <option value="paid">付費</option>
          </select>
          <input type="date" className="border px-2 py-1" value={form.paidUntil} onChange={(e) => setForm({ ...form, paidUntil: e.target.value })} />
          <button className="border border-[#2c3b4e] bg-[#2c3b4e] px-3 py-1 text-white" type="submit">
            建立帳號
          </button>
        </form>
        <table className="mt-4 w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#2c3b4e] text-white">
              <th className="border px-2 py-1 text-left">帳號</th>
              <th className="border px-2 py-1 text-left">姓名</th>
              <th className="border px-2 py-1 text-left">公司</th>
              <th className="border px-2 py-1 text-left">開通</th>
              <th className="border px-2 py-1 text-left">受評公司</th>
              <th className="border px-2 py-1 text-left">方案</th>
              <th className="border px-2 py-1 text-left">到期日</th>
              <th className="border px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {members.filter((row) => row.role !== "admin").map((row) => (
              <tr key={row.username}>
                <td className="border px-2 py-1">{row.username}</td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full border px-1"
                    value={row.displayName || ""}
                    onChange={(e) =>
                      setMembers((list) => list.map((item) => (item.username === row.username ? { ...item, displayName: e.target.value } : item)))
                    }
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full border px-1"
                    value={row.company}
                    onChange={(e) =>
                      setMembers((list) => list.map((item) => (item.username === row.username ? { ...item, company: e.target.value } : item)))
                    }
                  />
                </td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  <input
                    type="number"
                    min={1}
                    className="w-14 border px-1"
                    value={row.companyQuota ?? 1}
                    onChange={(e) =>
                      setMembers((list) =>
                        list.map((item) => (item.username === row.username ? { ...item, companyQuota: Number(e.target.value) || 1 } : item)),
                      )
                    }
                  />
                  <span className="ml-1 text-[12px] text-[#555]">已用 {row.boundUsed ?? 0}</span>
                </td>
                <td className="border px-2 py-1">{row.boundClient || "尚未鎖定"}</td>
                <td className="border px-2 py-1">
                  <select
                    value={row.plan}
                    onChange={(e) =>
                      setMembers((list) => list.map((item) => (item.username === row.username ? { ...item, plan: e.target.value as Row["plan"] } : item)))
                    }
                  >
                    <option value="free">免費</option>
                    <option value="paid">付費</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="date"
                    value={row.paidUntil}
                    onChange={(e) =>
                      setMembers((list) => list.map((item) => (item.username === row.username ? { ...item, paidUntil: e.target.value } : item)))
                    }
                  />
                </td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  <button type="button" className="underline" onClick={() => void save(row)}>
                    儲存
                  </button>
                  {row.boundClient ? (
                    <button type="button" className="ml-2 underline" onClick={() => void unlockCase(row)}>
                      解除鎖定
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
