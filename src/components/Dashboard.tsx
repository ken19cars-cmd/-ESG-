"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  annualDossiers,
  clientMeta,
  indicatorSources,
  mapping,
  reportSample,
  reportService,
  sourceVisuals,
  trend,
  yearData,
  years,
  type Year,
} from "@/lib/sample-client";

type Tab = "overview" | "E" | "S" | "G" | "map" | "dossier" | "report";
type Step = "collect" | "map" | "present" | "report";

const steps: { id: Step; n: string; title: string; body: string; tab: Tab }[] = [
  {
    id: "collect",
    n: "01",
    title: "蒐集年度資料",
    body: "財報、年報、內控、盤查，簽證季本來就在收的。",
    tab: "dossier",
  },
  {
    id: "map",
    n: "02",
    title: "對應指標",
    body: "科目跟治理項目，分別掛進環境、社會、治理。",
    tab: "map",
  },
  {
    id: "present",
    n: "03",
    title: "呈現成果",
    body: "客戶來開會，看營收、淨利，還有三個分數。",
    tab: "overview",
  },
  {
    id: "report",
    n: "04",
    title: "編製報告書",
    body: "報告書沿用板上的數字，不再另外做一套。",
    tab: "report",
  },
];

function useCount(value: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const from = n;
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 700);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (value - from) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return n;
}

function ScoreRing({
  label,
  score,
  tone,
  active,
  onClick,
}: {
  label: string;
  score: number;
  tone: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const animated = useCount(score);
  const shown = Math.round(animated);
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`panel flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "active" : ""}`}
    >
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#e6eef2" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
        <text x="36" y="41" textAnchor="middle" fill="#243044" fontSize="16" className="num">
          {shown}
        </text>
      </svg>
      <span className="text-[11px] tracking-[0.12em] text-mute">{label}</span>
    </button>
  );
}

