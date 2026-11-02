#!/usr/bin/env python3
"""Dựng file mẫu Word có ô điền sẵn ({…}) cho Báo cáo KPI Tháng (MMHSOP_009-FM01) và Báo cáo KPI Quý (FM02)
từ đúng file mẫu của quy trình MMHSOP_009 (bản VN + EN). App (Report Hub / CRM) điền bằng JSZip.

Chạy:  python3 -I tools/kpi_tpl/mk_tpl.py <FM01_VN.docx> <FM01_EN.docx> <FM02_VN.docx> <FM02_EN.docx> <thư mục ra> [thư mục ra 2 …]
Ra:    kpi_fm01_vi.docx · kpi_fm01_en.docx · kpi_fm02_vi.docx · kpi_fm02_en.docx

Ô điền:
  FM01  {YM} (tiêu đề cột) · dòng mẫu {R_DEPT} {R_STAFF} {R_TITLE} {R_CODE} {R_NAME} {R_T} {R_A} {R_W} {R_P} {R_PW} {R_WHY}
        (app lặp dòng có {R_CODE}) · dòng tổng {T_WHO} {T_W} {T_PW} · {MONTH} (tiêu đề) · {NEXT} {HIGH} {CHAL} {SUPP}
  FM02  đầu trang {NAME} {DEPT} {TITLE} {MANAGER} {PLACE} {DIRECTOR} {DATE} {PERIOD}
        dòng mẫu {K_NO} {K_DESC} {K_DET} {K_W} {K_R} {K_WR} (app lặp dòng có {K_NO}) · tổng {T_W} {T_R}
        năng lực {B1_START} {B1_END} {B2_START} {B2_END} {B3} {B4} {B5} {BG} + điểm {B1_S}…{BG_S}
        tự đánh giá {GOOD} {IMPROVE} {SE_EE} {SE_AE} {SE_PA} {SE_NA} · chữ ký người được đánh giá: ngày {SIGN_DATE}
"""
import copy, os, sys
import docx
from docx.oxml.ns import qn

def runs_clear(p, keep=1):
    rs = p.runs
    for r in rs[keep:]:
        r._r.getparent().remove(r._r)
    return p.runs

def add_run(p, text, bold=None, like=None):
    """thêm 1 run; định dạng chép từ run `like` hoặc từ dấu đoạn (pPr/rPr)"""
    r = p.add_run(text)
    src = like._r.find(qn('w:rPr')) if like is not None else None
    if src is None:
        ppr = p._p.find(qn('w:pPr'))
        src = ppr.find(qn('w:rPr')) if ppr is not None else None
    if src is not None:
        old = r._r.find(qn('w:rPr'))
        if old is not None: r._r.remove(old)
        r._r.insert(0, copy.deepcopy(src))
    if bold is not None: r.bold = bold
    return r

def cell_set(c, text, bold=None):
    p = c.paragraphs[0]
    for extra in c.paragraphs[1:]:
        extra._p.getparent().remove(extra._p)
    if p.runs:
        rs = runs_clear(p, 1); rs[0].text = text
        if bold is not None: rs[0].bold = bold
    else:
        add_run(p, text, bold)

def uniq(row):
    out, prev = [], None
    for c in row.cells:
        if c._tc is prev: continue
        prev = c._tc; out.append(c)
    return out

def fm01(src, dst):
    d = docx.Document(src)
    # tiêu đề: thêm kỳ báo cáo
    t0 = d.paragraphs[0]
    add_run(t0, ' · {MONTH}', like=t0.runs[-1])
    t = d.tables[0]
    for c in uniq(t.rows[0]):
        for p in c.paragraphs:
            for r in p.runs:
                if 'yyyymm' in r.text: r.text = r.text.replace('yyyymm', '{YM}')
    keys = ['R_DEPT', 'R_STAFF', 'R_TITLE', 'R_CODE', 'R_NAME', 'R_T', 'R_A', 'R_W', 'R_P', 'R_PW', 'R_WHY']
    for c, k in zip(uniq(t.rows[1]), keys): cell_set(c, '{' + k + '}', bold=False)
    for r in list(t.rows[2:5]): r._tr.getparent().remove(r._tr)
    tot = uniq(t.rows[2])            # dòng tổng (sau khi xoá dòng trống)
    p = tot[0].paragraphs[0]; rs = runs_clear(p, 1)
    rs[0].text = rs[0].text.split('–')[0].strip() + ' – {T_WHO}'
    cell_set(tot[3], '{T_W}', bold=True)
    cell_set(tot[5], '{T_PW}', bold=True)
    for p in d.paragraphs:
        tx = p.text.strip()
        for lab, k in (('- Hành động tháng tới:', 'NEXT'), ('- Actions for next month:', 'NEXT'),
                       ('- Điểm nổi bật:', 'HIGH'), ('- Highlights:', 'HIGH'),
                       ('- Khó khăn:', 'CHAL'), ('- Challenges:', 'CHAL'),
                       ('- Hỗ trợ cần thiết:', 'SUPP'), ('- Support needed:', 'SUPP')):
            if tx == lab:
                add_run(p, ' {' + k + '}', like=p.runs[-1])
    d.save(dst)

