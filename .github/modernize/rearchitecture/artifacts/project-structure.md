# Project structure

MotoWeb es un monorepo fullstack con dos aplicaciones desplegables:

- `apps/backend`: API Express, autenticación JWT en cookie HTTP-only, controladores y modelos Mongoose.
- `apps/frontend`: SPA React/Vite con las páginas públicas, login, reservas y panel administrativo.

Capas detectadas:

- Backend: `routes` → `controllers` → `models`, con `middlewares`, `services` y `scripts` de soporte.
- Frontend: `App.jsx` coordina vistas; `components` contiene UI y flujos; `styles` contiene estilos globales por dominio.

Puntos de entrada: `apps/backend/server.js`, `apps/frontend/main.jsx`, `apps/frontend/vite.config.js`.

Áreas funcionales: autenticación, catálogo de marcas/servicios, reservas, administración de usuarios, panel administrativo y galería pública.
