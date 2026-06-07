# AGENTS.md

## Cursor Cloud specific instructions

This is a plain static website (HTML/CSS/JS) with **no build system, no package manager, and no dependencies**. The entire app lives in `/public/`.

### Running the dev server

Serve `public/` with any static HTTP server:

```sh
python3 -m http.server 8080 --directory public
```

Then open `http://localhost:8080/` in a browser.

### Notes

- There is no linter, test framework, or build step configured in this repo.
- The app uses browser-native `crypto.getRandomValues()` — no Node.js or npm required.
- Google Analytics (`gtag.js`) is loaded from an external CDN on the homepage; it works automatically over HTTP(S) and does not need local configuration.
- `/generate` API hits are tracked server-side via GA4 Measurement Protocol in [`public/_worker.js`](public/_worker.js). This requires a Cloudflare Pages environment variable:

  1. In GA4: **Admin → Data streams → (web stream) → Measurement Protocol API secrets → Create**
  2. In Cloudflare Pages: set `GA_API_SECRET` to that secret (production). Optionally set `GA_MEASUREMENT_ID` (defaults to `G-8KTZ04YFHP`).
  3. Deploy. Verify with `curl -fsSL https://payloadsecret.com/generate` and check GA4 **Realtime** for the `api_generate` event.
