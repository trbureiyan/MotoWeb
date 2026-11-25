import assert from "node:assert/strict"
import test from "node:test"
import { loadAvailableBrands } from "./brands.js"

test("empty catalog remains empty rather than inventing brands", async () => {
    const brands = await loadAvailableBrands(async () => ({ ok: true, json: async () => [] }))
    assert.deepEqual(brands, [])
})

test("catalog server errors are reported even when their body looks like a list", async () => {
    await assert.rejects(loadAvailableBrands(async () => ({ ok: false, json: async () => [] })), /marcas/)
})

test("only active brands are offered", async () => {
    const brands = await loadAvailableBrands(async () => ({
        ok: true,
        json: async () => [{ name: "Activa", isActive: true }, { name: "Inactiva", isActive: false }]
    }))
    assert.deepEqual(brands.map(brand => brand.name), ["Activa"])
})
