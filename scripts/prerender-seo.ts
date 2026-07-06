import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSeoRoutes, SeoRoute } from '../src/seo/metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForHtml(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function upsertMeta(
  html: string,
  attributeType: 'name' | 'property',
  key: string,
  content: string
): string {
  const escapedContent = escapeHtml(content);
  const metaTag = `<meta ${attributeType}="${key}" content="${escapedContent}" />`;
  const pattern = new RegExp(
    `<meta\\s+${attributeType}=["']${key}["'][^>]*>|<meta\\s+[^>]*${attributeType}=["']${key}["'][^>]*>`,
    'i'
  );

  if (pattern.test(html)) {
    return html.replace(pattern, metaTag);
  }

  return html.replace('</head>', `    ${metaTag}\n  </head>`);
}

function upsertCanonical(html: string, canonical: string): string {
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/i;

  if (pattern.test(html)) {
    return html.replace(pattern, canonicalTag);
  }

  return html.replace('</head>', `    ${canonicalTag}\n  </head>`);
}

function upsertHreflang(html: string, route: SeoRoute): string {
  const alternateTags = route.alternates
    .map(
      (alternate) =>
        `    <link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeHtml(alternate.href)}" />`
    )
    .join('\n');

  const withoutExistingAlternates = html.replace(
    /\s*<link\s+rel=["']alternate["']\s+hreflang=["'][^"']+["'][^>]*>/gi,
    ''
  );

  return withoutExistingAlternates.replace(
    /(<link\s+rel=["']canonical["'][^>]*>)/i,
    `$1\n${alternateTags}`
  );
}

function upsertRouteSchema(html: string, route: SeoRoute): string {
  const schema = `    <!-- Structured Data -->\n    <script type="application/ld+json" id="static-seo-schema">\n${escapeJsonForHtml(route.schema)}\n    </script>`;
  const structuredDataPattern =
    /\s*<!-- Structured Data -->\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i;

  if (structuredDataPattern.test(html)) {
    return html.replace(structuredDataPattern, `\n${schema}`);
  }

  return html.replace('</head>', `${schema}\n  </head>`);
}

function buildSeoSummary(route: SeoRoute): string {
  const links = [
    { href: '/', label: 'Morse Code Translator' },
    { href: '/alphabet', label: 'Morse Code Alphabet' },
    { href: '/words/sos', label: 'SOS in Morse Code' },
    { href: '/words/i-love-you', label: 'I Love You in Morse Code' },
  ];

  if (route.word) {
    links.push({ href: '/alphabet', label: 'International Morse Code Chart' });
  }

  const linksHtml = links
    .map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`)
    .join('');

  const wordDetail = route.word
    ? `<p>${escapeHtml(route.word.history)} ${escapeHtml(route.word.usage)}</p>`
    : '';

  return `
    <noscript id="seo-prerender-summary">
      <main>
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.summary)}</p>
        ${wordDetail}
        <nav aria-label="Related Morse code pages">
          <ul>${linksHtml}</ul>
        </nav>
      </main>
    </noscript>`;
}

function upsertSeoSummary(html: string, route: SeoRoute): string {
  const summary = buildSeoSummary(route);
  const existingSummary = /\s*<noscript\s+id=["']seo-prerender-summary["'][\s\S]*?<\/noscript>/i;

  if (existingSummary.test(html)) {
    return html.replace(existingSummary, summary);
  }

  return html.replace('<div id="root"></div>', `<div id="root"></div>\n${summary}`);
}

function renderRouteHtml(template: string, route: SeoRoute): string {
  let html = template;

  html = html.replace(/<html\s+lang=["'][^"']+["']>/i, `<html lang="${route.lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'name', 'keywords', route.keywords);
  html = upsertMeta(html, 'property', 'og:type', 'website');
  html = upsertMeta(html, 'property', 'og:title', route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:url', route.canonical);
  html = upsertMeta(html, 'property', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'property', 'twitter:title', route.title);
  html = upsertMeta(html, 'property', 'twitter:description', route.description);
  html = upsertCanonical(html, route.canonical);
  html = upsertHreflang(html, route);
  html = upsertRouteSchema(html, route);
  html = upsertSeoSummary(html, route);

  return html;
}

function getRouteOutputPath(routePath: string): string {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }

  const cleanPath = routePath.replace(/^\/|\/$/g, '');
  return path.join(distDir, cleanPath, 'index.html');
}

function buildSitemap(routes: SeoRoute[], lastmod: string): string {
  const urlEntries = routes
    .map((route) => {
      const alternates = route.alternates
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeHtml(alternate.href)}" />`
        )
        .join('\n');

      return `  <url>
    <loc>${escapeHtml(route.canonical)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${alternates}
  </url>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`;
}

async function main(): Promise<void> {
  const template = await readFile(templatePath, 'utf8');
  const routes = getSeoRoutes();
  const lastmod = new Date().toISOString().slice(0, 10);

  for (const route of routes) {
    const outputPath = getRouteOutputPath(route.path);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderRouteHtml(template, route), 'utf8');
  }

  await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(routes, lastmod), 'utf8');

  console.log(`Prerendered ${routes.length} SEO routes and sitemap.xml`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
