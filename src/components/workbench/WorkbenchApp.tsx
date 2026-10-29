"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  compute,
  defaultInputs,
  fieldCatalog,
  regulationCatalog,
  type Inputs,
  type Metric,
} from "@/lib/esg-engine";

type Sheet = "fin" | "env" | "hr" | "gov" | "kpi" | "par" | "chart" | "why" | "reg";

const sheets: { id: Sheet; label: string }[] = [
  { id: "fin", label: "1.財務分母" },
  { id: "env", label: "2.環境E" },
  { id: "hr", label: "3.社會S" },
  { id: "gov", label: "4.治理G" },
  { id: "kpi", label: "5.績效薪酬" },
  { id: "par", label: "6.係數參數" },
  { id: "chart", label: "7.指標圖預覽" },
  { id: "why", label: "8.參數說明" },
  { id: "reg", label: "9.法規庫" },
];

function num(e: React.ChangeEvent<HTMLInputElement>) {
  const v = e.target.value;
  if (v === "" || v === "-") return 0;
  return Number(v);
}

export function WorkbenchApp() {
  const [sheet, setSheet] = useState<Sheet>("why");
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [regStamp, setRegStamp] = useState("尚未核對法規版本");
  const result = useMemo(() => compute(inputs), [inputs]);

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const fail = result.checks.filter((c) => c.level === "異常").length;
  const warn = result.checks.filter((c) => c.level === "注意").length;
  const fields = fieldCatalog.filter((f) => f.sheet === sheet);

  const grouped = fields.reduce<Record<string, typeof fields>>((acc, f) => {
    (acc[f.section] ||= []).push(f);
    return acc;
  }, {});

  const sideMetrics = result.metrics.filter((m) => {
    if (sheet === "env" || sheet === "chart") return m.group.startsWith("E");
    if (sheet === "hr") return m.group.startsWith("S") && !m.group.includes("績效");
    if (sheet === "kpi") return m.group.includes("績效") || m.group.includes("薪酬");
    if (sheet === "gov") return m.group.startsWith("G") && !m.group.includes("薪酬");
    return true;
  });

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b border-[#8a8a8a] bg-[#2c3b4e] px-3 py-1.5 text-[13px] text-white">
        <div className="flex items-center gap-4">
          <b>翰欣科技 ESG 計算系統</b>
          <span className="opacity-80">寫入活動數據 → 係數／公式運算 → 勾稽 → 圖表預覽</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            指標 {result.metrics.length}　異常 {fail}　注意 {warn}
          </span>
          <Link href="/" className="underline">
            回儀表板
          </Link>
        </div>
      </div>

      <div className="border-b border-[#b0b0b0] bg-[#d9e2ec] px-3 py-2 text-[13px]">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex items-center gap-2">
            案件
            <input className="w-[280px]" value={inputs.client} onChange={(e) => set("client", e.target.value)} />
          </label>
          <label className="flex items-center gap-2">
            年度
            <input className="w-[80px]" value={inputs.year} onChange={(e) => set("year", e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="checkbox"
              checked={inputs.useActivityForGhg}
              onChange={(e) => set("useActivityForGhg", e.target.checked)}
            />
            Scope1/2 用活動數據×係數（建議）
          </label>
          <span className="text-[#333]">藍字＝寫入　黃底＝系統運算　業務達成率不計入社會面分數</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-0 border-b border-[#aaa] bg-[#dedede] px-2 pt-1">
        {sheets.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSheet(s.id)}
            className={`mr-1 border border-b-0 px-2 py-1 text-[12px] ${
              sheet === s.id ? "border-[#888] bg-white font-semibold" : "border-transparent bg-[#cfd6dd] text-[#333]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="border-r border-[#bbb] bg-white p-3">
          {["fin", "env", "hr", "gov", "kpi", "par"].includes(sheet) &&
            Object.entries(grouped).map(([section, rows]) => (
              <div key={section} className="mb-4">
                <p className="mb-1 text-[12px] font-bold">
                  <span className="wb-tag">寫入</span>
                  {section}
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                      <th className="border border-[#888] px-2 py-1">項目</th>
                      <th className="w-[120px] border border-[#888] px-2 py-1">寫入</th>
                      <th className="w-[90px] border border-[#888] px-2 py-1">單位</th>
                      <th className="border border-[#888] px-2 py-1">為什麼要這個參數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((f) => (
                      <tr key={String(f.key)}>
                        <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">{f.label}</td>
                        <td className="border border-[#c8c8c8] px-1 py-1">
                          <input
                            type="number"
                            step="any"
                            value={Number(inputs[f.key])}
                            onChange={(e) => set(f.key, num(e) as never)}
                          />
                        </td>
                        <td className="border border-[#c8c8c8] px-2 py-1 text-[12px]">{f.unit}</td>
                        <td className="border border-[#c8c8c8] px-2 py-1 text-[12px] text-[#444]">
                          {f.why}
                          <div className="text-[11px] text-[#777]">{f.gri}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

          {sheet === "chart" && <ChartPreview metrics={result.metrics} />}

          {sheet === "why" && (
            <div>
              <p className="mb-2 text-[13px] leading-6">
                先前只有績效KPI＋少數環境人力欄。永續報告書還要 <b>E 能源／排放／水／廢棄物／空氣污染物</b>、
                <b>S 性別／身障／育嬰／職災死亡／TRIR／供應商／人權訓練</b>、
                <b>G 獨董／出席／反貪腐／裁罰／資安</b>，以及把度數變成噸CO2e 的
                <b>係數與 GWP</b>。下列是全部寫入參數與用途。
              </p>
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#2c3b4e] text-white">
                    <th className="border border-[#888] px-2 py-1 text-left">分頁</th>
                    <th className="border border-[#888] px-2 py-1 text-left">參數</th>
                    <th className="border border-[#888] px-2 py-1 text-left">為什麼需要</th>
                    <th className="border border-[#888] px-2 py-1 text-left">對應</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldCatalog.map((f) => (
                    <tr key={String(f.key)}>
                      <td className="border border-[#ccc] px-2 py-1">{f.section}</td>
                      <td className="border border-[#ccc] px-2 py-1">{f.label}</td>
                      <td className="border border-[#ccc] px-2 py-1">{f.why}</td>
                      <td className="border border-[#ccc] px-2 py-1">{f.gri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {sheet === "reg" && (
            <div>
              <button
                type="button"
                className="mb-2 border border-[#444] bg-[#eee] px-3 py-1 text-[13px]"
                onClick={() =>
                  setRegStamp(`已核對內建法規庫 ${new Date().toLocaleString("zh-TW", { hour12: false })}`)
                }
              >
                核對法規版本
              </button>
              <span className="ml-2 text-[13px]">{regStamp}</span>
              <table className="mt-2 w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#2c3b4e] text-white">
                    <th className="border px-2 py-1 text-left">規範</th>
                    <th className="border px-2 py-1 text-left">版本</th>
                    <th className="border px-2 py-1 text-left">計算要點</th>
                  </tr>
                </thead>
                <tbody>
                  {regulationCatalog.map((r) => (
                    <tr key={r.id}>
                      <td className="border px-2 py-1">
                        <a className="text-[#003399] underline" href={r.url} target="_blank">
                          {r.name}
                        </a>
                      </td>
                      <td className="border px-2 py-1">
                        {r.version}／庫內 {r.asOf}
                      </td>
                      <td className="border px-2 py-1">{r.point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="bg-[#f4f4f4] p-3">
          <h2 className="mb-2 text-[14px] font-bold">系統運算結果</h2>
          <table className="mb-3 w-full border-collapse text-[11px]">
            <tbody>
              {sideMetrics.map((m) => (
                <tr key={m.id}>
                  <td className="border border-[#ccc] px-2 py-1">
                    {m.name}
                    <div className="text-[10px] text-[#666]">{m.formula}</div>
                  </td>
                  <td className="wb-calc border border-[#ccc] px-2 py-1 text-right">
                    {m.value} {m.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="mb-2 text-[14px] font-bold">自動勾稽</h2>
          <ul className="space-y-1 text-[12px]">
            {result.checks.map((c) => (
              <li
                key={c.id}
                className={`border px-2 py-1 ${
                  c.level === "異常"
                    ? "border-red-800 bg-[#fde8e8]"
                    : c.level === "注意"
                      ? "border-[#8a6d00] bg-[#fff4cc]"
                      : "border-[#2d6a2d] bg-[#e7f5e7]"
                }`}
              >
                <b>
                  [{c.level}] {c.title}
                </b>
                <div>{c.detail}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function ChartPreview({ metrics }: { metrics: Metric[] }) {
  const bars = [
    ["再生能源%", metrics.find((m) => m.id === "ren")?.raw ?? 0],
    ["回收率%", metrics.find((m) => m.id === "rec")?.raw ?? 0],
    ["女性占比%", metrics.find((m) => m.id === "fem")?.raw ?? 0],
    ["考核覆蓋%", metrics.find((m) => m.id === "rev")?.raw ?? 0],
    ["獨董比%", metrics.find((m) => m.id === "ind")?.raw ?? 0],
    ["出席率%", metrics.find((m) => m.id === "att")?.raw ?? 0],
    ["供應商評鑑%", metrics.find((m) => m.id === "sup")?.raw ?? 0],
    ["反貪腐訓練%", metrics.find((m) => m.id === "ac")?.raw ?? 0],
  ] as [string, number][];
  const s1 = metrics.find((m) => m.id === "s1")?.raw ?? 0;
  const s2 = metrics.find((m) => m.id === "s2")?.raw ?? 0;
  const tot = s1 + s2 || 1;

  return (
    <div className="text-[13px]">
      <p className="mb-2">
        <span className="wb-tag">預覽</span>
        依目前寫入即時重算。列印／確信前仍以右側數字表為準。
      </p>
      <div className="mb-4 border border-[#ccc] p-3">
        <b>比率類指標（%）</b>
        <svg viewBox="0 0 520 220" className="mt-2 h-auto w-full max-w-[640px] bg-white">
          {bars.map((row, i) => {
            const w = Math.max(0, Math.min(100, row[1])) * 3.4;
            return (
              <g key={row[0]}>
                <text x="4" y={18 + i * 26} fontSize="11" fill="#222">
                  {row[0]}
                </text>
                <rect x="120" y={8 + i * 26} width="340" height="14" fill="#eee" stroke="#999" />
                <rect x="120" y={8 + i * 26} width={w} height="14" fill="#4a6b8a" />
                <text x="466" y={18 + i * 26} fontSize="11" fill="#111">
                  {Number.isFinite(row[1]) ? row[1].toFixed(1) : "—"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="border border-[#ccc] p-3">
        <b>Scope 1 / 2 結構（tCO2e）</b>
        <p className="mt-1 text-[12px]">
          Scope 1 {s1.toFixed(0)}（{((s1 / tot) * 100).toFixed(1)}%）　Scope 2 {s2.toFixed(0)}（
          {((s2 / tot) * 100).toFixed(1)}%）
        </p>
        <div className="mt-2 flex h-6 w-full max-w-[520px] overflow-hidden border border-[#888]">
          <div className="bg-[#6b4a3a] text-center text-[11px] text-white" style={{ width: `${(s1 / tot) * 100}%` }}>
            S1
          </div>
          <div className="bg-[#3a5a6b] text-center text-[11px] text-white" style={{ width: `${(s2 / tot) * 100}%` }}>
            S2
          </div>
        </div>
      </div>
    </div>
  );
}
