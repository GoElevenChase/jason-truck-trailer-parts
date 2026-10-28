# Set up a client website

Use this guide when turning the starter into a specific client's project. A new client should have their own repository or independent working copy so their content, configuration, and releases stay separate.

## 1. Establish the business facts

Gather the business name, approved description, services, audience, service area, email, phone, and primary customer action. Confirm the facts with the client or their current authoritative material.

Edit `src/content/site.ts`. This is the shared content source for both homepage designs, so the comparison stays focused on presentation while the business information remains consistent.

| Content field | What to replace |
| --- | --- |
| `business.name` | The public business name |
| `business.email` | The verified destination for direct inquiries and email drafts |
| `business.url` | The business's public website URL |
| `business.tagline` | The business's short positioning statement |
| `business.description` | The default search and social-sharing description |
| `services` | Service names, descriptions, and supporting details |
| `principles` | The approach or working principles the client actually follows |
| `process` | The agreed customer journey or delivery process |
| `faqs` | Questions and accurate answers for this business |
| `nav` | Navigation labels and matching section links |

The website URL in business content and `NEXT_PUBLIC_SITE_URL` have separate jobs: business content identifies the business, while the environment setting describes this deployment's public origin. A design preview can be hosted separately from the client's existing website.

Replace starter copy that does not apply to the client. Keep statements specific and supportable. If a requested testimonial, customer logo, rating, or result is not verified, omit it until the client approves a real one.

Shared content does not contain every design-specific line. The initial designs use a software-agency story. For another industry, also review these locations:

| File | What to customize |
| --- | --- |
| `src/components/design-one.tsx` | Open Studio hero, capability band, section headings, introductions, and calls to action |
| `src/components/design-two.tsx` | Midnight Systems hero, section headings, introductions, process heading, and calls to action |
| `src/components/shared.tsx` | Brand treatment, shared button labels, FAQ heading, contact heading and supporting copy, form labels, and footer copy |
| `src/components/system-visual.tsx` | Illustrative workflow labels, software imagery, and embedded brand initials |
| `src/components/design-chooser.tsx` | Mini homepage previews and direction descriptions; keep these consistent with the full designs |
| `src/app/globals.css`, `design-one.css`, and `design-two.css` | Shared typography, colors, and the two visual styles |

Keep the two visual directions distinct while using the same verified offer. The illustrative software dashboard is artwork, not a working CRM; replace or adapt it when it does not explain the client's business.

Review every contact and external link. A new client's page should not retain the previous client's email address, booking page, social profile, policy link, or destination domain.

## 2. Add the right assets

Replace the assets used by the content and design components. Preserve sensible file names, responsive sizing, and dimensions that reduce layout movement.

Replace `public/og-image.png` with an appropriate 1200 × 630 sharing image when adapting the starter for a client. Review the favicon and the brand treatment as well; changing the business name does not automatically create new visual assets.

Use a suitable logo for each background. Write alternative text for informative images; decorative images should not add unnecessary screen-reader narration. Confirm the client has permission to publish the assets.

Illustrative artwork can establish a mood, but must not imply an actual team member, location, customer, or completed project when it does not depict one.

## 3. Run the design preview

Use Node.js 22.13 or newer and the npm version recorded in `package.json`. Install dependencies using the checked-in lockfile:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The default settings use preview mode:

```dotenv
NEXT_PUBLIC_SITE_MODE=preview
NEXT_PUBLIC_SELECTED_DESIGN=design-1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_MODE=email
NEXT_PUBLIC_CONTACT_ENDPOINT=
```

In preview mode, `/` is the chooser and both `/design-1` and `/design-2` are available. The designs share business information but have separate visual compositions.

Run the checks before sharing:

```bash
npm run check
npm test
npm run build
npm run test:export
```

Review the built site as well as the development server: `npm start` serves the generated `out/` directory locally. Use a narrow mobile viewport and a desktop viewport. Check the full page, navigation, contact area, hover and focus states, and reduced-motion behavior.

If hosting a preview, rebuild with the preview URL where appropriate. Preview pages discourage search indexing, but this is not an access restriction. Use the host's access controls for a private client review.

## 4. Choose the contact flow

### Email draft

This is the default. Set the client's verified destination email in `src/content/site.ts`.

