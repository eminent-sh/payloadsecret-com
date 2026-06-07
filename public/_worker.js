const DEFAULT_GA_MEASUREMENT_ID = "G-8KTZ04YFHP";

function generateSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function truncate(value, maxLength) {
  if (!value) return undefined;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

async function trackApiGenerate(request, env) {
  const measurementId = env.GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
  const apiSecret = env.GA_API_SECRET;

  if (!apiSecret) return;

  const url = new URL(request.url);
  const referer = request.headers.get("Referer");
  const userAgent = request.headers.get("User-Agent");
  const country = request.cf?.country;

  const payload = {
    client_id: crypto.randomUUID(),
    events: [
      {
        name: "api_generate",
        params: {
          engagement_time_msec: 1,
          page_location: url.href,
          page_path: url.pathname,
          method: request.method,
          ...(referer ? { referer: truncate(referer, 500) } : {}),
          ...(userAgent ? { user_agent: truncate(userAgent, 500) } : {}),
          ...(country ? { country } : {}),
        },
      },
    ],
  };

  const endpoint = new URL("https://www.google-analytics.com/mp/collect");
  endpoint.searchParams.set("measurement_id", measurementId);
  endpoint.searchParams.set("api_secret", apiSecret);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("GA4 Measurement Protocol error:", response.status);
    }
  } catch (error) {
    console.error("GA4 Measurement Protocol request failed:", error);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/generate" && request.method === "GET") {
      const secret = generateSecret();

      if (env.GA_API_SECRET) {
        ctx.waitUntil(trackApiGenerate(request, env));
      }

      return new Response(secret, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
