# Rankeao Storefront -- Plan de Implementacion

**Proyecto**: rankeao-storefront (CalabozoMVP)
**Fecha**: 2026-04-07
**Competencia directa**: Jumpseller, Bsale, TCGMatch.cl
**Ventaja unica**: Storefront + Marketplace + Comunidad TCG (nadie lo combina)

---

## Contexto Competitivo

### Bsale (competidor principal en tiendas fisicas chilenas)
- POS + facturacion electronica SII + inventario + e-commerce
- Las tiendas TCG en Chile YA usan Bsale para boleta electronica y POS
- Precio: desde $29,990 CLP/mes (plan basico) hasta $89,990 CLP/mes
- Fortaleza: cumplimiento tributario SII integrado, POS fisico
- Debilidad: e-commerce generico, 0 features TCG, 0 comunidad, 0 marketplace

### Jumpseller (competidor storefront)
- Chileno, CLP, 0% comisiones, integraciones locales
- Desde $9,990 CLP/mes
- Fortaleza: mejor storefront chileno generico
- Debilidad: 0 vertical TCG, 0 marketplace, 0 comunidad

### TCGMatch.cl (competidor nicho)
- Unico marketplace TCG chileno, $9,990 CLP/mes
- Solo marketplace, sin storefront propio

### Nuestra estrategia
- **No competir en POS/boleta** → integrar CON Bsale (API) como proveedor de facturacion
- **Competir en storefront** → mejor que Jumpseller para tiendas TCG/hobby
- **Ganar en diferenciacion** → marketplace + torneos + comunidad + inteligencia TCG

---

## Phase 0: Foundation & Fixes (Semana 1)

| # | Task | Donde | Esfuerzo | Deps |
|---|------|-------|----------|------|
| 0.1 | **WhatsApp FAB visible en mobile** - Cambiar `hidden md:block` a visible en todos los viewports, posicionar sobre BottomNav | `components/layout/FloatingButtons.tsx`, `globals.css` | S | - |
| 0.2 | **Quitar auth gate del carrito** - Mostrar carrito sin login, mover auth gate solo a checkout | `features/cart/CartClient.tsx` | S | - |
| 0.3 | **Categorias dinamicas en Navbar** - Fetch desde API con React Query, fallback a hardcoded | `components/layout/Navbar.tsx` | S | - |
| 0.4 | **Validacion de formularios checkout** - Errores inline por campo, validacion en blur, formato telefono chileno +569 | `features/checkout/CheckoutClient.tsx` | M | - |
| 0.5 | **Error boundary + 404** - `error.tsx`, `not-found.tsx`, `loading.tsx` en route group `(storefront)` | `app/(storefront)/error.tsx`, `not-found.tsx`, `loading.tsx` | S | - |
| 0.6 | **Poblar config del tenant** - Carousel images, category tiles, WhatsApp, Google Maps URL via API/DB | Backend/data | S | - |
| 0.7 | **Sync cart store con servidor** - Fetch cart on mount cuando autenticado, actualizar itemCount | `app/providers.tsx` o nuevo `CartInitializer.tsx` | S | - |

---

## Phase 1: Revenue-Ready (Semanas 2-3)

Meta: Procesar la primera venta real.

| # | Task | Donde | Esfuerzo | Deps | Scope |
|---|------|-------|----------|------|-------|
| 1.1 | **Emails transaccionales** - Confirmacion orden, pago confirmado, enviado, entregado, bienvenida. Templates con branding del tenant. | Backend: Notification service | L | - | Backend |
| 1.2 | **Cargar productos Calabozo** - Top 30-50 productos con imagenes, precios CLP, stock, condicion | Tenant Panel | M | Panel funcionando | Data |
| 1.3 | **Guest cart (localStorage + merge on login)** - Zustand con persist, items completos, merge al autenticarse | `cart-store.ts`, `CartClient.tsx`, `LoginForm.tsx`, todos los `handleAddToCart` | L | 0.2 | Frontend |
| 1.4 | **Input de cupon en carrito** - Campo + boton "Aplicar", mostrar cupon aplicado con opcion de remover | `CartClient.tsx`, `CheckoutClient.tsx` | S | - | Frontend |
| 1.5 | **Verificar flujo de pagos end-to-end** - TRANSFER: mostrar datos bancarios. WEBPAY: manejar redirect/callback. MERCADOPAGO: redirect flow | `CheckoutClient.tsx`, nuevas paginas callback | M | Backend | Both |
| 1.6 | **Pagina de confirmacion de orden** - "Gracias por tu compra", resumen, instrucciones de pago, tracking | Nueva: `checkout/confirmacion/page.tsx` | M | 1.5 | Frontend |
| 1.7 | **Compliance SERNAC** - Retracto 10 dias, "IVA incluido", checkbox T&C en checkout, info legal en footer | `CheckoutClient.tsx`, `Footer.tsx`, `TerminosContent.tsx` | S | - | Frontend |

