"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  type ReportFigure,
} from "@/lib/esg-engine";
type ArticleBlock =
  | { kind: "text"; text: string }
  | { kind: "table"; rows: string[][] }
  | { kind: "image"; src: string };

type MemberView = { username: string; company: string; paid: boolean; role: "admin" | "member" };
import { griIndex, reportDraft } from "@/lib/report-draft";
import { regulationArticles } from "@/lib/regulation-library";
import {
  OFFICIAL_FACTOR_KEYS,
  REFRIGERANTS,
  type FactorAudit,
} from "@/lib/official-factors";

type Sheet = "pre" | "fin" | "env" | "hr" | "gov" | "kpi" | "par" | "chart" | "why" | "reg" | "rep";

const metricLink: Record<string, { sheet: Sheet; keys: (keyof Inputs)[] }> = {
  s1: { sheet: "env", keys: ["dieselLiter", "gasolineLiter", "lngM3", "refrigerantKg"] },
  s2: { sheet: "env", keys: ["electricityKwh", "steamGj"] },
  s12: { sheet: "env", keys: ["dieselLiter", "gasolineLiter", "lngM3", "refrigerantKg", "electricityKwh"] },
  s3o: { sheet: "env", keys: ["scope3"] },
  s3: { sheet: "env", keys: ["scope3"] },
  int: { sheet: "env", keys: ["intensityTarget"] },
  p12: { sheet: "env", keys: ["prevGhg12"] },
  pint: { sheet: "env", keys: ["prevGhg12", "prevRevenueMillion"] },
  gyoy: { sheet: "env", keys: ["prevGhg12"] },
  iyoy: { sheet: "env", keys: ["prevGhg12", "prevRevenueMillion"] },
  ren: { sheet: "env", keys: ["renewableKwh", "electricityKwh"] },
  en: { sheet: "env", keys: ["electricityKwh", "steamGj", "dieselLiter", "gasolineLiter", "lngM3"] },
  eni: { sheet: "env", keys: ["electricityKwh", "steamGj", "dieselLiter", "gasolineLiter", "lngM3"] },
  wint: { sheet: "env", keys: ["waterKt"] },
  wuse: { sheet: "env", keys: ["waterKt", "wastewaterKt"] },
  rec: { sheet: "env", keys: ["wasteT", "wasteRecycledT"] },
  haz: { sheet: "env", keys: ["wasteT", "wasteHazardT"] },
  wastI: { sheet: "env", keys: ["wasteT"] },
  ghge: { sheet: "hr", keys: ["headcountAvg"] },
  csp: { sheet: "fin", keys: ["communitySpend", "revenueMillion"] },
  grn: { sheet: "fin", keys: ["totalCapex", "greenCapex"] },
  turn: { sheet: "hr", keys: ["leavers", "headcountAvg"] },
  hire: { sheet: "hr", keys: ["newHires", "headcountAvg"] },
  fem: { sheet: "hr", keys: ["headcountFemale", "headcountEnd"] },
  male: { sheet: "hr", keys: ["headcountFemale", "headcountEnd"] },
  dis: { sheet: "hr", keys: ["headcountDisabled", "headcountEnd"] },
  tr: { sheet: "hr", keys: ["trainingHours", "headcountAvg"] },
  trf: { sheet: "hr", keys: ["trainingFemaleHours", "headcountFemale"] },
  trhit: { sheet: "hr", keys: ["trainingHours", "trainingHoursTarget"] },
  fr: { sheet: "hr", keys: ["disablingInjuries", "workHours"] },
  sr: { sheet: "hr", keys: ["lostDays", "workHours"] },
  trir: { sheet: "hr", keys: ["recordableInjuries", "workHours"] },
  par: { sheet: "hr", keys: ["parentalReturn", "parentalDue"] },
  fm: { sheet: "hr", keys: ["femaleManagers", "totalManagers"] },
  un: { sheet: "hr", keys: ["unionCovered", "headcountEnd"] },
  hrt: { sheet: "hr", keys: ["humanRightsTrained", "headcountEnd"] },
  sup: { sheet: "hr", keys: ["supplierScreened", "supplierCount"] },
  rev: { sheet: "kpi", keys: ["doneReview", "dueReview"] },
  ek: { sheet: "kpi", keys: ["withEsgKpi"] },
  biz: { sheet: "kpi", keys: ["businessActual", "businessTarget"] },
  eh: { sheet: "kpi", keys: ["esgActualScore", "esgTargetScore"] },
  wtd: { sheet: "kpi", keys: ["businessActual", "esgActualScore"] },
  bon: { sheet: "kpi", keys: ["bonusPool"] },
  pay: { sheet: "kpi", keys: ["highestPay", "medianPay"] },
  gp: { sheet: "kpi", keys: ["femalePay", "malePay"] },
  ind: { sheet: "gov", keys: ["independentSeats", "boardSeats"] },
  att: { sheet: "gov", keys: ["boardAttend", "boardSeats", "boardMeetings"] },
  ac: { sheet: "gov", keys: ["antiCorruptDone", "antiCorruptDue"] },
};

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

