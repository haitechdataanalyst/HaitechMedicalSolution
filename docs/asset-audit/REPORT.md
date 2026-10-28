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
