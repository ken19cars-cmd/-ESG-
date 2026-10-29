"use client";

import { useEffect, useMemo, useState } from "react";
import {
  photoMonths,
  projectCase,
  type SitePhoto,
} from "@/lib/project-case";
import {
  CameraFrame,
  FloorPlate,
  Massing,
  PhotoSketch,
  SiteDiagram,
} from "@/components/project/visuals";

const nav = [
  { href: "#facts", label: "基地資料" },
  { href: "#timeline", label: "大事記" },
  { href: "#design", label: "規劃構想" },
  { href: "#cameras", label: "工地實況" },
  { href: "#photos", label: "施工照片" },
  { href: "#schedule", label: "工期進度" },
  { href: "#briefings", label: "說明會" },
];

export function ProjectSite() {
  const [planId, setPlanId] = useState(projectCase.plans[0].id);
  const [renderId, setRenderId] = useState(projectCase.renders[0].id);
  const [cameraId, setCameraId] = useState(projectCase.cameras[0].id);
  const [month, setMonth] = useState("all");
  const [photo, setPhoto] = useState<SitePhoto | null>(null);
  const [briefingId, setBriefingId] = useState(projectCase.briefings[0].id);
  const [slide, setSlide] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!photo) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhoto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo]);

  const plan = projectCase.plans.find((item) => item.id === planId) ?? projectCase.plans[0];
  const render = projectCase.renders.find((item) => item.id === renderId) ?? projectCase.renders[0];
  const camera = projectCase.cameras.find((item) => item.id === cameraId) ?? projectCase.cameras[0];
  const briefing =
    projectCase.briefings.find((item) => item.id === briefingId) ?? projectCase.briefings[0];
  const photos = useMemo(
    () =>
      month === "all"
        ? projectCase.photos
        : projectCase.photos.filter((item) => item.month === month),
    [month],
  );

  return (
    <div className="min-h-screen bg-[#f3efe6] text-[#1a2332]">
      <header className="bg-[#1e4d40] text-[#f7f3eb]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
          <p>
            {projectCase.authority} · 工程公開資訊
          </p>
          <p>資料更新 {projectCase.updatedAt}</p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_0.8fr] md:py-16">
          <div>
            <p className="text-sm tracking-wide text-[#d5e6df]">示範案件 · {projectCase.caseNo}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
              {projectCase.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#e7f0ea]">{projectCase.summary}</p>
            <p className="mt-4 text-[#d5e6df]">{projectCase.address}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#schedule"
                className="bg-[#f3efe6] px-4 py-2 text-sm font-semibold text-[#1e4d40]"
              >
                查看工期進度
              </a>
              <a
                href="#cameras"
                className="border border-[#d5e6df] px-4 py-2 text-sm font-semibold"
              >
                觀看工地實況
              </a>
            </div>
          </div>
          <aside className="bg-[#16382f] p-5">
            <p className="text-sm text-[#d5e6df]">目前階段</p>
            <p className="mt-1 text-2xl font-semibold">{projectCase.phase}</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/15 pb-2">
                <dt className="text-[#d5e6df]">預定進度</dt>
                <dd>{projectCase.schedule.planned}%</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/15 pb-2">
                <dt className="text-[#d5e6df]">實際進度</dt>
                <dd>{projectCase.schedule.actual}%</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#d5e6df]">差異</dt>
                <dd>{projectCase.schedule.varianceLabel}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      <nav aria-label="頁面段落" className="sticky top-0 z-20 border-b border-[#e4d9c8] bg-[#f3efe6]/95 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 text-sm">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block whitespace-nowrap px-3 py-2 hover:bg-[#e7f0ea]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-6xl space-y-16 px-5 py-12">
        <section id="facts" className="scroll-mt-24">
          <SectionTitle kicker="基地基本資料" title="位置、規模與實施團隊" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border border-[#e4d9c8] bg-white p-3">
              <SiteDiagram />
            </div>
            <div className="border border-[#e4d9c8] bg-white">
              <dl className="divide-y divide-[#e4d9c8]">
                {projectCase.facts.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-3 text-sm">
                    <dt className="text-[#5c6b7a]">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["今日出工", `${projectCase.today.workers} 人`],
              ["吊運", projectCase.today.cranes],
              ["監測", projectCase.today.monitor],
              ["現場天氣", projectCase.today.weather],
            ].map(([label, value]) => (
              <div key={label} className="border border-[#e4d9c8] bg-white px-4 py-3">
                <p className="text-sm text-[#5c6b7a]">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#5c6b7a]">{projectCase.today.note}</p>
        </section>

        <section id="timeline" className="scroll-mt-24">
          <SectionTitle kicker="大事記" title="從公聽會到現在的施作樓層" />
          <ol className="mt-6 border-l-2 border-[#1e4d40]">
            {projectCase.milestones.map((item) => (
              <li key={item.date} className="relative pb-8 pl-6">
                <span
                  className={`absolute top-1 -left-[7px] h-3 w-3 rounded-full ${
                    item.state === "current" ? "bg-[#9a6b3f]" : "bg-[#1e4d40]"
                  }`}
                />
                <p className="text-sm text-[#5c6b7a]">
                  {item.date}
                  {item.state === "current" ? " · 進行中" : ""}
                  {item.state === "next" ? " · 預定" : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[#3e4a44]">{item.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="design" className="scroll-mt-24">
          <SectionTitle kicker="規劃構想" title="平面圖與建築量體" />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="border border-[#e4d9c8] bg-white p-4">
              <h3 className="font-semibold">平面圖</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {projectCase.plans.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === plan.id}
                    onClick={() => setPlanId(item.id)}
                    className={`px-3 py-1.5 text-sm ${
                      item.id === plan.id
                        ? "bg-[#1e4d40] text-white"
                        : "bg-[#f3efe6] text-[#1a2332]"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 border border-[#e4d9c8]">
                <FloorPlate plan={plan} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#3e4a44]">{plan.note}</p>
            </article>
            <article className="border border-[#e4d9c8] bg-white p-4">
              <h3 className="font-semibold">建築 3D 效果圖</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {projectCase.renders.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === render.id}
                    onClick={() => setRenderId(item.id)}
                    className={`px-3 py-1.5 text-sm ${
                      item.id === render.id
                        ? "bg-[#1e4d40] text-white"
                        : "bg-[#f3efe6] text-[#1a2332]"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 border border-[#e4d9c8]">
                <Massing view={render} />
              </div>
            </article>
          </div>
        </section>

        <section id="cameras" className="scroll-mt-24">
          <SectionTitle kicker="工地監視器" title="現場畫面" />
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5c6b7a]">
            正式案場接入工地錄影主機的即時串流。此頁以畫面與時間戳示意，西鄰鏡頭今日上午線路檢修。
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="border border-[#1a2332] bg-[#111]">
              <CameraFrame name={camera.name} live={camera.status === "live"} clock={clock} />
              <div className="flex items-center justify-between px-4 py-3 text-sm text-[#f7f3eb]">
                <p>{camera.aim}</p>
                <p>{camera.status === "live" ? "連線中" : `維護中 · 最後畫面 ${camera.lastFrame}`}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {projectCase.cameras.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={item.id === camera.id}
                    onClick={() => setCameraId(item.id)}
                    className={`w-full border px-4 py-3 text-left ${
                      item.id === camera.id
                        ? "border-[#1e4d40] bg-[#e7f0ea]"
                        : "border-[#e4d9c8] bg-white"
                    }`}
                  >
                    <span className="block font-semibold">{item.name}</span>
                    <span className="mt-1 block text-sm text-[#5c6b7a]">
                      {item.status === "live" ? "即時" : "維護中"} · {item.aim}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="photos" className="scroll-mt-24">
          <SectionTitle kicker="施工照片" title="依月份回看現場" />
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="照片月份">
            <FilterChip active={month === "all"} onClick={() => setMonth("all")}>
              全部
            </FilterChip>
            {photoMonths.map((item) => (
              <FilterChip key={item} active={month === item} onClick={() => setMonth(item)}>
                {item}
              </FilterChip>
            ))}
          </div>
          {photos.length === 0 ? (
            <p className="mt-6 border border-dashed border-[#e4d9c8] bg-white px-4 py-8 text-center text-sm">
              這個月份尚未上傳照片。
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {photos.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setPhoto(item)}
                    className="w-full border border-[#e4d9c8] bg-white text-left"
                  >
                    <PhotoSketch variant={item.variant} title={item.date} />
                    <span className="block px-3 py-3">
                      <span className="block text-sm text-[#5c6b7a]">{item.date}</span>
                      <span className="mt-1 block font-semibold">{item.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="schedule" className="scroll-mt-24">
          <SectionTitle kicker="工期進度" title="預定與實際對照" />
          <div className="mt-6 border border-[#e4d9c8] bg-white p-5">
            <div className="flex justify-between text-sm text-[#5c6b7a]">
              <span>{projectCase.schedule.startLabel}</span>
              <span>{projectCase.schedule.endLabel}</span>
            </div>
            <div className="relative mt-3 h-3 bg-[#efe8dc]">
              <div
                className="absolute inset-y-0 left-0 bg-[#c9ddd4]"
                style={{ width: `${projectCase.schedule.planned}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-[#1e4d40]"
                style={{ width: `${projectCase.schedule.actual}%` }}
              />
              <span
                className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-[#9a6b3f]"
                style={{ left: `${projectCase.schedule.elapsed}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[#5c6b7a]">
              淺色為預定進度 {projectCase.schedule.planned}%、深色為實際進度 {projectCase.schedule.actual}%、銅線為今日在總工期上的位置。
            </p>
            <p className="mt-2 text-sm leading-6">{projectCase.schedule.reason}</p>
            <ul className="mt-6 space-y-4">
              {projectCase.packages.map((item) => (
                <li key={item.name}>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[#5c6b7a]">
                      預定 {item.planned}% · 實際 {item.actual}%
                      {item.actual < item.planned ? " · 落後" : ""}
                    </span>
                  </div>
                  <div className="relative mt-2 h-2.5 bg-[#efe8dc]">
                    <div className="absolute inset-y-0 left-0 bg-[#c9ddd4]" style={{ width: `${item.planned}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-[#1e4d40]" style={{ width: `${item.actual}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="briefings" className="scroll-mt-24">
          <SectionTitle kicker="說明會簡報" title="對居民與機關報告過的內容" />
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <ul className="space-y-2">
              {projectCase.briefings.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={item.id === briefing.id}
                    onClick={() => {
                      setBriefingId(item.id);
                      setSlide(0);
                    }}
                    className={`w-full border px-4 py-3 text-left ${
                      item.id === briefing.id
                        ? "border-[#1e4d40] bg-[#e7f0ea]"
                        : "border-[#e4d9c8] bg-white"
                    }`}
                  >
                    <span className="block text-sm text-[#5c6b7a]">{item.date}</span>
                    <span className="mt-1 block font-semibold">{item.title}</span>
                    <span className="mt-1 block text-sm text-[#5c6b7a]">
                      {item.audience} · {item.pages} 頁
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <article className="border border-[#e4d9c8] bg-white p-6" aria-live="polite">
              <p className="text-sm text-[#5c6b7a]">
                {briefing.date} · {briefing.audience}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{briefing.slides[slide].heading}</h3>
              <ul className="mt-4 space-y-3 text-lg leading-8">
                {briefing.slides[slide].points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-[#5c6b7a]">
                  {slide + 1} / {briefing.slides.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="border border-[#1e4d40] px-3 py-1.5 text-sm disabled:opacity-40"
                    disabled={slide === 0}
                    onClick={() => setSlide((value) => value - 1)}
                  >
                    上一頁
                  </button>
                  <button
                    type="button"
                    className="bg-[#1e4d40] px-3 py-1.5 text-sm text-white disabled:opacity-40"
                    disabled={slide === briefing.slides.length - 1}
                    onClick={() => setSlide((value) => value + 1)}
                  >
                    下一頁
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4d9c8] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-3">
          <div>
            <p className="font-semibold">{projectCase.developer}</p>
            <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">實施者</p>
          </div>
          <div>
            <p className="font-semibold">{projectCase.builder}</p>
            <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">
              營造廠 · 工務所專線 02-0000-2100（示範）
            </p>
          </div>
          <div>
            <p className="font-semibold">{projectCase.architect}</p>
            <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">
              本頁數值、圖說與畫面為示範案件，正式上線時改接該案核定資料與工地串流。
            </p>
          </div>
        </div>
      </footer>

      {photo ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#1a2332]/75 p-4"
          role="presentation"
          onClick={() => setPhoto(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-auto bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <PhotoSketch variant={photo.variant} title={photo.title} />
            <div className="px-5 py-4">
              <p className="text-sm text-[#5c6b7a]">{photo.date}</p>
              <h2 id="photo-title" className="mt-1 text-xl font-semibold">
                {photo.title}
              </h2>
              <p className="mt-2 text-sm leading-6">{photo.note}</p>
              <button
                type="button"
                className="mt-4 border border-[#1e4d40] px-3 py-1.5 text-sm"
                onClick={() => setPhoto(null)}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-[#9a6b3f]">{kicker}</p>
      <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`px-3 py-1.5 text-sm ${active ? "bg-[#1e4d40] text-white" : "bg-white text-[#1a2332]"}`}
    >
      {children}
    </button>
  );
}
