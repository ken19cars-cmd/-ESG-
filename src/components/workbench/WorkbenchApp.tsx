"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  compute,
  defaultInputs,
  regulationCatalog,
  type Inputs,
} from "@/lib/esg-engine";

type Sheet = "fin" | "env" | "hr" | "kpi" | "reg";

const sheets: { id: Sheet; label: string }[] = [
  { id: "fin", label: "1.財務分母" },
  { id: "env", label: "2.環境（運算）" },
  { id: "hr", label: "3.人力職安（運算）" },
  { id: "kpi", label: "4.績效薪酬KPI（運算）" },
  { id: "reg", label: "5.法規庫" },
];

function num(e: React.ChangeEvent<HTMLInputElement>) {
  const v = e.target.value;
  if (v === "" || v === "-") return 0;
  return Number(v);
}

function Field({
  label,
  unit,
  hint,
  value,
  onChange,
  text,
}: {
  label: string;
  unit?: string;
  hint?: string;
  value: number | string;
  onChange: (v: number | string) => void;
  text?: boolean;
}) {
  return (
    <tr>
      <td className="border border-[#c8c8c8] bg-[#f7f7f7] px-2 py-1 text-[13px]">{label}</td>
      <td className="border border-[#c8c8c8] px-1 py-1">
        {text ? (
          <input value={String(value)} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            type="number"
            step="any"
            value={value === 0 ? 0 : value}
            onChange={(e) => onChange(num(e))}
          />
        )}
      </td>
      <td className="border border-[#c8c8c8] px-2 py-1 text-[12px] text-[#444]">{unit}</td>
      <td className="border border-[#c8c8c8] px-2 py-1 text-[12px] text-[#555]">{hint}</td>
    </tr>
  );
}

