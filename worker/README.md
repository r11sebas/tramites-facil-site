# tramitesfacil-votes

Cloudflare Worker con dos responsabilidades:

1. Guarda los votos de "¿Te sirvió esta guía?" de cada artículo, en un KV
   namespace (`VOTES`).
2. Cron diario (`0 13 * * *`, 8am hora Colombia) que manda un resumen por
   Telegram con visitas del sitio (Cloudflare Web Analytics) y estadísticas
   del canal de YouTube "Expedientes del Internet" (suscriptores ganados,
   vistas totales, progreso hacia la meta de 1,000 suscriptores).

Deploy independiente del sitio principal (Eleventy no lo construye ni lo
despliega).

Vive en `https://tramitesfacil-votes.r11jsebas.workers.dev` (subdominio
gratis de `workers.dev`, no en el dominio principal, para no requerir que
`tramitesfacil.co` esté "proxied" en Cloudflare).

## Endpoints

- `GET /api/vote?slug=<slug>` → `{ "yes": number, "no": number }`
- `POST /api/vote` con body `{ "slug": string, "helpful": boolean }` →
  incrementa el conteo correspondiente y devuelve los conteos actualizados.

Solo acepta peticiones con `Origin: https://tramitesfacil.co` (CORS).

## Desarrollo y deploy

```bash
cd worker
npx wrangler dev      # local, con datos de prueba
npx wrangler deploy   # despliega a producción
```

## Ver los conteos guardados

```bash
npx wrangler kv key list --namespace-id=197c614849ee4ee7b86c618882c0a6c5 --remote
npx wrangler kv key get "vote:<slug>:yes" --namespace-id=197c614849ee4ee7b86c618882c0a6c5 --remote
```

## Secrets/variables del cron diario

Configurados vía `wrangler secret put` (no viven en el repo):

- `CF_ANALYTICS_TOKEN` — token de Cloudflare con permiso "Account Analytics: Read".
- `TELEGRAM_BOT_TOKEN` — token del bot @Sebastats_bot.
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` — copiados del
  proyecto `ExpedientesInternet` (mismo Google Cloud OAuth usado para subir
  videos). **Importante**: esa app de Google sigue en modo "Prueba", así
  que el refresh token puede vencerse cada ~7 días. Si el mensaje diario
  empieza a mostrar "⚠️ No se pudo renovar el token de YouTube", hay que
  rehacer `npm run youtube-setup` en `ExpedientesInternet` y volver a subir
  `YT_REFRESH_TOKEN` aquí con el nuevo valor.

`CF_ACCOUNT_ID` y `TELEGRAM_CHAT_ID` son variables normales (no secretas),
están en `wrangler.toml`.

Para actualizar un secret:

```bash
echo "nuevo-valor" | npx wrangler secret put NOMBRE_DEL_SECRET
```