export function WorkbenchApp({ member }: { member: MemberView }) {
  const [sheet, setSheet] = useState<Sheet>("pre");
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [regStamp, setRegStamp] = useState("尚未核對法規版本");
  const [factorAudit, setFactorAudit] = useState<FactorAudit | null>(null);
  const [factorBusy, setFactorBusy] = useState(false);
  const [factorTick, setFactorTick] = useState(0);
  const [factorFocus, setFactorFocus] = useState<string | null>(null);
  const [docxBusy, setDocxBusy] = useState(false);
  const [stylePrompt, setStylePrompt] = useState("");
  const [styleImage, setStyleImage] = useState("");
  const [highlightKeys, setHighlightKeys] = useState<(keyof Inputs)[]>([]);
  const [sourcePop, setSourcePop] = useState<{
    label: string;
    gri: string;
    why: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minimized: boolean;
  } | null>(null);

  function openSource(event: React.MouseEvent<HTMLButtonElement>, item: { label: string; gri: string; why: string }) {
    if (!member.paid) {
      window.alert("法規條文需付費會員。請洽翰欣科技開通。");
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setSourcePop((prev) => ({
      ...item,
      x: prev?.x ?? Math.max(8, Math.min(rect.left, window.innerWidth - 620)),
      y: prev?.y ?? Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 520)),
      w: prev?.w ?? 560,
      h: prev?.h ?? 460,
      minimized: false,
    }));
  }
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

  async function exportWord() {
    if (!member.paid) {
      window.alert("匯出 Word 需付費會員。請洽翰欣科技開通。");
      return;
    }
    setDocxBusy(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, stylePrompt, styleImage }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Word 匯出失敗");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inputs.client}_${inputs.year}_永續報告書底稿.docx`.replace(/[\\/:*?"<>|]/g, "");
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Word 匯出失敗");
    } finally {
      setDocxBusy(false);
    }
  }

  const fail = result.checks.filter((c) => c.level === "異常").length;
  const warn = result.checks.filter((c) => c.level === "注意").length;
  const fields = fieldCatalog.filter((f) => f.sheet === sheet);

  const grouped = fields.reduce<Record<string, typeof fields>>((acc, f) => {
    (acc[f.section] ||= []).push(f);
    return acc;
  }, {});

  const checkSheet: Record<string, Sheet> = {
    rev0: "fin",
    capex: "fin",
    w1: "env",
    re: "env",
    intw: "env",
    yoy: "env",
    f1: "hr",
    a1: "hr",
    fat: "hr",
    r1: "kpi",
    w: "kpi",
    b1: "gov",
    indw: "gov",
  };
  const sideMetrics = result.metrics.filter((m) => metricLink[m.id]?.sheet === (sheet === "chart" ? "env" : sheet));
  const sideChecks = result.checks.filter((c) => checkSheet[c.id] === (sheet === "chart" ? "env" : sheet));

  useEffect(() => {
    const key = highlightKeys[0];
    if (!key) return;
    document.getElementById(`wb-field-${String(key)}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [highlightKeys, sheet]);

  function openMetric(id: string) {
    const link = metricLink[id];
    if (!link) return;
    setSheet(link.sheet);
    setHighlightKeys(link.keys);
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b border-[#8a8a8a] bg-[#2c3b4e] px-3 py-1.5 text-[13px] text-white">
        <div className="flex items-center gap-4">
          <b>翰欣科技 ESG 計算系統</b>
          <span className="opacity-80">活動數據　係數　運算　勾稽</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            {member.company}　{member.paid ? "付費會員" : "免費會員"}　指標 {result.metrics.length}　異常 {fail}　注意 {warn}
          </span>
          {member.role === "admin" && (
            <Link href="/admin" className="underline">
              會員管理
            </Link>
          )}
          <button
            type="button"
            className="underline"
            onClick={() => {
              void fetch("/api/auth/logout", { method: "POST" }).then(() => {
                window.location.href = "/login";
              });
            }}
          >
            登出
          </button>
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
                    <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">
                      <div>冷媒種類</div>
                      <button
                        type="button"
                        className="mt-0.5 text-[11px] text-[#335577] underline"
                        onClick={(event) =>
                          openSource(event, {
                            label: "冷媒種類",
                            gri: "IPCC；盤查作業指引",
                            why: "依設備使用的冷媒代碼帶入暖化潛勢（GWP）。逸散公斤數再乘 GWP，得到範疇一排放。",
                          })
                        }
                      >
                        查看法條
                      </button>
                    </td>
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
                      <tr
                        key={String(f.key)}
                        id={`wb-field-${String(f.key)}`}
                        className={highlightKeys.includes(f.key) ? "wb-jump" : factorFocus === f.key ? "outline outline-1 outline-[#1f4a7a]" : ""}
                      >
                        <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">
                          <div>{f.label}</div>
                          <button
                            type="button"
                            className="mt-0.5 text-[11px] text-[#335577] underline"
                            onClick={(event) => openSource(event, { label: f.label, gri: f.gri, why: f.why })}
                          >
                            查看法條
                          </button>
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
                高階薪酬中永續相關權重、氣候／環保相關資本支出合計，由本頁運算後帶入主表。這兩項是公司考核與氣候資訊實務加總，不是 GRI 條文上的專有名詞。
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

          {sheet === "chart" && (
            <PaidFrost locked={!member.paid}>
              <ChartPreview figures={result.figures} />
            </PaidFrost>
          )}

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
              <p className="mb-2 text-[13px] leading-6 text-[#333]">
                點各輸入欄名稱下方的「查看法條」，小視窗會列出該欄所引 GRI 揭露項目的要求與指引。下表是對照用的計算要點。
              </p>
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
              {regulationArticles.map((a) => (
                <div key={a.id} className="mt-4 border border-[#c8c8c8] bg-[#f7f7f7] p-3 text-[13px] leading-6">
                  <p className="font-bold text-[#1b3a4b]">{a.topic}</p>
                  <p className="text-[12px] text-[#555]">
                    {a.source}　{a.cite}
                  </p>
                  {a.plain.map((para, idx) => (
                    <p key={`${a.id}-${idx}`} className="mt-1">
                      {para}
                    </p>
                  ))}
                  <p className="mt-1 text-[#1b3a4b]">
                    <b>本系統怎麼填：</b>
                    {a.fill}
                  </p>
                </div>
              ))}
            </div>
          )}

          {sheet === "rep" && (
            <div className="text-[13px]">
              <label className="mb-3 block">
                美編說明（選填。有文字或參考圖才會呼叫語言模型決定配色與字體，數字仍由系統計算）
                <textarea
                  className="mt-1 h-20 w-full border border-[#8aa0b4] p-2 text-[13px]"
                  value={stylePrompt}
                  placeholder="例如：依參考圖配色，細框，標題靠左"
                  onChange={(event) => setStylePrompt(event.target.value)}
                />
              </label>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[13px]">
                <label className="border border-[#444] bg-[#eee] px-3 py-1">
                  上傳參考圖片
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const img = new Image();
                        img.onload = () => {
                          const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
                          const canvas = document.createElement("canvas");
                          canvas.width = Math.max(1, Math.round(img.width * scale));
                          canvas.height = Math.max(1, Math.round(img.height * scale));
                          canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
                          setStyleImage(canvas.toDataURL("image/jpeg", 0.7));
                        };
                        img.src = String(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {styleImage && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={styleImage} alt="參考圖預覽" className="h-14 border border-[#ccc]" />
                    <button type="button" className="underline" onClick={() => setStyleImage("")}>
                      移除參考圖
                    </button>
                  </>
                )}
              </div>
              <div className="mb-3 flex items-center justify-between">
                <p>
                  {inputs.client}　{inputs.year}　永續報告書績效表／GRI 索引底稿
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="border border-[#444] bg-[#eee] px-3 py-1"
                    disabled={docxBusy}
                    onClick={() => void exportWord()}
                  >
                    {docxBusy ? "匯出中" : "匯出 Word"}
                  </button>
                  <button
                    type="button"
                    className="border border-[#444] bg-[#eee] px-3 py-1"
                    onClick={() => {
                      if (!member.paid) {
                        window.alert("列印需付費會員。請洽翰欣科技開通。");
                        return;
                      }
                      window.print();
                    }}
                  >
                    列印
                  </button>
                </div>
              </div>
              <PaidFrost locked={!member.paid}>
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
              </PaidFrost>
            </div>
          )}
        </div>

        <aside className="bg-[#f4f4f4] p-3">
          <h2 className="mb-2 text-[14px] font-bold">系統運算結果</h2>
          <PaidFrost locked={!member.paid} className="mb-3">
            <table className="w-full border-collapse text-[11px]">
              <tbody>
                {sideMetrics.map((m) => (
                  <tr key={m.id}>
                    <td className="border border-[#ccc] px-2 py-1">
                      <button type="button" className="w-full text-left hover:bg-[#fff3bf]" onClick={() => openMetric(m.id)}>
                        <span className="underline decoration-[#888]">{m.name}</span>
                        <div className="text-[10px] text-[#333]">{m.formula}</div>
                      </button>
                    </td>
                    <td className="wb-calc border border-[#ccc] px-2 py-1 text-right">
                      {m.value} {m.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PaidFrost>
          <h2 className="mb-2 text-[14px] font-bold">自動勾稽</h2>
          <ul className="space-y-1 text-[12px]">
            {sideChecks.length === 0 && (
              <li className="border border-[#2d6a2d] bg-[#e7f5e7] px-2 py-1">
                <b>[通過] 本頁勾稽未發現異常</b>
                <div>
                  {sheet === "fin"
                    ? "已核對合併營收，以及氣候／環保資本支出未大於購置不動產廠房及設備。"
                    : "本頁已核對的項目彼此沒有對不上。"}
                </div>
              </li>
            )}
            {sideChecks.map((c) => (
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
      {sourcePop && (
        <SourceWindow pop={sourcePop} onChange={setSourcePop} onClose={() => setSourcePop(null)} />
      )}
    </div>
  );
}

function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "image") {
          return <img key={index} src={block.src} alt="條文表格" className="my-2 h-auto w-auto max-w-none border border-[#d5dee8]" />;
        }
        if (block.kind === "table") {
          const cols = block.rows[0]?.length ?? 0;
          const longest = Array.from({ length: cols }, (_, col) =>
            Math.max(0, ...block.rows.map((row) => (row[col] || "").length)),
          );
          return (
            <table key={index} className="my-2 border-collapse text-[12px]" style={{ width: "max-content" }}>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`border border-[#b7c3d0] px-2 py-1 align-top ${longest[cellIndex] <= 12 ? "whitespace-nowrap" : ""}`}
                        style={longest[cellIndex] > 12 ? { maxWidth: "22rem" } : undefined}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        return (
          <p key={index} className="mt-2 whitespace-pre-wrap">
            {block.text}
          </p>
        );
      })}
    </>
  );
}

