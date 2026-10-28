# Architecture

## Purpose

The starter separates business information, visual presentation, and publication settings. This lets a developer compare two homepage designs using the same facts, then publish one design without rebuilding the site's foundation.

The project produces a static website. It includes the visitor-facing pages and interaction code, but it does not include a database or a server-side application backend.

## Main responsibilities

| Location | Responsibility |
| --- | --- |
| `src/content/site.ts` | Typed business content shared by both design directions |
| `src/lib/site-settings.ts` | Parse and validate public build settings, publication mode, selected design, and contact mode |
| `src/lib/contact.ts` | Inquiry validation, email-draft construction, and explicit success-response recognition |
| `src/lib/metadata.ts` | Page metadata and indexing behavior derived from content and publication settings |
| `src/app/` | Next.js routes, page metadata, and exported site infrastructure |
| `src/components/design-one.tsx` and `design-two.tsx` | Separate compositions for Open Studio and Midnight Systems |
| `src/components/shared.tsx` | Common navigation, reveal behavior, FAQ, contact, footer, and design-review controls |
| `public/` | Publishable static assets |
| `out/` | Generated deployment output; regenerate rather than edit |

Presentation components should consume shared content without duplicating business facts. A visual change may be specific to one direction. A change to the client's email, service description, or name should normally happen in the shared content source.

## Publication modes

Preview mode exposes the chooser at `/` and the two design routes for review. Preview metadata discourages indexing.

Production mode renders the selected design at `/` and excludes the two preview routes from the export. A production build requires valid configuration so it cannot silently publish placeholder URLs or an unintended design.

The review route files are `src/app/design-1/page.preview.tsx` and `src/app/design-2/page.preview.tsx`. `next.config.ts` adds the `preview.tsx` page extension only in preview mode, using the same validated settings as the UI and metadata. In production these files remain in source control, but Next.js does not register them as routes. Ordinary `page.tsx` files, including the real homepage, are recognized in both modes. Keep the review suffix when editing those two pages.

This avoids generating an empty dynamic route with `generateStaticParams()`, which this Next.js version does not accept for static export. Switching modes changes route discovery without renaming, deleting, or restoring source files during a build.

`npm run build` first runs the `prebuild` hook: validate the configuration, then remove the previous generated `out/` directory with `scripts/clean-export.mjs`. This Next.js version can otherwise leave old exported pages behind, including review pages from an earlier preview build. The cleanup is anchored to this project's fixed `out/` path, refuses a symlink or non-directory there, and never removes source files or the development server's `.next` cache. Configuration validation runs first so an invalid setting does not discard the existing export. Always use `npm run build` instead of invoking `next build` directly when preparing deployable output.

This is a build-time decision. The static host serves the files produced by that build; it does not choose a design dynamically per visitor. Rebuild to switch modes, switch the selected design, or change public environment settings.

Tests should verify the exported route set as well as the selected component. Hiding links to preview pages is not enough if the pages are still exported.

Search directives and preview access are separate concerns. `noindex` requests that search engines omit a page; it does not authenticate visitors. Use hosting access controls when restricted previews are required.

## Contact boundary

The default contact mode prepares an email draft through the visitor's email application. No website server receives the message in that flow, and opening a draft is not a delivery confirmation.

External contact mode is an optional browser-to-service integration. The client posts JSON to a configured public HTTPS endpoint. It requires both a successful HTTP response and explicit `{ "ok": true }` JSON before it displays success.

The external service must validate the submission independently and own abuse controls, delivery or storage, and any secret credentials. It must also support requests from the site's public origin. None of those backend responsibilities are supplied by static export.

Do not introduce a misleading success state when an endpoint is absent or a request fails. Keep the default contact behavior useful and clearly labelled.

## Public configuration

`NEXT_PUBLIC_` variables are public. They may be visible in browser code and are resolved into the exported site during the build.

Use them for publication mode, design selection, the public website origin, and a public form endpoint. Do not use them for private service tokens, database credentials, SMTP passwords, or server-side verification secrets.

The starter has no default analytics loader. A future analytics integration should be an explicit project decision with its own configuration, behavior, and verification.

## Static deployment constraints

The build emits files in `out/`. This is suitable for a static hosting service with normal directory/index routing.

Features that require a request-time server, such as authenticated dashboards, private database queries, secret-bearing form handlers, or payment webhooks, need a separate service or a deliberate change to the deployment architecture. Adding a file that appears to be an API route does not turn a static host into an application server.

Keep image handling, fonts, and links compatible with the static output. Validate the deployed build, because local development behavior is not sufficient evidence that an exported route or asset is available.

## Reuse and extension

For a new client, copy the starter into a distinct repository and customize the shared content, assets, and designs. Keep their deployment settings independent of other clients.

Add service pages, articles, a CMS, analytics, or other integrations when the project requires them. Treat each addition as actual scope: provide the implementation, configuration, ownership, and validation instead of implying that a placeholder integration is functional.

The starter intentionally has no private platform contract. It uses ordinary source-controlled content and components, so future developers can maintain it without a MEGA/Gomega account.

## Verification

`npm run check`, `npm test`, `npm run build`, and `npm run test:export` are the release verification commands. Run export verification after the build with the same environment settings. Check both publication modes after changing route generation or build settings. Review the browser experience after changing layout, navigation, motion, or contact interactions.

Documentation should distinguish commands that exist, checks that were run, and checks that passed. A copied evidence report does not verify a new client build.
