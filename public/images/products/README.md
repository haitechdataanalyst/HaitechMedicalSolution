# `products/` — one folder per brand

```
products/
├── admetec/     loupes, lights, camera, frames        (the largest: about 940 files)
├── almadent/    chairs, handpieces, implant motors, piezo
├── bondent/     endodontics and imaging, grouped like the site's categories
├── medesy/      instruments by category
├── salli/       saddle chairs by model
├── strauss/     diamond burs by series
└── shared/      images used by more than one product (engraving previews)
```

Inside a brand the folder names follow the site's own category names, so a product at
`/product-category/bondent/endo-files/rotary-files/cc-premium` has its photo in `bondent/endo-files/rotary-files/`.

- `brand/` inside a brand folder holds brand-level banners, not product photos.
- `archive/` (where it appears) holds older originals that a newer set replaced. The site does not use them; they are kept, not deleted.
- `uncatalogued/` holds photos of products that have no page on the site yet.
