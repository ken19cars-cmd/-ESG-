import type { Inputs, Metric } from "@/lib/esg-engine";

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
  return [
    {
      chapter: "關於本報告書",
      gri: "GRI 2-1～2-5",
      rows: [
        { name: "組織名稱", value: inputs.client, unit: "—", gri: "GRI 2-1" },
        { name: "報導期間", value: `${inputs.year} 年1月1日至12月31日`, unit: "—", gri: "GRI 2-3" },
        { name: "依循準則", value: "GRI Standards 2021；上市櫃永續報告書作業辦法", unit: "—", gri: "GRI 1" },
      ],
    },
    {
      chapter: "5 環境—能源與溫室氣體",
      gri: "GRI 302、305；金管會排放量／密集度",
      rows: take("s1", "s2", "s12", "s3", "int", "ren", "en", "eni"),
    },
    {
      chapter: "5 環境—水與廢棄物",
      gri: "GRI 303、306、305-7",
      rows: take("wint", "wuse", "rec", "haz"),
    },
    {
      chapter: "5 環境—綠色投資",
      gri: "資本支出揭露",
      rows: take("grn"),
    },
    {
      chapter: "6 社會—人力結構與訓練",
      gri: "GRI 2-7、401、404、405",
      rows: take("turn", "hire", "fem", "dis", "tr", "trf"),
    },
    {
      chapter: "6 社會—職業安全",
      gri: "GRI 403-9",
      rows: take("fr", "sr", "trir"),
    },
    {
      chapter: "6 社會—權益與供應鏈",
      gri: "GRI 401-3、2-30、2-24、308、414",
      rows: take("par", "fm", "un", "hrt", "sup"),
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
