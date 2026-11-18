"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/workbench";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; member?: { role?: string } } | null;
      if (!res.ok) throw new Error(data?.error || "登入失敗");
      router.push(data?.member?.role === "admin" && next === "/workbench" ? "/admin" : next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-[380px] border border-[#8a8a8a] bg-white p-6 text-[14px] text-[#243044]">
      <h1 className="text-[18px] font-bold">會員登入</h1>
      <p className="mt-1 text-[12px] text-[#555]">翰欣科技 ESG 計算系統</p>
      <label className="mt-4 block">
        帳號
        <input className="mt-1 w-full border border-[#888] px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
      </label>
      <label className="mt-3 block">
        密碼
        <input className="mt-1 w-full border border-[#888] px-2 py-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {error && <p className="mt-3 text-[13px] text-[#a40000]">{error}</p>}
      <button type="submit" disabled={busy} className="mt-4 border border-[#2c3b4e] bg-[#2c3b4e] px-4 py-1 text-white">
        {busy ? "登入中" : "登入"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f5]">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
