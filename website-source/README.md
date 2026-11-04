# 伍星的工程手记 — editable website source

Live site: https://conan-wx.github.io/

This directory contains the React/Vite source for a free static GitHub Pages portfolio. It uses real HTML pages and a locally bundled StPageFlip engine with a small animation cleanup patch.

```powershell
npm ci
npm run dev
node build.mjs
node check-public-mirror.mjs
npx tsc --noEmit
node src/vendor/check-page-flip.mjs
```

The build writes to the sibling `public-mirror-dist/` directory. Copy those compiled files to the GitHub Pages repository root and commit/push to main. Preserve `.git`, `.nojekyll`, README.md and the `website-source/` directory when replacing compiled assets.

## Content updates

1. Edit `public/site-content.json` → `content` and keep `src/resume-content.json` identical.
2. Publish only posts whose status is `published`; never copy drafts or private contact details.
3. Edit `src/book-editorial.ts` for the condensed project page summaries and toolkit grouping. Complete technical details are retained in the public JSON and modal reader.
4. The current book is paginated for ten projects, two internships and seven awards. If those counts change, update the page numbering, chapter ranges and total in src/page.tsx.
5. Rebuild and run checks before copying to the public root. GitHub Pages publishes main `/` automatically.

The static site has no online editor, authentication or server write API. Its content is intentionally public. See BOOK-RELEASE.md and DESIGN-REFERENCES.md for design and verification details.
