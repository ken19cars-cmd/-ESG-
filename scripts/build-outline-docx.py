from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT, WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

NAVY = RGBColor(0x2C, 0x3B, 0x4E)
NAVY2 = RGBColor(0x3D, 0x4F, 0x61)
NAVY3 = RGBColor(0x4A, 0x5A, 0x6A)
FONT = "Microsoft JhengHei"

outline = [
    ("關於本報告書", ["編撰原則與依循準則", "報導期間與發行週期", "報導邊界與範疇", "資訊重編", "內部審閱", "外部確信", "聯絡窗口"]),
    ("經營者的話", ["當年度策略與承諾", "下一年度重點"]),
    ("年度永續績效亮點", ["治理", "環境", "社會"]),
    (
        "第1章　永續治理",
        [
            ("1.1 組織概況", ["1.1.1 公司簡介", "1.1.2 業務與價值鏈", "1.1.3 營運與財務績效", "1.1.4 外部倡議與公協會"]),
            ("1.2 永續治理架構", ["1.2.1 董事會監督", "1.2.2 永續委員會", "1.2.3 永續策略與目標"]),
            ("1.3 重大主題與利害關係人", ["1.3.1 利害關係人鑑別", "1.3.2 議合管道", "1.3.3 重大主題鑑別", "1.3.4 重大主題與管理方針"]),
        ],
    ),
    (
        "第2章　公司治理",
        [
            ("2.1 治理架構", ["2.1.1 董事會", "2.1.2 功能性委員會", "2.1.3 治理實務"]),
            ("2.2 誠信經營與法規遵循", ["2.2.1 誠信經營", "2.2.2 反貪腐", "2.2.3 法令遵循"]),
            ("2.3 風險管理與內控", ["2.3.1 風險管理", "2.3.2 內部控制"]),
            ("2.4 資訊安全與隱私", ["2.4.1 資訊安全", "2.4.2 個人資料保護"]),
            "2.5 稅務治理",
        ],
    ),
    (
        "第3章　環境永續",
        [
            ("3.1 氣候變遷", ["3.1.1 治理", "3.1.2 策略", "3.1.3 風險管理", "3.1.4 指標與目標"]),
            ("3.2 溫室氣體", ["3.2.1 盤查邊界與方法學", "3.2.2 Scope 1／2／3", "3.2.3 密集度與減量"]),
            ("3.3 能源管理", ["3.3.1 能源消耗", "3.3.2 能源密集度", "3.3.3 再生能源與節能"]),
            ("3.4 水資源", ["3.4.1 取水與用水", "3.4.2 廢水與耗水"]),
            ("3.5 廢棄物與循環", ["3.5.1 廢棄物產生與處理", "3.5.2 回收與減量"]),
        ],
    ),
    (
        "第4章　供應鏈與產品責任",
        [
            ("4.1 永續供應鏈", ["4.1.1 供應商管理", "4.1.2 環境評估", "4.1.3 社會評估"]),
            ("4.2 產品與服務", ["4.2.1 品質與安全", "4.2.2 行銷與標示"]),
            ("4.3 顧客權益", ["4.3.1 顧客服務", "4.3.2 客訴與滿意度"]),
        ],
    ),
    (
        "第5章　員工與人權",
        [
            ("5.1 人力結構與勞動條件", ["5.1.1 員工組成", "5.1.2 多元化與平等機會", "5.1.3 薪酬與福利", "5.1.4 勞資溝通"]),
            ("5.2 人才培育", ["5.2.1 訓練", "5.2.2 績效考核與職能發展"]),
            ("5.3 人權管理", ["5.3.1 人權政策", "5.3.2 申訴機制"]),
            ("5.4 職業安全衛生", ["5.4.1 職安衛管理", "5.4.2 健康促進", "5.4.3 職業傷害統計"]),
        ],
    ),
    (
        "第6章　社會參與",
        [
            "6.1 社會關懷",
            "6.2 社區關係",
        ],
    ),
    (
        "附錄",
        [
            "附錄一　GRI 內容索引",
            "附錄二　SASB 內容索引",
            "附錄三　TCFD 對照",
            "附錄四　SDGs 對照表",
            "附錄五　確信項目彙總表",
            "附錄六　確信報告",
            "附錄七　溫室氣體盤查聲明",
        ],
    ),
]


def set_east_asia_font(run, name=FONT):
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for attr in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rFonts.set(qn(attr), name)


