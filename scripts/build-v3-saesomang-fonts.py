"""Build reproducible, isolated V3 Saesomang font subsets."""
from __future__ import annotations

import argparse
import hashlib
import json
from importlib.metadata import version
from pathlib import Path
from shutil import copyfile

from fontTools import subset
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "v3" / "saesomang" / "fonts"
CSS = ROOT / "styles" / "v3" / "saesomang-fonts.css"
SOURCES = [
    (ROOT / "public" / "v3" / "fonts" / "PretendardVariable.woff2", OUTPUT / "SaesomangSansSubset.woff2", "NewHope Saesomang Sans"),
    (ROOT / "public" / "v3" / "fonts" / "MaruBuri-Regular.otf", OUTPUT / "SaesomangSerifSubset.woff2", "NewHope Saesomang Serif"),
]
PROTECTED = [
    ROOT / "public" / "v3" / "fonts" / "PretendardVariable.woff2",
    ROOT / "public" / "v3" / "fonts" / "MaruBuri-Regular.otf",
    ROOT / "public" / "v3" / "fonts" / "NewHopeSansSubset.woff2",
    ROOT / "public" / "v3" / "fonts" / "NewHopeSerifSubset.woff2",
    ROOT / "styles" / "v3" / "font-subsets.css",
]
MANIFEST = OUTPUT / "font-manifest.json"
EVIDENCE_ROOT = ROOT.parent / "docs" / "source-package" / "korawells" / "evidence" / "wu15" / "worker"
LICENSES = [
    (ROOT / "public" / "v3" / "fonts" / "LICENSE-Pretendard.txt", OUTPUT / "LICENSE-Pretendard.txt"),
    (ROOT / "public" / "v3" / "fonts" / "LICENSE-MaruBuri-NAVER.txt", OUTPUT / "LICENSE-MaruBuri-NAVER.txt"),
]

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def protected_digest(path: Path) -> str:
    """Keep binary hashes exact; normalize only the protected CSS line endings."""
    data = path.read_bytes()
    if path == ROOT / "styles" / "v3" / "font-subsets.css":
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()

def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()

def assert_contained(path: Path, parent: Path, label: str) -> None:
    try:
        path.relative_to(parent)
    except ValueError as error:
        raise SystemExit(f"{label} path must remain inside its allowed output root") from error

def manifest_path(value: Path) -> Path:
    candidate = value if value.is_absolute() else ROOT / value
    candidate = candidate.resolve()
    if candidate == MANIFEST.resolve():
        return candidate
    assert_contained(candidate, EVIDENCE_ROOT.resolve(), "manifest")
    if candidate.suffix != ".json":
        raise SystemExit("evidence manifest must use the .json suffix")
    return candidate

def source_files() -> list[Path]:
    files = [ROOT / "content" / "v3" / "saesomang.ts", ROOT / "app" / "v3" / "layout.tsx", ROOT / "app" / "v3" / "page.tsx"]
    files.extend(path for path in (ROOT / "components" / "v3").rglob("*") if path.suffix in {".ts", ".tsx", ".css"})
    return sorted(files)

def characters() -> set[int]:
    text = "".join(path.read_text(encoding="utf-8") for path in source_files())
    return set(range(0x20, 0x7F)) | {ord(char) for char in text if ord(char) >= 0x20}

def unicode_range(points: set[int]) -> str:
    ranges: list[list[int]] = []
    for point in sorted(points):
        if not ranges or point > ranges[-1][1] + 1:
            ranges.append([point, point])
        else:
            ranges[-1][1] = point
    return ",".join(f"U+{start:04X}" if start == end else f"U+{start:04X}-{end:04X}" for start, end in ranges)

def outline(font: TTFont, glyph_name: str):
    pen = RecordingPen()
    font.getGlyphSet()[glyph_name].draw(pen)
    return pen.value

def rename(font: TTFont, family: str) -> None:
    names = font["name"]
    values = {1: family, 2: "Regular", 3: f"NewHope-{family.replace(' ', '')}", 4: family, 6: family.replace(" ", ""), 16: family, 17: "Regular", 18: family, 21: family, 25: "NewHope"}
    for record in names.names:
        if record.nameID in values:
            record.string = values[record.nameID].encode("utf-16-be" if record.platformID == 3 else "mac_roman", errors="replace")
    for platform, encoding, language in {(3, 1, 1033), (1, 0, 0)}:
        for name_id, value in values.items():
            names.setName(value, name_id, platform, encoding, language)
    if "CFF " in font:
        cff = font["CFF "].cff
        top = cff.topDictIndex[0]
        top.FamilyName = family
        top.FullName = family
        top.FontName = family.replace(" ", "")
        cff.fontNames = [family.replace(" ", "")]

