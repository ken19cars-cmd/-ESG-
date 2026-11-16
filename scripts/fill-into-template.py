import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("fillmod", ROOT / "fill-report-docx.py")
fillmod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fillmod)

TEMPLATE = Path(r"D:\110.03.02健翔\作業參考資料\ESG\永續報告書刊物\永續報告書大綱_A3橫式.docx")
BACKUP_TEMPLATE = Path(r"C:\Users\K\Projects\hanxin-esg\templates\永續報告書大綱_A3橫式.docx")


def set_run_font(run, size=14):
    run.font.size = Pt(size)
    run.font.name = "Microsoft JhengHei"
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for attr in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rFonts.set(qn(attr), "Microsoft JhengHei")


def replace_keep_format(p, text):
    if p.runs:
        p.runs[0].text = text
        for r in p.runs[1:]:
            r.text = ""
    else:
        run = p.add_run(text)
        set_run_font(run, 28)


def para_key(p):
    return p.text.strip().replace(" ", "").replace("\u3000", "")


def find_para(doc, title):
    key = title.strip().replace(" ", "").replace("\u3000", "")
    for p in doc.paragraphs:
        if para_key(p) == key:
            return p
    return None


def insert_after(paragraph, elements):
    for el in reversed(elements):
        paragraph._p.addnext(el)


INK = "1B3A4B"
GOLD = "C4A35A"
LINE = "D9D0C4"
PAPER = "FBF8F2"
ROW_ALT = "F4EFE6"
SUM_ROW = "E8EEEA"
FONT_PATH = Path(r"C:\Windows\Fonts\msjh.ttc")


def shade_cell(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)


def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    mar = OxmlElement("w:tcMar")
    for edge, val in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        mar.append(node)
    tcPr.append(mar)


def set_cell_border(cell, *, header=False, last=False):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        if edge == "bottom":
            el.set(qn("w:val"), "single")
            el.set(qn("w:sz"), "12" if header else ("18" if last else "4"))
            el.set(qn("w:color"), GOLD if header else INK if last else LINE)
        else:
            el.set(qn("w:val"), "nil")
        borders.append(el)
    tcPr.append(borders)


def write_cell(cell, text, *, header=False, align=None, size=11, bold=False, color=None, fill=None, last=False):
    p = cell.paragraphs[0]
    p.text = ""
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    if align:
        p.alignment = align
    run = p.add_run(str(text))
    set_run_font(run, size)
    run.bold = bold or header
    if header:
        run.font.color.rgb = RGBColor(0xFB, 0xF8, 0xF2)
    elif color:
        run.font.color.rgb = RGBColor.from_string(color)
    else:
        run.font.color.rgb = RGBColor(0x1B, 0x3A, 0x4B)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    set_cell_margins(cell)
    set_cell_border(cell, header=header, last=last)
    if fill:
        shade_cell(cell, fill)
    if header:
        shade_cell(cell, INK)


def para_left_bar(p, color=GOLD):
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    left = OxmlElement("w:left")
    left.set(qn("w:val"), "single")
    left.set(qn("w:sz"), "18")
    left.set(qn("w:space"), "8")
    left.set(qn("w:color"), color)
    pBdr.append(left)
    pPr.append(pBdr)


