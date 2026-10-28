import { DesignChooser } from "@/components/design-chooser";
import { DesignOne } from "@/components/design-one";
import { DesignTwo } from "@/components/design-two";
import { siteSettings } from "@/lib/site-settings";

export default function Home() {
  if (!siteSettings.isProduction) return <DesignChooser />;
  return siteSettings.selectedDesign === "design-1" ? <DesignOne /> : <DesignTwo />;
}
