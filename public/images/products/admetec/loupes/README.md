# `loupes/` — Admetec loupes

```
loupes/
└── <series>/                    galilean · prismatic · ergo · ergo-v
    ├── <model>/                   2.5x, 3.8x, 5.0x ... (ergo-v has ergo-v and ergo-v-pro)
    │   └── <frame>/                 blues · indie · jazz · soul · swing
    │       ├── <frame>-<colour>.jpg          the loupes on that frame in that colour
    │       └── <frame>-frame-thumbnail.jpg   the frame on its own
    ├── gallery/                   overview photos of the series
    └── archive/by-frame/          earlier frame photos, replaced by the model folders; not used by the site
```

`ergo-v/magnification/` holds the field-of-view pictures shown by the magnification chooser.

**How the product page uses it.** The frame and colour buttons on a loupe's page are built from that product's
`frameVariants` in `data/products.json`. Each photo is one entry whose key is `<frame>-<colour>`; a two-word colour uses one hyphen
(`bronze-and-blue.jpg` is the colour `bronze-blue`). A new frame also needs an entry in `data/frames.json`.