def fm02(src, dst):
    d = docx.Document(src)
    # đầu trang (header của phần 2): ô trống ngay sau ô nhãn
    order = ['NAME', 'DEPT', 'TITLE', 'MANAGER', 'PLACE', 'DIRECTOR', 'DATE', 'PERIOD']
    seen = set()
    for s in d.sections:
        for hdr in (s.header, s.first_page_header, s.even_page_header):
            for tb in hdr.tables:
                if id(tb._tbl) in seen: continue
                seen.add(id(tb._tbl)); i = 0
                for row in tb.rows:
                    cs = uniq(row)
                    for j, c in enumerate(cs):
                        if c.text.strip().endswith(':') and j + 1 < len(cs) and not cs[j + 1].text.strip() and i < len(order):
                            cell_set(cs[j + 1], '{' + order[i] + '}', bold=False); i += 1
    tA, tB, tC = d.tables[0], d.tables[1], d.tables[2]
    for c, k in zip(uniq(tA.rows[1]), ['K_NO', 'K_DESC', 'K_DET', 'K_W', 'K_R', 'K_WR']):
        cell_set(c, '{' + k + '}', bold=(k == 'K_NO'))
    for r in list(tA.rows[2:9]): r._tr.getparent().remove(r._tr)
    tot = uniq(tA.rows[2])
    cell_set(tot[3], '{T_W}', bold=True); cell_set(tot[5], '{T_R}', bold=True)
    # B. năng lực
    for ri, k in ((1, 'B1'), (2, 'B2')):
        cs = uniq(tB.rows[ri]); p = cs[2].paragraphs[0]; rs = p.runs
        lab1 = rs[0].text.strip(); lab2 = rs[-1].text.strip()
        runs_clear(p, 0)
        add_run(p, lab1 + ' ', bold=True); add_run(p, '{' + k + '_START}')
        r = add_run(p, ''); r.add_break(); r = add_run(p, ''); r.add_break()
        add_run(p, lab2 + ' ', bold=True); add_run(p, '{' + k + '_END}')
        cell_set(cs[3], '{' + k + '_S}', bold=True)
    for ri, k in ((3, 'B3'), (4, 'B4'), (5, 'B5'), (6, 'BG')):
        cs = uniq(tB.rows[ri]); cell_set(cs[2], '{' + k + '}', bold=False); cell_set(cs[3], '{' + k + '_S}', bold=True)
    # C. tự đánh giá
    c0 = uniq(tC.rows[1])[0]; p = c0.paragraphs[0]
    rs = p.runs  # [Tự đánh giá][\n][Điểm tốt:][\n][\nCần cải thiện…:][\n]
    good = [r for r in rs if r.text.strip().endswith(':')]
    if len(good) >= 2:
        good[0].text = good[0].text + ' '
        r = good[0]._r; nr = copy.deepcopy(r); r.addnext(nr)
        from docx.text.run import Run
        R = Run(nr, p); R.text = '{GOOD}'; R.bold = False
        good[1].text = good[1].text + ' '
        r = good[1]._r; nr = copy.deepcopy(r); r.addnext(nr)
        R = Run(nr, p); R.text = '{IMPROVE}'; R.bold = False
    for ri, k in ((1, 'EE'), (2, 'AE'), (3, 'PA'), (4, 'NA')):
        cs = uniq(tC.rows[ri]); cell_set(cs[-1], '{SE_' + k + '}', bold=True)
    cs = uniq(tC.rows[14]); cell_set(cs[-1], '{SIGN_DATE}', bold=False)
    d.save(dst)

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 5: print(__doc__); sys.exit(1)
    for out in a[4:]:
        os.makedirs(out, exist_ok=True)
        fm01(a[0], os.path.join(out, 'kpi_fm01_vi.docx')); fm01(a[1], os.path.join(out, 'kpi_fm01_en.docx'))
        fm02(a[2], os.path.join(out, 'kpi_fm02_vi.docx')); fm02(a[3], os.path.join(out, 'kpi_fm02_en.docx'))
        print('✓', out)
