import assert from "node:assert/strict"
import test from "node:test"
import { readApiResponse, apiErrorMessage } from "./api-response.js"

test("an empty server error produces a readable connection error", async () => {
    await assert.rejects(
        readApiResponse(new Response("", { status: 502 })),
        /servidor/i
    )
})

test("a successful non-JSON response does not act like a valid account", async () => {
    await assert.rejects(
        readApiResponse(new Response("<html>unexpected</html>", { status: 200 })),
        /servidor/i
    )
})

test("valid JSON errors preserve useful validation details", async () => {
    const body = { error: ["Ingresa un correo válido."] }
    assert.deepEqual(await readApiResponse(Response.json(body, { status: 400 })), body)
})

test("network failures are presented in Spanish rather than raw browser errors", () => {
    assert.match(apiErrorMessage(new TypeError("Failed to fetch")), /conectar/i)
})