---

## Phase 2: Growth & Conversion (Semanas 4-6)

Meta: Mejorar conversion y AOV.

| # | Task | Donde | Esfuerzo | Deps | Scope |
|---|------|-------|----------|------|-------|
| 2.1 | **Home page Server Components** - Fetch productos server-side, pasar como props, hidratar React Query | `app/(storefront)/page.tsx`, `HomeClient.tsx` | M | - | Frontend |
| 2.2 | **Mini-cart drawer** - Slide-out al agregar producto, muestra item + total + "Ver carrito" / "Seguir comprando" | Nuevo: `MiniCartDrawer.tsx`, `cart-store.ts` | M | 1.3 | Frontend |
| 2.3 | **Search autocomplete** - Debounce 300ms, top 5 resultados con imagen/nombre/precio | Nuevo: `SearchAutocomplete.tsx`, `Header.tsx` | M | - | Frontend |
| 2.4 | **Breadcrumbs UI** - Componente visual (JSON-LD ya existe), usar en producto/catalogo/paginas estaticas | Nuevo: `Breadcrumb.tsx`, `ProductDetailClient.tsx`, `CatalogClient.tsx` | S | - | Frontend |
| 2.5 | **Mobile filter drawer** - Boton "Filtros" en mobile que abre bottom sheet con todos los filtros | Nuevo: `FilterDrawer.tsx`, `CatalogClient.tsx` | M | - | Frontend |
| 2.6 | **Image gallery swipe + zoom** - Swipe con framer-motion, tap-to-zoom modal para ver cartas en detalle | `ProductDetailClient.tsx`, nuevo: `ImageZoomModal.tsx` | M | - | Frontend |
| 2.7 | **Productos relacionados** - Seccion "Tambien te puede interesar" en detalle de producto (misma categoria/juego) | `producto/[id]/page.tsx`, `ProductDetailClient.tsx` | M | - | Frontend |
| 2.8 | **URL slugs en vez de IDs** - `/producto/carta-charizard-ex-nm` en vez de `/producto/42` | Renombrar `[id]` a `[slug]`, actualizar links, sitemap | M | Backend soporte slug | Both |
| 2.9 | **Wishlist** - Corazon en ProductCard, guardar en localStorage, pagina `/favoritos` | Nuevo: `wishlist-store.ts`, `favoritos/page.tsx` | M | - | Frontend |
| 2.10 | **Productos vistos recientemente** - Track en Zustand, mostrar en home y detalle | Nuevo: `recently-viewed-store.ts` | S | - | Frontend |

---

## Phase 3: Diferenciacion TCG (Semanas 7-10)

Meta: Features que Shopify/Jumpseller/Bsale NO pueden ofrecer.

| # | Task | Donde | Esfuerzo | Deps | Scope |
|---|------|-------|----------|------|-------|
| 3.1 | **Guia de condicion de cartas** - Visual (NM/LP/MP/HP/DMG) con fotos, badge en ProductCard, pagina SEO `/guia-condiciones` | Nuevo: `CardConditionBadge.tsx`, `CardConditionGuide.tsx`, pagina | M | - | Frontend |
| 3.2 | **Filtros por juego y set/expansion** - Tabs Magic/Pokemon/YuGiOh, filtro por set dentro de cada juego | `CatalogClient.tsx`, nuevo: `GameTabBar.tsx`, `lib/api/catalog.ts` | L | Backend Catalog API | Both |
| 3.3 | **Reviews y ratings de productos** - Estrellas, texto, badge "Compra verificada", integrar en JSON-LD | Nuevo: `ProductReviews.tsx`, `StarRating.tsx`, `lib/api/reviews.ts` | L | Backend reviews API | Both |
| 3.4 | **Estimacion de envio** - Calculadora en carrito (region → costo), mostrar en checkout | Nuevo: `lib/api/shipping.ts`, actualizar `CartClient.tsx`, `CheckoutClient.tsx` | L | Backend shipping API | Both |
| 3.5 | **Category landing pages** - `/catalogo/singles`, `/catalogo/sellado` con metadata y JSON-LD propios | Nueva ruta: `catalogo/[category]/page.tsx` | M | 2.8 | Frontend |
| 3.6 | **Boton "Comprar ahora"** - Bypass carrito, directo a checkout con 1 producto | `ProductDetailClient.tsx`, `CheckoutClient.tsx` | M | 1.5 | Frontend |
| 3.7 | **Summary sticky mobile** - Barra fija en checkout y carrito mobile con total + boton | `CheckoutClient.tsx`, `CartClient.tsx` | S | - | Frontend |

