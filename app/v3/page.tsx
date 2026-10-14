import { preload } from "react-dom";
import { V3Frame } from "@/components/v3/layout/V3Frame";
import { saesomangBrandAssets, saesomangContent } from "@/content/v3/saesomang";

export default function V3Page() {
  preload("/v3/saesomang/fonts/SaesomangSansSubset.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/v3/saesomang/fonts/SaesomangSerifSubset.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <V3Frame content={saesomangContent} variant="saesomang" extras={saesomangContent.extras} whyWordmarkSvg={saesomangBrandAssets.whySvg} />;
}
