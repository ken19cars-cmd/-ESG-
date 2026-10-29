"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  compute,
  defaultInputs,
  derived,
  fieldCatalog,
  isLockedKey,
  missingOnRow,
  preResults,
  regulationCatalog,
  type Inputs,
  type Metric,
} from "@/lib/esg-engine";
import { griIndex, reportDraft } from "@/lib/report-draft";
import {
  OFFICIAL_FACTOR_KEYS,
  REFRIGERANTS,
  type FactorAudit,
} from "@/lib/official-factors";

type Sheet = "pre" | "fin" | "env" | "hr" | "gov" | "kpi" | "par" | "chart" | "why" | "reg" | "rep";

const sheets: { id: Sheet; label: string }[] = [
  { id: "pre", label: "0.接案前置底稿" },
  { id: "fin", label: "1.財務分母" },
  { id: "env", label: "2.環境E" },
  { id: "hr", label: "3.社會S" },
  { id: "gov", label: "4.治理G" },
  { id: "kpi", label: "5.績效薪酬" },
  { id: "par", label: "6.係數參數" },
  { id: "chart", label: "7.指標圖預覽" },
  { id: "why", label: "8.欄位對照" },
  { id: "reg", label: "9.法規庫" },
  { id: "rep", label: "10.報告書底稿" },
];

function num(e: React.ChangeEvent<HTMLInputElement>) {
  const v = e.target.value;
  if (v === "" || v === "-") return 0;
  return Number(v);
}

const INT_UNITS = new Set(["人", "次", "日", "件", "席", "家", "張", "kWh", "小時", "人次"]);

function inputStep(unit: string) {
  return INT_UNITS.has(unit) ? 1 : 0.1;
}

