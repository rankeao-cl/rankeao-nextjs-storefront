/**
 * Import scraped products into Rankeao database for tenant "calabozo"
 * Run: node scripts/import-products.mjs
 */

import pg from "pg";
import { readFileSync } from "fs";

const DB_URL = "postgres://postgres:RKOpostgis2026railway@metro.proxy.rlwy.net:20401/railway?sslmode=disable";
const TENANT_ID = 4;

// Map Calabozo categories to Rankeao product_categories slugs
const CATEGORY_MAP = {
  "ACCESORIOS - ARCHIVADORES, CARPETAS Y HOJAS": "accessories",
  "ACCESORIOS - PLAYMATS, DADOS Y BOLSAS": "playmats",
  "ACCESORIOS - PORTAMAZOS": "deck-boxes",
  "ACCESORIOS - PROTECTORES": "sleeves",
  "EVENTOS": "pre-orders",
  "JUEGOS DE MESA": "board-games",
  "JUEGOS DE ROL": "rpg",
  "LIBROS, COMICS, PELUCHES Y OTROS": "books-comics",
  "LIVING CARD GAMES": "living-card-games",
  "PINTURAS Y FIGURAS": "figures-miniatures",
  "PREVENTAS": "pre-orders",
  "TCG - ALTERED": "sealed",
  "TCG - MAGIC MAZOS ARMADOS": "starter-decks",
  "TCG - MAGIC THE GATHERING SELLADO": "sealed",
  "TCG - MITOS Y LEYENDAS": "sealed",
  "TCG - POKEMON": "sealed",
  "TCG - STAR WARS UNLIMITED": "sealed",
  "TCG - YU-GI-OH": "sealed",
};

// Map to game IDs (from seeds: 1=Magic, 2=Pokemon, 3=YuGiOh, 4=Mitos)
const GAME_MAP = {
  "TCG - MAGIC MAZOS ARMADOS": "magic",
  "TCG - MAGIC THE GATHERING SELLADO": "magic",
  "TCG - POKEMON": "pokemon",
  "TCG - YU-GI-OH": "yugioh",
  "TCG - MITOS Y LEYENDAS": "mitos",
  "TCG - ALTERED": null,
  "TCG - STAR WARS UNLIMITED": null,
};

async function main() {
  const products = JSON.parse(readFileSync("scripts/scraped-products.json", "utf-8"));
  console.log(`Loaded ${products.length} products to import\n`);

  const client = new pg.Client({ connectionString: DB_URL });
  await client.connect();

  // Load category IDs
  const catRes = await client.query("SELECT id, slug FROM commerce.product_categories");
  const categoryIds = {};
  catRes.rows.forEach(r => { categoryIds[r.slug] = r.id; });
  console.log("Categories:", Object.keys(categoryIds).join(", "));

  // Load game IDs
  const gameRes = await client.query("SELECT id, slug FROM platform.games");
  const gameIds = {};
  gameRes.rows.forEach(r => { gameIds[r.slug] = r.id; });
  console.log("Games:", Object.keys(gameIds).join(", "));

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const p of products) {
    try {
      const catSlug = CATEGORY_MAP[p.category] || "accessories";
      const categoryId = categoryIds[catSlug] || null;

      const gameSlug = GAME_MAP[p.category];
      const gameId = gameSlug ? (gameIds[gameSlug] || null) : null;

      // Generate a simple slug from the name
      const slug = p.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 100)
        + "-" + p.external_id;

      // Check if already exists (by external_id in metadata)
      const existing = await client.query(
        "SELECT id FROM commerce.products WHERE tenant_id = $1 AND metadata->>'external_id' = $2",
        [TENANT_ID, p.external_id]
      );

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      const result = await client.query(`
        INSERT INTO commerce.products (
          tenant_id, category_id, game_id,
          name, slug, description,
          price, compare_price, currency,
          stock, track_inventory,
          image_url, status, is_public, is_visible, is_featured,
          tags, metadata,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3,
          $4, $5, $6,
          $7, $8, 'CLP',
          $9, true,
          $10, $11, true, true, false,
          $12, $13,
          NOW(), NOW()
        ) RETURNING id
      `, [
        TENANT_ID,
        categoryId,
        gameId,
        p.name,
        slug,
        null, // description - could fetch from product detail pages later
        p.price,
        p.compare_price,
        p.stock || 0,
        p.image_url,
        p.is_active ? "ACTIVE" : "PAUSED",
        `{${p.category.toLowerCase().replace(/[^a-z0-9,\- ]/g, "").substring(0, 29)}}`,
        JSON.stringify({
          external_id: p.external_id,
          source: "calabozotienda.cl",
          original_category: p.category,
          brand: p.brand,
          discount_percent: p.discount_percent,
        }),
      ]);

      // Also insert the image into product_images
      if (p.image_url) {
        await client.query(
          "INSERT INTO commerce.product_images (product_id, url, sort_order, is_primary) VALUES ($1, $2, 0, true)",
          [result.rows[0].id, p.image_url]
        );
      }

      inserted++;
    } catch (e) {
      errors++;
      if (errors <= 5) console.log(`  Error on "${p.name}": ${e.message}`);
    }
  }

  // Update tenant product count
  await client.query(
    "UPDATE tenant.tenants SET product_count = (SELECT count(*) FROM commerce.products WHERE tenant_id = $1 AND status = 'ACTIVE') WHERE id = $1",
    [TENANT_ID]
  );

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);

  // Verify
  const count = await client.query("SELECT count(*) as cnt FROM commerce.products WHERE tenant_id = $1", [TENANT_ID]);
  console.log(`Total products in DB for calabozo: ${count.rows[0].cnt}`);

  await client.end();
}

main().catch(console.error);
