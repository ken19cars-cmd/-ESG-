import articles from "./gri-articles.json";

export type FieldSource = {
  originalTitle: string;
  original: string[];
  translation: string[];
  url: string;
};

const GRI_ARTICLES = articles as Record<string, { file: string; text: string }>;

const GRI = "https://www.globalreporting.org/standards/";
const GHG = "https://ghgprotocol.org/standards";
const FSC = "https://twse-regulation.twse.com.tw/TW/law/DAT08.aspx?FLCODE=FL075209";

function pack(originalTitle: string, original: string[], translation: string[], url = GRI): FieldSource {
  return { originalTitle, original, translation, url };
}

const FSC_GHG = pack(
  "上市櫃公司編製與申報永續報告書作業辦法",
  [
    "第4條之1（溫室氣體）：上市公司應揭露溫室氣體範疇一及範疇二盤查資訊，並依實收資本額與產業分階段完成個體公司、合併報表母子公司之揭露與確信。",
    "確信標準依「上市上櫃公司永續資訊確信機構管理要點」：溫室氣體意見書依確信準則3410號，或 ISO 14064-3。部分據點若屬環境部公告應盤查登錄之排放源，該部分依環境部規定。",
    "第5條：上市公司應於每年八月三十一日前申報永續報告書，並應建立永續報告書編製及確信之作業程序，納入內部控制制度。",
  ],
  [
    "這條管的是報告書要交出的排放結果，不是叫你在表格裡直接填公噸。",
    "範疇一、範疇二要有排放量；密集度要用排放量除以組織選定的分母。本系統的分母是合併營收（百萬元），所以合併營收一定要填。",
    "最近兩年比較時，上年排放與上年營收填在環境頁。兩欄都是 0，表示尚未提供上年數，系統只出當年。",
    "確信意見書由經證交所、櫃買中心認可的會計師或環境部查驗機構出具。本系統提供可重算的底稿，不代替意見書。",
  ],
  FSC,
);

