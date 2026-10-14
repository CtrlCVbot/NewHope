from pathlib import Path
import json
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "v3" / "saesomang"
BRAND = OUT / "brand"
EVIDENCE = None
MARUBURI = ROOT / "public" / "v3" / "fonts" / "MaruBuri-Regular.otf"
PRETENDARD = ROOT / "public" / "v3" / "fonts" / "PretendardVariable.woff2"

def load(font_path):
    font = TTFont(font_path)
    return font, font.getBestCmap(), font.getGlyphSet(), font["hmtx"].metrics, font["head"].unitsPerEm

def glyphs(text, font_data, size, x, baseline, fill, letter_spacing=0):
    font, cmap, glyph_set, metrics, upm = font_data
    scale = size / upm
    pieces = []
    cursor = x
    for char in text:
        name = cmap.get(ord(char))
        if not name:
            raise ValueError(f"missing glyph: {char}")
        pen = SVGPathPen(glyph_set)
        glyph_set[name].draw(pen)
        d = pen.getCommands()
        advance = metrics[name][0] * scale
        if d:
            pieces.append(f'<path d="{d}" transform="translate({cursor:.3f} {baseline:.3f}) scale({scale:.6f} {-scale:.6f})" fill="{fill}"/>')
        cursor += advance + letter_spacing
    return "".join(pieces), cursor - x

def svg(name, width, height, title, label, groups):
    body = "".join(groups)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{label}"><title>{title}</title>{body}</svg>\n'

def line_icon(name, title, label, content):
    return svg(name, 96, 96, title, label, [f'<g fill="none" stroke="{primary}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{content}</g>'])

if len(sys.argv) == 3 and sys.argv[1] == "--evidence":
    EVIDENCE = (ROOT / sys.argv[2]).resolve()
elif len(sys.argv) != 1:
    raise SystemExit("Usage: python scripts/build-v3-saesomang-brand.py [--evidence <path>]")
if EVIDENCE:
    try:
        EVIDENCE.relative_to(ROOT.parent / "docs")
    except ValueError as error:
        raise SystemExit("evidence path must remain under the repository docs directory") from error
    EVIDENCE.mkdir(parents=True, exist_ok=True)
BRAND.mkdir(parents=True, exist_ok=True)
maru = load(MARUBURI)
pretendard = load(PRETENDARD)

primary = "#6c5275"
white = "#ffffff"
light = "#b0a1bf"

def wordmark(width, height, word_size, subtitle_size, word_y, subtitle_y, word_color, subtitle_color, subtitle=True):
    word, word_width = glyphs("새소망", maru, word_size, 0, word_y, word_color, -word_size * .045)
    groups = [f'<g transform="translate({(width - word_width) / 2:.3f} 0)">{word}</g>']
    if subtitle:
        sub, sub_width = glyphs("방문요양센터", pretendard, subtitle_size, 0, subtitle_y, subtitle_color, subtitle_size * .04)
        groups.append(f'<g transform="translate({(width - sub_width) / 2:.3f} 0)">{sub}</g>')
    return groups

variants = {
    "header-full.svg": (400, 90, 58, 18, 61, 61, primary, primary, True, "새소망 방문요양센터 전체형 로고"),
    "header-short.svg": (200, 72, 58, 0, 60, 0, primary, primary, False, "새소망 축약형 로고"),
    "menu.svg": (430, 128, 76, 20, 80, 113, primary, primary, True, "새소망 메뉴 로고"),
    "why.svg": (900, 250, 150, 34, 164, 225, white, white, True, "새소망 Why 섹션 로고"),
    "footer.svg": (360, 108, 62, 18, 66, 96, light, light, True, "새소망 푸터 로고"),
}
for file_name, config in variants.items():
    width, height, word_size, sub_size, word_y, sub_y, word_color, sub_color, show_subtitle, title = config
    if file_name == "header-full.svg":
        word, word_width = glyphs("새소망", maru, word_size, 0, word_y, word_color, -word_size * .045)
        subtitle, _ = glyphs("방문요양센터", pretendard, sub_size, word_width + 18, sub_y, sub_color, sub_size * .04)
        content = [word, subtitle]
    else:
        content = wordmark(width, height, word_size, sub_size, word_y, sub_y, word_color, sub_color, show_subtitle)
    (BRAND / file_name).write_text(svg(file_name, width, height, title, title, content), encoding="utf-8")

icons = {
    "home.svg": ("집 아이콘", "돌봄이 이뤄지는 집", '<path d="M15 45 48 18l33 27v35H57V57H39v23H15Z"/>'),
    "bath.svg": ("목욕 아이콘", "방문목욕 안내", '<path d="M16 59h64v15H16Z"/><path d="M24 59V47c0-9 7-16 16-16h16c9 0 16 7 16 16v12M23 74c2 7 8 11 15 11h20c7 0 13-4 15-11M22 26h.1M47 18h.1M72 26h.1"/>'),
    "chat.svg": ("대화 아이콘", "말벗과 생활 살핌", '<path d="M18 22h60v42H45L30 78V64H18Z"/><path d="M33 43h30M33 53h20"/>'),
    "leaf.svg": ("잎 아이콘", "편안한 일상", '<path d="M76 19C43 20 23 38 23 67c0 5 1 8 2 10 32 0 51-18 51-58Z"/><path d="M20 80c13-22 29-35 50-48"/>'),
    "arrow-up-right.svg": ("오른쪽 위 화살표", "자세히 보기", '<path d="M25 71 71 25M36 25h35v35"/>'),
}
for file_name, (title, label, paths) in icons.items():
    (BRAND / ".." / "icons").mkdir(parents=True, exist_ok=True)
    (BRAND / ".." / "icons" / file_name).write_text(line_icon(file_name, title, label, paths), encoding="utf-8")

# Preview only: rasterizes self-owned SVG variants with no external font dependency.
preview_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="470" viewBox="0 0 960 470"><rect width="960" height="470" fill="#15031b"/><image href="../../../../../../site/public/v3/saesomang/brand/header-full.svg" x="40" y="40" width="400" height="90"/><image href="../../../../../../site/public/v3/saesomang/brand/menu.svg" x="500" y="34" width="430" height="128"/><image href="../../../../../../site/public/v3/saesomang/brand/why.svg" x="30" y="185" width="900" height="250"/></svg>'
# The preview uses copies of the path SVGs embedded at build time to keep it self-contained.
embedded = preview_svg
for file_name in ["header-full.svg", "menu.svg", "why.svg"]:
    data = (BRAND / file_name).read_text(encoding="utf-8")
    embedded = embedded.replace(f'../../../../../../site/public/v3/saesomang/brand/{file_name}', "data:image/svg+xml;base64," + __import__("base64").b64encode(data.encode()).decode())
if EVIDENCE:
    (EVIDENCE / "brand-preview.svg").write_text(embedded, encoding="utf-8")

manifest_path = OUT / "assets-manifest.json"
if manifest_path.exists():
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["brand"] = {"fontSource": "public/v3/fonts/MaruBuri-Regular.otf and PretendardVariable.woff2", "fontOutlineOnly": True, "variants": list(variants), "icons": list(icons), "externalReferences": 0}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
