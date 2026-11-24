import assert from "node:assert/strict"
import test from "node:test"
import { resolveReviews } from "./reviews.js"

test("an empty successful response does not resurrect hidden testimonials", () => {
    assert.deepEqual(resolveReviews([]), [])
})

test("a non-list response is not mistaken for an empty successful list", () => {
    assert.throws(() => resolveReviews({ message: "error" }), /opiniones/)
})
