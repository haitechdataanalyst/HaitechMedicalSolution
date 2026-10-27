# `public/` — static assets

Everything here is served as-is from the site root: `public/brand/haitech/logo.png` is `/brand/haitech/logo.png`.

## Layout

```
public/
├── favicon.ico                    must stay at the root (browsers ask for /favicon.ico)
├── google893dc9e00413be13.html    Search Console verification, must stay at the root
├── llms.txt                       read by AI crawlers at /llms.txt, must stay at the root
│
├── brand/
│   ├── haitech/                   Haitech's own marks: logo, mark, email logo, default social preview (og-default.png)
│   └── manufacturers/             one logo per manufacturer: <brand>-logo.<ext>
│
├── images/
│   ├── site/                      images that belong to the site itself, not to a product
│   │   └── hero/                  home page hero images
│   │   └── placeholder.svg        shown wherever a product image is missing
│   ├── icons/                     custom SVG icons
│   ├── articles/                  images used inside support articles
│   ├── team/                      team portraits: <first>-<last>.jpg
│   └── products/
│       ├── shared/                images used by more than one product (engraving previews)
│       ├── admetec/
│       │   ├── brand/             brand-level banners
│       │   ├── loupes/<series>/<model>/<frame>/<frame>-<colour>.jpg
│       │   │                      the photos behind the product-page frame and colour selector
│       │   │                      (series: galilean, prismatic, ergo, ergo-v; frames: blues, indie, jazz, soul, swing).
│       │   │                      gallery/, by-frame/ and magnification/ beside them are older originals.
│       │   ├── lights/            flamingo/, headlights/{wired,wireless}/, models/<light>/
│       │   ├── frames/            our-frames/, select-frames/
│       │   ├── flamingo/          camera photography; gallery/ for the product gallery
│       │   └── catalog/
│       ├── almadent/              chairs/, auxiliary/, handpiece/, electric-motor/, three-in-one-piezo/
│       ├── bondent/               product photos (flat)
│       ├── medesy/                one folder per instrument category
│       ├── salli/                 product photos (flat)
│       └── strauss/               one folder per bur series
│
├── videos/
│   └── home-hero/                 the three hero slides (1080p, 540p, poster) and source/ (the 4K originals)
│
└── documents/
    └── catalogues/<brand>/        downloadable PDFs
```

## Rules

- **Names are lowercase kebab-case**, no spaces, no parentheses, no underscores: `cc-premium.jpg`, not `CC Premium (1).jpg`. Linux hosts are case-sensitive, and spaces break unquoted URLs.
- **One home per image.** Put it under the brand and product area it belongs to; use `products/shared/` or `site/` only when it really is shared.
- **Product, category, frame and headlight photography is served from Cloudinary** (the data files hold the URLs). The copies under `images/products/` are the originals, kept in the repository; only the paths named in code (the brand pages, logos, hero, team) are served from here.
- **Reference an asset by its full path** (`"/images/team/viren-gosar.jpg"`), not by building it from pieces, so it can be found by searching the code.
- **A frame photo is named `<frame>-<colour>.jpg`** and its colour becomes the key `frame-colour` in the product's `frameVariants` (`data/products.json`); a colour made of two words uses a single `-` (`bronze-and-blue.jpg` is the colour `bronze-blue`). A new frame also needs an entry in `data/frames.json`.
- **Moving a file changes its URL.** Redirects for the old URLs that code or data used live in `data/asset-redirects.json` and are applied by `next.config.ts`.