export function WorkbenchApp() {
  const [sheet, setSheet] = useState<Sheet>("pre");
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [regStamp, setRegStamp] = useState("尚未核對法規版本");
  const [factorAudit, setFactorAudit] = useState<FactorAudit | null>(null);
  const [factorBusy, setFactorBusy] = useState(false);
  const [factorTick, setFactorTick] = useState(0);
  const [factorFocus, setFactorFocus] = useState<string | null>(null);
  const d = useMemo(() => derived(inputs), [inputs]);
  const result = useMemo(() => compute(inputs), [inputs]);

  useEffect(() => {
    const ac = new AbortController();
    setFactorBusy(true);
    fetch(
      `/api/factors?year=${encodeURIComponent(inputs.year)}&refrigerant=${encodeURIComponent(inputs.refrigerantCode)}`,
      { signal: ac.signal, cache: "no-store" },
    )
      .then((r) => r.json())
      .then((data: FactorAudit) => {
        if (!ac.signal.aborted) setFactorAudit(data);
      })
      .catch(() => {
        if (!ac.signal.aborted) setFactorAudit(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setFactorBusy(false);
      });
    return () => ac.abort();
  }, [inputs.year, inputs.refrigerantCode, factorTick]);

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    if (isLockedKey(key)) return;
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
          <span className="opacity-80">活動數據　係數　運算　勾稽</span>
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
          {sheet === "par" && (
            <div className="mb-4">
              <p className="mb-1 text-[12px] font-bold">
                <span className="wb-tag">輸入</span>冷媒
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                    <th className="border border-[#888] px-2 py-1">項目</th>
                    <th className="w-[120px] border border-[#888] px-2 py-1">數值</th>
                    <th className="w-[220px] border border-[#888] px-2 py-1">檢查最新</th>
                    <th className="w-[90px] border border-[#888] px-2 py-1">單位</th>
                    <th className="border border-[#888] px-2 py-1">說明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">冷媒種類</td>
                    <td className="border border-[#c8c8c8] px-1 py-1">
                      <select
                        className="h-[26px] w-full border border-[#8aa0b4] bg-white px-1"
                        value={inputs.refrigerantCode}
                        onChange={(e) => set("refrigerantCode", e.target.value)}
                      >
                        {REFRIGERANTS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-[#c8c8c8] px-2 py-1" />
                    <td className="border border-[#c8c8c8] px-2 py-1 text-[12px]">—</td>
                    <td className="border border-[#c8c8c8] px-2 py-1 text-[12px] text-[#444]">
                      來源：設備冷媒。帶入下列 GWP。
                      <div className="text-[11px] text-[#777]">IPCC；盤查作業指引</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {["pre", "fin", "env", "hr", "gov", "kpi", "par"].includes(sheet) &&
            Object.entries(grouped).map(([section, rows]) => (
              <div key={section} className="mb-4">
                <p className="mb-1 text-[12px] font-bold">
                  <span className="wb-tag">{rows.every((r) => isLockedKey(r.key)) ? "運算" : "輸入"}</span>
                  {section}
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                      <th className="border border-[#888] px-2 py-1">項目</th>
                      <th className="w-[120px] border border-[#888] px-2 py-1">數值</th>
                      {sheet === "par" && <th className="w-[220px] border border-[#888] px-2 py-1">檢查最新</th>}
                      <th className="w-[90px] border border-[#888] px-2 py-1">單位</th>
                      <th className="border border-[#888] px-2 py-1">說明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((f) => {
                      const locked = isLockedKey(f.key);
                      const miss = missingOnRow(inputs, f.key);
                      const shown = locked ? d[f.key] : inputs[f.key];
                      const isOfficial = OFFICIAL_FACTOR_KEYS.includes(f.key as (typeof OFFICIAL_FACTOR_KEYS)[number]);
                      const factorCheck = factorAudit?.checks.find((c) => c.key === f.key);
                      return (
                      <tr key={String(f.key)} className={factorFocus === f.key ? "outline outline-1 outline-[#1f4a7a]" : ""}>
                        <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">
                          {f.label}
                          {locked && (
                            <div className="text-[11px] text-[#666]">
                              {isOfficial ? "依公告帶入" : "依底稿帶入"}
                            </div>
                          )}
                        </td>
                        <td className={`border border-[#c8c8c8] px-1 py-1 ${locked ? "wb-calc" : ""}`}>
                          {locked ? (
                            <div className="px-1 py-0.5 text-[13px]">{Number(shown)}</div>
                          ) : (
                            <input
                              type="number"
                              step={inputStep(f.unit)}
                              value={Number(shown)}
                              onChange={(e) => set(f.key, num(e) as never)}
                            />
                          )}
                          {miss.length > 0 && (
                            <div className="text-[11px] font-bold text-[#c00000]">
                              {miss.join("、")}
                            </div>
                          )}
                        </td>
                        {sheet === "par" && (
                          <td className="border border-[#c8c8c8] px-1 py-1 align-top">
                            {isOfficial && (
                              <>
                                <button
                                  type="button"
                                  className="wb-check-btn"
                                  disabled={factorBusy}
                                  onClick={() => {
                                    setFactorFocus(String(f.key));
                                    setFactorTick((n) => n + 1);
                                  }}
                                >
                                  {factorBusy && factorFocus === f.key ? "連線公告中…" : "檢查最新"}
                                </button>
                                {factorCheck && (
                                  <div
                                    className={`mt-1 text-[11px] leading-4 ${
                                      factorCheck.level === "異常"
                                        ? "font-bold text-[#c00000]"
                                        : factorCheck.level === "注意"
                                          ? "font-bold text-[#8a6d00]"
                                          : "font-bold text-[#2d6a2d]"
                                    }`}
                                  >
                                    [{factorCheck.level}]
                                    {factorCheck.crawled != null ? ` ${String(factorCheck.crawled)}` : ""}
                                    <div className="font-normal text-[#111]">來源文件：{factorCheck.sourceDoc}</div>
                                    {factorCheck.level !== "通過" && (
                                      <div className="font-normal text-[#333]">{factorCheck.detail}</div>
                                    )}
                                    <a
                                      className="font-normal text-[#003399] underline"
                                      href={factorCheck.url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      打開來源文件
                                    </a>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        )}
                        <td className="border border-[#c8c8c8] px-2 py-1 text-[12px]">{f.unit}</td>
                        <td className="border border-[#c8c8c8] px-2 py-1 text-[12px] text-[#444]">
                          {f.why}
                          <div className="text-[11px] text-[#777]">{f.gri}</div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}

          {sheet === "par" && (
            <div className="mb-3 text-[12px]">
              <p className="mb-2 leading-6">
                係數依案件年度對應公告文件帶入並鎖定。核對結果與來源文件見各列。
                {factorBusy ? "　正在連線公告頁…" : factorAudit ? `　最近核對 ${new Date(factorAudit.crawledAt).toLocaleString("zh-TW", { hour12: false })}` : ""}
              </p>
              <button
                type="button"
                className="mb-2 border border-[#444] bg-[#eee] px-3 py-1 text-[13px]"
                onClick={() => setFactorTick((n) => n + 1)}
              >
                重新向公告頁核對
              </button>
              {factorAudit && (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                      <th className="border border-[#888] px-2 py-1">項目</th>
                      <th className="border border-[#888] px-2 py-1">帶入值</th>
                      <th className="border border-[#888] px-2 py-1">來源文件</th>
                      <th className="border border-[#888] px-2 py-1">驗證</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factorAudit.checks.map((c) => (
                      <tr key={c.key}>
                        <td className="border border-[#c8c8c8] px-2 py-1">{c.title}</td>
                        <td className="wb-calc border border-[#c8c8c8] px-2 py-1">{c.expected ?? "—"}</td>
                        <td className="border border-[#c8c8c8] px-2 py-1">{c.sourceDoc}</td>
                        <td
                          className={`border border-[#c8c8c8] px-2 py-1 ${
                            c.level === "異常" ? "bg-[#fde8e8]" : c.level === "注意" ? "bg-[#fff4cc]" : "bg-[#e7f5e7]"
                          }`}
                        >
                          <b>[{c.level}]</b> {c.crawlNote} {c.detail}{" "}
                          <a className="text-[#003399] underline" href={c.url} target="_blank" rel="noreferrer">
                            來源
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {sheet === "pre" && (
            <div className="mb-3 text-[12px] text-[#333]">
              <p className="mb-2 leading-6">
                高階ESG權重、綠色資本支出由本頁運算後帶入主表。
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                    <th className="border border-[#888] px-2 py-1">主表欄位（系統帶入）</th>
                    <th className="border border-[#888] px-2 py-1">運算結果</th>
                    <th className="border border-[#888] px-2 py-1">算式</th>
                  </tr>
                </thead>
                <tbody>
                  {preResults(inputs).map((r) => (
                    <tr key={r.name}>
                      <td className="border border-[#c8c8c8] px-2 py-1">{r.name}</td>
                      <td className="wb-calc border border-[#c8c8c8] px-2 py-1">
                        {r.value}
                        {r.missing.length > 0 && (
                          <div className="text-[11px] font-bold text-[#c00000]">{r.missing.join("、")}</div>
                        )}
                      </td>
                      <td className="border border-[#c8c8c8] px-2 py-1">{r.formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {sheet === "chart" && <ChartPreview metrics={result.metrics} />}

          {sheet === "why" && (
            <div>
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#2c3b4e] text-white">
                    <th className="border border-[#888] px-2 py-1 text-left">分頁</th>
                    <th className="border border-[#888] px-2 py-1 text-left">參數</th>
                    <th className="border border-[#888] px-2 py-1 text-left">說明</th>
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

          {sheet === "rep" && (
            <div className="text-[13px]">
              <div className="mb-3 flex items-center justify-between">
                <p>
                  {inputs.client}　{inputs.year}　永續報告書績效表／GRI 索引底稿
                </p>
                <button
                  type="button"
                  className="border border-[#444] bg-[#eee] px-3 py-1"
                  onClick={() => window.print()}
                >
                  列印
                </button>
              </div>
              {reportDraft(d, result.metrics).map((block) => (
                <div key={block.chapter} className="mb-4">
                  <p className="mb-1 text-[12px] font-bold">
                    {block.chapter}
                    <span className="ml-2 font-normal text-[#666]">{block.gri}</span>
                  </p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                        <th className="border border-[#888] px-2 py-1">項目</th>
                        <th className="border border-[#888] px-2 py-1">數值</th>
                        <th className="border border-[#888] px-2 py-1">單位</th>
                        <th className="border border-[#888] px-2 py-1">對應</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((r) => (
                        <tr key={r.name}>
                          <td className="border border-[#c8c8c8] px-2 py-1">{r.name}</td>
                          <td className="wb-calc border border-[#c8c8c8] px-2 py-1">{r.value}</td>
                          <td className="border border-[#c8c8c8] px-2 py-1">{r.unit}</td>
                          <td className="border border-[#c8c8c8] px-2 py-1">{r.gri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <p className="mb-1 text-[12px] font-bold">附錄　GRI 內容索引（績效項）</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
                    <th className="border border-[#888] px-2 py-1">揭露</th>
                    <th className="border border-[#888] px-2 py-1">主題</th>
                    <th className="border border-[#888] px-2 py-1">數值</th>
                    <th className="border border-[#888] px-2 py-1">章節</th>
                  </tr>
                </thead>
                <tbody>
                  {griIndex(result.metrics).map((r) => (
                    <tr key={r.topic}>
                      <td className="border border-[#c8c8c8] px-2 py-1">{r.gri}</td>
                      <td className="border border-[#c8c8c8] px-2 py-1">{r.topic}</td>
                      <td className="wb-calc border border-[#c8c8c8] px-2 py-1">{r.value}</td>
                      <td className="border border-[#c8c8c8] px-2 py-1">{r.chapter}</td>
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

function BarChart({ title, rows }: { title: string; rows: [string, number][] }) {
  const h = Math.max(120, rows.length * 22 + 16);
  const max = Math.max(1, ...rows.map((r) => (Number.isFinite(r[1]) ? r[1] : 0)));
  return (
    <div className="mb-3 border border-[#ccc] p-3">
      <b>{title}</b>
      <svg viewBox={`0 0 560 ${h}`} className="mt-1 h-auto w-full bg-white">
        {rows.map((row, i) => {
          const v = Number.isFinite(row[1]) ? row[1] : 0;
          const w = (v / max) * 360;
          return (
            <g key={row[0]}>
              <text x="4" y={16 + i * 22} fontSize="10" fill="#222">
                {row[0]}
              </text>
              <rect x="148" y={6 + i * 22} width="360" height="12" fill="#eee" stroke="#999" />
              <rect x="148" y={6 + i * 22} width={w} height="12" fill="#4a6b8a" />
              <text x="514" y={16 + i * 22} fontSize="10" fill="#111">
                {Number.isFinite(row[1]) ? row[1].toFixed(1) : "—"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ChartPreview({ metrics }: { metrics: Metric[] }) {
  const pick = (id: string) => metrics.find((m) => m.id === id)?.raw ?? NaN;
  const pct = metrics.filter((m) => m.unit === "%").map((m) => [m.name, m.raw] as [string, number]);
  const s1 = pick("s1");
  const s2 = pick("s2");
  const s3 = pick("s3") - (Number.isFinite(s1) ? s1 : 0) - (Number.isFinite(s2) ? s2 : 0);
  const tot = (s1 || 0) + (s2 || 0) || 1;
  return (
    <div className="text-[13px]">
      <p className="mb-2">
        依目前輸入重算。
      </p>
      <BarChart title="全部比率指標（%）" rows={pct} />
      <BarChart
        title="環境絕對值"
        rows={[
          ["Scope 1 tCO2e", pick("s1")],
          ["Scope 2 tCO2e", pick("s2")],
          ["密集度", pick("int")],
          ["能源 GJ", pick("en")],
          ["用水密集度", pick("wint")],
          ["耗水 千噸", pick("wuse")],
        ]}
      />
      <BarChart
        title="社會／職安"
        rows={[
          ["流動率%", pick("turn")],
          ["新進率%", pick("hire")],
          ["人均訓練 h", pick("tr")],
          ["FR", pick("fr")],
          ["SR", pick("sr")],
          ["TRIR", pick("trir")],
          ["育嬰復職%", pick("par")],
          ["女性主管%", pick("fm")],
        ]}
      />
      <BarChart
        title="治理／薪酬"
        rows={[
          ["獨董比%", pick("ind")],
          ["出席率%", pick("att")],
          ["反貪腐%", pick("ac")],
          ["考核覆蓋%", pick("rev")],
          ["ESG KPI員工%", pick("ek")],
          ["業務達成%", pick("biz")],
          ["ESG達成%", pick("eh")],
          ["最高薪倍數", pick("pay")],
          ["女男薪酬比", pick("gp")],
        ]}
      />
      <div className="border border-[#ccc] p-3">
        <b>Scope 1 / 2 結構（tCO2e）</b>
        <p className="mt-1 text-[12px]">
          S1 {s1.toFixed(0)}　S2 {s2.toFixed(0)}　S3 彙總差額 {Number.isFinite(s3) ? s3.toFixed(0) : "—"}
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
