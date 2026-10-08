#!/usr/bin/env node
// Post-build SEO audit. Run `npm run build && npm run seo:check`.
//
// Reads the prerendered pages in .next/server/app and checks that every page
// has a unique title, description and self-referencing absolute canonical,
// Open Graph + Twitter tags, and well-formed JSON-LD; that the sitemap lists
// only canonical, indexable URLs; and that robots.txt matches the deploy type.
// Exits non-zero if anything is wrong.

import fs from "node:fs";
import path from "node:path";

const APP_OUT = path.join(process.cwd(), ".next", "server", "app");
const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

if (!fs.existsSync(APP_OUT)) {
  console.error("No build output found. Run `npm run build` first.");
  process.exit(1);
}

// --- collect prerendered HTML pages -----------------------------------------
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const SKIP = new Set(["_not-found.html", "_global-error.html"]);
const pages = walk(APP_OUT)
  .filter((f) => f.endsWith(".html") && !SKIP.has(path.basename(f)))
  .map((file) => {
    const rel = path.relative(APP_OUT, file).replace(/\.html$/, "");
    const route = rel === "index" ? "/" : "/" + rel.replace(/\/index$/, "");
    return { route, html: fs.readFileSync(file, "utf8") };
  });

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const metaContent = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};

const seen = { title: new Map(), description: new Map(), canonical: new Map() };
const remember = (kind, value, route) => {
  if (!value) return;
  const list = seen[kind].get(value) ?? [];
  list.push(route);
  seen[kind].set(value, list);
};

const indexable = new Set();

for (const { route, html } of pages) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = metaContent(html, "name", "description");
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const robots = metaContent(html, "name", "robots") ?? "";

  if (!title) err(route, "missing <title>");
  else if (title.length > 65) warn(route, `title is ${title.length} chars (may be truncated in results)`);
  if (!description) err(route, "missing meta description");
  else if (description.length < 70 || description.length > 160)
    warn(route, `meta description is ${description.length} chars (aim for 70–160)`);

  if (!canonical) err(route, "missing canonical");
  else {
    if (!/^https:\/\//.test(canonical)) err(route, `canonical is not absolute https: ${canonical}`);
    const canonPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
    if (canonPath !== route) err(route, `canonical points elsewhere (${canonical})`);
  }

  for (const prop of ["og:title", "og:description", "og:url", "og:image", "og:type"])
    if (!metaContent(html, "property", prop)) err(route, `missing ${prop}`);
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"])
    if (!metaContent(html, "name", name)) err(route, `missing ${name}`);
  if (canonical && metaContent(html, "property", "og:url") !== canonical) err(route, "og:url differs from canonical");

  const noindex = /noindex/.test(robots);
  if (isProduction && noindex) err(route, `production page is noindex (robots="${robots}")`);
  if (!isProduction && !noindex) err(route, "preview/staging page is indexable");
  if (!noindex && canonical) indexable.add(canonical);

  remember("title", title, route);
  remember("description", description, route);
  remember("canonical", canonical, route);

  // --- JSON-LD ---------------------------------------------------------------
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) err(route, "no JSON-LD");
  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      err(route, `JSON-LD is not valid JSON: ${e.message}`);
      continue;
    }
    if (data["@context"] !== "https://schema.org") err(route, "JSON-LD @context must be https://schema.org");
    const nodes = data["@graph"] ?? [data];
    const ids = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
    for (const node of nodes) checkNode(route, node, ids);
  }
}

