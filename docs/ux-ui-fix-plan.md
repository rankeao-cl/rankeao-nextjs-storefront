# Plan de Fixes UX/UI - Rankeao Storefront

**Basado en:** Auditoría completa UX Architect + UI Designer (Abril 2026)
**Archivos auditados:** 35+
**Issues encontrados:** 80+

---

## Fase A: Theme Coherence (1 día)

El problema #1: colores hardcoded por todo el codebase. Arreglar esto soluciona ~60% de los issues visuales de golpe.

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| A1 | **Forzar light theme en storefront** - ThemeProvider ya está en `defaultTheme="light"`, verificar que `:root` aplique light tokens | `globals.css`, `providers.tsx` | S |
| A2 | **Reemplazar TODOS los `bg-white/5`, `bg-white/10`, `hover:bg-white/5`** por tokens (`bg-[var(--surface)]`, `hover:bg-[var(--surface)]`) | `CartClient`, `CheckoutClient`, `ProductDetailClient`, `tracking/page`, `error.tsx`, `not-found.tsx`, `loading.tsx` | M |
| A3 | **Reemplazar `bg-white`, `text-gray-*`, `border-gray-*`** en ProductCard por tokens del design system | `ProductCard.tsx` (24 instancias) | M |
| A4 | **Reemplazar `bg-[#f5f5f7]` y `from-[#f5f5f7]`** por `bg-[var(--background)]` | `HomeClient.tsx`, `ProductCarousel.tsx` | S |
| A5 | **Fix `rounded-card` clase inexistente** → `rounded-xl` | `ProductDetailClient.tsx` | S |
| A6 | **Fix skeletons/loading** usar tokens en vez de `bg-white/5` | `loading.tsx`, `ProductCardSkeleton.tsx` | S |
| A7 | **Login/Register** cambiar `bg-black` a gradiente con branding del tenant | `LoginForm.tsx`, `RegisterForm.tsx` | S |
| A8 | **Fix `::selection` color hardcoded** → usar `var(--store-primary)` | `globals.css` | S |
| A9 | **Fix skeleton shimmer** usar tokens en vez de `#f0f0f0` | `globals.css` | S |

---

## Fase B: Bugs Críticos (1 día)

Cosas que están rotas y afectan funcionalidad.

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| B1 | **Cart badge contar cantidades** no items - `items.reduce((sum, i) => sum + i.quantity, 0)` | `CartInitializer.tsx` | S |
| B2 | **Checkout race condition** - agregar `isLoading` check antes de redirigir por carrito vacío | `CheckoutClient.tsx` | S |
| B3 | **Add-to-cart feedback para guests** - mostrar toast + redirect a login con return URL | `HomeClient.tsx`, `CatalogClient.tsx`, `ProductDetailClient.tsx` | M |
| B4 | **Login redirect back** - leer `?redirect=` param y volver a página anterior post-login | `LoginForm.tsx`, `RegisterForm.tsx` | S |
| B5 | **Crear página `/cuenta`** - orden history, datos personales, logout | Nueva: `app/(storefront)/cuenta/page.tsx` | M |
| B6 | **Crear página `/recuperar`** - form de recuperación de contraseña | Nueva: `app/(storefront)/recuperar/page.tsx` | S |
| B7 | **Order confirmation auto-search** - tracking page debe consumir `?order=` param automáticamente | `tracking/page.tsx` | S |
| B8 | **Safe area bottom CSS** - agregar `padding-bottom: env(safe-area-inset-bottom)` para iPhone | `globals.css` | S |

---

## Fase C: Interaction Polish (2 días)

Lo que hace que se sienta profesional vs amateur.

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| C1 | **Swipe en ImageCarousel** - touch events para mobile | `ImageCarousel.tsx` | M |
| C2 | **Carousel arrows visibles en mobile** - `opacity-60 md:opacity-0 md:group-hover:opacity-100` | `ProductCarousel.tsx` | S |
| C3 | **Selected state en checkout** - borde primary en delivery/payment seleccionado | `CheckoutClient.tsx` | S |
| C4 | **Loading state en add-to-cart** - spinner/disabled durante API call | `ProductCard.tsx`, `ProductDetailClient.tsx` | M |
| C5 | **Navbar mobile animada** - slide-down con transición en vez de mount/unmount | `Navbar.tsx` | S |
| C6 | **Navbar active link** - indicador visual de página actual | `Navbar.tsx` | S |
| C7 | **BottomNav active indicator** - dot debajo del tab activo | `BottomNav.tsx` | S |
| C8 | **FAB entrance animation** - fade-in + slide-up con delay | `FloatingButtons.tsx`, `globals.css` | S |
| C9 | **Pagination truncada** - 1...4 5 6...20 en vez de todos los números | `CatalogClient.tsx` | M |
| C10 | **Cart "Vaciar" confirmación** - dialog antes de borrar todo | `CartClient.tsx` | S |
| C11 | **Password visibility toggle** en login/register | `LoginForm.tsx`, `RegisterForm.tsx` | S |

---

## Fase D: Trust & Conversion (1-2 días)

