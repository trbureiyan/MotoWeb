# Tech stack

- Runtime: Node.js con módulos ES (`type: module`).
- Backend: Express 4, Mongoose 8, MongoDB, bcrypt 6, JWT 9, cookie-parser, Zod y Morgan.
- Frontend: React 19, Vite 6, GSAP 3 y `@gsap/react`.
- Package manager: pnpm 11; los scripts también se ejecutan con npm.
- Configuración runtime: `apps/backend/.env` contiene `PORT`, `MONGODB_URI`, `NODE_ENV` y `JWT_SECRET`; Vite proxifica `/api` hacia `http://localhost:3000`.
- Autenticación: JWT en cookie `token`; las operaciones administrativas requieren `role=admin`.
