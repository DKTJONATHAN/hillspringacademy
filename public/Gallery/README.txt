Gallery photos (automatic)
==========================

1. Put image files in this folder (public/Gallery/).
2. Supported types: .webp .jpg .jpeg .png .gif .avif
3. Commit and push (or run npm run build / npm run dev).

The site scans this folder at build and dev time. New pictures appear on
/gallery automatically — you do NOT need to edit data.js.

Tips
----
- Prefer short filenames without spaces: campus-gate.webp, sports-day.jpg
- Avoid clear face-forward portraits of children.
- Optional alt-text overrides live in src/data.js under GALLERY_OVERRIDES.
