import type { RichText } from "@/content/v3/types";

export type RichTextSegment = { text: string; emphasized: boolean };

export function richTextSegments({ text, emphasis = [] }: RichText): RichTextSegment[] {
  const phrases = [...new Set(emphasis.filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!phrases.length) return [{ text, emphasized: false }];
  const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(escaped.join("|"), "g");
  const segments: RichTextSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > cursor) segments.push({ text: text.slice(cursor, at), emphasized: false });
    segments.push({ text: match[0], emphasized: true });
    cursor = at + match[0].length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), emphasized: false });
  return segments;
}
