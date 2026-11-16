import importlib.util
import math
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("outline_mod", ROOT / "build-outline-docx.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

FONT_PATH = Path(r"C:\Windows\Fonts\msjh.ttc")
BAR = (0x4A, 0x6B, 0x8A)
TRACK = (0xEE, 0xEE, 0xEE)
STROKE = (0x99, 0x99, 0x99)
S1 = (0x6B, 0x4A, 0x3A)
S2 = (0x3A, 0x5A, 0x6B)
HEADER = "2C3B4E"


def n(v):
    try:
        x = float(v)
    except (TypeError, ValueError):
        return 0.0
    return x if math.isfinite(x) else 0.0


def fmt(v, d=2):
    if v is None or not math.isfinite(v):
        return "—"
    s = f"{v:,.{d}f}".rstrip("0").rstrip(".")
    return s


def zh_fmt(v, d=2):
    if not math.isfinite(v):
        return "—"
    s = f"{v:,.{d}f}".rstrip("0").rstrip(".")
    return s if s else "0"


def compute():
    i = {
        "client": "綠能精密股份有限公司（示範）",
        "year": "2025",
        "revenueMillion": 12840,
        "electricityKwh": 18600000,
        "renewableKwh": 5208000,
        "dieselLiter": 420000,
        "gasolineLiter": 38000,
        "lngM3": 210000,
        "refrigerantKg": 42,
        "steamGj": 1200,
        "scope3": 18400,
        "waterKt": 18,
        "wastewaterKt": 14.2,
        "wasteT": 920,
        "wasteRecycledT": 754,
        "wasteHazardT": 36,
        "totalCapex": 6.4,
        "headcountEnd": 1280,
        "headcountAvg": 1264,
        "headcountFemale": 486,
        "headcountDisabled": 16,
        "newHires": 148,
        "leavers": 142,
        "trainingHours": 35392,
        "trainingFemaleHours": 12800,
        "workHours": 2550000,
        "disablingInjuries": 0,
        "lostDays": 0,
        "recordableInjuries": 2,
        "parentalDue": 18,
        "parentalReturn": 17,
        "femaleManagers": 42,
        "totalManagers": 168,
        "unionCovered": 0,
        "dueReview": 1264,
        "doneReview": 1264,
        "withEsgKpi": 86,
        "humanRightsTrained": 1200,
        "supplierCount": 220,
        "supplierScreened": 200,
        "communitySpend": 0.12,
        "boardSeats": 7,
        "independentSeats": 3,
        "boardMeetings": 8,
        "boardAttend": 54,
        "antiCorruptDue": 1280,
        "antiCorruptDone": 1280,
        "infoSecIncidents": 0,
        "businessTarget": 120,
        "businessActual": 128.4,
        "esgTargetScore": 100,
        "esgActualScore": 92,
        "bonusPool": 1800,
        "highestPay": 1280,
        "medianPay": 112,
        "femalePay": 108,
        "malePay": 116,
        "execFinPoints": 70,
        "execEsgPoints": 15,
        "execOtherPoints": 15,
        "capexEnergySave": 0.8,
        "capexRenewable": 0.5,
        "capexPollution": 0.2,
        "capexOtherGreen": 0.1,
        "intensityTarget": 3.5,
    }
    exec_total = n(i["execFinPoints"]) + n(i["execEsgPoints"]) + n(i["execOtherPoints"])
    i["esgWeight"] = (n(i["execEsgPoints"]) / exec_total) * 100 if exec_total else 0
    i["greenCapex"] = n(i["capexEnergySave"]) + n(i["capexRenewable"]) + n(i["capexPollution"]) + n(i["capexOtherGreen"])
    i["efElectricity"] = 0.466
    i["efDiesel"] = 2.606
    i["efGasoline"] = 2.263
    i["efLng"] = 2.18
    i["gwpRefrigerant"] = 1300

    s1 = (n(i["dieselLiter"]) * n(i["efDiesel"]) + n(i["gasolineLiter"]) * n(i["efGasoline"]) + n(i["lngM3"]) * n(i["efLng"])) / 1000
    s1 += (n(i["refrigerantKg"]) * n(i["gwpRefrigerant"])) / 1000
    s2 = (n(i["electricityKwh"]) * n(i["efElectricity"])) / 1000
    s12 = s1 + s2
    s123 = s12 + n(i["scope3"])
    rev = n(i["revenueMillion"])
    intensity = s12 / rev if rev else float("nan")
    ren = n(i["renewableKwh"]) / n(i["electricityKwh"]) * 100 if n(i["electricityKwh"]) else float("nan")
    en = n(i["electricityKwh"]) * 0.0036 + n(i["steamGj"]) + n(i["dieselLiter"]) * 0.0386 + n(i["gasolineLiter"]) * 0.0342
    eni = en / rev if rev else float("nan")
    wint = n(i["waterKt"]) / rev if rev else float("nan")
    wuse = n(i["waterKt"]) - n(i["wastewaterKt"])
    rec = n(i["wasteRecycledT"]) / n(i["wasteT"]) * 100 if n(i["wasteT"]) else float("nan")
    haz = n(i["wasteHazardT"]) / n(i["wasteT"]) * 100 if n(i["wasteT"]) else float("nan")
    grn = n(i["greenCapex"]) / n(i["totalCapex"]) * 100 if n(i["totalCapex"]) else float("nan")
    avg = n(i["headcountAvg"])
    end = n(i["headcountEnd"])
    turn = n(i["leavers"]) / avg * 100 if avg else float("nan")
    hire = n(i["newHires"]) / avg * 100 if avg else float("nan")
    fem = n(i["headcountFemale"]) / end * 100 if end else float("nan")
    dis = n(i["headcountDisabled"]) / end * 100 if end else float("nan")
    tr = n(i["trainingHours"]) / avg if avg else float("nan")
    trf = n(i["trainingFemaleHours"]) / n(i["headcountFemale"]) if n(i["headcountFemale"]) else float("nan")
    wh = n(i["workHours"])
    fr = n(i["disablingInjuries"]) * 1e6 / wh if wh else float("nan")
    sr = n(i["lostDays"]) * 1e6 / wh if wh else float("nan")
    trir = n(i["recordableInjuries"]) * 1e6 / wh if wh else float("nan")
    par = n(i["parentalReturn"]) / n(i["parentalDue"]) * 100 if n(i["parentalDue"]) else float("nan")
    fm = n(i["femaleManagers"]) / n(i["totalManagers"]) * 100 if n(i["totalManagers"]) else float("nan")
    un = n(i["unionCovered"]) / end * 100 if end else float("nan")
    hrt = n(i["humanRightsTrained"]) / end * 100 if end else float("nan")
    sup = n(i["supplierScreened"]) / n(i["supplierCount"]) * 100 if n(i["supplierCount"]) else float("nan")
    revc = n(i["doneReview"]) / n(i["dueReview"]) * 100 if n(i["dueReview"]) else float("nan")
    ek = n(i["withEsgKpi"]) / end * 100 if end else float("nan")
    biz = n(i["businessActual"]) / n(i["businessTarget"]) * 100 if n(i["businessTarget"]) else float("nan")
    eh = n(i["esgActualScore"]) / n(i["esgTargetScore"]) * 100 if n(i["esgTargetScore"]) else float("nan")
    w = min(max(n(i["esgWeight"]), 0), 100) / 100
    wtd = (1 - w) * (biz if math.isfinite(biz) else 0) + w * (eh if math.isfinite(eh) else 0)
    bon = n(i["bonusPool"]) * w * ((eh if math.isfinite(eh) else 0) / 100)
    pay = n(i["highestPay"]) / n(i["medianPay"]) if n(i["medianPay"]) else float("nan")
    gp = n(i["femalePay"]) / n(i["malePay"]) if n(i["malePay"]) else float("nan")
    ind = n(i["independentSeats"]) / n(i["boardSeats"]) * 100 if n(i["boardSeats"]) else float("nan")
    att = n(i["boardAttend"]) / (n(i["boardSeats"]) * n(i["boardMeetings"])) * 100 if n(i["boardSeats"]) * n(i["boardMeetings"]) else float("nan")
    ac = n(i["antiCorruptDone"]) / n(i["antiCorruptDue"]) * 100 if n(i["antiCorruptDue"]) else float("nan")

    metrics = [
        ("s1", "Scope 1", s1, "tCO2e", "GRI 305-1", "E"),
        ("s2", "Scope 2", s2, "tCO2e", "GRI 305-2", "E"),
        ("s12", "Scope 1+2", s12, "tCO2e", "金管會排放量", "E"),
        ("s3", "Scope 1+2+3", s123, "tCO2e", "GRI 305-3", "E"),
        ("int", "排放密集度", intensity, "tCO2e／百萬營收", "金管會；GRI 305-4", "E"),
        ("ren", "再生能源電力比", ren, "%", "GRI 302-1", "E"),
        ("en", "能源使用", en, "GJ", "GRI 302-1", "E"),
        ("eni", "能源密集度", eni, "GJ／百萬營收", "GRI 302-3", "E"),
        ("wint", "用水密集度", wint, "千噸／百萬營收", "GRI 303", "E"),
        ("wuse", "耗水量(簡化)", wuse, "千噸", "GRI 303-5", "E"),
        ("rec", "廢棄物回收率", rec, "%", "GRI 306", "E"),
        ("haz", "有害廢棄物比", haz, "%", "GRI 306", "E"),
        ("grn", "綠色資本支出比", grn, "%", "投資揭露", "E"),
        ("turn", "員工離職率", turn, "%", "GRI 401-1", "S"),
        ("hire", "新進率", hire, "%", "GRI 401-1", "S"),
        ("fem", "女性占比", fem, "%", "GRI 405-1", "S"),
        ("dis", "身障占比", dis, "%", "GRI 405-1", "S"),
        ("tr", "人均訓練", tr, "小時", "GRI 404-1", "S"),
        ("trf", "女性人均訓練", trf, "小時", "GRI 404-1", "S"),
        ("fr", "FR 失能傷害頻率", fr, "／百萬工時", "GRI 403-9", "S"),
        ("sr", "SR 嚴重率", sr, "／百萬工時", "GRI 403-9", "S"),
        ("trir", "TRIR", trir, "／百萬工時", "GRI 403-9", "S"),
        ("par", "育嬰復職率", par, "%", "GRI 401-3", "S"),
        ("fm", "女性主管比", fm, "%", "GRI 405-1", "S"),
        ("un", "團體協約覆蓋", un, "%", "GRI 2-30", "S"),
        ("hrt", "人權訓練覆蓋", hrt, "%", "GRI 2-24", "S"),
        ("sup", "供應商ESG評鑑覆蓋", sup, "%", "GRI 308／414", "S"),
        ("rev", "考核覆蓋率", revc, "%", "GRI 404-3", "S"),
        ("ek", "納入ESG KPI員工比", ek, "%", "實務守則§9", "S"),
        ("biz", "業務目標達成率", biz, "%", "內部績效", "S"),
        ("eh", "ESG KPI達成率", eh, "%", "GRI 2-19", "S"),
        ("wtd", "加權績效達成率", wtd, "%", "獎金", "S"),
        ("bon", "ESG連動獎金", bon, "萬元", "GRI 2-19", "G"),
        ("pay", "最高薪／中位數", pay, "倍", "GRI 2-21", "G"),
        ("gp", "女／男薪酬比", gp, "倍", "GRI 405-2", "G"),
        ("ind", "獨立董事比", ind, "%", "證交法／評鑑", "G"),
        ("att", "董事會出席率", att, "%", "議事錄", "G"),
        ("ac", "反貪腐訓練覆蓋", ac, "%", "GRI 205-2", "G"),
    ]
    by_id = {m[0]: m for m in metrics}
    return i, metrics, by_id


def val(by_id, key):
    m = by_id[key]
    return (m[1], zh_fmt(m[2]), m[3])


def raw(by_id, key):
    return by_id[key][2]


def shade_cell(cell, fill, color="FFFFFF", bold=True):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)
    for p in cell.paragraphs:
        for run in p.runs:
            run.bold = bold
            run.font.color.rgb = RGBColor.from_string(color)
            run.font.size = Pt(12)
            run.font.name = "Microsoft JhengHei"
            mod.set_east_asia_font(run)