function TrendChart({
  year,
  onPick,
}: {
  year: Year;
  onPick: (y: Year) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 560;
  const height = 132;
  const pad = 26;
  const keys = ["e", "s", "g"] as const;
  const colors = { e: "#4d7584", s: "#5d7394", g: "#8a6672" };
  const x = (i: number) => pad + (i * (width - pad * 2)) / (trend.length - 1);
  const y = (v: number) => height - pad - ((v - 50) / 50) * (height - pad * 2);
  const active = hover ?? trend.findIndex((row) => row.year === year);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {[60, 70, 80, 90].map((tick) => (
        <g key={tick}>
          <line x1={pad} x2={width - pad} y1={y(tick)} y2={y(tick)} stroke="#e3eef3" />
          <text x="6" y={y(tick) + 3} fontSize="10" fill="#7b8b98">
            {tick}
          </text>
        </g>
      ))}
      {keys.map((key) => {
        const d = trend.map((row, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(row[key])}`).join(" ");
        return <path key={key} d={d} fill="none" stroke={colors[key]} strokeWidth="2.4" />;
      })}
      {trend.map((row, i) => (
        <g
          key={row.year}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onPick(row.year as Year)}
          className="cursor-pointer"
        >
          <rect x={x(i) - 28} y={8} width="56" height={height - 16} fill="transparent" />
          {keys.map((key) => (
            <circle key={key} cx={x(i)} cy={y(row[key])} r={active === i ? 5 : 3} fill={colors[key]} />
          ))}
          <text
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fill={row.year === year ? "#243044" : "#5c6b76"}
          >
            {row.year}
          </text>
        </g>
      ))}
      {active >= 0 && (
        <g>
          <rect
            x={Math.min(Math.max(8, x(active) - 52), width - 112)}
            y={6}
            width="104"
            height="36"
            rx="6"
            fill="#ffffff"
            stroke="#d5e4ec"
          />
          <text
            x={Math.min(Math.max(60, x(active)), width - 60)}
            y={20}
            textAnchor="middle"
            fontSize="10"
            fill="#7b8b98"
          >
            {trend[active].year}
          </text>
          <text
            x={Math.min(Math.max(60, x(active)), width - 60)}
            y={34}
            textAnchor="middle"
            fontSize="11"
            fill="#243044"
          >
            E {trend[active].e}  S {trend[active].s}  G {trend[active].g}
          </text>
        </g>
      )}
    </svg>
  );
}

export function Dashboard() {
  const [year, setYear] = useState<Year>("2025");
  const [tab, setTab] = useState<Tab>("overview");
  const [step, setStep] = useState<Step>("present");
  const data = yearData[year];
  const overall = useCount(data.scores.overall);
  const nav: { id: Tab; label: string }[] = [
    { id: "overview", label: "總覽" },
    { id: "E", label: "環境" },
    { id: "S", label: "社會" },
    { id: "G", label: "治理" },
    { id: "dossier", label: "年度資料" },
    { id: "map", label: "來源對照" },
    { id: "report", label: "報告書" },
  ];

  const highlight = useMemo(() => {
    if (step === "collect") return "fin";
    if (step === "map") return "map";
    if (step === "report") return "map";
    return "score";
  }, [step]);

  return (
    <div className="app-shell flex min-h-screen">
      <aside className="hidden w-44 shrink-0 flex-col border-r border-[#d7e6ee] bg-white lg:flex">
        <div className="border-b border-[#e6eef3] px-3 py-3">
          <p className="text-sm font-semibold leading-5 text-[#243044]">OO公司ESG永續儀表板</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-md px-2.5 py-1.5 text-left text-sm ${
                tab === item.id ? "bg-[#e5f6f8] font-medium text-[#243044]" : "text-[#4d6270] hover:bg-[#f4f8fb]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#e6eef3] p-3">
          <p className="px-2 pb-2 text-xs text-[#7b8b98]">年度</p>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${
                year === y ? "bg-[#e5f6f8] text-[#243044]" : "text-[#4d6270] hover:bg-[#f4f8fb]"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d7e6ee] bg-white px-4 py-2">
        <div>
          <p className="text-[11px] text-[#7b8b98]">翰欣科技　衡澄</p>
          <h1 className="text-xl font-semibold text-[#243044]">企業ESG永續應用系統</h1>
          <p className="text-xs text-[#3e4e5a]">
            <span className="font-medium text-[#243044]">規範　計算　檢索　稽核</span>
            <span className="mx-2 text-[#b7c6d0]">·</span>
            帳先對上，再拿去給客戶看。
          </p>
        </div>
        <div className="flex gap-1 lg:hidden">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`rounded-md px-2 py-1 text-xs ${year === y ? "bg-[#2c4454] text-white" : "bg-[#eef5f8] text-[#4d6270]"}`}
            >
              {y}
            </button>
          ))}
        </div>
      </header>

      <section className="px-4 pt-2">
        <div className="mb-1 flex items-end justify-between gap-3">
          <p className="text-xs text-[#4d6270]">資料來源</p>
          <p className="text-[11px] text-[#7b8b98]">點一張，開對應的頁</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sourceVisuals.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setTab(item.tab as Tab)}
              className="panel min-w-[148px] max-w-[168px] shrink-0 overflow-hidden rounded-lg text-left"
            >
              <div className="relative h-14 w-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="168px"
                />
              </div>
              <div className="px-2 py-1.5">
                <p className="text-xs">{item.title}</p>
                <p className="line-clamp-1 text-[10px] leading-4 text-mute">{item.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <main className="grid gap-2 px-4 py-2 xl:grid-cols-12">
        <section className="grid content-start gap-1.5 xl:col-span-3">
          <p className="text-xs text-[#4d6270]">作業步驟</p>
          {steps.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setStep(item.id);
                setTab(item.tab);
              }}
              className={`panel fade-up rounded-lg px-3 py-2 text-left ${step === item.id ? "active" : ""}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-baseline gap-2">
                <p className="num text-xs text-[#243044]">{item.n}</p>
                <h2 className="text-sm">{item.title}</h2>
              </div>
              <p className="mt-0.5 text-xs leading-5 text-mute">{item.body}</p>
            </button>
          ))}
        </section>

        <section className="grid content-start gap-2 xl:col-span-9">
          <div className="grid gap-2 sm:grid-cols-4">
            <ScoreRing
              label="綜合"
              score={data.scores.overall}
              tone="#4d7584"
              active={highlight === "score"}
              onClick={() => setTab("overview")}
            />
            <ScoreRing
              label="環境 E"
              score={data.scores.e}
              tone="#4d7584"
              active={tab === "E"}
              onClick={() => setTab("E")}
            />
            <ScoreRing
              label="社會 S"
              score={data.scores.s}
              tone="#5d7394"
              active={tab === "S"}
              onClick={() => setTab("S")}
            />
            <ScoreRing
              label="治理 G"
              score={data.scores.g}
              tone="#8a6672"
              active={tab === "G"}
              onClick={() => setTab("G")}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {data.financial.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setTab(item.key === "map" ? "map" : "overview")}
                className={`panel rounded-lg px-3 py-2 text-left ${
                  highlight === item.key || highlight === "score" ? "active" : ""
                }`}
              >
                <p className="text-[11px] text-mute">{item.label}</p>
                <p className="num text-lg text-[#243044]">{item.value}</p>
                <p className="text-[11px] text-[#4a5963]">{item.hint}</p>
                <p className="line-clamp-1 text-[10px] leading-4 text-mute">
                  來源：{indicatorSources[item.label]}
                </p>
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-sm ${
                  tab === item.id ? "bg-[#2c4454] text-white" : "bg-white text-[#4d6270]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="panel fade-up rounded-lg px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-sm">四年 ESG 分數軌跡</h2>
                <p className="num text-sm text-mute">INDEX {overall.toFixed(1)}</p>
              </div>
              <TrendChart year={year} onPick={setYear} />
            </div>
          )}

          {tab === "E" && (
            <div className="panel fade-up space-y-3 rounded-lg px-3 py-2">
              {data.environment.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="num text-[#243044]">
                      {item.value} {item.unit}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6eef2]">
                    <div
                      className="bar-fill h-full origin-left rounded-full bg-[#5d7584]"
                      style={{ width: `${item.bar}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-mute">
                    YoY {item.yoy}% · {item.target} · 來源：{indicatorSources[item.name]}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "S" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.social.map((item, i) => (
                <article
                  key={item.name}
                  className="panel fade-up rounded-lg px-3 py-2"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <p className="text-sm text-mute">{item.name}</p>
                  <p className="num mt-2 text-2xl text-[#243044]">{item.value}</p>
                  <p className="mt-2 text-sm text-mute">{item.note}</p>
                  <p className="mt-2 text-[11px] text-[#3e4e5a]">來源：{indicatorSources[item.name]}</p>
                </article>
              ))}
            </div>
          )}

          {tab === "G" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.governance.map((item, i) => (
                <article
                  key={item.name}
                  className="panel fade-up flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="num mt-1 text-sm text-mute">{item.value}</p>
                    <p className="mt-1 text-[11px] text-mute">來源：{indicatorSources[item.name]}</p>
                  </div>
                  <span className="rounded-full border border-[#d5e0e6] px-3 py-1 text-xs text-[#243044]">
                    {item.status}
                  </span>
                </article>
              ))}
            </div>
          )}

          {tab === "map" && (
            <div className="panel fade-up overflow-hidden rounded-lg">
              <div className="border-b border-line px-3 py-2">
                <h2 className="text-lg">年度資料怎麼上板</h2>
                <p className="mt-1 text-sm leading-6 text-mute">
                  左邊是事務所本來就交的，右邊是板上的指標。點一列跳到該頁。
                </p>
              </div>
              {mapping.map((row) => (
                <button
                  key={row.source}
                  type="button"
                  onClick={() => setTab(row.dim as Tab)}
                  className="flex w-full items-center justify-between gap-4 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-[#f4f8fb]"
                >
                  <span className="text-sm">{row.source}</span>
                  <span className="text-sm text-[#243044]">{row.indicator}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "dossier" && (
            <div className="grid gap-3 md:grid-cols-2">
              {annualDossiers.map((group, i) => (
                <article
                  key={group.group}
                  className="panel fade-up overflow-hidden rounded-lg"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={group.image}
                      alt={group.group}
                      fill
                      className="object-cover"
                      sizes="40vw"
                    />
                  </div>
                  <div className="px-3 py-2">
                  <p className="text-[11px] tracking-[0.2em] text-[#243044]">{group.note}</p>
                  <h2 className="mt-1 text-lg">{group.group}</h2>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item.name} className="border-t border-line pt-3">
                        <p className="text-sm">{item.name}</p>
                        <p className="mt-1 text-xs leading-6 text-mute">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === "report" && (
            <div className="grid gap-2">
              <article className="panel fade-up rounded-lg px-3 py-2">
                <p className="text-[11px] tracking-[0.2em] text-[#243044]">事務所服務</p>
                <h2 className="mt-1 text-xl">{reportService.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-mute">{reportService.pitch}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {reportService.packages.map((item) => (
                    <div key={item.name} className="rounded-lg border border-[#e3eef3] bg-[#f7fbfd] px-3 py-2">
                      <p className="text-[#243044]">{item.name}</p>
                      <p className="mt-2 text-sm leading-6 text-mute">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {reportService.frameworks.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d5e0e6] px-3 py-1 text-[11px] text-[#3e4e5a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
              <article className="panel fade-up overflow-hidden rounded-lg">
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-[140px]">
                    <Image
                      src={reportSample.cover}
                      alt="永續報告書封面示範"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  <div className="relative min-h-[140px]">
                    <Image
                      src={reportSample.spread}
                      alt="年報內頁示範"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                </div>
                <div className="px-3 py-2">
                <p className="text-[11px] tracking-[0.2em] text-[#4a5963]">摘錄</p>
                <h2 className="mt-1 text-lg">{reportSample.client}</h2>
                <p className="mt-2 text-sm italic leading-7 text-mute">{reportSample.quote}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {reportSample.chapters.map((ch) => (
                    <div key={ch.no} className="rounded-xl border border-line px-4 py-3">
                      <p className="num text-xs text-[#243044]">
                        {ch.no} {ch.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-mute">{ch.body}</p>
                    </div>
                  ))}
                </div>
                </div>
              </article>
            </div>
          )}
        </section>
      </main>
      </div>
    </div>
  );
}
