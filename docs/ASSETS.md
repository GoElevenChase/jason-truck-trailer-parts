# Assets

Jason Truck & Trailer Parts had no existing website to source media from, so the photography is free stock from Pexels (Pexels License: free for commercial use, no attribution required). These are illustrative photos, not photos of the business's own premises or stock. Replace them with client photography when available.

| File | Pexels photo ID | Used in |
| --- | --- | --- |
| `public/images/truck-garage-night.jpg` | 7019372 | A hero |
| `public/images/engine-bw.jpg` | 190574 | A feature 01, B featured |
| `public/images/trailers-dock.jpg` | 27099093 | A feature 02 |
| `public/images/brake-disc-lift.jpg` | 4022545 | A feature 03 |
| `public/images/black-trucks-row.jpg` | 12396171 | A runaround, B philosophy |
| `public/images/truck-backlit-road.jpg` | 28264496 | A details band |
| `public/images/brake-disc-studio.jpg` | 4022543 | A details band, B feature 03 |
| `public/images/white-trucks-road.jpg` | 2199293 | B hero |
| `public/images/engine-bay.jpg` | 3686360 | B feature 01 |
| `public/images/white-semi-side.jpg` | 18468424 | B feature 02 |
| `public/images/undercarriage.jpg` | 8986137 | B feature 04 |
| `public/images/trucks-sunset-lot.jpg` | 35097902 | B contact |

Photo pages: `https://www.pexels.com/photo/<id>/`.

Photos are downloaded at 2880px wide (portrait shots scaled to 1920px) so they stay sharp on large and high-density screens.

`public/previews/design-1-desktop.webp` and `design-2-desktop.webp` are 2x screenshots of each design's first screen, used by the chooser at `/`. Regenerate them after design changes.

The JASON wordmark is typeset in Archivo (expanded, extra-bold); there is no separate logo image file. Fonts in `public/fonts/` are under the SIL Open Font License (Manrope, Barlow Condensed, Archivo); license texts sit beside them.

## Before production

`src/content/site.ts` leaves `email`, `phone` and `url` empty because no contact details were supplied. The pages show "Contact details to be added" and the form will not open an email draft until an email is set. `npm run build` in production mode will refuse to build while these are empty.
