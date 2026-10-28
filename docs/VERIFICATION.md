# Verification record

Checked on 2026-10-21 with Node.js 24.19.0, npm 11.9.0, and Next.js 16.4.2.

## Automated checks

| Check | Result |
| --- | --- |
| `npm test` | 11 tests passed, 0 failed |
| `npm run check` | Shared settings and TypeScript passed |
| Preview build and `npm run test:export` | Chooser and both design routes exported; all noindex; no canonical; empty sitemap |
| Production build, `design-1`, and export verification | Open Studio at `/`; indexable metadata and canonical; one sitemap URL; both review routes absent |
| Production build, `design-2`, and export verification | Midnight Systems at `/`; same publication checks passed |

Production export checks used `NEXT_PUBLIC_SITE_URL=https://www.elevenchase.com` locally. They did not deploy to or change that domain. The deliverable demo uses preview mode.

The export verification reads the generated HTML, robots file, sitemap, and route files. The build workflow validates settings and clears only the previous generated `out/` directory before rebuilding, so changing modes cannot preserve an old review page.

## Browser checks

Visual and interaction checks used the completed static export in Chromium:

- Desktop chooser and both homepage designs inspected at a 1363px browser width.
- All three layouts inspected in 360px-wide frames (345px content width after the scrollbar), with no horizontal page overflow.
- Mobile menu expansion, section navigation, Escape dismissal, and focus return checked.
- Chooser links and the design switcher opened the intended homepage.
- Both designs had one main landmark, one top-level heading, and valid internal section anchors.
- FAQ expansion worked. Empty contact submission focused the required name field.
- The contact button was enabled after hydration. Server-rendered output starts with it disabled, and a no-JavaScript email fallback is included.
- No application console errors were observed in the final static review.

A temporary iframe review harness was kept outside the project and deployment output.

## Scope and limits

- No real inquiry was sent. The default contact behavior opens an email draft; sending remains the visitor's action in their email app.
- External contact validation and affirmative-response parsing have unit coverage. A live external receiving service was not configured or tested.
- Reduced-motion support is implemented in CSS and the reveal component. A full assistive-technology, cross-browser, or performance audit was not performed.
- Recheck the chosen production build, content, contact destination, and hosting behavior after customizing the starter for a client.