function SourceWindow({
  pop,
  onChange,
  onClose,
}: {
  pop: { label: string; gri: string; why: string; x: number; y: number; w: number; h: number; minimized: boolean };
  onChange: (next: typeof pop) => void;
  onClose: () => void;
}) {
  const [showEnglish, setShowEnglish] = useState(false);
  const [loaded, setLoaded] = useState<{ blocks: ArticleBlock[]; english: ArticleBlock[] } | null>(null);
  const [sourceError, setSourceError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnglish(false);
      setLoaded(null);
      setSourceError("");
    }, 0);
    const ac = new AbortController();
    fetch(`/api/source?gri=${encodeURIComponent(pop.gri)}&why=${encodeURIComponent(pop.why)}`, { signal: ac.signal })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { error?: string; blocks?: ArticleBlock[]; english?: ArticleBlock[] } | null;
        if (!res.ok) throw new Error(data?.error || "無法讀取條文");
        setLoaded({ blocks: data?.blocks || [], english: data?.english || [] });
      })
      .catch((error: unknown) => {
        if (ac.signal.aborted) return;
        setSourceError(error instanceof Error ? error.message : "無法讀取條文");
      });
    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [pop.gri, pop.label, pop.why]);
  const blocks = showEnglish && loaded?.english.length ? loaded.english : loaded?.blocks || [];
  const popRef = useRef(pop);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    left: number;
    top: number;
    n: boolean;
    s: boolean;
    e: boolean;
    west: boolean;
  } | null>(null);
  popRef.current = pop;

  function beginResize(event: React.MouseEvent, edge: { n?: boolean; s?: boolean; e?: boolean; west?: boolean }) {
    event.preventDefault();
    event.stopPropagation();
    resize.current = {
      x: event.clientX,
      y: event.clientY,
      w: pop.w,
      h: pop.h,
      left: pop.x,
      top: pop.y,
      n: Boolean(edge.n),
      s: Boolean(edge.s),
      e: Boolean(edge.e),
      west: Boolean(edge.west),
    };
  }

  useEffect(() => {
    function move(event: MouseEvent) {
      const current = popRef.current;
      if (drag.current) {
        onChange({ ...current, x: event.clientX - drag.current.dx, y: event.clientY - drag.current.dy });
      }
      if (resize.current) {
        const start = resize.current;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        let w = start.w;
        let h = start.h;
        let x = start.left;
        let y = start.top;
        if (start.e) w = Math.max(300, start.w + dx);
        if (start.s) h = Math.max(180, start.h + dy);
        if (start.west) {
          w = Math.max(300, start.w - dx);
          x = start.left + (start.w - w);
        }
        if (start.n) {
          h = Math.max(180, start.h - dy);
          y = start.top + (start.h - h);
        }
        onChange({ ...current, x, y, w, h });
      }
    }
    function up() {
      drag.current = null;
      resize.current = null;
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [onChange]);

  return (
    <div
      className="fixed z-50 flex flex-col border border-[#2c3b4e] bg-white text-[13px] leading-6 text-[#243044] shadow-lg"
      style={{ left: pop.x, top: pop.y, width: pop.w, height: pop.minimized ? 40 : pop.h }}
    >
      <div
        className="flex h-10 shrink-0 cursor-move items-center justify-between gap-2 bg-[#2c3b4e] px-2 text-white"
        onMouseDown={(event) => {
          drag.current = { dx: event.clientX - pop.x, dy: event.clientY - pop.y };
        }}
      >
        <b className="truncate">{pop.label}</b>
        <span className="flex shrink-0 gap-1">
          {(loaded?.english.length ?? 0) > 0 && (
            <button
              type="button"
              className="border border-white/40 px-2 text-[12px]"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setShowEnglish((value) => !value)}
            >
              {showEnglish ? "顯示中文" : "顯示原文"}
            </button>
          )}
          <button
            type="button"
            className="border border-white/40 px-2 text-[12px]"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => {
              const enlarge = pop.w < 700;
              onChange({
                ...pop,
                minimized: false,
                w: enlarge ? Math.min(980, window.innerWidth - 40) : 560,
                h: enlarge ? Math.min(720, window.innerHeight - 40) : 460,
                x: enlarge ? 20 : pop.x,
                y: enlarge ? 20 : pop.y,
              });
            }}
          >
            {pop.w >= 700 ? "還原大小" : "放大"}
          </button>
          <button
            type="button"
            className="border border-white/40 px-2 text-[12px]"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => onChange({ ...pop, minimized: !pop.minimized })}
          >
            {pop.minimized ? "展開" : "縮小"}
          </button>
          <button
            type="button"
            className="border border-white/40 px-2 text-[12px]"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            關閉
          </button>
        </span>
      </div>
      {!pop.minimized && (
        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-auto px-3 py-2">
            {sourceError ? (
              <p className="mt-2">{sourceError}</p>
            ) : !loaded ? (
              <p className="mt-2">讀取條文中。</p>
            ) : blocks.length > 0 ? (
              <ArticleBlocks blocks={blocks} />
            ) : (
              <p className="mt-2">沒有收錄條文。系統歸屬的法源：{pop.gri}</p>
            )}
          </div>
        </div>
      )}
      {!pop.minimized && (
        <>
          <div className="absolute top-0 right-3 left-3 z-20 h-2 cursor-ns-resize" onMouseDown={(event) => beginResize(event, { n: true })} />
          <div className="absolute right-3 bottom-0 left-3 z-20 h-2 cursor-ns-resize" onMouseDown={(event) => beginResize(event, { s: true })} />
          <div className="absolute top-3 bottom-3 left-0 z-20 w-2 cursor-ew-resize" onMouseDown={(event) => beginResize(event, { west: true })} />
          <div className="absolute top-3 right-0 bottom-3 z-20 w-2 cursor-ew-resize" onMouseDown={(event) => beginResize(event, { e: true })} />
          <div className="absolute top-0 left-0 z-30 h-3 w-3 cursor-nwse-resize" onMouseDown={(event) => beginResize(event, { n: true, west: true })} />
          <div className="absolute top-0 right-0 z-30 h-3 w-3 cursor-nesw-resize" onMouseDown={(event) => beginResize(event, { n: true, e: true })} />
          <div className="absolute bottom-0 left-0 z-30 h-3 w-3 cursor-nesw-resize" onMouseDown={(event) => beginResize(event, { s: true, west: true })} />
          <div className="absolute right-0 bottom-0 z-30 h-3 w-3 cursor-nwse-resize" onMouseDown={(event) => beginResize(event, { s: true, e: true })} />
        </>
      )}
    </div>
  );
}

