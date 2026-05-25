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
- Google Analytics (`gtag.js`) is loaded from an external CDN; it works automatically over HTTP(S) and does not need local configuration.