---

## Phase 4: Scale (Semanas 11-16)

Meta: Madurez multi-tenant y features avanzados.

| # | Task | Esfuerzo | Scope |
|---|------|----------|-------|
| 4.1 | **Custom domains** - `www.calabozotienda.cl` → tenant calabozo. SSL, DNS verification, middleware lookup | XL | Both + Infra |
| 4.2 | **Import/export CSV de productos** - Bulk load para tiendas con 500+ SKUs | L | Backend + Panel |
| 4.3 | **Abandoned cart recovery** - Email 1-24h despues de carrito abandonado | M | Backend |
| 4.4 | **Marketplace hibrido** - Productos aparecen en storefront + marketplace unificado Rankeao | XL | Both |
| 4.5 | **Integracion envios** - Chilexpress, Starken, Blue Express APIs. Tarifas en tiempo real, etiquetas, tracking | XL | Backend |
| 4.6 | **Integracion Bsale** - Sync de inventario POS ↔ online, boleta electronica via API Bsale. NO competir, INTEGRAR | XL | Backend |
| 4.7 | **Analytics dashboard tenants** - Ventas, conversion, top productos, trafico | L | Backend + Panel |

### 4.6 Detalle: Estrategia Bsale

Las tiendas TCG en Chile ya usan Bsale para POS y boleta electronica. En vez de construir nuestro propio sistema SII:

**Opcion A (recomendada): Integracion API Bsale**
- Bsale tiene API REST documentada
- Sync bidireccional de inventario (venta en POS baja stock online y viceversa)
- Al crear orden en Rankeao → generar boleta electronica via API Bsale
- El tenant configura sus credenciales Bsale en el panel
- Costo: Bsale cobra al tenant, nosotros no pagamos nada
- Ventaja: resolvemos boleta + POS + inventario de un solo golpe

**Opcion B (fallback): Integracion directa SII**
- Via intermediario (Openfactura, Facto)
- Solo resuelve boleta, no POS ni inventario
- Mas barato pero menos funcional

**Opcion C (MVP): Sin integracion**
- El tenant maneja boleta manualmente desde Bsale
- Rankeao solo maneja el e-commerce
- Viable para MVP pero no escala

---

## Phase 5: Moat (Meses 5-6+)

Meta: Features que NADIE mas puede ofrecer. Leverage del ecosistema Rankeao.

| # | Task | Backend Service | Esfuerzo | Ventaja Competitiva |
|---|------|----------------|----------|---------------------|
| 5.1 | **Torneos integrados en storefront** - Seccion "Proximos torneos", inscripcion como producto, descuentos post-torneo | Tournament service | XL | Unico: tienda + torneos |
| 5.2 | **Recomendaciones sociales** - "Jugadores de tu clan compraron...", "Popular en tu ciudad" | Social service | XL | Commerce social para nicho |
| 5.3 | **Deck builder → carrito** - Armar mazo y "Comprar este mazo" agrega todas las cartas al carrito | Catalog service (Scryfall) | XL | Killer feature: build & buy |
| 5.4 | **Precios de mercado TCG** - "Precio mercado: $5,000 / Precio tienda: $4,200 / Ahorro: 16%" | Catalog service (pricing) | L | Transparencia de precios |
| 5.5 | **Gamificacion en compras** - XP por compra, niveles = descuentos, badges de coleccionista, quests | Gamification service | XL | Fidelizacion gamificada |
| 5.6 | **Sync inventario tienda fisica** - POS integration o sync manual, stock en tiempo real | Store + integracion | XL | Omnichannel real |

