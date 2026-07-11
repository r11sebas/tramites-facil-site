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
- [x] Cloudflare apuntando `tramitesfacil.co` a `r11sebas.github.io`, y
      dominio custom activo en GitHub Pages con HTTPS.
- [x] Cloudflare Web Analytics activado en modo automático (Cloudflare lo
      detectó como zona propia y lo activa a nivel de red — no requiere
      ningún snippet ni cambio de código en el repo).
- [x] Aplicado a Google AdSense. Estado "Preparando" con "No se encuentra"
      en el dashboard → agregado `ads.txt` en la raíz del sitio (causa más
      común de ese estado). Toca esperar a que Google lo vuelva a rastrear.
- [ ] Cuando el estado en AdSense pase a **"Listo"/aprobado**: entra a
      Ads → Overview → **Auto ads**, y actívalo con el interruptor. Es la
      vía más rápida para empezar a mostrar anuncios — no requiere ningún
      cambio de código, porque ya está el script de verificación instalado
      en `src/_includes/base.njk`. Google decide automáticamente dónde
      poner los anuncios en cada página.
- [ ] Opcional, más adelante: crear **unidades de anuncio manuales** (Ads →
      By ad unit) para tener más control sobre dónde aparecen — suelen dar
      mejor rendimiento que Auto Ads pero requieren más configuración.
      Cuando tengas los IDs de unidad, dime y los inserto en las plantillas
      (por ejemplo, dentro del artículo y antes de "También te puede
      interesar").
- [x] Wise aprobado y con link de afiliado activo en el artículo de
      remesas.
- [ ] iVisa y Rapid Translate: aplicaciones enviadas, pendientes de
      aprobación. Cuando lleguen los links, agregarlos a los artículos de
      visas (iVisa) y traducción oficial (Rapid Translate).
- [ ] SafetyWing / World Nomads: pendiente a propósito, aplicar más
      adelante cuando el sitio tenga más tráfico/autoridad (seguros de
      viaje piden más confianza).

## Roadmap de contenido

No tenemos acceso a herramientas de volumen de búsqueda real (Keyword
Planner, Ahrefs, etc.), así que estos temas están priorizados por huecos
lógicos de intención de búsqueda dentro de cada categoría existente, no por
datos de volumen. La fuente de datos real más confiable, una vez haya
tráfico, es el reporte **Consultas** de Google Search Console (ya conectado
vía sitemap) — cuando haya suficiente data ahí, conviene revisar este
roadmap contra las búsquedas reales que ya traen gente al sitio.

Próximos temas propuestos, agrupados por categoría (para que cada página de
`/categoria/<slug>/` crezca de forma pareja):

- **Visa Canadá**: Work permit para cónyuges/pareja de estudiantes,
  Provincial Nominee Program (PNP) explicado, examen médico para
  inmigración a Canadá.
- **Visa Europa**: Visa Schengen de negocios vs turismo, qué hacer si
  Schengen te la niega, cómo elegir seguro de viaje Schengen que cumpla el
  mínimo exigido.
- **Trámites**: cómo autenticar un poder notarial para uso en el exterior,
  registro civil de nacimiento desde el exterior, homologación de licencia
  de conducir en EEUU/Canadá.
- **Remesas**: cómo declarar remesas recibidas ante la DIAN, remesas vs
  giros (diferencias legales en Colombia).
- **Trabajo remoto**: facturación electrónica para freelancers que cobran
  en dólares, seguridad social (EPS/pensión) para independientes remotos.
- **Visa EEUU**: renovación de visa sin entrevista (Interview Waiver),
  visa de estudiante F-1 (panorama general), ESTA vs visa de turista.

## Agregar un artículo nuevo

Crea un archivo `.md` en `src/articulos/` con este front matter:

```yaml
---
layout: article.njk
title: Título del artículo
description: Descripción para SEO (150-160 caracteres aprox.)
date: 2026-07-05
category: Visa EEUU
keywords: palabra clave 1, palabra clave 2
---
```

El valor de `category` debe coincidir **exactamente** con uno de los
`name` definidos en `src/_data/categories.json` (Visa EEUU, Visa Canadá,
Visa Europa, Trámites, Remesas, Trabajo remoto) — de ahí sale el color, el
ícono y a qué página `/categoria/<slug>/` queda enlazado el artículo. Si
agregas una categoría nueva, primero añádela a ese archivo.

El artículo aparece automáticamente en la home y en el sitemap al hacer build.
