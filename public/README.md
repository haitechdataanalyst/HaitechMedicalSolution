# `public/` — static assets

Everything here is served exactly as it is from the site root: `public/brand/haitech/logo.png` is `https://<site>/brand/haitech/logo.png`.
Read the tree one level at a time; every folder below the first level has its own `README.md` that explains what is inside.

## Level 1 — what kind of file is it?

| Folder | What it holds |
|---|---|
| [`brand/`](brand/README.md) | Logos: Haitech's own and one per manufacturer |
| [`images/`](images/README.md) | Every photograph and illustration |
| [`videos/`](videos/README.md) | Video files (the home page hero) |
| [`documents/`](documents/README.md) | Downloadable files such as catalogue PDFs |
| `favicon.ico`, `google893dc9e00413be13.html`, `llms.txt` | Files that must sit at the site root because browsers, Google Search Console and AI crawlers ask for them there. Do not move them. |

## Levels 2, 3, 4 — how an image is found

```
images/                      kind of image
├── site/                      the website itself (hero, placeholder)
├── articles/                  pictures used inside support articles
├── team/                      team portraits
├── icons/                     custom SVG icons
└── products/                  everything that is sold, one folder per brand
    └── <brand>/                 admetec, almadent, bondent, medesy, salli, strauss
        └── <product area>/        what the product is, named like the site's own categories
            └── <product or model>/  one product, then (for loupes) one folder per frame
```

## Rules for every file

- **Lowercase kebab-case**, no spaces, brackets or underscores: `cc-premium.jpg`, not `CC Premium (1).jpg`. Linux hosts are case-sensitive and spaces break links.
- **One home per file.** Put it in the brand and product area it shows. Use `images/products/shared/` or `images/site/` only for what is really shared.
- **Reference a file by its full path** (`"/images/team/viren-gosar.jpg"`) so a search of the code finds it. Never assemble a path from pieces.
- **Every photo and video the site shows is served from Cloudinary**, in a media-library folder tree that mirrors this one under `Haitech Medical Solution/`. Code and data hold Cloudinary URLs; `next.config.ts` points `next/image` at `lib/cloudinary-loader.ts`, which adds `f_auto,q_auto` and a width. Add a new image by uploading it to the matching Cloudinary folder, not by adding it here. Only the fallback `images/site/placeholder.svg`, `favicon.ico` and the three root files are served from this folder. Local copies of everything else were removed on 2026-10-28 (list in `docs/asset-audit/removed-local-media.csv`, backup in `D:/haitech-asset-backup-2026-10-27`).
- **Moving a file changes its URL.** Old URLs that code or data used are kept alive by `data/asset-redirects.json`, applied in `next.config.ts`.
