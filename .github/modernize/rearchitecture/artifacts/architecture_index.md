# Architecture implementation guide

This index is not the full contract. Do not implement from this file alone; follow the artifact paths below.

## Global artifacts

- `unit_graph.yaml`: entrypoints, dependencies and source anchors for every unit.
- `migration_boundary.yaml`: implementation scope; `must_rewrite` is authoritative and source anchors are not rewrite targets.
- `wire_contracts.yaml`: REST request/response/auth/error contracts. Filter by `unit`.
- `shared_modules.yaml`: shared authentication and API proxy modules. Filter by `used_by_units`.
- `cross_unit_state.yaml`: cookie and UI-state flows. Filter by writer or reader unit.
- `project-structure.md`, `tech-stack.md`, `data-model.md`: global structure, stack and existing data model.

## Implementation Guide

### auth-api

- External trigger: `/api/auth/login`, `/register`, `/logout`, `/profile`.
- Read `units/auth-api/behavior.yaml` and `units/auth-api/bindings.yaml` for auth side effects and route wiring.
- Filter `wire_contracts.yaml` where `unit: auth-api`; filter `cross_unit_state.yaml` where writer or reader is `auth-api`.
- Before DONE report protected-cookie evidence and login/profile error behavior.

### catalog-api

- External trigger: public catalog GETs and admin catalog POST/PATCH operations.
- Read the unit behavior, bindings and decomposition files; filter catalog rows in `wire_contracts.yaml`.
- Before DONE report active filtering, validation, duplicate handling and admin authorization evidence.

### appointment-api

- External trigger: authenticated booking POST and admin appointment GET/PATCH.
- Read the unit artifacts and the appointment rows in `wire_contracts.yaml`; preserve reference resolution and status/notes updates.
- Before DONE report creation, populated response shape, authorization and validation evidence.

### admin-panel

- External trigger: React admin view selected by `App.activeView`.
- Read the unit behavior, bindings and decomposition files; filter shared modules and cross-unit state for `admin-panel`.
- Before DONE report API loading, empty/error states, persisted mutation results and build evidence.

### user-admin-api

- External trigger: admin `/api/users` GET/PATCH.
- Read the unit artifacts and the user-admin row in `wire_contracts.yaml`.
- Before DONE report that password hashes are excluded and role/status changes are authorization-protected.

### seed-cli

- External trigger: `npm run seed` from `apps/backend`.
- Read the unit behavior and bindings files; preserve idempotency and environment-based credentials.
- Before DONE report seed counts, existing-record behavior and MongoDB connection evidence.

## Completion evidence

Implementation is complete only when the assigned artifacts were read, every `must_preserve` behavior is implemented, unresolved contracts are listed, backend syntax passes, frontend build passes, and runtime verification is performed with MongoDB available.
