# TrámitesFácil

Sitio de contenido sobre visas y trámites migratorios (EEUU/Canadá) para
colombianos. Generado con [Eleventy](https://www.11ty.dev/), sin framework de
JS en el front. Monetización vía Google AdSense + afiliados.

## Desarrollo local

```bash
npm install
npm run serve   # levanta el sitio en http://localhost:8080 con recarga automática
npm run build    # genera el sitio estático en _site/
```

## Pendientes manuales (no automatizables desde el repo)

- [x] Dominio `tramitesfacil.co` configurado en `site.json`, `robots.txt` y
      `CNAME`.
- [ ] En Cloudflare, apuntar `tramitesfacil.co` (DNS → CNAME `@` y `www` a
      `r11sebas.github.io`).
- [ ] En GitHub, Settings → Pages → Custom domain → escribir
      `tramitesfacil.co` y guardar (espera a que verifique DNS y emita el
      certificado HTTPS).
- [ ] Configurar Cloudflare Web Analytics y pegar el snippet en
      `src/_includes/base.njk`.
- [ ] Aplicar a Google AdSense cuando haya ~10-15 artículos publicados.
- [ ] Registrarse en programas de afiliados (iVisa, Wise, SafetyWing/World
      Nomads, servicios de traducción certificada) y añadir los enlaces en
      los artículos relevantes.

## Agregar un artículo nuevo

Crea un archivo `.md` en `src/articulos/` con este front matter:

```yaml
---
layout: article.njk
title: Título del artículo
description: Descripción para SEO (150-160 caracteres aprox.)
date: 2026-07-05
category: Visa EEUU | Visa Canadá | Trámites
keywords: palabra clave 1, palabra clave 2
---
```

El artículo aparece automáticamente en la home y en el sitemap al hacer build.
