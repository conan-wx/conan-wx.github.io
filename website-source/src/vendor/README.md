# StPageFlip local lifecycle patch

`page-flip.js` is the ESM bundle from `page-flip@2.0.7`, copied from `dist/js/page-flip.module.js`. Upstream: https://github.com/Nodlik/StPageFlip. Copyright (c) 2020 Nodlik, MIT. Full license: `public/THIRD-PARTY-NOTICES.txt` (shipped at `/THIRD-PARTY-NOTICES.txt`).

The upstream `Render.start()` recursively schedules `requestAnimationFrame`, but `PageFlip.destroy()` does not stop it. Recreating the book could leave loops rendering detached DOM.

Local changes are limited to two lifecycle locations:

1. `Render.start()` first stops a previous loop, tracks the current frame ID, and guards callbacks with `_renderLoopActive`. A new `Render.stop()` disables the loop, cancels the pending frame, clears its ID and discards any active animation.
2. `PageFlip.destroy()` calls `this.render.stop()` before removing UI and the book element.

No geometry, input, layout or page-turn behavior was changed. Import this local bundle from the application rather than the unpatched npm entry point. When upgrading upstream, review and reapply the lifecycle patch.

Check syntax and cancellation behavior:

```text
node --check src/vendor/page-flip.js
node src/vendor/check-page-flip.mjs
```

The check runs the bundle in an isolated Node VM with a deterministic RAF queue. It verifies only the patched lifecycle, without starting a browser.
