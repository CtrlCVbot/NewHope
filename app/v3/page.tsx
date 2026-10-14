import { V3Frame } from "@/components/v3/layout/V3Frame";
import { saesomangBrandAssets, saesomangContent } from "@/content/v3/saesomang";

export default function V3Page() {
  return <V3Frame content={saesomangContent} variant="saesomang" extras={saesomangContent.extras} whyWordmarkSvg={saesomangBrandAssets.whySvg} />;
}
