# Vite Migration Design (Vue 3 CDN -> Vite + SFC)

Date: 2026-03-16

## Goals
- Migrate the current single-file Vue 3 CDN app to a Vite-built Vue 3 app.
- Split UI into reusable components and extract business logic into composables.
- Replace the handwritten Service Worker with `vite-plugin-pwa`.
- Preserve current functionality, visuals, and local-first behavior.

## Non-Goals
- No TypeScript migration in this phase.
- No new features or behavioral changes beyond the build/tooling swap.
- No backend services or cloud sync.

## Target Structure
- `src/main.js`: app bootstrap, global CSS.
- `src/App.vue`: top-level layout and view switching.
- `src/components/`: UI components (Header, StatusCard, CalendarGrid, DayCell, BottomNav, SettingsPanel, TemplatesPanel, ReportModal, ExportPanel).
- `src/composables/`: reusable logic (calendar math, tasks/templates, stats, settings, storage/exports, report generation).
- `src/assets/`: images/fonts handled by Vite.
- `public/`: PWA icons and static files.

## Data Flow
- Composition API with state kept in composables and injected into components.
- Storage is still local (IndexedDB / localStorage depending on current logic).
- Export features remain local-only (CSV/config export).

## PWA Plan
- Use `vite-plugin-pwa` with a declarative manifest and Workbox config.
- Precache app shell + static assets; runtime caching for images.
- Keep offline fallback to main app shell.

## Migration Steps (High Level)
1. Initialize Vite Vue project in this repo and install dependencies.
2. Move CSS out of `index.html` into `src/styles/app.css` (or `App.vue`).
3. Move HTML template into `App.vue` and split into components.
4. Move JS logic into composables and wire components.
5. Configure `vite-plugin-pwa` and migrate `manifest.json`.
6. Move static assets to `public/` or `src/assets/` depending on usage.
7. Validate local dev, build, and PWA install flow.

## Risks
- Asset paths may change when moving from root to Vite paths.
- PWA caching differences vs. current `sw.js`.
- Encoding issues for existing Chinese strings; keep source files UTF-8.

## Verification
- `npm run dev` renders UI correctly.
- `npm run build` succeeds.
- `npm run preview` supports PWA install + offline app shell.