Submitting the draft form opens a `mailto:` draft in the visitor's email application. The visitor must send it there. The website does not claim that the inquiry was delivered or saved.

Check the visible email address, generated draft destination, subject, and body. Verify that entered text is encoded correctly. A visible direct email link is useful when the visitor has no configured mail application.

The form's submit control becomes available after its client-side behavior is ready. Without JavaScript, the visible direct email links remain available and the form does not fall back to placing inquiry details in a page URL.

### External endpoint

Enable external mode only after the receiving service is ready:

```dotenv
NEXT_PUBLIC_CONTACT_MODE=external
NEXT_PUBLIC_CONTACT_ENDPOINT=https://example.com/contact
```

The URL above is an explanatory placeholder. Replace it with the real HTTPS endpoint before building. It must accept the contact component's JSON payload and allow requests from the deployed website's origin.

The current request body has these fields:

| JSON field | Meaning |
| --- | --- |
| `name` | Visitor's name; the client checks 2–120 characters |
| `email` | Visitor's email; the client checks its basic format and a 254-character maximum |
| `service` | Selected service title, or an empty string for a general inquiry |
| `message` | Project description; the client checks 10–4,000 characters |
| `website` | Honeypot field; a normal visitor leaves it empty |
| `formId` | `project-inquiry` |
| `submissionId` | A generated UUID for that submission attempt |

The source contract is in `src/lib/contact.ts`; `ContactSection` in `src/components/shared.tsx` assembles and sends the request. The fetch uses `Content-Type: application/json` and omits cross-origin credentials. Configure the receiving service's CORS behavior to support that request and its preflight.

Return a successful HTTP status and JSON `{ "ok": true }` only after the request has actually been accepted by the service. The site treats other results as failures and keeps the inquiry available for correction or retry.

The service owns server-side validation, anti-spam controls, rate limiting, delivery or storage, and any credentials. Browser-side validation alone does not provide those protections.

Test both a confirmed successful submission and an error response. Confirm that a received inquiry reaches its intended destination before launching the form. Do not use real customer data for routine verification.

## 5. Prepare the selected production design

Once the client has selected a direction, set:

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_SITE_MODE` | `production` |
| `NEXT_PUBLIC_SELECTED_DESIGN` | `design-1` or `design-2` |
| `NEXT_PUBLIC_SITE_URL` | The client's verified public HTTPS origin |
| `NEXT_PUBLIC_CONTACT_MODE` | The contact mode you verified |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Real endpoint for external mode; unused for email mode |

Production URLs must not be localhost, example, or placeholder destinations. Supply the actual domain in your local release environment or hosting project's build settings.

The selected design becomes `/`. The chooser and the separate design-preview routes are excluded from the production export. This avoids shipping the client comparison as the public website.

These environment values are incorporated into the static build. Rebuild after every change; copying an earlier `out/` directory does not update its settings.

## 6. Approve production content

Before launch, confirm the final copy, services, images, destination email and phone, metadata, social-sharing content, and any external links.

Policy links should lead to the client's approved documents. This starter does not supply legal advice or approved policy text for each client. Remove an unavailable optional policy link rather than linking to a placeholder or another business's document.

If replacing an existing website, inventory its existing URLs and arrange appropriate redirects at the host or routing layer. A homepage starter does not automatically preserve an older site's service pages, articles, or search visibility.

## 7. Build and deploy

```bash
npm run check
npm test
npm run build
npm run test:export
```

Publish the contents of `out/`. For a Git-connected static host, configure installation as `npm ci`, the build as `npm run build`, and the published directory as `out` where those settings are requested.

Confirm the deployed site uses the expected domain and selected design. Verify the actual public output, not only a local screenshot.

| Check | Expected result |
| --- | --- |
| Homepage | Selected design at `/` |
| Design review | No chooser or exported `/design-1` and `/design-2` pages |
| Metadata | Real domain, correct business name and description |
| Search directives | Production behavior, not leftover preview restrictions |
| Contact | Verified draft destination or confirmed external delivery |
| Mobile navigation | All destinations reachable, menu usable by touch and keyboard |
| Unknown URL | Appropriate missing-page response |
| Assets | No broken images, missing fonts, or unintended previous-client branding |

Keep the source repository, lockfile, deployment configuration, and the client's approved content together for future maintenance. Record the selected design and contact mode in the project's handoff notes.
