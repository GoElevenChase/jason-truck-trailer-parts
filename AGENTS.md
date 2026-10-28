<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project purpose

This is ElevenChase's independent, reusable business-website starter. It provides two distinct homepage designs and a preview chooser, then exports the selected design as the production homepage.

Keep the default project free of private MEGA/Gomega packages, review bridges, tracking code, customer identifiers, and lead-service dependencies. Add integrations only when the user's requested work calls for them.

## Content and design

- Keep shared business facts and copy in `src/content/site.ts`; keep mode and integration settings in `src/lib/site-settings.ts`.
- Preserve the distinction between Design 1, Open Studio, and Design 2, Midnight Systems. A different design should have a deliberate composition, not only a color change.
- Use verified client information. Do not invent testimonials, metrics, awards, certifications, customer logos, prices, guarantees, or claims of results.
- Use client-approved assets and accurate image descriptions. Do not present illustrative images as photographs of actual employees, premises, or completed projects.
- Keep navigation and interactive controls usable with a keyboard. Preserve visible focus, semantic landmarks, labels, sensible contrast, and reduced-motion behavior.

## Runtime boundaries

- The default delivery target is Next.js static export, with output in `out/`. Do not introduce server-only functionality into the exported site without an explicitly requested architecture change.
- Preview mode serves the chooser and both design routes. Production serves the selected design at `/` and excludes the design-preview routes from the export.
- Treat preview visibility and access control separately. `noindex` does not make a page private.
- Contact mode `email` opens an email draft. Never show a sent or saved confirmation for that action.
- Contact mode `external` requires a configured public HTTPS endpoint. Require a successful HTTP response and explicit `{ "ok": true }` JSON before showing submission success.
- Client-side validation is for usability. The external service must validate and protect submissions on the server.
- All `NEXT_PUBLIC_` values are public and included in the build. Never place secrets in them or commit local credentials.
- Analytics, a CMS, authentication, CRM, and payments are optional future integrations, not included functionality to claim in UI or documentation.

## Validation and handoff

- Read the existing implementation before changing it. Follow the declared package versions and installed Next.js documentation.
- For routing, mode, contact, or build-setting changes, verify the relevant behavior with the existing checks and focused tests.
- Run `npm run check`, `npm test`, `npm run build`, and `npm run test:export` before a release. For changes to publication modes, verify both preview and production exports.
- Confirm production output contains the selected homepage and excludes the preview chooser and design-preview pages.
- Report what changed, what was actually checked, and any remaining limitation. Do not claim a deployment, delivered email, or passing check without observing it.
