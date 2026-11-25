import assert from "node:assert/strict"
import test from "node:test"
import { errorMiddleware } from "../src/middlewares/error.middleware.js"

const invoke = error => {
    const res = {
        status(code) { this.code = code; return this },
        json(body) { this.body = body; return this }
    }
    const original = console.error
    console.error = () => {}
    try { errorMiddleware(error, {}, res, () => {}) } finally { console.error = original }
    return res
}

test("unexpected server errors do not expose filesystem paths", () => {
    const result = invoke(new Error("Cannot find module C:\\private\\secret"))
    assert.equal(result.code, 500)
    assert.equal(result.body.message, "Error interno del servidor")
})

test("expected client errors keep their status and helpful message", () => {
    const error = Object.assign(new Error("Solicitud inválida"), { statusCode: 400, expose: true })
    const result = invoke(error)
    assert.equal(result.code, 400)
    assert.equal(result.body.message, "Solicitud inválida")
})

test("client errors not marked as safe do not expose internal details", () => {
    const result = invoke(Object.assign(new Error("C:\\private\\dependency"), { status: 400 }))
    assert.equal(result.code, 400)
    assert.equal(result.body.message, "Solicitud inválida")
})
