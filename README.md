# payloadsecret.com

Generate random 32-byte, base64 secrets for your [Payload](https://payloadcms.com) instance. Open [payloadsecret.com](https://payloadsecret.com) and a ready-to-use key is already waiting for you — copy it from the page, or pull one programmatically via the HTTP API.

## HTTP API

The site exposes a single endpoint that returns a fresh secret on every request.

```
GET https://payloadsecret.com/generate
```

**Response:** `200 text/plain` — a 44-character base64 string derived from 32 cryptographically-random bytes. The response is never cached (`Cache-Control: no-store`).

### Examples

**curl**

```sh
curl -fsSL https://payloadsecret.com/generate
```

**curl — copy straight to clipboard**

```sh
# macOS
curl -fsSL https://payloadsecret.com/generate | pbcopy

# Linux
curl -fsSL https://payloadsecret.com/generate | xclip -selection clipboard
```

**Browser fetch / client-side JS**

```js
const secret = await fetch('https://payloadsecret.com/generate')
  .then(r => r.text());

console.log(secret);
```

## Using the secret with Payload

Set the value as an environment variable and reference it in your config:

```sh
# .env (never commit this file)
PAYLOAD_SECRET="<generated-value>"
```

```ts
// payload.config.ts
import { buildConfig } from 'payload'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  // ...
})
```

Payload reads `process.env.PAYLOAD_SECRET` at startup. If the variable is missing, Payload will fail to start. Use a unique secret per environment (local, staging, production). See the [Payload docs](https://payloadcms.com/docs/configuration/environment-vars) for more detail.

## Web UI

Visit [payloadsecret.com](https://payloadsecret.com). A secret is auto-generated on page load. Use the buttons to the right of the key field to:

- **🙉** — toggle secret visibility
- **🔄** — generate a new secret
- **📋** — copy the secret to your clipboard

The usage documentation on the page covers `PAYLOAD_SECRET`, where to set it, and how to reference it from your Payload config.

## Local development

Serve the `public/` directory with any static HTTP server:

```sh
python3 -m http.server 8080 --directory public
```

Then open `http://localhost:8080/`. No build step, no package manager, no dependencies — the app uses browser-native `crypto.getRandomValues()`.

## License

[MIT](LICENSE)