export function WorkbenchApp() {
  const [sheet, setSheet] = useState<Sheet>("kpi");
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [regStamp, setRegStamp] = useState("尚未按「核對法規版本」");

  const result = useMemo(() => compute(inputs), [inputs]);

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function verifyRegs() {
    const t = new Date().toLocaleString("zh-TW", { hour12: false });
    setRegStamp(`已核對本機法規庫 ${t}（係數請再對環境部當期公告）`);
  }

  const fail = result.checks.filter((c) => c.level === "異常").length;
  const warn = result.checks.filter((c) => c.level === "注意").length;

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b border-[#8a8a8a] bg-[#2c3b4e] px-3 py-1.5 text-[13px] text-white">
        <div className="flex items-center gap-4">
          <b>衡澄 ESG 工作底稿</b>
          <span className="opacity-80">會計師寫入／系統運算／法規勾稽</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            異常 {fail}　注意 {warn}
          </span>
          <Link href="/" className="underline">
            回客戶儀表板
          </Link>
        </div>
      </div>

      <div className="border-b border-[#b0b0b0] bg-[#d9e2ec] px-3 py-2 text-[13px]">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex items-center gap-2">
            案件
            <input
              className="w-[280px]"
              value={inputs.client}
              onChange={(e) => set("client", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2">
            年度
            <input
              className="w-[80px]"
              value={inputs.year}
              onChange={(e) => set("year", e.target.value)}
            />
          </label>
          <span className="text-[#333]">
            藍色欄位＝寫入　黃底＝系統依準則運算　業務完成率不計入社會面分數
          </span>
        </div>
      </div>

      <div className="flex gap-0 border-b border-[#aaa] bg-[#dedede] px-2 pt-1">
        {sheets.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSheet(s.id)}
            className={`mr-1 border border-b-0 px-3 py-1 text-[13px] ${
              sheet === s.id
                ? "border-[#888] bg-white font-semibold"
                : "border-transparent bg-[#cfd6dd] text-[#333]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="border-r border-[#bbb] bg-white p-3">
          {sheet === "fin" && (
            <table className="w-full border-collapse">
              <thead>
                <Head />
              </thead>
              <tbody>
                <Field
                  label="合併營收"
                  unit="百萬元"
                  hint="密集度、用水密集度分母。必須與合併財報一致。"
                  value={inputs.revenueMillion}
                  onChange={(v) => set("revenueMillion", Number(v))}
                />
                <Field
                  label="總資本支出"
                  unit="億元"
                  hint="現金流量表／資產增加"
                  value={inputs.totalCapex}
                  onChange={(v) => set("totalCapex", Number(v))}
                />
                <Field
                  label="綠色資本支出"
                  unit="億元"
                  hint="節能、環保設備、綠電"
                  value={inputs.greenCapex}
                  onChange={(v) => set("greenCapex", Number(v))}
                />
              </tbody>
            </table>
          )}

          {sheet === "env" && (
            <>
              <p className="mb-2 text-[13px]">
                <span className="wb-tag">系統運算</span>
                排放、密集度、回收率。不要直接填「分數」。
              </p>
              <label className="mb-2 flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={inputs.useActivityForGhg}
                  onChange={(e) => set("useActivityForGhg", e.target.checked)}
                />
                以活動數據 × 係數計算 Scope 1／2（建議）。取消則改填盤查總量。
              </label>
              <table className="w-full border-collapse">
                <thead>
                  <Head />
                </thead>
                <tbody>
                  <Field
                    label="外購電力"
                    unit="kWh"
                    hint="Scope 2 活動數據"
                    value={inputs.electricityKwh}
                    onChange={(v) => set("electricityKwh", Number(v))}
                  />
                  <Field
                    label="電力排放係數"
                    unit="kgCO2e/kWh"
                    hint="請改為環境部／能源署當期公告"
                    value={inputs.efElectricity}
                    onChange={(v) => set("efElectricity", Number(v))}
                  />
                  <Field
                    label="柴油用量"
                    unit="L"
                    hint="Scope 1 活動數據（示範）"
                    value={inputs.dieselLiter}
                    onChange={(v) => set("dieselLiter", Number(v))}
                  />
                  <Field
                    label="柴油排放係數"
                    unit="kgCO2e/L"
                    hint="係數版本須留底稿"
                    value={inputs.efDiesel}
                    onChange={(v) => set("efDiesel", Number(v))}
                  />
                  {!inputs.useActivityForGhg && (
                    <>
                      <Field
                        label="Scope 1 盤查值"
                        unit="tCO2e"
                        value={inputs.scope1Manual}
                        onChange={(v) => set("scope1Manual", Number(v))}
                      />
                      <Field
                        label="Scope 2 盤查值"
                        unit="tCO2e"
                        value={inputs.scope2Manual}
                        onChange={(v) => set("scope2Manual", Number(v))}
                      />
                    </>
                  )}
                  <Field
                    label="排放密集度目標"
                    unit="tCO2e／百萬營收"
                    hint="用來算目標差距與是否達標"
                    value={inputs.intensityTarget}
                    onChange={(v) => set("intensityTarget", Number(v))}
                  />
                  <Field
                    label="取水量"
                    unit="千噸"
                    value={inputs.waterKt}
                    onChange={(v) => set("waterKt", Number(v))}
                  />
                  <Field
                    label="廢棄物產生"
                    unit="噸"
                    value={inputs.wasteT}
                    onChange={(v) => set("wasteT", Number(v))}
                  />
                  <Field
                    label="廢棄物回收"
                    unit="噸"
                    value={inputs.wasteRecycledT}
                    onChange={(v) => set("wasteRecycledT", Number(v))}
                  />
                </tbody>
              </table>
            </>
          )}

          {sheet === "hr" && (
            <>
              <p className="mb-2 text-[13px]">
                <span className="wb-tag">系統運算</span>
                流動率、人均訓練、FR／SR。分母用平均人數與總工時，不用期末人數硬除。
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <Head />
                </thead>
                <tbody>
                  <Field
                    label="期末人數"
                    unit="人"
                    value={inputs.headcountEnd}
                    onChange={(v) => set("headcountEnd", Number(v))}
                  />
                  <Field
                    label="年平均人數"
                    unit="人"
                    hint="401-1、404-1 分母"
                    value={inputs.headcountAvg}
                    onChange={(v) => set("headcountAvg", Number(v))}
                  />
                  <Field
                    label="新進人數"
                    unit="人"
                    value={inputs.newHires}
                    onChange={(v) => set("newHires", Number(v))}
                  />
                  <Field
                    label="離職人數"
                    unit="人"
                    value={inputs.leavers}
                    onChange={(v) => set("leavers", Number(v))}
                  />
                  <Field
                    label="總訓練時數"
                    unit="小時"
                    value={inputs.trainingHours}
                    onChange={(v) => set("trainingHours", Number(v))}
                  />
                  <Field
                    label="人均訓練目標"
                    unit="小時"
                    value={inputs.trainingHoursTarget}
                    onChange={(v) => set("trainingHoursTarget", Number(v))}
                  />
                  <Field
                    label="總經歷工時"
                    unit="小時"
                    hint="職安年報；FR／SR 分母"
                    value={inputs.workHours}
                    onChange={(v) => set("workHours", Number(v))}
                  />
                  <Field
                    label="失能傷害次數"
                    unit="次"
                    value={inputs.disablingInjuries}
                    onChange={(v) => set("disablingInjuries", Number(v))}
                  />
                  <Field
                    label="損失日數"
                    unit="日"
                    value={inputs.lostDays}
                    onChange={(v) => set("lostDays", Number(v))}
                  />
                </tbody>
              </table>
            </>
          )}

          {sheet === "kpi" && (
            <>
              <p className="mb-2 text-[13px] leading-6">
                <span className="wb-tag">特別強調</span>
                業務目標及完成率只進「財務構面 KPI」，
                <b>不會</b>自動變成 ESG 社會面分數。系統要算的是：考核覆蓋率、納入 ESG
                KPI 的員工比、ESG 達成率、加權績效、連動獎金、薪酬倍數。
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <Head />
                </thead>
                <tbody>
                  <Field
                    label="應考核人數"
                    unit="人"
                    hint="GRI 404-3 分母"
                    value={inputs.dueReview}
                    onChange={(v) => set("dueReview", Number(v))}
                  />
                  <Field
                    label="已考核人數"
                    unit="人"
                    value={inputs.doneReview}
                    onChange={(v) => set("doneReview", Number(v))}
                  />
                  <Field
                    label="KPI含ESG指標人數"
                    unit="人"
                    hint="永續發展實務守則 §9"
                    value={inputs.withEsgKpi}
                    onChange={(v) => set("withEsgKpi", Number(v))}
                  />
                  <Field
                    label="高階ESG權重"
                    unit="%"
                    hint="變動薪酬中 ESG 占比，常見 10–20"
                    value={inputs.esgWeight}
                    onChange={(v) => set("esgWeight", Number(v))}
                  />
                  <Field
                    label="業務目標"
                    unit="億元"
                    hint="財務KPI，非GRI S指標"
                    value={inputs.businessTarget}
                    onChange={(v) => set("businessTarget", Number(v))}
                  />
                  <Field
                    label="業務實際"
                    unit="億元"
                    value={inputs.businessActual}
                    onChange={(v) => set("businessActual", Number(v))}
                  />
                  <Field
                    label="ESG KPI目標"
                    unit="分"
                    hint="減碳／職安／訓練等加總或評分"
                    value={inputs.esgTargetScore}
                    onChange={(v) => set("esgTargetScore", Number(v))}
                  />
                  <Field
                    label="ESG KPI實際"
                    unit="分"
                    value={inputs.esgActualScore}
                    onChange={(v) => set("esgActualScore", Number(v))}
                  />
                  <Field
                    label="變動獎金池"
                    unit="萬元"
                    value={inputs.bonusPool}
                    onChange={(v) => set("bonusPool", Number(v))}
                  />
                  <Field
                    label="最高個人年薪"
                    unit="萬元"
                    hint="GRI 2-21 分子"
                    value={inputs.highestPay}
                    onChange={(v) => set("highestPay", Number(v))}
                  />
                  <Field
                    label="其他員工年薪中位數"
                    unit="萬元"
                    hint="GRI 2-21 分母（不含最高薪）"
                    value={inputs.medianPay}
                    onChange={(v) => set("medianPay", Number(v))}
                  />
                </tbody>
              </table>
            </>
          )}

          {sheet === "reg" && (
            <div>
              <div className="mb-3 flex items-center gap-3 text-[13px]">
                <button
                  type="button"
                  onClick={verifyRegs}
                  className="border border-[#444] bg-[#eee] px-3 py-1"
                >
                  核對法規版本
                </button>
                <span>{regStamp}</span>
              </div>
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#2c3b4e] text-white">
                    <th className="border border-[#999] px-2 py-1 text-left">規範</th>
                    <th className="border border-[#999] px-2 py-1 text-left">版本／時點</th>
                    <th className="border border-[#999] px-2 py-1 text-left">本系統採用之計算要點</th>
                  </tr>
                </thead>
                <tbody>
                  {regulationCatalog.map((r) => (
                    <tr key={r.id}>
                      <td className="border border-[#ccc] px-2 py-1">
                        <a href={r.url} className="text-[#003399] underline" target="_blank">
                          {r.name}
                        </a>
                      </td>
                      <td className="border border-[#ccc] px-2 py-1">
                        {r.version}
                        <br />
                        庫內 {r.asOf}
                      </td>
                      <td className="border border-[#ccc] px-2 py-1">{r.point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[12px] text-[#555]">
                示範版法規庫為內建條文與公式對照，不是即時爬蟲。係數與作業辦法修正時，以主管機關公告為準並更新本表。
              </p>
            </div>
          )}
        </div>

        <aside className="bg-[#f4f4f4] p-3">
          <h2 className="mb-2 text-[14px] font-bold">系統運算結果（黃底）</h2>
          <table className="mb-4 w-full border-collapse text-[12px]">
            <tbody>
              {result.metrics
                .filter((m) => {
                  if (sheet === "env") return m.group.startsWith("E");
                  if (sheet === "hr") return m.group.startsWith("S") && m.group !== "S 績效KPI";
                  if (sheet === "kpi") return m.group === "S 績效KPI" || m.group.startsWith("G");
                  return true;
                })
                .map((m) => (
                  <tr key={m.id}>
                    <td className="border border-[#ccc] px-2 py-1">
                      {m.name}
                      <div className="text-[11px] text-[#666]">{m.basis}</div>
                    </td>
                    <td className="wb-calc border border-[#ccc] px-2 py-1 text-right">
                      {m.value} {m.unit}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <h2 className="mb-2 text-[14px] font-bold">自動勾稽</h2>
          <ul className="space-y-2 text-[12px]">
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
                <div className="text-[#555]">{c.basis}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Head() {
  return (
    <tr className="bg-[#2c3b4e] text-left text-[12px] text-white">
      <th className="border border-[#888] px-2 py-1">項目</th>
      <th className="border border-[#888] px-2 py-1 w-[140px]">寫入</th>
      <th className="border border-[#888] px-2 py-1 w-[90px]">單位</th>
      <th className="border border-[#888] px-2 py-1">說明／法源</th>
    </tr>
  );
}
