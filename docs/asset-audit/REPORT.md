# Image asset clean-up and Cloudinary organisation

Date: 2026-10-27. Everything below was measured, not assumed; where something could not be verified it says so.

## 1. Local clean-up

| | Count | Size |
|---|---:|---:|
| Images scanned (every tracked image in the repository) | 1,323 | 608 MB |
| Removed: not named by any code or data, and the Cloudinary copy answers HTTP 200 | 702 | 437 MB |
| Removed: byte-identical copy of a retained file | 72 | 8 MB |
| **Removed in total** | **774** | **445 MB** |
| Retained | 554 | 135 MB |

**How a file was judged.** A file counts as used when a code or data file names it by its full path (checked with a boundary-aware pattern, so a path that merely appears inside a Cloudinary URL does not count), when a folder constant plus the file name in code reaches it, or when it must sit at the site root. Dynamic paths were searched for and none are built at runtime. A file was removed only if it passed **all** of: not named anywhere (re-verified immediately before deletion), a replacement exists (Cloudinary copy that returned HTTP 200, or a byte-identical retained local file), and a verified copy had been written to the backup.

**Exact duplicates (SHA-256).** 233 groups, 605 files. Consolidated by pointing references at one copy first:
- the two identical article demo images -> one (`article-loupe-selection.tsx` updated);
- the Ergo V magnification chooser pointed into `archive/by-frame/`; it now points at the identical photo in the model folder;
- 75 copies of the 5 frame thumbnails (one identical copy per model) -> 5 files in `images/products/admetec/frames/thumbnails/`, and `data/frames.json` updated.

**Visual duplicates.** 5,227 pairs have a perceptual hash within 3 bits. Almost all are the same loupe in different colours or on different frames, which look alike by outline but are different products, so **none were removed**. The list is in `duplicates.json`.

**Recoverability.** Each removed file is listed with its replacement in `removed-files.csv`. A byte-verified copy of every one is in `D:\haitech-asset-backup-2026-10-27` (774 files, 447 MB). The git tag `pre-asset-cleanup` also holds them: `git checkout pre-asset-cleanup -- <path>`.

## 2. Cloudinary

Account `gwnakzdo`. Inspected read-only first (Admin API).

| | Before | After |
|---|---:|---:|
| Image assets | 781 | 1,044 |
| Assets in a folder | 1 | 1,044 (100%) |
| Folders (all hold assets, none empty) | 1 | 217 |

- **Finding:** 780 of 781 assets had no folder. Their public IDs look like paths (`haitech/images/products/...`) but the Media Library only shows `asset_folder`, so everything sat in one flat list.
- **Existing assets:** 773 were given an `asset_folder` mirroring the local hierarchy under the existing root folder `Haitech Medical Solution/` (for example `Haitech Medical Solution/images/products/admetec/loupes/ergo/5.0x/blues`). This changes only the folder; public IDs and delivery URLs are unchanged, which was checked on a probe asset first. Plan: `cloudinary-folder-plan.json`.
- **Uploaded:** 263 new images (79 MB), 0 failed. Each URL answers HTTP 200 and its byte size equals the local file. Public IDs follow the account's existing convention (`haitech/` + path, lowercase, dots as hyphens), folders mirror the local path. Mapping: `cloudinary-upload-map.json`; plan: `cloudinary-upload-plan.json`.
- **Reused, not uploaded:** 206 local files that already had an identical copy (same bytes and pixel size) on Cloudinary.
- **Not touched:** 8 assets that are not ours (`sample`, `cld-sample*`, `main-sample`, `My Brand/mark_...`).
- **Nothing on Cloudinary was deleted or overwritten** (`overwrite: false`).
- Folder assignment is limited to 500 Admin API calls an hour, so it ran in two batches.

## 3. References changed

| File | References switched from a local path to a Cloudinary URL |
|---|---:|
| `data/products.json` (frame and colour photos, electric motor, piezo) | 465 |
| `data/frames.json` (Swing) | 7 |
| `data/headlights.json` | 3 |

Every URL was fetched first and returned 200. Paths named in code (brand pages, logos, hero, team, article images) stay local, so Next.js image optimisation, `sizes`, `priority` and the Open Graph image (`/brand/haitech/og-default.png`, which still answers 200) behave as before. Earlier in the same piece of work: 52 + 23 paths were rewritten for the folder reorganisation, and `data/asset-redirects.json` (66 redirects) keeps old URLs alive.

## 4. Final hierarchies

Local (`public/`): see `public/README.md`.
Cloudinary: `Haitech Medical Solution/` -> `images/{products,team,site,articles}` and `brand/manufacturers`, where `products/<brand>/...` mirrors `public/images/products/<brand>/...` (admetec: `loupes/<series>/<model>/<frame>`, `lights/{wired,wireless}`, `camera/flamingo`, `frames`).

