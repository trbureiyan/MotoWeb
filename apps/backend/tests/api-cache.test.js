import assert from "node:assert/strict"
import test from "node:test"
import app from "../src/app.js"

test("private API responses cannot be cached by the browser or proxy", async () => {
    const server = app.listen(0)
    try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/profile`)
        assert.equal(response.status, 401)
        assert.match(response.headers.get("cache-control") || "", /no-store/)
    } finally {
        await new Promise(resolve => server.close(resolve))
    }
})