def style_font(style, size, bold, color, space_before=0, space_after=8):
    font = style.font
    font.name = FONT
    font.size = Pt(size)
    font.bold = bold
    font.color.rgb = color
    rPr = style.element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for attr in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rFonts.set(qn(attr), FONT)
    pf = style.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing_rule = WD_LINE_SPACING.SINGLE


def a3_landscape(section, next_page=False):
    section.orientation = WD_ORIENT.LANDSCAPE
    section.page_width = Mm(420)
    section.page_height = Mm(297)
    section.top_margin = Mm(16)
    section.bottom_margin = Mm(16)
    section.left_margin = Mm(20)
    section.right_margin = Mm(20)
    sectPr = section._sectPr
    pgSz = sectPr.find(qn("w:pgSz"))
    if pgSz is not None:
        pgSz.set(qn("w:orient"), "landscape")
        pgSz.set(qn("w:w"), str(Mm(420).twips))
        pgSz.set(qn("w:h"), str(Mm(297).twips))
    if next_page:
        el = sectPr.find(qn("w:type"))
        if el is None:
            el = OxmlElement("w:type")
            sectPr.insert(0, el)
        el.set(qn("w:val"), "nextPage")


def add_page_number(section):
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    fld1 = OxmlElement("w:fldChar")
    fld1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld2 = OxmlElement("w:fldChar")
    fld2.set(qn("w:fldCharType"), "end")
    run._r.append(fld1)
    run._r.append(instr)
    run._r.append(fld2)
    run.font.size = Pt(11)
    set_east_asia_font(run)


def add_toc(paragraph):
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    begin.set(qn("w:dirty"), "true")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = ' TOC \\o "1-3" \\h \\z \\u '
    sep = OxmlElement("w:fldChar")
    sep.set(qn("w:fldCharType"), "separate")
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.append(begin)
    run._r.append(instr)
    run._r.append(sep)
    run._r.append(end)


def add_heading_run(p, text, size, color, bold=True):
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.color.rgb = color
    set_east_asia_font(run)
    return run


def write_branch(doc, items, level):
    for item in items:
        if isinstance(item, tuple):
            title, children = item
            doc.add_heading(title, level=level)
            write_branch(doc, children, level + 1)
        else:
            doc.add_heading(item, level=level)


def next_section(doc):
    section = doc.add_section(WD_SECTION.NEW_PAGE)
    a3_landscape(section, next_page=True)
    add_page_number(section)
    return section


def main():
    doc = Document()
    normal = doc.styles["Normal"]
    style_font(normal, 14, False, RGBColor(0x1A, 0x1A, 0x1A), 0, 6)
    style_font(doc.styles["Heading 1"], 24, True, NAVY, 0, 10)
    style_font(doc.styles["Heading 2"], 16, True, NAVY2, 12, 4)
    style_font(doc.styles["Heading 3"], 14, True, NAVY3, 6, 3)
    for name in ("TOC 1", "TOC 2", "TOC 3"):
        try:
            style_font(doc.styles[name], 14, False, RGBColor(0x1A, 0x1A, 0x1A), 0, 4)
        except KeyError:
            pass

    cover = doc.sections[0]
    a3_landscape(cover)
    add_page_number(cover)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_heading_run(p, "永續報告書", 48, NAVY)
    p.paragraph_format.space_after = Pt(20)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_heading_run(p, "組織名稱", 28, NAVY)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_heading_run(p, "報導年度", 28, NAVY)

    next_section(doc)
    toc_title = doc.add_paragraph()
    add_heading_run(toc_title, "目錄", 24, NAVY)
    toc_title.paragraph_format.space_after = Pt(12)
    toc_p = doc.add_paragraph()
    add_toc(toc_p)

    for title, children in outline:
        next_section(doc)
        doc.add_heading(title, level=1)
        write_branch(doc, children, 2)

    for i, section in enumerate(doc.sections):
        a3_landscape(section, next_page=i > 0)

    targets = [
        Path(r"C:\Users\K\Projects\hanxin-esg\templates\永續報告書大綱_A3橫式.docx"),
        Path(r"D:\110.03.02健翔\作業參考資料\ESG\永續報告書刊物\永續報告書大綱_A3橫式_新.docx"),
        Path(r"D:\110.03.02健翔\作業參考資料\ESG\永續報告書刊物\永續報告書大綱_A3橫式.docx"),
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