def make_caption(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.0
    para_left_bar(p)
    run = p.add_run(text)
    set_run_font(run, 11)
    run.bold = True
    run.font.color.rgb = RGBColor(0x1B, 0x3A, 0x4B)
    return p._p


def make_fig_caption(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(12)
    para_left_bar(p, GOLD)
    run = p.add_run(text)
    set_run_font(run, 10)
    run.font.color.rgb = RGBColor(0x5A, 0x4A, 0x38)
    return p._p


def make_table(doc, headers, rows, widths_cm):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.autofit = False
    tbl = table._tbl
    tblPr = tbl.tblPr
    tblW = tblPr.find(qn("w:tblW"))
    if tblW is None:
        tblW = OxmlElement("w:tblW")
        tblPr.append(tblW)
    total = int(sum(widths_cm) * 567)
    tblW.set(qn("w:w"), str(total))
    tblW.set(qn("w:type"), "dxa")
    grid = tbl.find(qn("w:tblGrid"))
    if grid is not None:
        for child in list(grid):
            grid.remove(child)
        for w in widths_cm:
            gc = OxmlElement("w:gridCol")
            gc.set(qn("w:w"), str(int(w * 567)))
            grid.append(gc)
    aligns = []
    for h in headers:
        if h in ("單位", "占比") or h.endswith("年"):
            aligns.append(WD_ALIGN_PARAGRAPH.CENTER)
        elif h in ("內容", "項目", "GRI準則", "揭露項目", "章節", "面向"):
            aligns.append(WD_ALIGN_PARAGRAPH.LEFT)
        else:
            aligns.append(WD_ALIGN_PARAGRAPH.CENTER)
    last_i = len(headers) - 1
    for i, h in enumerate(headers):
        write_cell(table.rows[0].cells[i], h, header=True, align=WD_ALIGN_PARAGRAPH.CENTER, size=9)
    n = len(rows)
    for r_i, row in enumerate(rows):
        is_sum = any("合計" in str(c) for c in row[:1])
        is_last = r_i == n - 1
        fill = SUM_ROW if is_sum else (ROW_ALT if r_i % 2 else PAPER)
        for c_i, text in enumerate(row):
            emphasize = c_i == last_i or is_sum
            write_cell(
                table.rows[r_i + 1].cells[c_i],
                text,
                align=aligns[c_i],
                size=12 if emphasize and c_i == last_i else 10,
                bold=emphasize,
                fill=fill,
                last=is_last,
            )
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(2)
    return table._tbl, spacer._p


def fold_unit_column(headers, rows, widths):
    if "單位" not in headers:
        return headers, rows, widths
    ui = headers.index("單位")
    name_i = headers.index("項目") if "項目" in headers else 0
    new_headers = [h for h in headers if h != "單位"]
    new_rows = []
    for row in rows:
        row = list(row)
        unit = str(row[ui]).strip()
        name = str(row[name_i]).strip()
        if unit and unit not in ("—", "-") and not name.endswith(f"({unit})"):
            row[name_i] = f"{name}({unit})"
        del row[ui]
        new_rows.append(row)
    new_widths = list(widths)
    extra = new_widths.pop(ui)
    new_widths[min(name_i, len(new_widths) - 1)] += extra * 0.55
    return new_headers, new_rows, new_widths


def load_font(size):
    try:
        return ImageFont.truetype(str(FONT_PATH), size)
    except OSError:
        return ImageFont.load_default()


def draw_designed_bars(path, rows, unit_note=""):
    scale = 3
    w, row_h, top, bot = 520, 36, 18, 28
    h = top + len(rows) * row_h + bot
    img = Image.new("RGB", (w * scale, h * scale), (251, 248, 242))
    draw = ImageDraw.Draw(img)
    title_font = load_font(11 * scale)
    label_font = load_font(12 * scale)
    num_font = load_font(13 * scale)
    max_v = max([1.0] + [abs(v) for _, v in rows if v == v])
    bar_x, bar_w = 168 * scale, 250 * scale
    draw.rectangle([0, 0, img.width, 3 * scale], fill=(196, 163, 90))
    for i, (name, v) in enumerate(rows):
        y = (top + i * row_h) * scale
        draw.text((16 * scale, y + 8 * scale), name, fill=(27, 58, 75), font=label_font)
        track = [bar_x, y + 10 * scale, bar_x + bar_w, y + 22 * scale]
        draw.rounded_rectangle(track, radius=6 * scale, fill=(232, 224, 210))
        val_n = v if v == v else 0
        bw = int(bar_w * (abs(val_n) / max_v))
        if bw > 0:
            draw.rounded_rectangle([track[0], track[1], track[0] + bw, track[3]], radius=6 * scale, fill=(61, 107, 120))
        label = f"{val_n:,.1f}".rstrip("0").rstrip(".")
        draw.text((bar_x + bar_w + 12 * scale, y + 7 * scale), label, fill=(27, 58, 75), font=num_font)
    if unit_note:
        draw.text((16 * scale, (h - 18) * scale), unit_note, fill=(122, 108, 90), font=title_font)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")


def draw_designed_scope(path, s1, s2):
    scale = 3
    w, h = 520, 168
    img = Image.new("RGB", (w * scale, h * scale), (251, 248, 242))
    draw = ImageDraw.Draw(img)
    num_font = load_font(22 * scale)
    label_font = load_font(11 * scale)
    small = load_font(10 * scale)
    draw.rectangle([0, 0, img.width, 3 * scale], fill=(196, 163, 90))
    tot = (s1 or 0) + (s2 or 0) or 1
    cx, cy, r = 88 * scale, 92 * scale, 58 * scale
    bbox = [cx - r, cy - r, cx + r, cy + r]
    a1 = 360 * (s1 / tot)
    draw.pieslice(bbox, start=-90, end=-90 + a1, fill=(107, 74, 58))
    draw.pieslice(bbox, start=-90 + a1, end=270, fill=(58, 90, 107))
    hole = 32 * scale
    draw.ellipse([cx - hole, cy - hole, cx + hole, cy + hole], fill=(251, 248, 242))
    draw.text((cx - 22 * scale, cy - 10 * scale), "排放", fill=(122, 108, 90), font=small)

    def card(x, title, value, rgb):
        draw.rounded_rectangle([x, 40 * scale, x + 150 * scale, 118 * scale], radius=10 * scale, fill=(255, 252, 247), outline=rgb, width=2 * scale)
        draw.rectangle([x, 40 * scale, x + 8 * scale, 118 * scale], fill=rgb)
        draw.text((x + 18 * scale, 50 * scale), title, fill=rgb, font=label_font)
        draw.text((x + 18 * scale, 74 * scale), f"{value:,.0f}", fill=(27, 58, 75), font=num_font)

    card(190 * scale, "範疇一", s1, (107, 74, 58))
    card(352 * scale, "範疇二", s2, (58, 90, 107))
    draw.text((16 * scale, 148 * scale), "單位：公噸CO2e　　內圈為範疇一／二結構", fill=(122, 108, 90), font=small)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")


def make_picture(doc, path):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run()
    run.add_picture(str(path), width=Mm(148))
    return p._p


def val(by_id, key):
    return fillmod.val(by_id, key)


def raw(by_id, key):
    return fillmod.raw(by_id, key)


def zh(by_id_extra, key, d=2):
    return fillmod.zh_fmt(by_id_extra[key], d)


def main():
    src = TEMPLATE if TEMPLATE.exists() else BACKUP_TEMPLATE
    doc = Document(str(src))
    i, metrics, by_id = fillmod.compute()
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

    replace_keep_format(doc.paragraphs[0], i["client"])
    replace_keep_format(doc.paragraphs[2], f"{i['year']}年度")

    year = i["year"]
    ycol = f"{year}年"
    charts_dir = ROOT.parent / "tmp-charts"
    charts_dir.mkdir(exist_ok=True)
    draw_designed_scope(charts_dir / "scope.png", raw(by_id, "s1"), raw(by_id, "s2"))
    draw_designed_bars(
        charts_dir / "gov.png",
        [
            ("獨立董事比率", raw(by_id, "ind")),
            ("董事會出席率", raw(by_id, "att")),
            ("反貪腐訓練比率", raw(by_id, "ac")),
        ],
        unit_note="單位：%",
    )
    draw_designed_bars(
        charts_dir / "social.png",
        [
            ("員工離職率", raw(by_id, "turn")),
            ("新進員工率", raw(by_id, "hire")),
            ("女性占結束日員工", raw(by_id, "fem")),
            ("女性占主管職", raw(by_id, "fm")),
        ],
        unit_note="單位：%",
    )

    s12 = raw(by_id, "s12") or 1
    fills = {
        "關於本報告書": {
            "caption": "表　報導基礎",
            "headers": ["項目", "內容"],
            "widths": [4.2, 12.5],
            "rows": [
                ["組織名稱", i["client"]],
                ["報導期間", f"{year}年1月1日至12月31日"],
                ["依循準則", "GRI Standards 2021；上市櫃公司編製與申報永續報告書作業辦法"],
            ],
        },
        "年度永續績效亮點": {
            "caption": "表　年度永續績效亮點",
            "headers": ["面向", "項目", "單位", ycol],
            "widths": [2.4, 6.2, 4.2, 3.2],
            "rows": [
                ["治理", "獨立董事席次比率", "%", fillmod.zh_fmt(raw(by_id, "ind"))],
                ["治理", "董事會出席率", "%", fillmod.zh_fmt(raw(by_id, "att"))],
                ["環境", "範疇一＋二排放量", "公噸CO2e", fillmod.zh_fmt(raw(by_id, "s12"))],
                ["環境", "排放密集度", "公噸CO2e／百萬元營收", fillmod.zh_fmt(raw(by_id, "int"))],
                ["環境", "再生能源占外購電力", "%", fillmod.zh_fmt(raw(by_id, "ren"))],
                ["社會", "員工離職率", "%", fillmod.zh_fmt(raw(by_id, "turn"))],
                ["社會", "平均每位員工受訓時數", "小時", fillmod.zh_fmt(raw(by_id, "tr"))],
            ],
        },
        "1.1.3 營運與財務績效": {
            "caption": "表1-1　營運與財務績效",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["合併營收", "百萬元", fillmod.zh_fmt(i["revenueMillion"])],
                ["氣候／環保相關資本支出占比", "%", fillmod.zh_fmt(raw(by_id, "grn"))],
                ["高階薪酬中永續相關權重", "%", fillmod.zh_fmt(i["esgWeight"])],
            ],
        },
        "2.1.1 董事會": {
            "caption": "表2-1　董事會組成與運作",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["董事席次", "席", fillmod.zh_fmt(i["boardSeats"], 0)],
                ["獨立董事席次", "席", fillmod.zh_fmt(i["independentSeats"], 0)],
                ["獨立董事席次比率", "%", fillmod.zh_fmt(raw(by_id, "ind"))],
                ["董事會出席率", "%", fillmod.zh_fmt(raw(by_id, "att"))],
            ],
        },
        "2.2.2 反貪腐": {
            "caption": "表2-2　反貪腐訓練",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [["已完成反貪腐訓練比率", "%", fillmod.zh_fmt(raw(by_id, "ac"))]],
        },
        "2.4.1 資訊安全": {
            "caption": "表2-3　顧客隱私相關申訴",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [["經證實之客戶個資申訴", "件", fillmod.zh_fmt(i["infoSecIncidents"], 0)]],
        },
        "3.1.4 指標與目標": {
            "caption": "表3-1　氣候相關指標與目標",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.5, 3.5],
            "rows": [
                ["溫室氣體排放密集度（實際）", "公噸CO2e／百萬元營收", fillmod.zh_fmt(raw(by_id, "int"))],
                ["溫室氣體排放密集度（目標）", "公噸CO2e／百萬元營收", fillmod.zh_fmt(i["intensityTarget"])],
            ],
        },
        "3.2.2 Scope 1／2／3": {
            "caption": "表3-2　溫室氣體排放量",
            "headers": ["項目", "單位", ycol, "占比"],
            "widths": [5.2, 3.6, 3.6, 3.2],
            "rows": [
                ["範疇一", "公噸CO2e", fillmod.zh_fmt(raw(by_id, "s1")), f"{fillmod.zh_fmt(raw(by_id, 's1') / s12 * 100)}%"],
                ["範疇二", "公噸CO2e", fillmod.zh_fmt(raw(by_id, "s2")), f"{fillmod.zh_fmt(raw(by_id, 's2') / s12 * 100)}%"],
                ["範疇一＋二合計", "公噸CO2e", fillmod.zh_fmt(raw(by_id, "s12")), "100%"],
                ["範疇三", "公噸CO2e", fillmod.zh_fmt(raw(by_id, "s3")), "—"],
            ],
        },
        "3.3.1 能源消耗": {
            "caption": "表3-3　能源使用",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["組織內能源消耗", "吉焦耳", fillmod.zh_fmt(raw(by_id, "en"))],
                ["能源密集度", "吉焦耳／百萬元營收", fillmod.zh_fmt(raw(by_id, "eni"))],
                ["再生能源占外購電力", "%", fillmod.zh_fmt(raw(by_id, "ren"))],
            ],
        },
        "3.4.1 取水與用水": {
            "caption": "表3-4　水資源",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.5, 3.5],
            "rows": [
                ["取水密集度", "千噸／百萬元營收", fillmod.zh_fmt(raw(by_id, "wint"))],
                ["耗水（取水減放流）", "千噸", fillmod.zh_fmt(raw(by_id, "wuse"))],
            ],
        },
        "3.5.1 廢棄物產生與處理": {
            "caption": "表3-5　廢棄物",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["有害廢棄物占產生量", "%", fillmod.zh_fmt(raw(by_id, "haz"))],
                ["從處置移轉之廢棄物占比", "%", fillmod.zh_fmt(raw(by_id, "rec"))],
            ],
        },
        "4.1.1 供應商管理": {
            "caption": "表4-1　供應商篩選",
            "headers": ["項目", "單位", ycol],
            "widths": [9.0, 3.8, 3.2],
            "rows": [["以環境或社會準則篩選之供應商比率", "%", fillmod.zh_fmt(raw(by_id, "sup"))]],
        },
        "5.1.1 員工組成": {
            "caption": "表5-1　人力結構",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["報導期間結束日員工總數", "人", fillmod.zh_fmt(i["headcountEnd"], 0)],
                ["報導期間平均員工數", "人", fillmod.zh_fmt(i["headcountAvg"], 0)],
                ["員工離職率", "%", fillmod.zh_fmt(raw(by_id, "turn"))],
                ["新進員工率", "%", fillmod.zh_fmt(raw(by_id, "hire"))],
                ["女性占結束日員工", "%", fillmod.zh_fmt(raw(by_id, "fem"))],
                ["身心障礙者占結束日員工", "%", fillmod.zh_fmt(raw(by_id, "dis"))],
                ["女性占主管職", "%", fillmod.zh_fmt(raw(by_id, "fm"))],
            ],
        },
        "5.1.3 薪酬與福利": {
            "caption": "表5-2　薪酬",
            "headers": ["項目", "單位", ycol],
            "widths": [8.2, 4.4, 3.4],
            "rows": [
                ["最高薪酬對中位數之倍數", "倍", fillmod.zh_fmt(raw(by_id, "pay"))],
                ["女性對男性薪酬比", "倍", fillmod.zh_fmt(raw(by_id, "gp"))],
            ],
        },
        "5.2.1 訓練": {
            "caption": "表5-3　訓練",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [
                ["平均每位員工受訓時數", "小時", fillmod.zh_fmt(raw(by_id, "tr"))],
                ["女性平均受訓時數", "小時", fillmod.zh_fmt(raw(by_id, "trf"))],
            ],
        },
        "5.2.2 績效考核與職能發展": {
            "caption": "表5-4　定期績效考核",
            "headers": ["項目", "單位", ycol],
            "widths": [8.4, 4.2, 3.4],
            "rows": [["接受定期績效考核之員工比率", "%", fillmod.zh_fmt(raw(by_id, "rev"))]],
        },
        "5.4.3 職業傷害統計": {
            "caption": "表5-5　職業傷害統計",
            "headers": ["項目", "單位", ycol],
            "widths": [7.2, 5.4, 3.4],
            "rows": [
                ["失能傷害頻率", "／百萬工時", fillmod.zh_fmt(raw(by_id, "fr"))],
                ["失能傷害嚴重率", "／百萬工時", fillmod.zh_fmt(raw(by_id, "sr"))],
                ["可記錄職業傷害率", "／百萬工時", fillmod.zh_fmt(raw(by_id, "trir"))],
                ["育嬰留停後復職率", "%", fillmod.zh_fmt(raw(by_id, "par"))],
            ],
        },
        "6.1 社會關懷": {
            "caption": "表6-1　社會投入",
            "headers": ["項目", "單位", ycol],
            "widths": [7.5, 5.0, 3.5],
            "rows": [["基礎設施投資與公益捐贈", "億元", fillmod.zh_fmt(i["communitySpend"])]],
        },
        "附錄一　GRI 內容索引": {
            "caption": "表A-1　GRI內容索引",
            "headers": ["GRI準則", "揭露項目", "章節"],
            "widths": [5.0, 7.2, 4.0],
            "rows": [
                [m[4], m[1], {"E": "第3章 環境永續", "S": "第5章 員工與人權", "G": "第2章 公司治理"}.get(m[5], "")]
                for m in metrics
                if str(m[4]).startswith(("GRI", "金管會", "證交法", "勞動部"))
            ],
        },
    }
    pictures = {
        "2.1.1 董事會": [(charts_dir / "gov.png", "圖2-1　董事會與誠信相關比率")],
        "3.2.2 Scope 1／2／3": [(charts_dir / "scope.png", "圖3-1　範疇一與範疇二排放結構")],
        "5.1.1 員工組成": [(charts_dir / "social.png", "圖5-1　人力結構相關比率")],
    }
    titles = list(dict.fromkeys([*fills.keys(), *pictures.keys()]))

    for title in titles:
        p = find_para(doc, title)
        if p is None:
            print("MISSING", title)
            continue
        extras = []
        spec = fills.get(title)
        if spec and spec.get("rows"):
            extras.append(make_caption(doc, spec["caption"]))
            headers, rows, widths = fold_unit_column(spec["headers"], spec["rows"], spec["widths"])
            tbl, spacer = make_table(doc, headers, rows, widths)
            extras.extend([tbl, spacer])
        for img, cap in pictures.get(title, []):
            extras.append(make_picture(doc, img))
            extras.append(make_fig_caption(doc, cap))
        if extras:
            insert_after(p, extras)

    name = f"{i['client']}_{i['year']}_永續報告書_計算帶入.docx"
    alt = f"{i['client']}_{i['year']}_永續報告書_計算帶入_論述.docx"
    folder = Path(r"D:\110.03.02健翔\作業參考資料\ESG\永續報告書刊物")
    targets = [
        folder / name,
        folder / alt,
        ROOT.parent / "templates" / name,
    ]
    for path in targets:
        try:
            doc.save(path)
            print("OK", path)
        except OSError as e:
            print("FAIL", path, e)


if __name__ == "__main__":
    main()
