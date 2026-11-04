# 伍星的工程手记

Public site: https://conan-wx.github.io/

## Design

An original engineering notebook, with a forest-green woven cover, gold constellation diagram, warm paper, portrait collage, technical line drawings and chapter ribbons. Interaction references and licenses are recorded in DESIGN-REFERENCES.md. All resume facts come from the existing approved public content; the redesign adds no personal claims.

22 pages: cover; about; education; two toolkit pages; ten project pages; two internships; two awards pages; notes; contact; back cover.

## Interaction

- Click the cover button to open, drag outer corners, swipe horizontally on touch devices, or use previous/next controls.
- Focus the book and use Left/Right, Home/End. Reduced motion preference uses instant navigation.
- Desktop spreads, mobile single pages. Narrow phones receive taller pages. Vertical scrolling remains available.
- Native modal table of contents and complete project notes, with Escape and focus restoration.
- Continuous reading, chapter jump links, paper/night palette persisted locally, focus mode, copy email.
- Public static display only; content updates require rebuilding and publishing. No online owner editor or new database was introduced.

## Validation

- Production build, strict TypeScript, published-content safety check.
- Vendored engine RAF lifecycle check verifies cancellation and destroy.
- Browser checks: desktop cover/spreads; 390px and 320px single pages; open cover; corner drag from project 6 to 7; contents jump; full project details; Escape; keyboard navigation; reading mode; night palette; no horizontal overflow.
- Continuous reading renders all 22 pages and full resume data remains in public/site-content.json. No drafts are published.

The library is bundled locally; there are no runtime CDN, external font or original-host dependencies. See src/vendor/README.md for the small engine lifecycle correction and /THIRD-PARTY-NOTICES.txt for MIT license.
