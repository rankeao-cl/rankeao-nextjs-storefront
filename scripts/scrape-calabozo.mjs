/**
 * Scrape all products from calabozotienda.cl
 * Run: node scripts/scrape-calabozo.mjs
 */

const BASE = "https://www.calabozotienda.cl";

// Extracted from the actual dropdown menu (UPPERCASE)
const CATEGORY_SLUGS = [
  "ACCESORIOS - ARCHIVADORES, CARPETAS Y HOJAS",
  "ACCESORIOS - PLAYMATS, DADOS Y BOLSAS",
  "ACCESORIOS - PORTAMAZOS",
  "ACCESORIOS - PROTECTORES",
  "EVENTOS",
  "JUEGOS DE MESA",
  "JUEGOS DE ROL",
  "LIBROS, COMICS, PELUCHES Y OTROS",
  "LIVING CARD GAMES",
  "PINTURAS Y FIGURAS",
  "PREVENTAS",
  "TCG - ALTERED",
  "TCG - MAGIC MAZOS ARMADOS",
  "TCG - MAGIC THE GATHERING SELLADO",
  "TCG - MITOS Y LEYENDAS",
  "TCG - POKEMON",
  "TCG - STAR WARS UNLIMITED",
  "TCG - YU-GI-OH",
];

async function fetchPage(url) {
  const res = await fetch(url);
  return res.text();
}

function parsePrice(str) {
  if (!str) return 0;
  return parseInt(str.replace(/\./g, "").replace(/\$/g, "").replace(/,/g, "").trim()) || 0;
}

function extractProducts(html, category) {
  const products = [];

  // Split by product card divs
  const cards = html.split('class="col-sm-4 Prod-item"');

  for (let i = 1; i < cards.length; i++) {
    const card = cards[i];
    try {
      // ID from ProdInfo link
      const idMatch = card.match(/ProdInfo\/(\d+)/);
      if (!idMatch) continue;
      const id = idMatch[1];

      // Image
      const imgMatch = card.match(/src="(https?:\/\/[^"]+Imagenes-Articulos[^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1] : null;

      // Name from data-descripcion or span
      const nameMatch = card.match(/data-descripcion="([^"]+)"/) || card.match(/<span>([^<]+)<\/span>/);
      const name = nameMatch ? nameMatch[1].trim() : `Producto ${id}`;

      // Brand
      const brandMatch = card.match(/Marca:\s*<\/strong>([^<]*)/);
      const brand = brandMatch ? brandMatch[1].trim() : "";

      // Discount badge
      const discountMatch = card.match(/burbuja-descuento[^>]*>-(\d+)%/);
      const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

      // Prices from data attributes
      const priceMatch = card.match(/data-precio="(\d+)"/);
      const comparePriceMatch = card.match(/data-PrecioSinDescuento\s*="(\d+)"/);
      const price = priceMatch ? parseInt(priceMatch[1]) : 0;
      const comparePrice = comparePriceMatch ? parseInt(comparePriceMatch[1]) : 0;

      // Out of stock
      const outOfStock = card.includes("AGOTADO") || card.includes("NO DISPONIBLE");

      products.push({
        external_id: id,
        name,
        price,
        compare_price: comparePrice > price ? comparePrice : null,
        category,
        brand: brand || null,
        image_url: imageUrl,
        stock: outOfStock ? 0 : 10,
        discount_percent: discount || null,
        is_active: !outOfStock,
      });
    } catch (e) {
      // skip
    }
  }
  return products;
}

function getMaxPage(html) {
  // Pagination: /tienda/familia/CATEGORY/PAGE_NUM
  const pages = [...html.matchAll(/\/tienda\/familia\/[^"]*\/(\d+)/g)];
  if (pages.length === 0) return 1;
  return Math.max(...pages.map(m => parseInt(m[1])));
}

async function scrapeCategory(category) {
  const encoded = encodeURIComponent(category);
  const url = `${BASE}/tienda/familia/${encoded}`;
  console.log(`  ${category}...`);

  let html;
  try {
    html = await fetchPage(url);
  } catch (e) {
    console.log(`    ERROR: ${e.message}`);
    return [];
  }

  const maxPage = getMaxPage(html);
  let allProducts = extractProducts(html, category);
  console.log(`    p1: ${allProducts.length} products (${maxPage} pages total)`);

  for (let page = 2; page <= maxPage; page++) {
    try {
      await new Promise(r => setTimeout(r, 200)); // polite delay
      const pageHtml = await fetchPage(`${url}/${page}`);
      const pageProducts = extractProducts(pageHtml, category);
      allProducts = allProducts.concat(pageProducts);
      console.log(`    p${page}: ${pageProducts.length} products`);
    } catch (e) {
      console.log(`    p${page} ERROR: ${e.message}`);
    }
  }

  return allProducts;
}

async function main() {
  console.log("Scraping calabozotienda.cl...\n");
  let allProducts = [];

  for (const cat of CATEGORY_SLUGS) {
    const products = await scrapeCategory(cat);
    allProducts = allProducts.concat(products);
  }

  // Deduplicate
  const seen = new Set();
  const unique = allProducts.filter(p => {
    if (seen.has(p.external_id)) return false;
    seen.add(p.external_id);
    return true;
  });

  console.log(`\nTotal: ${unique.length} unique products`);

  // Stats
  const cats = {};
  unique.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));

  const fs = await import("fs");
  fs.writeFileSync("scripts/scraped-products.json", JSON.stringify(unique, null, 2));
  console.log("\nSaved to scripts/scraped-products.json");
}

main().catch(console.error);