---

## Grafo de Dependencias (Camino Critico)

```
SEMANA 1 (Phase 0) - Todo paralelo, sin dependencias
  ├── 0.1 WhatsApp mobile
  ├── 0.2 Auth gate carrito
  ├── 0.3 Categorias dinamicas
  ├── 0.4 Validacion checkout
  ├── 0.5 Error boundary
  ├── 0.6 Tenant config data
  └── 0.7 Cart sync

SEMANAS 2-3 (Phase 1)
  ├── 1.1 Emails (backend, paralelo)
  ├── 1.2 Cargar productos (data, paralelo)
  ├── 1.3 Guest cart ← depende de 0.2
  ├── 1.4 Cupon UI
  ├── 1.5 Pagos end-to-end (backend)
  ├── 1.6 Confirmacion orden ← depende de 1.5
  └── 1.7 SERNAC compliance

SEMANAS 4-6 (Phase 2)
  ├── 2.1 SSR home page
  ├── 2.2 Mini-cart ← depende de 1.3
  ├── 2.3 Search autocomplete
  ├── 2.4 Breadcrumbs
  ├── 2.5 Mobile filters
  ├── 2.6 Image swipe/zoom
  ├── 2.7 Related products
  ├── 2.8 URL slugs (necesita backend)
  ├── 2.9 Wishlist
  └── 2.10 Recently viewed

SEMANAS 7-10 (Phase 3)
  ├── 3.1 Card condition guide
  ├── 3.2 Game/set filters (necesita Catalog API)
  ├── 3.3 Reviews (necesita backend)
  ├── 3.4 Shipping estimation (necesita backend)
  ├── 3.5 Category pages ← recomendado despues de 2.8
  ├── 3.6 Buy now ← depende de 1.5
  └── 3.7 Sticky mobile summary

SEMANAS 11-16 (Phase 4)
  ├── 4.6 Integracion Bsale (prioridad alta)
  ├── 4.4 Marketplace hibrido
  └── resto paralelo

MESES 5-6+ (Phase 5) - El moat
  └── Todo depende de backend services existentes de Rankeao
```

---

## Estimacion Total

| Phase | Items | Semanas | Acumulado |
|-------|-------|---------|-----------|
| 0: Foundation | 7 | 1 | Semana 1 |
| 1: Revenue | 7 | 2-3 | Semanas 2-3 |
| 2: Growth | 10 | 2-3 | Semanas 4-6 |
| 3: Diferenciacion | 7 | 3-4 | Semanas 7-10 |
| 4: Scale | 7 | 5-6 | Semanas 11-16 |
| 5: Moat | 6 | 8-10 | Meses 5-6+ |

---

## Decisiones Tecnicas Clave

1. **React Query** se mantiene para data fetching. Mover mas fetches iniciales a Server Components pero usar RQ para interactividad.
2. **No introducir form library** aun. Validacion simple es suficiente. Evaluar `react-hook-form` si se agregan mas formularios.
3. **Zustand** se mantiene como state manager. Extender stores existentes (especialmente cart-store).
4. **Estructura feature-based** se mantiene: `features/{domain}/` para componentes de pagina, `components/ui/` para UI reutilizable.
5. **Integrar CON Bsale, no competir** - Las tiendas ya lo usan y lo conocen. Ser el mejor frontend que conecta con su backend existente.
6. **API contracts primero** - Muchas features Phase 3+ dependen de endpoints backend nuevos. Definir contratos API antes de empezar frontend.

---

## Archivos Criticos (mas modificados a lo largo del plan)

| Archivo | Phases que lo tocan |
|---------|-------------------|
| `features/checkout/CheckoutClient.tsx` | 0.4, 1.5, 1.6, 1.7, 3.4, 3.6, 3.7, 5.5 |
| `lib/stores/cart-store.ts` | 0.7, 1.3, 2.2 |
| `features/catalog/ProductDetailClient.tsx` | 2.4, 2.6, 2.7, 3.1, 3.3, 3.6, 5.4 |
| `features/home/HomeClient.tsx` | 2.1, 2.10, 5.1 |
| `components/layout/FloatingButtons.tsx` | 0.1 |
| `features/cart/CartClient.tsx` | 0.2, 1.3, 1.4, 3.4, 3.7 |
| `components/layout/Navbar.tsx` | 0.3 |