## 5. Validation

- Crawl of 65 pages on desktop and the 15 key pages on mobile (a sitemap sample plus every brand page, the frames page and product pages): **952 images, 0 broken**.
- Frame and colour switching on Prismatic, Galilean, Ergo and Ergo V Pro pages: the image changes for each, served from Cloudinary, 0 failed requests.
- `tsc --noEmit`: 0 errors in project code.
- Lint: 16 errors remain; all are existing rule violations (`react-hooks/set-state-in-effect`, unescaped apostrophes) on lines this work did not touch.
- **Not run:** `next build` (it would overwrite the `.next` folder the running dev server uses, and the disk is almost full) and tests (the project defines none). Run `npm run build` before deploying.

## 6. Unresolved or needing a decision

1. **Live database.** The deployed site reads product data from the database; run `npm run db:seed` after deploying so it picks up the new frame photos, Prismatic frames, Swing and the new image URLs.
2. **Cloudinary public IDs keep their old structure** (for example `loupes-ergo-5-0x/blues-frame/...`) while folders show the new one. Renaming public IDs would break every old URL, including the ones in the live database, until it is reseeded. Not done on purpose; it can be done together with a reseed.
3. **Cloudinary duplicates:** 88 groups with identical bytes and size (97 extra copies, about 30 MB). 87 existed before this work (earlier uploads from duplicate local files); 1 is new: Prismatic 3.8x and 4.8x use the same `swing-black.png`, because the supplied photo set held the same picture for both models. Not deleted, because the old ones may be in use. List: `cloudinary-duplicates.json`. Please check whether Prismatic 4.8x needs its own Swing photo.
4. **Ergo V magnification preview:** `admetec-ergo-v-74x-350x350.webp` (used for Ergo V 7.0x) is byte-identical to the Ergo V Pro 7.4x preview. Possibly the wrong picture for 7.0x; left as is.
5. **Missing photos that were never in the repository:** six testimonial photos named in `data/testimonials.json` (`/images/testimonials/*.jpg`). Not caused by this clean-up (no commit ever held them). The file does not appear to be used by the home page.
6. **Local originals of the newly uploaded photos are retained** (about 435 frame photos, 117 MB) although the site now serves the Cloudinary copies. They are safe to remove with the same procedure once you confirm Cloudinary is the source of truth.
7. **Disk:** drive C: has about 1.8 GB free. The backup is on D:.

## 7. Final Cloudinary organisation audit (2026-10-28)

Goal: every image in a clear folder, none unorganised, none misplaced. Repeatable with `scripts/audit-cloudinary-folders.py` after refreshing the two inventory files; result in `cloudinary-final-audit.json`.

**Corrections made in this pass** (all metadata-only: no asset deleted, renamed or re-uploaded, no URL changed):
- 8 assets that are not ours (7 Cloudinary demo images at the library root and `My Brand/mark_...`) moved into `Haitech Medical Solution/_cloudinary-defaults/`; the then-empty `My Brand` folder removed.
- 20 old magnification sets (Galilean 2.5x/2.7x/3.2, Prisma 4.0x/4.8x/5.5x) were sitting in a folder called `by-frame` although they are not frame photos; moved to `.../loupes/<series>/archive/<model>/`. The 8 folders this left empty were removed.
- Unused and duplicate images are **tagged, not deleted**: `unused-by-current-site` (317 assets, 305 MB, nothing in the current code or data names them) and `duplicate-content` (92 assets, extra copies of an identical file; the copy in use, or else the one in the primary folder, is the one left untagged). Filter by tag in the Media Library. Reason for tagging: the deployed backend database may still hold the old URLs until `npm run db:seed` runs, so deleting now could break images. After reseeding and checking the live site, these can be deleted in one step (`cloudinary-final-plan.json` lists them; to undo a tag, remove it).

**Result: 14 of 14 checks pass.**

| Check | Result |
|---|---|
| Assets in the library / assets with no folder | 1,044 / 0 |
| Assets outside `Haitech Medical Solution/` | 0 |
| Public IDs changed, assets deleted or added | 0 |
| Folder paths outside the hierarchy (`images/products/<brand>/...`, `images/{team,articles,icons,site}`, `brand/{haitech,manufacturers}`, `_cloudinary-defaults`) | 0 |
| Uppercase or spaces below the root folder | 0 |
| Empty folders (225 -> 217 folders, all hold assets) | 0 |
| File name disagrees with its folder (loupes, Strauss series, Salli models, frames) | 0 |
| Uploaded images whose Cloudinary folder differs from the local folder (263 checked) | 0 |
| Delivery URLs that do not answer HTTP 200 | 0 of 1,044 |
| Cloudinary images used by the site that are missing | 0 of 719 |
| Images in use that carry the `unused` tag | 0 |

