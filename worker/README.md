# tramitesfacil-votes

Cloudflare Worker que guarda los votos de "¿Te sirvió esta guía?" de cada
artículo, en un KV namespace (`VOTES`). Deploy independiente del sitio
principal (Eleventy no lo construye ni lo despliega).

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
