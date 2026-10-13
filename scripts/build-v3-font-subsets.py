"""Build reproducible V3 font subsets without changing the protected source fonts."""
from __future__ import annotations

import hashlib
import json
import argparse
from importlib.metadata import version
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOTS = [ROOT / "components" / "v3", ROOT / "content" / "v3", ROOT / "app" / "v3-design"]
FONTS = [
    (ROOT / "public/v3/fonts/PretendardVariable.woff2", ROOT / "public/v3/fonts/NewHopeSansSubset.woff2", "NewHope Sans Subset"),
    (ROOT / "public/v3/fonts/MaruBuri-Regular.otf", ROOT / "public/v3/fonts/NewHopeSerifSubset.woff2", "NewHope Serif Subset"),
]
CSS = ROOT / "styles/v3/font-subsets.css"

def digest(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()

def characters() -> set[int]:
    text = "".join(path.read_text(encoding="utf-8") for root in SOURCE_ROOTS for path in root.rglob("*") if path.suffix in {".ts", ".tsx", ".css"})
    return set(range(32, 127)) | {ord(char) for char in text if 32 <= ord(char) < 127 or ord(char) > 127}

def unicode_range(points: set[int]) -> str:
    ranges = []
    for point in sorted(points):
        if not ranges or point > ranges[-1][1] + 1: ranges.append([point, point])
        else: ranges[-1][1] = point
    return ",".join(f"U+{start:04X}" if start == end else f"U+{start:04X}-{end:04X}" for start, end in ranges)

def outline(font: TTFont, glyph_name: str):
    pen = RecordingPen(); font.getGlyphSet()[glyph_name].draw(pen); return pen.value

def rename(font: TTFont, family: str) -> None:
    name = font["name"]
    values = {1: family, 2: "Regular", 3: f"NewHope-{family.replace(' ', '')}", 4: family, 6: family.replace(" ", ""), 16: family, 17: "Regular", 18: family, 21: family, 25: "NewHope"}
    for record in name.names:
        if record.nameID in values: record.string = values[record.nameID].encode("utf-16-be" if record.platformID == 3 else "mac_roman", errors="replace")
    for platform, encoding, language in {(3, 1, 1033), (1, 0, 0)}:
        for name_id, value in values.items(): name.setName(value, name_id, platform, encoding, language)
    if "CFF " in font:
        cff = font["CFF "].cff
        top_dict = cff.topDictIndex[0]
        top_dict.FamilyName = family
        top_dict.FullName = family
        top_dict.FontName = family.replace(" ", "")
        cff.fontNames = [family.replace(" ", "")]

def build(source: Path, output: Path, family: str, requested: set[int]) -> dict:
    original = TTFont(source, recalcTimestamp=False)
    source_license = {record.nameID: record.toUnicode() for record in original["name"].names if record.nameID in {0, 13, 14}}
    source_license_records = [(record.nameID, record.toUnicode(), record.platformID, record.platEncID, record.langID) for record in original["name"].names if record.nameID in {0, 13, 14}]
    cmap = original.getBestCmap()
    supported = requested & set(cmap)
    missing = sorted(requested - set(cmap))
    original_metrics = {codepoint: (cmap[codepoint], original["hmtx"][cmap[codepoint]][0], outline(original, cmap[codepoint])) for codepoint in supported}
    options = subset.Options()
    options.layout_features = ["*"]
    options.glyph_names = True
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=supported)
    subsetter.subset(original)
    rename(original, family)
    for name_id, value, platform, encoding, language in source_license_records:
        original["name"].setName(value, name_id, platform, encoding, language)
    original["head"].modified = 0
    original.flavor = "woff2"
    output.parent.mkdir(parents=True, exist_ok=True)
    original.save(output)
    assert output.read_bytes()[:4] == b"wOF2", f"{output.name} is not WOFF2"
    result = TTFont(output, recalcTimestamp=False)
    result_cmap = result.getBestCmap()
    for codepoint, (glyph, advance, commands) in original_metrics.items():
        assert result_cmap.get(codepoint) == glyph, f"glyph mismatch U+{codepoint:04X}"
        assert result["hmtx"][glyph][0] == advance, f"advance mismatch U+{codepoint:04X}"
        assert outline(result, glyph) == commands, f"outline mismatch U+{codepoint:04X}"
    names = [(record.nameID, record.toUnicode()) for record in result["name"].names]
    for name_id, value in names:
        if name_id in {1, 3, 4, 6, 16, 18, 21, 25}: assert "Pretendard" not in value and "MaruBuri" not in value, f"reserved primary name {name_id}"
    assert any(name_id == 1 and value == family for name_id, value in names)
    if "CFF " in result:
        cff = result["CFF "].cff
        top_dict = cff.topDictIndex[0]
        assert top_dict.FamilyName == family and top_dict.FullName == family and top_dict.FontName == family.replace(" ", "")
        assert [str(name) for name in cff.fontNames] == [family.replace(" ", "")]
    result_license = {record.nameID: record.toUnicode() for record in result["name"].names if record.nameID in {0, 13, 14}}
    for name_id, value in source_license.items(): assert value in result_license.get(name_id, ""), f"license metadata {name_id} missing"
    return {"source": str(source), "source_sha256": digest(source), "output": str(output), "output_sha256": digest(output), "bytes": output.stat().st_size, "requested_codepoints": len(requested), "covered_codepoints": len(supported), "missing_codepoints": [f"U+{point:04X}" for point in missing], "name_family": family, "variable_axes": {axis.axisTag: [axis.minValue, axis.defaultValue, axis.maxValue] for axis in result["fvar"].axes} if "fvar" in result else {}}

def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("--manifest", type=Path); args = parser.parse_args()
    requested = characters()
    results = [build(source, output, family, requested) for source, output, family in FONTS]
    first_hashes = [result["output_sha256"] for result in results]
    repeat = [build(source, output, family, requested) for source, output, family in FONTS]
    assert first_hashes == [result["output_sha256"] for result in repeat], "subset regeneration changed output hash"
    supported = set(requested)
    for source, _, _ in FONTS: supported &= set(TTFont(source).getBestCmap())
    ranges = unicode_range(supported)
    CSS.write_text(f'@font-face{{font-family:"NewHope Sans Subset";src:url("/v3/fonts/NewHopeSansSubset.woff2") format("woff2");font-weight:45 930;font-style:normal;font-display:swap;unicode-range:{ranges}}}\n@font-face{{font-family:"NewHope Serif Subset";src:url("/v3/fonts/NewHopeSerifSubset.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;unicode-range:{ranges}}}\n.v3Scope{{--f-sans:"NewHope Sans Subset","Pretendard WU0","Malgun Gothic",sans-serif;--f-serif:"NewHope Serif Subset","MaruBuri WU0",serif}}\n', encoding="utf-8")
    payload = {"fonttools": version("fonttools"), "brotli": version("Brotli"), "ascii_included": "U+0020-U+007E", "unicode_range": ranges, "results": results, "repeat_hash_match": True}
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True); args.manifest.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False))

if __name__ == "__main__": main()
