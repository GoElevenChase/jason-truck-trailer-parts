import { DesignTwo } from "@/components/design-two";
import { DesignSwitcher } from "@/components/shared";
import { buildMetadata } from "@/lib/metadata";

// next.config.ts recognizes the .preview.tsx extension only in preview mode.
export const metadata = buildMetadata({
  title: "Choice B · Open Road",
  path: "/design-2/",
});

export default function DesignTwoPreview() {
  return <><DesignTwo /><DesignSwitcher active="design-2" /></>;
}