function fmtChart(v: number) {
  if (!Number.isFinite(v)) return "—";
  const abs = Math.abs(v);
  const d = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return v.toLocaleString("zh-TW", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}

function BarFigure({ fig }: { fig: ReportFigure }) {
  const h = Math.max(120, fig.rows.length * 28 + 20);
  const max = Math.max(1, ...fig.rows.map((r) => (Number.isFinite(r.value) ? r.value : 0)));
  return (
    <div className="mb-3 border border-[#ccc] bg-white p-3">
      <b className="text-[#2c3b4e]">{fig.title}</b>
      <span className="ml-2 text-[11px] text-[#666]">（{fig.unit}）</span>
      <svg viewBox={`0 0 560 ${h}`} className="mt-1 h-auto w-full">
        {fig.rows.map((row, i) => {
          const v = Number.isFinite(row.value) ? row.value : 0;
          const w = (v / max) * 360;
          return (
            <g key={row.label}>
              <text x="4" y={20 + i * 28} fontSize="11" fill="#222">
                {row.label}
              </text>
              <rect x="148" y={8 + i * 28} width="360" height="16" fill="#eee" />
              <rect x="148" y={8 + i * 28} width={w} height="16" fill={`#${row.color}`} />
              <text x="514" y={20 + i * 28} fontSize="11" fill="#111">
                {fmtChart(row.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PieFigure({ fig }: { fig: ReportFigure }) {
  const parts = fig.rows.filter((r) => Number.isFinite(r.value) && r.value > 0);
  const total = parts.reduce((s, r) => s + r.value, 0) || 1;
  const cx = 90;
  const cy = 90;
  const r = 72;
  let acc = 0;
  const slices = parts.map((row) => {
    const start = acc;
    const frac = row.value / total;
    acc += frac;
    const a0 = start * Math.PI * 2 - Math.PI / 2;
    const a1 = acc * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = frac > 0.5 ? 1 : 0;
    return { row, d: `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z` };
  });
  return (
    <div className="mb-3 border border-[#ccc] bg-white p-3">
      <b className="text-[#2c3b4e]">{fig.title}</b>
      <span className="ml-2 text-[11px] text-[#666]">（{fig.unit}）</span>
      <div className="mt-1 flex flex-wrap items-center gap-4">
        <svg viewBox="0 0 180 180" className="h-40 w-40">
          {slices.map((s) => (
            <path key={s.row.label} d={s.d} fill={`#${s.row.color}`} />
          ))}
          <circle cx={cx} cy={cy} r="38" fill="white" />
        </svg>
        <ul className="text-[12px] leading-6">
          {fig.rows.map((row) => (
            <li key={row.label}>
              <span className="mr-2 inline-block h-2.5 w-2.5 align-middle" style={{ background: `#${row.color}` }} />
              {row.label}　{fmtChart(row.value)}　
              {total ? `${((Number.isFinite(row.value) ? row.value : 0) / total * 100).toFixed(1)}%` : "—"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PaidFrost({
  locked,
  className = "",
  children,
}: {
  locked: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (!locked) return <div className={className}>{children}</div>;
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <div className="pointer-events-none blur-[11px]" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/20" />
    </div>
  );
}

function ChartPreview({ figures }: { figures: ReportFigure[] }) {
  return (
    <div className="text-[13px]">
      <p className="mb-2 text-[#333]">依目前輸入即時重算，圖式對應報告書常見績效圖（無文字論述）。</p>
      <div className="grid gap-2 md:grid-cols-2">
        {figures.map((f) => (f.kind === "pie" ? <PieFigure key={f.id} fig={f} /> : <BarFigure key={f.id} fig={f} />))}
      </div>
    </div>
  );
}
