const ALLOWED_ORIGIN = "https://tramitesfacil.co";

function corsHeaders(origin) {
  const allow = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9-]{1,120}$/.test(slug);
}

async function getCounts(env, slug) {
  const [yes, no] = await Promise.all([
    env.VOTES.get(`vote:${slug}:yes`),
    env.VOTES.get(`vote:${slug}:no`),
  ]);
  return { yes: parseInt(yes || "0", 10), no: parseInt(no || "0", 10) };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (url.pathname !== "/api/vote") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === "GET") {
      const slug = url.searchParams.get("slug");
      if (!isValidSlug(slug)) return json({ error: "invalid slug" }, 400, origin);
      const counts = await getCounts(env, slug);
      return json(counts, 200, origin);
    }

    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid JSON body" }, 400, origin);
      }

      const { slug, helpful } = body;
      if (!isValidSlug(slug)) return json({ error: "invalid slug" }, 400, origin);
      if (typeof helpful !== "boolean") return json({ error: "helpful must be boolean" }, 400, origin);

      const key = `vote:${slug}:${helpful ? "yes" : "no"}`;
      const current = parseInt((await env.VOTES.get(key)) || "0", 10);
      await env.VOTES.put(key, String(current + 1));

      const counts = await getCounts(env, slug);
      return json(counts, 200, origin);
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
  },
};
