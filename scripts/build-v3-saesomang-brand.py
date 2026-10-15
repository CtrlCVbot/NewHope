from pathlib import Path
import hashlib, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

# Deliberately retains the product generator's relative ROOT layout.
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "v3" / "saesomang"
BRAND = OUT / "brand"
MARUBURI = ROOT / "public" / "v3" / "fonts" / "MaruBuri-Regular.otf"
PRETENDARD = ROOT / "public" / "v3" / "fonts" / "PretendardVariable.woff2"
PRIMARY, LIGHT, WHITE = "#6c5275", "#b0a1bf", "#ffffff"

def load(path):
    font = TTFont(path)
    return font, font.getBestCmap(), font.getGlyphSet(), font["hmtx"].metrics, font["head"].unitsPerEm

def glyphs(text, font_data, size, x, baseline, fill, spacing=0):
    font, cmap, glyph_set, metrics, upm = font_data
    scale, cursor, result = size / upm, x, []
    for char in text:
        name = cmap.get(ord(char))
        if not name: raise ValueError(f"missing glyph: {char}")
        pen = SVGPathPen(glyph_set); glyph_set[name].draw(pen); d = pen.getCommands()
        if d: result.append(f'<path d="{d}" transform="translate({cursor:.3f} {baseline:.3f}) scale({scale:.6f} {-scale:.6f})" fill="{fill}"/>')
        cursor += metrics[name][0] * scale + spacing
    return "".join(result)

def svg(w, h, title, label, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{label}"><title>{title}</title>{body}</svg>\n'

def symbol_paths(color, x=0, y=0, scale=1, compact=False):
    if compact:
        paths = f'<path d="M9 29 32 8l23 21v27H9Z" fill="none" stroke="{color}" stroke-width="7" stroke-linejoin="round"/><path d="M32 53V37" fill="none" stroke="{color}" stroke-width="7" stroke-linecap="round"/><path d="M32 40C20 39 16 32 18 26c10 0 15 6 14 14Z" fill="{color}"/><path d="M32 40c12-1 16-8 14-14-10 0-15 6-14 14Z" fill="{color}"/>'
    else:
        paths = f'<path d="M8 29 32 8l24 21v27H8Z" fill="none" stroke="{color}" stroke-width="5" stroke-linejoin="round"/><path d="M32 53V37" fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round"/><path d="M32 40C20 39 16 32 18 26c10 0 15 6 14 14Z" fill="{color}"/><path d="M32 40c12-1 16-8 14-14-10 0-15 6-14 14Z" fill="{color}"/>'
    return f'<g transform="translate({x} {y}) scale({scale})">{paths}</g>'

MARU, PRETENDARD = load(MARUBURI), load(PRETENDARD)
def word(size, x, y, color): return glyphs("새소망", MARU, size, x, y, color, -size * .045)
def subtitle(size, x, y, color): return glyphs("방문요양센터", PRETENDARD, size, x, y, color, size * .04)
def combo(w,h,title,label,symbol,ws,wx,wy,ss=0,sx=0,sy=0,color=PRIMARY):
    return svg(w,h,title,label,symbol+word(ws,wx,wy,color)+(subtitle(ss,sx,sy,color) if ss else ""))

BRAND.mkdir(parents=True, exist_ok=True)
variants = {
 "header-full.svg": combo(352,88,"새소망 방문요양센터 전체형 로고","새소망 방문요양센터",symbol_paths(PRIMARY,6,12),55,84,47,20,84,72),
 "header-short.svg": combo(224,64,"새소망 축약형 로고","새소망",symbol_paths(PRIMARY,8,8,.75),52,66,45),
 "menu.svg": combo(430,128,"새소망 메뉴 로고","새소망 방문요양센터",symbol_paths(PRIMARY,38,28,1.1),72,126,69,22,128,106),
 "why.svg": combo(900,250,"새소망 Why 섹션 로고","새소망 방문요양센터",symbol_paths(WHITE,112,42,2.1),150,268,141,34,271,199,WHITE),
 "footer.svg": combo(360,108,"새소망 푸터 로고","새소망 방문요양센터",symbol_paths(LIGHT,20,24,.9),60,88,61,22,90,92,LIGHT),
}
for name, data in variants.items(): (BRAND / name).write_text(data, encoding="utf-8")
symbols = {
 "symbol.svg": svg(64,64,"새소망 집 안 새싹 심볼","새소망 집 안 새싹 심볼",symbol_paths(PRIMARY)),
 "symbol-white.svg": svg(64,64,"새소망 집 안 새싹 흰색 심볼","새소망 집 안 새싹 흰색 심볼",symbol_paths(WHITE)),
 "symbol-small.svg": svg(64,64,"새소망 집 안 새싹 소형 심볼","새소망 집 안 새싹 소형 심볼",symbol_paths(PRIMARY,compact=True)),
}
for name, data in symbols.items(): (BRAND / name).write_text(data, encoding="utf-8")

# Kept byte-identical to the product generator's existing five service icons.
icons = {
 "home.svg": ("집 아이콘","돌봄이 이뤄지는 집",'<path d="M15 45 48 18l33 27v35H57V57H39v23H15Z"/>'),
 "bath.svg": ("목욕 아이콘","방문목욕 안내",'<path d="M16 59h64v15H16Z"/><path d="M24 59V47c0-9 7-16 16-16h16c9 0 16 7 16 16v12M23 74c2 7 8 11 15 11h20c7 0 13-4 15-11M22 26h.1M47 18h.1M72 26h.1"/>'),
 "chat.svg": ("대화 아이콘","말벗과 생활 살핌",'<path d="M18 22h60v42H45L30 78V64H18Z"/><path d="M33 43h30M33 53h20"/>'),
 "leaf.svg": ("잎 아이콘","편안한 일상",'<path d="M76 19C43 20 23 38 23 67c0 5 1 8 2 10 32 0 51-18 51-58Z"/><path d="M20 80c13-22 29-35 50-48"/>'),
 "arrow-up-right.svg": ("오른쪽 위 화살표","자세히 보기",'<path d="M25 71 71 25M36 25h35v35"/>'),
}
icons_dir = OUT / "icons"; icons_dir.mkdir(parents=True, exist_ok=True)
for name,(title,label,paths) in icons.items():
    (icons_dir/name).write_text(svg(96,96,title,label,f'<g fill="none" stroke="{PRIMARY}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{paths}</g>'),encoding="utf-8")
manifest_path = OUT / "assets-manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"schemaVersion":2,"images":[]}
manifest["brand"] = {"fontSource":"public/v3/fonts/MaruBuri-Regular.otf and PretendardVariable.woff2","fontOutlineOnly":True,"variants":list(variants),"symbols":list(symbols),"icons":list(icons),"externalReferences":0,"generatorSha256":hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