const SOURCES: { test: (gri: string) => boolean; source: FieldSource }[] = [
  {
    test: (gri) => gri.includes("305-1") || gri.includes("305-6"),
    source: pack(
      "GRI 305-1 Direct (Scope 1) GHG emissions；GHG Protocol 直接排放",
      ["官方項目名稱：GRI 305-1 Direct (Scope 1) GHG emissions。冷媒另涉及 GRI 305-6 Emissions of ozone-depleting substances。"],
      [
        "範疇一是組織擁有或控制的排放源所產生的溫室氣體，計算結果用公噸二氧化碳當量（tCO2e）表示。",
        "本系統的活動數據是用量：柴油、汽油填公升，天然氣填立方公尺，冷媒填逸散或補灌公斤數。排放量由系統乘當期係數；冷媒再乘該冷媒的全球暖化潛勢（GWP）。",
        "自己廠內燃燒天然氣屬範疇一。向外購買的電力、蒸汽屬範疇二，不要填在油氣欄。",
        "該項能源當年確定沒有，填 0。0 表示確認為零，不是尚未輸入。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("305-2") || gri.includes("302-1"),
    source: pack(
      "GRI 302-1 Energy consumption within the organization；GRI 305-2 Energy indirect (Scope 2) GHG emissions",
      ["官方項目名稱：GRI 302-1 組織內部能源消耗；GRI 305-2 能源間接（範疇二）溫室氣體排放。"],
      [
        "外購電力、外購蒸汽是買進來的能源。能源頁要填用量：電力為度（kWh），蒸汽為熱值（GJ）。",
        "GRI 302 看的是用了多少能源。GRI 305-2 看的是這些外購能源在發電或產汽時產生、計入購買方的排放。同一筆電費會同時進入兩處：302 用度數換算熱值，305-2 用度數乘電力排碳係數。",
        "再生能源電力用來計算占外購電力的比例，不另外再計一筆範疇二。",
        "電力排碳係數依經濟部能源署當年度公告，由係數頁帶入，不在本欄手改。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("305-3"),
    source: pack(
      "GRI 305-3 Other indirect (Scope 3) GHG emissions；GHG Protocol Scope 3",
      ["官方項目名稱：GRI 305-3 Other indirect (Scope 3) GHG emissions。"],
      [
        "範疇三是價值鏈上、非本組織擁有或控制的其他間接排放，例如採購、運輸、通勤、產品使用。",
        "本欄填已經完成盤查的彙總公噸二氧化碳當量。系統不從電費、油單推算十五個類別。",
        "尚未盤查而確定這一年不揭露彙總數時填 0，並應在報告書說明範圍。不要把尚未蒐集寫成已確認為零，除非負責單位已確認。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("305-4") || gri.includes("作業辦法"),
    source: FSC_GHG,
  },
  {
    test: (gri) => gri.includes("305-7"),
    source: pack(
      "GRI 305-7 Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions",
      ["官方項目名稱：GRI 305-7 氮氧化物、硫氧化物及其他顯著空氣排放。"],
      [
        "這一欄是空氣污染物的重量，不是溫室氣體。本系統分列 NOx、SOx，單位是噸。",
        "數字通常來自固定污染源的檢測或申報。沒有該項排放源就填 0。",
        "不要把溫室氣體的公噸二氧化碳當量填進 NOx、SOx。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("303"),
    source: pack(
      "GRI 303 Water and effluents",
      ["官方項目名稱：GRI 303 水與放流水。303-3 為取水，303-4 為排水，303-5 為耗水。"],
      [
        "取水量通常對水費或水源計量。放流水量是排出的廢水。本系統的耗水用取水減放流，這是簡化算法，不是完整水平衡。",
        "水不是每一家公司的法定必填排放欄。若重大主題評估認為衝擊低，報告書可以不量化，但應在內容索引說明省略理由。",
        "有帳單就填實際量。確認沒有放流計量時，放流填 0，並在報告書註明未監測。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("306"),
    source: pack(
      "GRI 306 Waste",
      ["官方項目名稱：GRI 306 廢棄物。306-3 為產生的廢棄物，306-4 為離開處置的廢棄物（含回收、再利用）。"],
      [
        "廢棄物產生量是分母。回收或再利用量不能大於產生量，系統會勾稽。有害廢棄物是產生量中的有害部分。",
        "數字來自清運單、事業廢棄物申報或委外處理紀錄，單位是噸。",
        "確認沒有該類廢棄物才填 0。回收量大於產生量會被判為異常。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-7") || gri.includes("405-1") || gri.includes("401-1") || gri.includes("404-1"),
    source: pack(
      "GRI 2-7 Employees；GRI 401-1；GRI 404-1；GRI 405-1",
      ["官方項目名稱：GRI 2-7 員工；401-1 新進與離職；404-1 平均受訓時數；405-1 多元化。"],
      [
        "GRI 2-7 要求說明員工人數。準則允許用報導期間結束日的人數，或期間平均人數。本系統兩個都留：結束日人數做結構，平均人數做離職率與平均受訓時數的分母。",
        "女性、身心障礙人數要和結束日總人數同一時點。女性人數不能大於結束日總數。",
        "新進、離職是期間發生數，除以平均員工數得到新進率、離職率。平均受訓時數是訓練總時數除以平均員工數。",
        "這些是人數與時數，不是約當全職的換算，除非公司內部統計本來就是約當人數且全公司一致。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-8"),
    source: pack(
      "GRI 2-8 Workers who are not employees",
      ["官方項目名稱：GRI 2-8 Workers who are not employees（非員工的工作者）。"],
      [
        "這一欄是承攬、派遣等由組織控制其工作、但不是員工的人數。",
        "不要把員工總數再填一次。沒有這類工作者就填 0。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("403") || gri.includes("勞動部") || gri.includes("職災"),
    source: pack(
      "勞動部職業災害統計；GRI 403-9 Work-related injuries",
      [
        "勞動部職業災害統計：失能傷害頻率（FR）＝失能傷害次數 × 1,000,000 ÷ 總經歷工時。失能傷害嚴重率（SR）＝失能傷害損失日數 × 1,000,000 ÷ 總經歷工時。",
        "官方項目名稱：GRI 403-9 Work-related injuries。死亡人數應單獨揭露。",
      ],
      [
        "總經歷工時是頻率的分母，填小時。失能次數、損失日數用勞動部統計口徑。",
        "GRI 403-9 另要求可記錄之職業傷害與死亡人數。美國 OSHA 的 TRIR 不是台灣職安法的法定名稱，系統若計算會另行標明。",
        "死亡人數大於 0 時，勾稽會列為異常，報告書必須揭露該重大事件。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("401-3"),
    source: pack(
      "GRI 401-3 Parental leave",
      ["官方項目名稱：GRI 401-3 Parental leave（育嬰假）。"],
      [
        "應復職人數，是報導期間育嬰留職停薪到期、有權復職的人數。實際復職人數是其中真正復職的人。",
        "復職率＝實際復職 ÷ 應復職。當年沒有到期人員，兩欄都填 0。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-30"),
    source: pack(
      "GRI 2-30 Collective bargaining agreements",
      ["官方項目名稱：GRI 2-30 Collective bargaining agreements（團體協約）。"],
      [
        "填團體協約涵蓋的員工人數。比率以結束日員工總數為分母。",
        "沒有簽訂團體協約就填 0，這是確認沒有涵蓋，不是漏填。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-24") || gri.includes("308") || gri.includes("414"),
    source: pack(
      "GRI 2-24；GRI 308-1；GRI 414-1",
      ["官方項目名稱：GRI 2-24 Embedding policy commitments；308-1 與 414-1 為以環境或社會準則篩選新供應商。"],
      [
        "人權訓練人數，是接受人權政策相關訓練的人數。覆蓋率的分母由組織界定，本系統用結束日員工總數。",
        "供應商篩選填家數：供應商總數，以及已用環境或社會準則篩選的家數。系統把環境篩選與社會篩選合併成一個比率，這不是準則上的「ESG 評鑑」專名。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-19") || gri.includes("2-21") || gri.includes("404-3") || gri.includes("405-2") || gri.includes("實務守則"),
    source: pack(
      "GRI 2-19、2-21、404-3、405-2；上市上櫃公司永續發展實務守則",
      [
        "官方項目名稱：GRI 2-19 Remuneration policies；2-21 Annual total compensation ratio；404-3 Percentage of employees receiving regular performance reviews；405-2 Ratio of basic salary and remuneration of women to men。",
        "永續發展實務守則鼓勵將永續績效納入考核，沒有規定必須填「含永續指標之人數」或內部目標分數。",
      ],
      [
        "績效薪酬頁不是金管會規定每家都要填的法定清單。沒有考核或薪酬資料就填 0。",
        "404-3 是定期績效考核的應考核人數與已考核人數。已考核不能大於應考核。",
        "2-21 用組織最高薪酬個人的年度總薪酬，除以其他員工年度總薪酬中位數。405-2 用女性與男性的平均薪酬相比。",
        "高階薪酬裡的永續權重，由前置頁的配分算出，不是準則規定的法定百分比。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("205"),
    source: pack(
      "GRI 205-2 Communication and training about anti-corruption policies and procedures",
      ["官方項目名稱：GRI 205-2 反貪腐政策之溝通與訓練。"],
      [
        "應填應接受反貪腐訓練的人數，以及已完成的人數。比率＝已完成 ÷ 應接受。",
        "準則要求依治理單位、員工等類別說明。本系統先收總人數；若報告書要分治理單位與員工，須在正式報告書再拆。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("2-27") || gri.includes("裁罰"),
    source: pack(
      "GRI 2-27 Compliance with laws and regulations；金管會永續報告書作業辦法",
      ["官方項目名稱：GRI 2-27 Compliance with laws and regulations（法規遵循）。", "金管會作業辦法同時要求揭露重大裁罰。"],
      [
        "填報導期間重大違反法令的罰鍰，單位是萬元。沒有重大裁罰填 0。",
        "0 表示確認沒有要揭露的重大罰鍰。若尚有爭議案件未定讞，應在報告書用文字說明，不要只靠這一格。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("418"),
    source: pack(
      "GRI 418-1 Substantiated complaints concerning breaches of customer privacy and losses of customer data",
      ["官方項目名稱：GRI 418-1 經證實之客戶隱私侵害與客戶資料遺失申訴。"],
      [
        "這一欄是經證實的客戶個資申訴件數，不是所有資安事件的總數。",
        "沒有經證實的客戶個資申訴就填 0。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("203-1"),
    source: pack(
      "GRI 203-1 Infrastructure investments and services supported",
      ["官方項目名稱：GRI 203-1 Infrastructure investments and services supported。"],
      [
        "GRI 203-1 指基礎設施投資與支援服務。捐贈常一併揭露，準則沒有強制使用「公益支出」這個詞。",
        "本欄填金額，單位是億元。占比用此金額除以合併營收。沒有這類支出填 0。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("IAS") || gri.includes("現金流量"),
    source: pack(
      "國際會計準則第 7 號「現金流量表」",
      ["投資活動現金流量應單獨揭露購置不動產、廠房及設備所支付的現金。"],
      [
        "本欄對現金流量表投資活動的「購置不動產、廠房及設備」，單位用億元。",
        "它是氣候／環保資本支出占比的分母。氣候／環保資本支出是其中可歸類的一部分，不能大於這個購置總額。大於時勾稽會判異常。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("氣候") || gri.includes("能源署") || gri.includes("環境部") || gri.includes("IPCC"),
    source: pack(
      "金管會氣候相關資訊；經濟部能源署電力排碳係數；環境部排放係數管理表；IPCC GWP",
      [
        "金管會要求於永續報告書揭露氣候相關資訊，包含因應氣候之相關資本支出。準則沒有規定必須拆成「節能、再生能源、污染防治、其他」四個名稱，這四個名稱是本系統為了加總而設。",
        "電力排碳係數依經濟部能源署公告。燃料係數依環境部溫室氣體排放係數管理表。冷媒 GWP 依 IPCC，盤查採用的版本以主管機關規定為準。",
      ],
      [
        "資本支出填帳上可歸到氣候減緩、調適或污染防治的金額。四項在前置頁加總後帶入財務頁。",
        "係數頁的電力、油氣、冷媒係數由系統依年度與冷媒代碼帶入，用來把活動數據換成排放量。",
      ],
    ),
  },
  {
    test: (gri) => gri.includes("公司法") || gri.includes("證交法") || gri.includes("董事"),
    source: pack(
      "公司法、證券交易法與公開發行公司年報",
      ["公開發行公司應揭露董事會組成、獨立董事席次，以及董事會開會情形。獨立董事的設置依證券交易法及相關法令。"],
      [
        "董事席次、獨立董事席次填席。開會次數填當年實際開會次數。出席填各次出席人次合計。",
        "出席率＝出席人次 ÷（席次 × 開會次數）。這是年報常用算法，不是 GRI 規定的專名。",
        "獨立董事席次不能大於董事席次。",
      ],
    ),
  },
];

function articleText(code: string): string | null {
  const raw = GRI_ARTICLES[code]?.text;
  if (!raw) return null;
  const marker = "報導組織應報導以下資訊";
  const at = raw.indexOf(marker);
  if (at > 80 && !raw.slice(0, at).includes("\n要求")) {
    const heading = raw.match(/^揭露項目\s+\d+-\d+/)?.[0] ?? `揭露項目 ${code}`;
    return `${heading}\n${raw.slice(at)}`;
  }
  return raw;
}

function citedArticles(gri: string): string[] {
  const codes = [...new Set([...gri.matchAll(/\d{1,3}-\d{1,2}/g)].map((match) => match[0]))];
  if (gri.includes("GRI 306") && !codes.some((code) => code.startsWith("306-"))) codes.push("306-3");
  return codes.flatMap((code) => {
    const text = articleText(code);
    return text ? [text] : [];
  });
}

export function fieldSource(gri: string, why: string): FieldSource {
  const found = SOURCES.find((item) => item.test(gri));
  const base = found
    ? found.source
    : pack(
        gri || "本欄對應說明",
        ["此欄沒有另段公開法規全文可引用。"],
        [why || "請依公司實際資料填寫。確定沒有該項目時填 0。"],
      );
  const full = citedArticles(gri);
  if (!full.length) return base;
  const law = base.url === FSC ? base.original : [];
  return { ...base, original: [...full, ...law] };
}
