/**
 * Script to create the Calabozo tenant in the Rankeao database.
 * Run: node scripts/create-tenant.mjs
 *
 * Requires: npm install pg (temporary dependency)
 */

import pg from "pg";
const { Client } = pg;

const DB_URL = "postgres://postgres:RKOpostgis2026railway@metro.proxy.rlwy.net:20401/railway?sslmode=disable";
const OWNER_EMAIL = "matiaspalma2594@gmail.com";

const TENANT = {
  slug: "calabozo",
  name: "El Calabozo",
  email: "contacto@calabozotienda.cl",
  legal_name: "El Calabozo",
  phone: "+56934613599",
  description: "Tienda especializada en juegos de cartas coleccionables (TCG), juegos de mesa, juegos de rol y accesorios. Operando desde 2012 en Concepcion, Chile.",
  short_description: "Tu tienda de TCG, juegos de mesa y accesorios en Concepcion",
  primary_color: "#C52828",
  secondary_color: "#ffffff",
  country_code: "CL",
  address: "O'Higgins 950B",
  city: "Concepcion",
  region: "Bio Bio",
  timezone: "America/Santiago",
  currency: "CLP",
  plan: "PRO",
  status: "ACTIVE",
  is_public: true,
  is_verified: true,
  tags: ["tcg", "magic", "pokemon", "yugioh", "juegos-de-mesa", "accesorios"],
};

// Additional product categories for Calabozo (board games, RPGs, etc.)
const EXTRA_CATEGORIES = [
  { slug: "board-games", name: "Juegos de Mesa" },
  { slug: "rpg", name: "Juegos de Rol" },
  { slug: "books-comics", name: "Libros, Comics y Otros" },
  { slug: "living-card-games", name: "Living Card Games" },
  { slug: "figures-miniatures", name: "Pinturas y Figuras" },
  { slug: "pre-orders", name: "Preventas" },
];

async function main() {
  const client = new Client({ connectionString: DB_URL });

  try {
    await client.connect();
    console.log("Connected to database");

    // 1. Find the user
    const userResult = await client.query(
      "SELECT id, username, email FROM platform.users WHERE email = $1",
      [OWNER_EMAIL]
    );

    if (userResult.rows.length === 0) {
      console.error(`User with email ${OWNER_EMAIL} not found!`);
      console.log("Listing users for reference:");
      const allUsers = await client.query("SELECT id, username, email FROM platform.users LIMIT 10");
      console.table(allUsers.rows);
      process.exit(1);
    }

    const user = userResult.rows[0];
    console.log(`Found user: ${user.username} (ID: ${user.id})`);

    // 2. Check if tenant already exists
    const existingTenant = await client.query(
      "SELECT id, slug FROM tenant.tenants WHERE slug = $1",
      [TENANT.slug]
    );

    if (existingTenant.rows.length > 0) {
      console.log(`Tenant '${TENANT.slug}' already exists (ID: ${existingTenant.rows[0].id}). Skipping creation.`);
    } else {
      // 3. Create tenant
      const tenantResult = await client.query(`
        INSERT INTO tenant.tenants (
          owner_id, slug, name, email, legal_name, phone,
          description, short_description,
          primary_color, secondary_color,
          country_code, address, city, region,
          timezone, currency, plan, status,
          is_public, is_verified, verified_at,
          tags, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8,
          $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20, NOW(),
          $21, NOW(), NOW()
        ) RETURNING id, public_id
      `, [
        user.id, TENANT.slug, TENANT.name, TENANT.email, TENANT.legal_name, TENANT.phone,
        TENANT.description, TENANT.short_description,
        TENANT.primary_color, TENANT.secondary_color,
        TENANT.country_code, TENANT.address, TENANT.city, TENANT.region,
        TENANT.timezone, TENANT.currency, TENANT.plan, TENANT.status,
        TENANT.is_public, TENANT.is_verified,
        `{${TENANT.tags.join(",")}}`,
      ]);

      const tenantId = tenantResult.rows[0].id;
      console.log(`Created tenant '${TENANT.slug}' (ID: ${tenantId})`);

      // 4. Create default schedules (Mon-Sat 10:00-20:00, Sun closed)
      const days = [
        { day: 0, open: "10:00", close: "20:00", closed: true },  // Sunday
        { day: 1, open: "10:00", close: "20:00", closed: false }, // Monday
        { day: 2, open: "10:00", close: "20:00", closed: false },
        { day: 3, open: "10:00", close: "20:00", closed: false },
        { day: 4, open: "10:00", close: "20:00", closed: false },
        { day: 5, open: "10:00", close: "20:00", closed: false },
        { day: 6, open: "10:00", close: "20:00", closed: false }, // Saturday
      ];

      for (const d of days) {
        await client.query(`
          INSERT INTO tenant.tenant_schedules (tenant_id, day_of_week, open_time, close_time, is_closed)
          VALUES ($1, $2, $3, $4, $5)
        `, [tenantId, d.day, d.open, d.close, d.closed]);
      }
      console.log("Created default schedules");

      // 5. Create OWNER staff record
      const ownerRoleResult = await client.query(
        "SELECT id FROM tenant.tenant_roles WHERE name = 'OWNER'"
      );
      const ownerRoleId = ownerRoleResult.rows[0]?.id;

      if (ownerRoleId) {
        await client.query(`
          INSERT INTO tenant.tenant_staff (tenant_id, user_id, role_id, status, accepted_at)
          VALUES ($1, $2, $3, 'ACTIVE', NOW())
        `, [tenantId, user.id, ownerRoleId]);
        console.log(`Assigned user ${user.username} as OWNER`);
      }

      // 6. Add social links
      await client.query(`
        INSERT INTO tenant.tenant_social_links (tenant_id, platform, url) VALUES
        ($1, 'facebook', 'https://www.facebook.com/calabozotienda'),
        ($1, 'instagram', 'https://www.instagram.com/calabozotienda')
      `, [tenantId]);
      console.log("Added social links");
    }

    // 7. Add extra product categories (if not exist)
    for (const cat of EXTRA_CATEGORIES) {
      const exists = await client.query(
        "SELECT id FROM commerce.product_categories WHERE slug = $1",
        [cat.slug]
      );
      if (exists.rows.length === 0) {
        await client.query(
          "INSERT INTO commerce.product_categories (slug, name) VALUES ($1, $2)",
          [cat.slug, cat.name]
        );
        console.log(`Added category: ${cat.name}`);
      } else {
        console.log(`Category '${cat.slug}' already exists`);
      }
    }

    console.log("\nDone! Calabozo tenant is ready.");
    console.log(`Storefront URL: calabozo.rankeao.cl`);

  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