function checkNode(route, node, ids) {
  const type = node["@type"];
  const need = (cond, msg) => cond || err(route, `${type}: ${msg}`);
  const isUrl = (v) => typeof v === "string" && /^https:\/\//.test(v);
  const refOk = (v) => v && (!v["@id"] || ids.has(v["@id"]) || err(route, `${type}: dangling @id ${v["@id"]}`));

  switch (type) {
    case "Organization":
      need(node.name, "name required");
      need(isUrl(node.url), "absolute url required");
      need(isUrl(node.logo), "absolute logo url required");
      break;
    case "WebSite":
      need(node.name && isUrl(node.url), "name and absolute url required");
      refOk(node.publisher);
      break;
    case "WebPage":
      need(isUrl(node.url), "absolute url required");
      refOk(node.isPartOf);
      refOk(node.breadcrumb);
      break;
    case "BreadcrumbList":
      need(Array.isArray(node.itemListElement) && node.itemListElement.length > 0, "itemListElement required");
      (node.itemListElement ?? []).forEach((item, i) => {
        need(item["@type"] === "ListItem", `item ${i + 1} must be a ListItem`);
        need(item.position === i + 1, `item ${i + 1} position must be ${i + 1}`);
        need(item.name && isUrl(item.item), `item ${i + 1} needs name and absolute item URL`);
      });
      break;
    case "FAQPage":
      need(Array.isArray(node.mainEntity) && node.mainEntity.length > 0, "mainEntity required");
      (node.mainEntity ?? []).forEach((q, i) => {
        need(q["@type"] === "Question" && q.name, `question ${i + 1} needs @type Question and name`);
        need(q.acceptedAnswer?.["@type"] === "Answer" && q.acceptedAnswer.text, `question ${i + 1} needs an Answer with text`);
      });
      break;
    case "Service":
      need(node.name, "name required");
      refOk(node.provider);
      for (const offer of node.offers ?? []) {
        need(offer["@type"] === "Offer", "offers must be Offer");
        need(typeof offer.price === "number" && offer.priceCurrency, `offer "${offer.name}" needs numeric price + priceCurrency`);
      }
      break;
    case "Article":
    case "BlogPosting":
      need(node.headline && node.datePublished && node.author, "headline, datePublished and author required");
      break;
    case "Product":
      need(node.name && (node.offers || node.review || node.aggregateRating), "name plus offers/review/aggregateRating required");
      break;
    default:
      warn(route, `no shape rules for JSON-LD type ${type}`);
  }
}

// --- duplicates ---------------------------------------------------------------
for (const [kind, map] of Object.entries(seen))
  for (const [value, routes] of map)
    if (routes.length > 1) err(routes.join(", "), `duplicate ${kind}: "${value}"`);

// --- sitemap -----------------------------------------------------------------
// (Preview builds don't advertise the sitemap and every page is noindex, so
// only production builds are held to "sitemap == indexable canonicals".)
const sitemapFile = path.join(APP_OUT, "sitemap.xml.body");
if (!fs.existsSync(sitemapFile)) err("sitemap.xml", "not generated");
else if (isProduction) {
  const locs = [...fs.readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) err("sitemap.xml", "no URLs");
  for (const loc of locs) if (!indexable.has(loc)) err("sitemap.xml", `${loc} is not a canonical, indexable page`);
  for (const url of indexable) if (!locs.includes(url)) err("sitemap.xml", `missing ${url}`);
}

// --- robots.txt --------------------------------------------------------------
const robotsFile = path.join(APP_OUT, "robots.txt.body");
if (!fs.existsSync(robotsFile)) err("robots.txt", "not generated");
else {
  const robots = fs.readFileSync(robotsFile, "utf8");
  const group = (agent) =>
    robots.split(/\n\s*\n/).find((g) => new RegExp(`^User-Agent: ${agent}$`, "mi").test(g)) ?? "";
  if (isProduction) {
    if (/^Disallow: \/$/m.test(group("\\*"))) err("robots.txt", "production robots.txt blocks all crawlers");
    if (/^Disallow: \/$/m.test(group("OAI-SearchBot"))) err("robots.txt", "OAI-SearchBot must be allowed");
    if (!/^Disallow: \/$/m.test(group("GPTBot"))) err("robots.txt", "GPTBot must be disallowed");
    if (!/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m.test(robots)) err("robots.txt", "missing absolute Sitemap line");
  } else if (!/^Disallow: \/$/m.test(group("\\*"))) {
    err("robots.txt", "preview/staging robots.txt must block all crawlers");
  }
}

// --- report ------------------------------------------------------------------
console.log(`SEO check (${isProduction ? "production" : "preview"} build): ${pages.length} page(s) — ${pages.map((p) => p.route).join(", ")}`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  FAIL  ${e}`);
if (errors.length) process.exit(1);
console.log("  ok    titles, descriptions and canonicals are unique; tags, JSON-LD, sitemap and robots.txt look correct");