def set_cell_border(cell):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:color"), "888888")
        tcBorders.append(el)
    tcPr.append(tcBorders)


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.autofit = True
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        set_cell_border(cell)
        shade_cell(cell, HEADER)
    for r_i, row in enumerate(rows):
        for c_i, text in enumerate(row):
            cell = table.rows[r_i + 1].cells[c_i]
            cell.text = str(text)
            set_cell_border(cell)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(12)
                    run.font.name = "Microsoft JhengHei"
                    mod.set_east_asia_font(run)
    doc.add_paragraph("")
    return table


def load_font(size):
    try:
        return ImageFont.truetype(str(FONT_PATH), size)
    except OSError:
        return ImageFont.load_default()


def draw_bar_chart(path, title, rows, *, show_title=True, compact=False):
    scale = 2
    row_h = 20 if compact else 22
    top = 8 if not show_title else 24
    h = max(72, len(rows) * row_h + top + 8)
    width = 420 if compact else 560
    img = Image.new("RGB", (width * scale, h * scale), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    font = load_font(10 * scale)
    title_font = load_font(12 * scale)
    if show_title and not compact:
        draw.rectangle([0, 0, img.width - 1, img.height - 1], outline=(204, 204, 204), width=scale)
        draw.text((8 * scale, 6 * scale), title, fill=(17, 17, 17), font=title_font)
    max_v = max([1.0] + [abs(v) for _, v in rows if math.isfinite(v)])
    label_w = 108 if compact else 148
    bar_w = 220 if compact else 360
    for i, (name, v) in enumerate(rows):
        val_n = v if math.isfinite(v) else 0
        w = (abs(val_n) / max_v) * bar_w
        y = top + i * row_h
        draw.text((4 * scale, (y + 2) * scale), name, fill=(34, 34, 34), font=font)
        x1, y1 = label_w * scale, (y + 1) * scale
        x2, y2 = (label_w + bar_w) * scale, (y + 11) * scale
        draw.rectangle([x1, y1, x2, y2], fill=TRACK, outline=STROKE)
        if w > 0:
            draw.rectangle([x1, y1, (label_w + w) * scale, y2], fill=BAR)
        label = f"{val_n:.1f}" if math.isfinite(v) else "—"
        draw.text(((label_w + bar_w + 8) * scale, (y + 2) * scale), label, fill=(17, 17, 17), font=font)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def draw_scope_bar(path, s1, s2, *, show_title=True):
    tot = (s1 or 0) + (s2 or 0) or 1
    scale = 2
    w, h = (420 * scale, 48 * scale) if not show_title else (520 * scale, 56 * scale)
    img = Image.new("RGB", (w, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    font = load_font(11 * scale)
    title_font = load_font(12 * scale)
    y = 16 * scale if not show_title else 28 * scale
    if show_title:
        draw.text((8 * scale, 4 * scale), "範疇一／二結構（公噸CO2e）", fill=(17, 17, 17), font=title_font)
    x = 8 * scale
    bar_w = w - 16 * scale
    bar_h = 22 * scale
    w1 = bar_w * (s1 / tot)
    draw.rectangle([x, y, x + bar_w, y + bar_h], outline=(136, 136, 136))
    draw.rectangle([x, y, x + w1, y + bar_h], fill=S1)
    draw.rectangle([x + w1, y, x + bar_w, y + bar_h], fill=S2)
    s1_txt = f"範疇一 {s1:,.0f}"
    s2_txt = f"範疇二 {s2:,.0f}"
    draw.text((x + 8, y + 3), s1_txt, fill=(255, 255, 255), font=font)
    if w1 < bar_w - 80 * scale:
        draw.text((x + w1 + 8, y + 3), s2_txt, fill=(255, 255, 255), font=font)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def add_picture(doc, path):
    p = doc.add_paragraph()
    run = p.add_run()
    run.add_picture(str(path), width=Mm(230))


def write_branch(doc, items, level, by_id, charts_dir):
    for item in items:
        if isinstance(item, tuple):
            title, children = item
            doc.add_heading(title, level=level)
            fill_heading(doc, title, by_id, charts_dir)
            write_branch(doc, children, level + 1, by_id, charts_dir)
        else:
            doc.add_heading(item, level=level)
            fill_heading(doc, item, by_id, charts_dir)


def fill_heading(doc, title, by_id, charts_dir):
    tables = {
        "關於本報告書": [
            ["組織名稱", by_id["_client"], ""],
            ["報導期間", f"{by_id['_year']}年1月1日至12月31日", ""],
            ["依循準則", "GRI Standards 2021；上市櫃永續報告書作業辦法", ""],
        ],
        "年度永續績效亮點": [
            val(by_id, "s12"),
            val(by_id, "int"),
            val(by_id, "ren"),
            val(by_id, "turn"),
            val(by_id, "tr"),
            val(by_id, "ind"),
            val(by_id, "att"),
            val(by_id, "eh"),
        ],
        "1.1.3 營運與財務績效": [
            ("合併營收", zh_fmt(by_id["_rev"]), "百萬元"),
            val(by_id, "grn"),
            ("高階ESG權重", zh_fmt(by_id["_w"]), "%"),
        ],
        "2.1.1 董事會": [
            ("董事席次", zh_fmt(by_id["_seats"], 0), "席"),
            ("獨立董事", zh_fmt(by_id["_indseats"], 0), "席"),
            val(by_id, "ind"),
            val(by_id, "att"),
        ],
        "2.2.2 反貪腐": [val(by_id, "ac")],
        "2.4.1 資訊安全": [("資安事件", zh_fmt(by_id["_sec"], 0), "件")],
        "2.5 稅務治理": [],
        "3.1.4 指標與目標": [val(by_id, "int"), ("密集度目標", zh_fmt(by_id["_intt"]), "tCO2e／百萬營收")],
        "3.2.2 Scope 1／2／3": [val(by_id, "s1"), val(by_id, "s2"), val(by_id, "s12"), val(by_id, "s3")],
        "3.2.3 密集度與減量": [val(by_id, "int")],
        "3.3.1 能源消耗": [val(by_id, "en")],
        "3.3.2 能源密集度": [val(by_id, "eni")],
        "3.3.3 再生能源與節能": [val(by_id, "ren")],
        "3.4.1 取水與用水": [val(by_id, "wint")],
        "3.4.2 廢水與耗水": [val(by_id, "wuse")],
        "3.5.1 廢棄物產生與處理": [val(by_id, "haz")],
        "3.5.2 回收與減量": [val(by_id, "rec")],
        "4.1.1 供應商管理": [val(by_id, "sup")],
        "5.1.1 員工組成": [val(by_id, "turn"), val(by_id, "hire"), val(by_id, "fem"), val(by_id, "dis")],
        "5.1.3 薪酬與福利": [val(by_id, "pay"), val(by_id, "gp"), val(by_id, "bon")],
        "5.2.1 訓練": [val(by_id, "tr"), val(by_id, "trf")],
        "5.2.2 績效考核與職能發展": [val(by_id, "rev"), val(by_id, "ek"), val(by_id, "biz"), val(by_id, "eh"), val(by_id, "wtd")],
        "5.3.2 申訴機制": [val(by_id, "hrt")],
        "5.4.3 職業傷害統計": [val(by_id, "fr"), val(by_id, "sr"), val(by_id, "trir"), val(by_id, "par"), val(by_id, "fm")],
        "6.1 社會關懷": [("社區／公益支出", zh_fmt(by_id["_comm"]), "億元")],
    }
    rows = tables.get(title)
    if rows:
        add_table(doc, ["項目", "數值", "單位"], rows)

    if title == "年度永續績效亮點":
        pct = [(m[1], m[2]) for m in by_id["_all"] if m[3] == "%"]
        p = charts_dir / "pct.png"
        draw_bar_chart(p, "全部比率指標（%）", pct)
        add_picture(doc, p)
    if title == "3.3.3 再生能源與節能":
        p = charts_dir / "env.png"
        draw_bar_chart(
            p,
            "環境絕對值",
            [
                ("Scope 1 tCO2e", raw(by_id, "s1")),
                ("Scope 2 tCO2e", raw(by_id, "s2")),
                ("密集度", raw(by_id, "int")),
                ("能源 GJ", raw(by_id, "en")),
                ("用水密集度", raw(by_id, "wint")),
                ("耗水 千噸", raw(by_id, "wuse")),
            ],
        )
        add_picture(doc, p)
        p2 = charts_dir / "scope.png"
        draw_scope_bar(p2, raw(by_id, "s1"), raw(by_id, "s2"))
        add_picture(doc, p2)
    if title == "2.1.3 治理實務":
        p = charts_dir / "gov.png"
        draw_bar_chart(
            p,
            "治理／薪酬",
            [
                ("獨董比%", raw(by_id, "ind")),
                ("出席率%", raw(by_id, "att")),
                ("反貪腐%", raw(by_id, "ac")),
                ("考核覆蓋%", raw(by_id, "rev")),
                ("ESG KPI員工%", raw(by_id, "ek")),
                ("業務達成%", raw(by_id, "biz")),
                ("ESG達成%", raw(by_id, "eh")),
                ("最高薪倍數", raw(by_id, "pay")),
                ("女男薪酬比", raw(by_id, "gp")),
            ],
        )
        add_picture(doc, p)
    if title == "5.4.3 職業傷害統計":
        p = charts_dir / "social.png"
        draw_bar_chart(
            p,
            "社會／職安",
            [
                ("離職率%", raw(by_id, "turn")),
                ("新進率%", raw(by_id, "hire")),
                ("人均訓練 h", raw(by_id, "tr")),
                ("FR", raw(by_id, "fr")),
                ("SR", raw(by_id, "sr")),
                ("TRIR", raw(by_id, "trir")),
                ("育嬰復職%", raw(by_id, "par")),
                ("女性主管%", raw(by_id, "fm")),
            ],
        )
        add_picture(doc, p)
    if title == "附錄一　GRI 內容索引":
        add_table(
            doc,
            ["揭露", "主題", "數值", "單位"],
            [[m[4], m[1], zh_fmt(m[2]), m[3]] for m in by_id["_all"]],
        )


def main():
    i, metrics, by_id = compute()
    by_id["_client"] = i["client"]
    by_id["_year"] = i["year"]
    by_id["_rev"] = i["revenueMillion"]
    by_id["_w"] = i["esgWeight"]
    by_id["_seats"] = i["boardSeats"]
    by_id["_indseats"] = i["independentSeats"]
    by_id["_sec"] = i["infoSecIncidents"]
    by_id["_intt"] = i["intensityTarget"]
    by_id["_comm"] = i["communitySpend"]
    by_id["_all"] = metrics

    charts_dir = ROOT.parent / "tmp-charts"
    doc = Document()
    normal = doc.styles["Normal"]
    mod.style_font(normal, 14, False, RGBColor(0x1A, 0x1A, 0x1A), 0, 6)
    mod.style_font(doc.styles["Heading 1"], 24, True, mod.NAVY, 0, 10)
    mod.style_font(doc.styles["Heading 2"], 16, True, mod.NAVY2, 12, 4)
    mod.style_font(doc.styles["Heading 3"], 14, True, mod.NAVY3, 6, 3)
    for name in ("TOC 1", "TOC 2", "TOC 3"):
        try:
            mod.style_font(doc.styles[name], 14, False, RGBColor(0x1A, 0x1A, 0x1A), 0, 4)
        except KeyError:
            pass

    cover = doc.sections[0]
    mod.a3_landscape(cover)
    mod.add_page_number(cover)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    mod.add_heading_run(p, "永續報告書", 48, mod.NAVY)
    p.paragraph_format.space_after = Pt(20)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    mod.add_heading_run(p, i["client"], 28, mod.NAVY)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    mod.add_heading_run(p, f"{i['year']}年度", 28, mod.NAVY)

    mod.next_section(doc)
    toc_title = doc.add_paragraph()
    mod.add_heading_run(toc_title, "目錄", 24, mod.NAVY)
    toc_title.paragraph_format.space_after = Pt(12)
    toc_p = doc.add_paragraph()
    mod.add_toc(toc_p)

    for title, children in mod.outline:
        mod.next_section(doc)
        doc.add_heading(title, level=1)
        fill_heading(doc, title, by_id, charts_dir)
        write_branch(doc, children, 2, by_id, charts_dir)

    for idx, section in enumerate(doc.sections):
        mod.a3_landscape(section, next_page=idx > 0)

    name = f"{i['client']}_{i['year']}_永續報告書_計算帶入.docx".replace("/", "")
    targets = [
        ROOT.parent / "templates" / name,
        Path(r"D:\110.03.02健翔\作業參考資料\ESG\永續報告書刊物") / name,
    ]
    for path in targets:
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            doc.save(path)
            print("OK", path)
        except OSError as e:
            print("FAIL", path, e)


if __name__ == "__main__":
    main()