def build(source: Path, output: Path, family: str, requested: set[int]) -> dict:
    original = TTFont(source, recalcTimestamp=False)
    cmap = original.getBestCmap()
    supported = requested & set(cmap)
    missing = sorted(requested - set(cmap))
    metrics = {point: (cmap[point], original["hmtx"][cmap[point]][0], outline(original, cmap[point])) for point in supported}
    licenses = [(item.nameID, item.toUnicode(), item.platformID, item.platEncID, item.langID) for item in original["name"].names if item.nameID in {0, 13, 14}]
    options = subset.Options()
    options.layout_features = ["*"]
    options.glyph_names = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=supported)
    subsetter.subset(original)
    rename(original, family)
    for name_id, value, platform, encoding, language in licenses:
        original["name"].setName(value, name_id, platform, encoding, language)
    original["head"].modified = 0
    original.flavor = "woff2"
    output.parent.mkdir(parents=True, exist_ok=True)
    original.save(output)
    assert output.read_bytes()[:4] == b"wOF2"
    result = TTFont(output, recalcTimestamp=False)
    result_cmap = result.getBestCmap()
    for point, (glyph, advance, commands) in metrics.items():
        assert result_cmap.get(point) == glyph, f"glyph mismatch U+{point:04X}"
        assert result["hmtx"][glyph][0] == advance, f"advance mismatch U+{point:04X}"
        assert outline(result, glyph) == commands, f"outline mismatch U+{point:04X}"
    for record in result["name"].names:
        if record.nameID in {1, 3, 4, 6, 16, 18, 21, 25}:
            assert "Pretendard" not in record.toUnicode() and "MaruBuri" not in record.toUnicode()
    assert any(record.nameID == 1 and record.toUnicode() == family for record in result["name"].names)
    if "CFF " in result:
        cff = result["CFF "].cff
        assert [str(item) for item in cff.fontNames] == [family.replace(" ", "")]
        assert cff.topDictIndex[0].FamilyName == family and cff.topDictIndex[0].FullName == family
    for name_id, value, platform, encoding, language in licenses:
        assert any(item.nameID == name_id and item.toUnicode() == value and item.platformID == platform and item.platEncID == encoding and item.langID == language for item in result["name"].names)
    return {"source": relative(source), "source_sha256": digest(source), "output": relative(output), "output_sha256": digest(output), "bytes": output.stat().st_size, "requested_codepoints": len(requested), "covered_codepoints": len(supported), "missing_codepoints": [f"U+{point:04X}" for point in missing], "name_family": family, "variable_axes": {axis.axisTag: [axis.minValue, axis.defaultValue, axis.maxValue] for axis in result["fvar"].axes} if "fvar" in result else {}}

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    args = parser.parse_args()
    args.manifest = manifest_path(args.manifest)
    assert_contained(OUTPUT.resolve(), (ROOT / "public" / "v3" / "saesomang").resolve(), "output")
    assert_contained(CSS.resolve(), (ROOT / "styles" / "v3").resolve(), "stylesheet")
    before = {relative(path): protected_digest(path) for path in PROTECTED}
    requested = characters()
    results = [build(source, output, family, requested) for source, output, family in SOURCES]
    first = [item["output_sha256"] for item in results]
    repeated = [build(source, output, family, requested) for source, output, family in SOURCES]
    assert first == [item["output_sha256"] for item in repeated], "subset regeneration changed output hash"
    supported = set(requested)
    for source, _, _ in SOURCES:
        supported &= set(TTFont(source).getBestCmap())
    ranges = unicode_range(supported)
    CSS.write_text(f'@font-face{{font-family:"NewHope Saesomang Sans";src:url("/v3/saesomang/fonts/SaesomangSansSubset.woff2") format("woff2");font-weight:45 930;font-style:normal;font-display:swap;unicode-range:{ranges}}}\n@font-face{{font-family:"NewHope Saesomang Serif";src:url("/v3/saesomang/fonts/SaesomangSerifSubset.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;unicode-range:{ranges}}}\n.saesomangScope{{--f-sans:"NewHope Saesomang Sans","Pretendard WU0","Malgun Gothic",sans-serif;--f-serif:"NewHope Saesomang Serif","MaruBuri WU0",serif}}\n', encoding="utf-8")
    for source, destination in LICENSES:
        copyfile(source, destination)
        assert digest(source) == digest(destination), f"license copy mismatch: {destination.name}"
    (OUTPUT / "README.md").write_text("# 새소망 2차 전용 폰트\n\n`PYTHONPATH=<fonttools runtime> python scripts/build-v3-saesomang-fonts.py`로 재생성합니다. FontTools 4.60.1과 Brotli 1.2.0이 필요합니다. 출력 폰트는 새 family 이름으로 바꾸되 원본 폰트와 1차 subset은 수정하지 않습니다. subset 밖의 동적 입력은 기존 로컬 fallback으로 표시됩니다.\n", encoding="utf-8")
    after = {relative(path): protected_digest(path) for path in PROTECTED}
    assert before == after, "protected first-generation font assets changed"
    payload = {"fonttools": version("fonttools"), "brotli": version("Brotli"), "ascii_included": "U+0020-U+007E", "unicode_range": ranges, "seed_files": [relative(path) for path in source_files()], "protected_sha256": after, "protected_sha256_policy": {"binary_assets": "exact file bytes", "styles/v3/font-subsets.css": "UTF-8 bytes with CRLF normalized to LF only"}, "results": repeated, "repeat_hash_match": True}
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False))

if __name__ == "__main__":
    main()
