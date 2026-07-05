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

- [ ] Registrar el dominio definitivo y actualizar `src/_data/site.json`
      (`url`), `src/robots.txt` (línea `Sitemap:`) y el correo de contacto en
      `src/sobre-nosotros.njk`.
- [ ] Agregar el archivo `CNAME` en la raíz con el dominio elegido, y activar
      GitHub Pages en la configuración del repo (Settings → Pages → Source:
      GitHub Actions).
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
