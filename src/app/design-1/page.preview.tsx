import { DesignOne } from "@/components/design-one";
import { DesignSwitcher } from "@/components/shared";
import { buildMetadata } from "@/lib/metadata";

// next.config.ts recognizes the .preview.tsx extension only in preview mode.
export const metadata = buildMetadata({
  title: "Choice A · Heavy Duty",
  path: "/design-1/",
});

export default function DesignOnePreview() {
  return <><DesignOne /><DesignSwitcher active="design-1" /></>;
}
