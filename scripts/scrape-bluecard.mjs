/**
 * Scrape all products from bluecard.cl (Bsale platform)
 * Uses JSON-LD structured data embedded in the HTML
 * Run: node scripts/scrape-bluecard.mjs
 */

const BASE = "https://www.bluecard.cl";

async function fetchPage(url) {
  const res = await fetch(url);
  return res.text();
}

async function getAllCollections() {
  const html = await fetchPage(BASE);
  const matches = [...html.matchAll(/href="\/collection\/([^"]+)"/g)];
  return [...new Set(matches.map(m => m[1]))];
}

function extractProductsFromJsonLd(html, collection) {
  const products = [];
  // Find JSON-LD ItemList blocks
  const jsonLdBlocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];

  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      if (data["@type"] !== "ItemList" || !data.itemListElement) continue;

      for (const item of data.itemListElement) {
        const p = item.item;
        if (!p || p["@type"] !== "product") continue;

        const offer = p.offers;
        const price = offer?.price ? parseInt(offer.price) : 0;
        const inStock = offer?.availability?.includes("InStock");
        const idMatch = p.url?.match(/#product-(\d+)/);

        products.push({
          external_id: idMatch?.[1] || `bc-${products.length}`,
          name: p.name || "",
          price,
          compare_price: null,
          category: collection,
          brand: p.brand?.name || null,
          image_url: p.image || null,
          description: p.description ? decodeHtmlEntities(p.description).substring(0, 500) : null,
          stock: inStock ? 10 : 0,
          is_active: inStock,
        });
      }
    } catch (e) { /* skip invalid JSON */ }
  }
  return products;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&iexcl;/g, "!")
    .replace(/&eacute;/g, "é").replace(/&oacute;/g, "ó").replace(/&aacute;/g, "á")
    .replace(/&iacute;/g, "í").replace(/&uacute;/g, "ú").replace(/&ntilde;/g, "ñ")
    .replace(/&mdash;/g, "—").replace(/<[^>]+>/g, "");
}

function getMaxPage(html) {
  const pages = [...html.matchAll(/[?&]page=(\d+)/g)];
  if (pages.length === 0) return 1;
  return Math.max(...pages.map(m => parseInt(m[1])));
}

async function scrapeCollection(slug) {
  const url = `${BASE}/collection/${slug}`;
  let html;
  try { html = await fetchPage(url); } catch { return []; }

  const maxPage = getMaxPage(html);
  let all = extractProductsFromJsonLd(html, slug);

  for (let page = 2; page <= maxPage; page++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const pageHtml = await fetchPage(`${url}?page=${page}`);
      all = all.concat(extractProductsFromJsonLd(pageHtml, slug));
    } catch { /* skip */ }
  }

  if (all.length > 0) console.log(`  ${slug}: ${all.length} products (${maxPage} pages)`);
  return all;
}

async function main() {
  console.log("Scraping bluecard.cl via JSON-LD...\n");

  const collections = await getAllCollections();
  console.log(`Found ${collections.length} collections\n`);

  let allProducts = [];
  for (const slug of collections) {
    const products = await scrapeCollection(slug);
    allProducts = allProducts.concat(products);
  }

  // Deduplicate by name
  const seen = new Set();
  const unique = allProducts.filter(p => {
    const key = p.name.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\nTotal: ${unique.length} unique products (${allProducts.length} before dedup)`);

  const fs = await import("fs");
  fs.writeFileSync("scripts/scraped-bluecard.json", JSON.stringify(unique, null, 2));
  console.log("Saved to scripts/scraped-bluecard.json");
}

main().catch(console.error);
