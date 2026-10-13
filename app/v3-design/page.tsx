import { preload } from "react-dom";
import { V3Frame } from "@/components/v3/layout/V3Frame";
import { v3PlaceholderContent } from "@/content/v3/placeholder";

export default function V3DesignPage() {
  preload("/v3/fonts/NewHopeSansSubset.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/v3/fonts/NewHopeSerifSubset.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <V3Frame content={v3PlaceholderContent} />;
}