Lo que hace que la gente compre.

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| D1 | **Trust badges en checkout** - iconos Webpay/Transbank, candado, "Pago seguro" | `CheckoutClient.tsx` | S |
| D2 | **Trust strip en homepage** - "Envío a todo Chile · Pago seguro · Retiro en tienda" entre tiles y productos | `HomeClient.tsx` | S |
| D3 | **Promo bar configurable** - leer de `tenant.config?.promo_bar_text` | `Header.tsx` | S |
| D4 | **Payment logos** junto a radio buttons en checkout | `CheckoutClient.tsx` | S |
| D5 | **"Comprar ahora" button** en product detail - add + redirect a checkout | `ProductDetailClient.tsx` | M |
| D6 | **Productos relacionados** en product detail - carousel de misma categoría/juego | `ProductDetailClient.tsx`, `producto/[id]/page.tsx` | M |
| D7 | **Filter chips activos** en catálogo - mostrar filtros aplicados con X para remover | `CatalogClient.tsx` | M |
| D8 | **Results count** en catálogo - "Mostrando 1-20 de 145 productos" | `CatalogClient.tsx` | S |
| D9 | **Empty search mejorado** - icono, sugerencias, link a catálogo | `ProductGrid.tsx` | S |
| D10 | **Breadcrumbs UI** en product detail y catálogo filtrado | Nuevo: `Breadcrumb.tsx`, `ProductDetailClient.tsx` | M |
| D11 | **Terms checkbox en registro** - legal requirement | `RegisterForm.tsx` | S |

---

## Fase E: Visual Polish (1-2 días)

Lo que hace que se vea como bluecard.cl y no como un proyecto de universidad.

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| E1 | **Brand logos reales** - reemplazar letras por imágenes SVG de marcas | `HomeClient.tsx`, nuevos assets | M |
| E2 | **Catalog filters agrupados** - envolver en card con borde, label "Filtros" | `CatalogClient.tsx` | S |
| E3 | **Select dropdowns custom** - `appearance-none` + chevron custom | `CatalogClient.tsx`, `CheckoutClient.tsx` | S |
| E4 | **Product detail card condition** como badges/pills en vez de tabla | `ProductDetailClient.tsx` | S |
| E5 | **Order tracking timeline** - stepper horizontal (Pendiente → Confirmado → Enviado → Entregado) | `tracking/page.tsx` | M |
| E6 | **Cart item line total** - mostrar precio × cantidad + "($X c/u)" | `CartClient.tsx` | S |
| E7 | **Footer payment logos visibilidad** - subir opacity de 60 a 80 | `Footer.tsx` | S |
| E8 | **Footer "Compra segura" más visible** - subir de `text-white/25` a `text-white/50` + icono verde | `Footer.tsx` | S |
| E9 | **ImageCarousel mobile aspect ratio** - `aspect-[2/1] md:aspect-[3/1]` más alto en mobile | `ImageCarousel.tsx` | S |
| E10 | **Loading skeleton aspect ratio** - matchear con ImageCarousel real | `loading.tsx` | S |
| E11 | **"Vista rapida" overlay** - ocultar en mobile (`hidden md:flex`) | `ProductCard.tsx` | S |

---

## Fase F: Performance & Code Quality (1 día)

| # | Task | Archivos | Esfuerzo |
|---|------|----------|----------|
| F1 | **Social SVG icons** - extraer a componente compartido | Nuevo: `components/icons/SocialIcons.tsx` | S |
| F2 | **ImageCarousel lazy render** - solo renderizar current ±1 slides | `ImageCarousel.tsx` | M |
| F3 | **ProductCarousel scroll snap** - `scroll-snap-type: x mandatory` | `ProductCarousel.tsx`, `globals.css` | S |
| F4 | **Eliminar `CategoryTile.tsx`** - dead code, HomeClient tiene su propia implementación | `CategoryTile.tsx` | S |
| F5 | **Optimistic updates en cart quantity** - UI inmediata, rollback on error | `CartClient.tsx` | M |

---

## Resumen por prioridad

| Fase | Items | Tiempo | Impacto |
|------|-------|--------|---------|
| **A: Theme** | 9 | 1 día | Arregla 60% de issues visuales |
| **B: Bugs** | 8 | 1 día | Funcionalidad rota → funcional |
| **C: Interactions** | 11 | 2 días | Amateur → Profesional |
| **D: Trust/Conversion** | 11 | 2 días | Más ventas |
| **E: Visual Polish** | 11 | 2 días | Proyecto → Producto real |
| **F: Performance** | 5 | 1 día | Más rápido, menos código |
| **Total** | **55 items** | **~9 días** | |

---

## Orden de ejecución recomendado

```
Día 1: A1-A9 (theme coherence) + B1-B2 (bugs críticos)
Día 2: B3-B8 (resto de bugs) + C1-C3 (interactions más importantes)
Día 3: C4-C11 (resto interactions) + D1-D4 (trust signals)
Día 4: D5-D11 (conversion features)
Día 5: E1-E11 (visual polish)
Día 6: F1-F5 (performance) + QA final
```

Fase A es la más importante - una vez que el theme esté coherente, todo lo demás se ve 10x mejor automáticamente.
