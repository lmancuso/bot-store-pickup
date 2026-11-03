# Store Pickup conversacional

MVP solo frontend: chat estilo mensajería (diseño propio), mapa Leaflet/OSM, datos mock y pedido con código de retiro. Español rioplatense.

## Requisitos

- Node.js `>= 24`
- pnpm 10 (recomendado vía Corepack):

```bash
corepack enable
```

## Instalación

```bash
pnpm install
pnpm exec playwright install chromium
```

El segundo comando hace falta solo para los E2E.

## Arranque

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

`pnpm test:e2e` hace build y sirve la app en el puerto `3100` (ver `playwright.config.ts`).

## Qué deberías ver hoy

- Chat mobile-first con header, burbujas (hora + ticks), indicador «escribiendo…», input accesible y autoscroll.
- Historial + sesión (carrito / categoría / ubicación) en `localStorage` con clave versionada `store-pickup-chat:v1`, tolerante a JSON corrupto.
- Datos mock: 5 categorías × 3 vendedores cerca del Obelisco, menús en ARS, nombres inventados.
- Detección de categoría por keywords (`IntentDetector` intercambiable); si hay ambigüedad, pregunta.
- Geolocalización del navegador con fallback al Obelisco (`-34.6037, -58.3816`); también podés marcar ubicación clickeando el mapa.
- Mapa Leaflet/OSM (import dinámico sin SSR): usuario + vendedores de la categoría; el abierto más cercano (haversine) resaltado.
- Flujo «pizza» → menú del más cercano; «empanadas» cambia vendedores; si hay carrito, pregunta antes de vaciar.
- Menú con botones +/− y por texto; total en vivo; «confirmar pedido» muestra código, dirección, horario y link «Cómo llegar».
