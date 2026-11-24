import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import assert from "node:assert/strict"
import test from "node:test"

const backendDirectory = fileURLToPath(new URL("../", import.meta.url))
const runConfig = (environment) => {
    const env = { ...process.env, ...environment }
    delete env.MONGODB_URI
    delete env.MONGO_URI
    return spawnSync(process.execPath, ["--input-type=module", "--eval", "import('./src/config.js')"], {
        cwd: backendDirectory,
        env,
        encoding: "utf8"
    })
}

test("production refuses to start without a configured MongoDB URI", () => {
    const result = runConfig({ NODE_ENV: "production", JWT_SECRET: "test-only-secret" })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /MONGODB_URI/)
})

test("development retains its local MongoDB default", () => {
    const result = runConfig({ NODE_ENV: "development", JWT_SECRET: "test-only-secret" })
    assert.equal(result.status, 0, result.stderr)
})
