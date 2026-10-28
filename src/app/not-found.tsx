import Link from "next/link";
import { Logo } from "@/components/shared";

export default function NotFound() {
  return <main id="main-content" className="not-found"><Logo variant="heavy" inverse /><span>404 / Wrong turn</span><h1>This page took<br /><em>a different route.</em></h1><p>The page you’re looking for isn’t here.</p><Link href="/">Back to the homepage →</Link></main>;
}
