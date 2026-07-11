async function getSiteVisitsYesterday(env) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setUTCDate(now.getUTCDate() - 1);
  const start = yesterday.toISOString().slice(0, 10);
  const end = now.toISOString().slice(0, 10);

  const query = `
    query {
      viewer {
        accounts(filter: {accountTag: "${env.CF_ACCOUNT_ID}"}) {
          rumPageloadEventsAdaptiveGroups(limit: 1, filter: {date_geq: "${start}", date_leq: "${end}"}) {
            count
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  const groups = data?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
  if (!groups || !groups.length) return 0;
  return groups.reduce((sum, g) => sum + (g.count || 0), 0);
}

async function getYouTubeStats(env) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.YT_CLIENT_ID,
      client_secret: env.YT_CLIENT_SECRET,
      refresh_token: env.YT_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error("No se pudo renovar el token de YouTube (probablemente expiró, hay que reconectar)");
  }

  const statsRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
  );
  const statsData = await statsRes.json();
  const stats = statsData?.items?.[0]?.statistics;
  if (!stats) {
    throw new Error("YouTube no devolvió estadísticas del canal");
  }

  return {
    subscribers: parseInt(stats.subscriberCount || "0", 10),
    views: parseInt(stats.viewCount || "0", 10),
  };
}

function formatNumber(n) {
  return n.toLocaleString("es-CO");
}

async function sendTelegramMessage(env, text) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
  });
}

export async function runDailyStats(env) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [`📊 Resumen diario — ${today}`, ""];

  try {
    const visits = await getSiteVisitsYesterday(env);
    lines.push("🌐 TrámitesFácil");
    lines.push(`Visitas ayer: ${formatNumber(visits)}`);
  } catch (err) {
    lines.push("🌐 TrámitesFácil");
    lines.push("⚠️ No se pudo leer Cloudflare Analytics.");
  }

  lines.push("");

  try {
    const yt = await getYouTubeStats(env);
    const prevSubsRaw = await env.VOTES.get("yt:prev:subscribers");
    const prevSubs = prevSubsRaw ? parseInt(prevSubsRaw, 10) : yt.subscribers;
    const gained = yt.subscribers - prevSubs;
    const gainedText = gained > 0 ? `+${gained}` : gained < 0 ? `${gained}` : "sin cambio";

    lines.push("📺 Expedientes del Internet");
    lines.push(`Suscriptores: ${formatNumber(yt.subscribers)} (${gainedText} desde ayer)`);
    lines.push(`Vistas totales: ${formatNumber(yt.views)}`);
    lines.push(`Progreso a monetización: ${formatNumber(yt.subscribers)}/1,000 suscriptores (${((yt.subscribers / 1000) * 100).toFixed(1)}%)`);

    await env.VOTES.put("yt:prev:subscribers", String(yt.subscribers));
    await env.VOTES.put("yt:prev:views", String(yt.views));
  } catch (err) {
    lines.push("📺 Expedientes del Internet");
    lines.push(`⚠️ ${err.message}`);
  }

  await sendTelegramMessage(env, lines.join("\n"));
}
