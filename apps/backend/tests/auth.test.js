import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import test from "node:test"
import { fileURLToPath } from "node:url"
import jwt from "jsonwebtoken"
import User from "../src/models/User.js"
import { TOKEN_SECRET } from "../src/config.js"
import { authRequired } from "../src/middlewares/validate.token.js"
import { updateUser } from "../src/controllers/users.controller.js"
import authRoutes from "../src/routes/auth.routes.js"

const userId = "507f1f77bcf86cd799439011"
const backendDirectory = fileURLToPath(new URL("../", import.meta.url))

const authenticate = (user) => new Promise((resolve, reject) => {
    const originalFindById = User.findById
    User.findById = () => ({ select: () => ({ lean: async () => user }) })
    const req = { cookies: { token: jwt.sign({ id: userId }, TOKEN_SECRET) } }
    const res = {
        code: 200,
        status(code) { this.code = code; return this },
        json(body) { restore(); resolve({ code: this.code, body, req }) }
    }
    const restore = () => { User.findById = originalFindById }
    authRequired(req, res, error => {
        restore()
        if (error) reject(error)
        else resolve({ code: 200, req })
    })
})

test("a deactivated account cannot use an existing token", async () => {
    const result = await authenticate({ _id: userId, name: "Demo", role: "client", isActive: false })
    assert.equal(result.code, 403)
})

test("a deleted account cannot use an existing token", async () => {
    const result = await authenticate(null)
    assert.equal(result.code, 403)
})

test("an active token provides the current database role", async () => {
    const result = await authenticate({ _id: userId, name: "Demo", role: "admin", isActive: true })
    assert.equal(result.code, 200)
    assert.equal(result.req.user.role, "admin")
})

test("user activation rejects string values instead of coercing them", async () => {
    const originalUpdate = User.findByIdAndUpdate
    let called = false
    User.findByIdAndUpdate = () => {
        called = true
        return { select: () => ({ lean: async () => ({ _id: userId, isActive: true }) }) }
    }
    try {
        const res = {
            code: 200,
            status(code) { this.code = code; return this },
            json(body) { this.body = body; return this }
        }
        await updateUser({ params: { id: userId }, body: { isActive: "false" } }, res)
        assert.equal(res.code, 400)
        assert.equal(called, false)
    } finally {
        User.findByIdAndUpdate = originalUpdate
    }
})

test("profile route forwards database failures to Express error handling", async () => {
    const originalFindById = User.findById
    User.findById = async () => { throw new Error("database unavailable") }
    try {
        const route = authRoutes.stack.find(layer => layer.route?.path === "/profile").route
        const handler = route.stack.at(-1).handle
        let forwarded
        await new Promise(resolve => {
            const returned = handler({ user: { id: userId } }, {}, error => {
                forwarded = error
                resolve()
            })
            Promise.resolve(returned).catch(resolve)
        })
        assert.equal(forwarded?.message, "database unavailable")
    } finally {
        User.findById = originalFindById
    }
})

test("seed refuses to create privileged users without configured passwords", () => {
    const env = { ...process.env, NODE_ENV: "production", JWT_SECRET: "test-only-secret", MONGODB_URI: "mongodb://127.0.0.1:1/motoweb" }
    delete env.SEED_ADMIN_PASSWORD
    delete env.SEED_MECHANIC_PASSWORD
    const result = spawnSync(process.execPath, ["scripts/seed.js"], {
        cwd: backendDirectory,
        env,
        encoding: "utf8",
        timeout: 2000
    })
    assert.match(result.stderr, /SEED_ADMIN_PASSWORD|SEED_MECHANIC_PASSWORD/)
    assert.notEqual(result.status, 0)
})
