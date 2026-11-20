import type { Inputs, Metric } from "@/lib/esg-engine";
import { annexApplies, annexItems, industryMeta, topicFlags } from "@/lib/industry-rules";

export type ReportBlock = {
  chapter: string;
  gri: string;
  rows: { name: string; value: string; unit: string; gri: string }[];
};

function pick(metrics: Metric[], id: string) {
  return metrics.find((m) => m.id === id);
}

function row(metrics: Metric[], id: string) {
  const m = pick(metrics, id);
  if (!m) return null;
  return { name: m.name, value: m.value, unit: m.unit, gri: m.basis };
}

export function reportDraft(inputs: Inputs, metrics: Metric[]): ReportBlock[] {
  const take = (...ids: string[]) => ids.map((id) => row(metrics, id)).filter(Boolean) as ReportBlock["rows"];
  const meta = industryMeta(inputs.industry);
  const annex = annexApplies(inputs.industry, inputs.capitalBillion, inputs.diningRevenuePct);
  const flags = topicFlags(inputs.industry, inputs.capitalBillion, inputs.diningRevenuePct);
  const annexRows = (annex.applies ? annexItems(inputs.industry, inputs.diningRevenuePct) : []).map((item) => {
    if (item.fill === "qual") {
      return { name: `${item.no} ${item.text}`, value: "質化敘述，本系統不計算", unit: "—", gri: `作業辦法${meta.annex}` };
    }
    if (item.fill === "derived") {
      const m = pick(metrics, item.key === "en" ? "en" : item.key === "wuse" ? "wuse" : item.key === "haz" ? "haz" : item.key === "fr" ? "fr" : "");
      return { name: `${item.no} ${item.text}`, value: m?.value ?? "—", unit: m?.unit ?? item.unit, gri: `作業辦法${meta.annex}` };
    }
    const raw = item.key ? inputs[item.key as keyof Inputs] : undefined;
    return { name: `${item.no} ${item.text}`, value: typeof raw === "number" ? String(raw) : "—", unit: item.unit, gri: `作業辦法${meta.annex}` };
  });
  return [
    {
      chapter: "關於本報告書",
      gri: "GRI 2-1～2-5",
      rows: [
        { name: "組織名稱", value: inputs.client, unit: "—", gri: "GRI 2-1" },
        { name: "報導期間", value: `${inputs.year} 年1月1日至12月31日`, unit: "—", gri: "GRI 2-3" },
        { name: "產業別", value: meta.name, unit: "—", gri: "作業辦法第4條" },
        { name: "實收資本額", value: String(inputs.capitalBillion), unit: "億元", gri: "作業辦法第4條、第4條之1" },
        { name: "依循準則", value: "GRI Standards 2021；上市櫃永續報告書作業辦法", unit: "—", gri: "GRI 1" },
      ],
    },
    {
      chapter: annex.applies ? `產業別加強揭露（${meta.annex}）` : "產業別加強揭露（附表一未強制）",
      gri: "作業辦法第4條附表一（參採 SASB）",
      rows: annexRows.length
        ? annexRows
        : [{ name: "適用情形", value: annex.reason, unit: "—", gri: "作業辦法第4條" }],
    },
    {
      chapter: "5 環境—能源與溫室氣體",
      gri: "GRI 302、305；金管會排放量／密集度",
      rows: take("s1", "s2", "s3o", "s12", "s3", "int", "p12", "pint", "gyoy", "iyoy", "ghge", "ren", "en", "eni"),
    },
    ...(flags.water || flags.waste
      ? [
          {
            chapter: "5 環境—水與廢棄物",
            gri: "GRI 303、306、305-7",
            rows: take(
              ...(flags.water ? (["wint", "wuse"] as const) : []),
              ...(flags.waste ? (["rec", "haz", "wastI"] as const) : []),
            ),
          },
        ]
      : []),
    {
      chapter: "5 環境—綠色投資",
      gri: "資本支出揭露",
      rows: take("grn"),
    },
    {
      chapter: "6 社會—人力結構與訓練",
      gri: "GRI 2-7、401、404、405",
      rows: take("turn", "hire", "fem", "male", "dis", "tr", "trf", "trhit"),
    },
    {
      chapter: "6 社會—職業安全",
      gri: "GRI 403-9",
      rows: take("fr", "sr", "trir"),
    },
    {
      chapter: "6 社會—權益與供應鏈",
      gri: "GRI 401-3、2-30、2-24、308、414",
      rows: take("par", "fm", "un", "hrt", "sup", "csp"),
    },
    {
      chapter: "4 治理—董事會與誠信",
      gri: "年報治理；GRI 2-9、205-2、2-27",
      rows: take("ind", "att", "ac"),
    },
    {
      chapter: "4 治理—薪酬與永續績效",
      gri: "GRI 2-19、2-21、405-2；實務守則§9",
      rows: take("ek", "eh", "bon", "pay", "gp", "rev"),
    },
  ];
}

export function griIndex(metrics: Metric[]) {
  return metrics.map((m) => ({
    gri: m.basis,
    topic: m.name,
    value: `${m.value} ${m.unit}`.trim(),
    chapter: m.group,
    formula: m.formula,
  }));
}
