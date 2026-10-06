#!/usr/bin/env python3
"""Thay màu viết cứng bằng biến CSS — CHỈ bên trong khối <style>, bỏ qua phần khai báo :root{…}.
Dùng:
  python3 recolor_css.py index.html --map '#3A5CAA=--t-pri' '#003047=--t-ink' '#F0F7FF=--t-soft' '#CFE2F3=--t-line' \
        --rgba '78,124,175=--brand-blue' [--dry]
  · --map  HEX=--biến   : #3A5CAA → var(--t-pri) (không phân biệt hoa thường, đúng 6 ký tự hex)
  · --rgba R,G,B=--biến : rgba(78,124,175,.12) → color-mix(in srgb,var(--brand-blue) 12%,transparent)
  · --dry               : chỉ đếm, không ghi file
Không đụng màu trong chuỗi JS (màu dữ liệu, biểu đồ, CSS inline của email) — những màu đó phải giữ cố định."""
import re, sys, argparse
ap = argparse.ArgumentParser(); ap.add_argument("file"); ap.add_argument("--map", nargs="*", default=[]); ap.add_argument("--rgba", nargs="*", default=[]); ap.add_argument("--dry", action="store_true")
o = ap.parse_args()
M = {k.strip().lstrip("#").upper(): v.strip() for k, v in (x.split("=") for x in o.map)}
R = {k.replace(" ", ""): v.strip() for k, v in (x.split("=") for x in o.rgba)}
s = open(o.file, encoding="utf-8").read(); cnt = {"hex": 0, "rgba": 0}
hexp = re.compile(r"#(" + "|".join(map(re.escape, M)) + r")\b", re.I) if M else None
rgbp = re.compile(r"rgba\((" + "|".join(map(re.escape, R)) + r"),\s*(\.?\d*\.?\d+)\)") if R else None
def fix(t):
    if hexp: t = hexp.sub(lambda m: (cnt.__setitem__("hex", cnt["hex"] + 1), f"var({M[m.group(1).upper()]})")[1], t)
    if rgbp: t = rgbp.sub(lambda m: (cnt.__setitem__("rgba", cnt["rgba"] + 1), "color-mix(in srgb,var(%s) %g%%,transparent)" % (R[m.group(1)], round(float(m.group(2)) * 100, 1)))[1], t)
    return t
def blk(m):
    parts = re.split(r"(:root\{[^}]*\})", m.group(2))
    return m.group(1) + "".join(p if p.startswith(":root{") else fix(p) for p in parts) + m.group(3)
out = re.sub(r"(<style[^>]*>)(.*?)(</style>)", blk, s, flags=re.S)
print(f"thay {cnt['hex']} mã hex · {cnt['rgba']} rgba")
if not o.dry: open(o.file, "w", encoding="utf-8").write(out)