**Limits of this audit.** A file name agreeing with its folder is checked by naming rules, not by looking at each picture; the folder placement itself comes from where each image lived locally and from the product data. The site was not re-crawled after this pass (the dev server was not running); only folder and tag metadata changed and every URL was re-fetched. The local tree is now a subset of the Cloudinary tree: 87 Cloudinary folders have no local counterpart because their local copies were removed in the clean-up and now live only on Cloudinary.

## 8. Serving every image and video from Cloudinary (2026-10-28)

Measured from the browser's own network requests across all 212 sitemap pages plus cart, login, register, contact and search (desktop 1440px), not from reading the code.

| | Before | After |
|---|---:|---:|
| Distinct media URLs requested | 335 (334 images, 1 video) | 532 images (one URL per width the pages ask for) |
| Served from Cloudinary | 261 (78%) | 526 (99%) |
| Served from the local `public/` folder | 73 | **0** |
| Other hosts | 1 (Google Maps) | 6: 5 Google reviewers' profile pictures and the Google Maps static map |
| Requests that failed (HTTP 400 or above) | 0 | 0 |
| Passed through the app server's image optimiser (`/_next/image`) | all of them | **0** |

**What the 73 local requests were:** 34 product and brand photos, 23 team portraits, 7 manufacturer logos, 5 article images, 2 Haitech logos and the Admetec logo, and the home hero video.

**What changed**
- 18 files had no Cloudinary copy and were uploaded without overwriting (folder = local path): Haitech logo, mark and share image, Admetec's webp logo, 5 team portraits, the 6 hero videos and 3 posters; map in `cloudinary-media-upload-map.json`.
- 114 local paths in code and data (27 files) now hold verified Cloudinary URLs, each fetched first and answering HTTP 200.
- `lib/cloudinary-loader.ts` is the `next/image` loader: `f_auto` (AVIF/WebP), `q_auto`, `c_limit` (never enlarge) and the width Next asks for, so Cloudinary does the resizing and the app server does none. The 4 plain `<img>` tags in cart, checkout and inventory, which fetched full-size originals, use the same URL builder at 128-768 px.
- **Videos are deliberately not transformed.** A video URL with `f_auto,q_auto` returns `Accept-Ranges: none` (no seeking, no partial download); the plain upload returns `206 Partial Content`. The hero files were already encoded at 1080p and 540p, and the component already loads only the slide in view, at the size that suits the screen, and none for reduced-motion or Save-Data visitors.
- Above-the-fold and lazy loading were already correct (the hero poster is the preloaded LCP image; other images load lazily) and were not changed.

**Measured effect.** On a random sample of 79 images the page asked for, the delivered files total 0.6 MB against 23.9 MB for the originals (98% smaller; the largest, a 3.4 MB photo, arrives as 1 KB at thumbnail width). The logo went from a 59 KB PNG to 13 KB WebP. Not measured: Lighthouse, LCP or total page weight before and after, because the earlier state was not captured; run Lighthouse on the deployed site for those.

**Local media removed.** 555 of 562 media files (139 MB) that no code or data names and whose Cloudinary copy answers 200, each copied to `D:/haitech-asset-backup-2026-10-27` first and listed with its Cloudinary URL in `removed-local-media.csv`. The git tag `pre-media-cleanup` also holds them. The 64 redirects that pointed at a removed file now point at its Cloudinary URL.

**Remaining local media (7 files)**
| File | Why it stays |
|---|---|
| `images/site/placeholder.svg` | the fallback shown when an image fails; it must not depend on Cloudinary being reachable |
| `favicon.ico`, `llms.txt`, `google893dc9e00413be13.html` | must be served from the site root |
| `brand/haitech/logo-email.png`, `images/icons/premium-badge.svg` | not on Cloudinary and not used by the site (the email logo is for outgoing mail; the badge is unreferenced); not uploaded because nothing needs them |
| `videos/home-hero/source/website-carousal*.mp4` (3, 21.8 MB) | the 4K originals the hero videos were encoded from; never served |

**Needs a decision**
1. **Cloudinary cost.** `next/image` no longer caches images on your server, so each distinct width is a Cloudinary transformation, cached after its first request. Usage was 1.9 credits at the start of this work; check it in the Cloudinary dashboard after a week of real traffic.
2. **Third-party images.** Google reviewers' avatars and the static map come from Google and are not ours to move.
3. **Six testimonial photos** named in `data/testimonials.json` do not exist anywhere; that file is not used by the home page.
4. **Deploy order.** Push, deploy, then run `npm run db:seed`; old URLs on the live site keep working through `data/asset-redirects.json`.
5. **Not run:** `next build` (it would overwrite the dev server's `.next`) and tests (none defined). Run `npm run build` before deploying. The hero video was checked by its `src` and a byte-range request, not by playing it, because the headless browser has no H.264 decoder.
