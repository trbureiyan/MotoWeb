import assert from "node:assert/strict"
import test from "node:test"
import Review from "../src/models/Review.js"
import User from "../src/models/User.js"
import { listReviews } from "../src/controllers/reviews.controller.js"

const userId = "507f1f77bcf86cd799439011"

const listAs = async (user, account) => {
    const originalFindReview = Review.find
    const originalFindUser = User.findById
    let filter
    Review.find = query => {
        filter = query
        return { populate: () => ({ sort: () => ({ lean: async () => [] }) }) }
    }
    User.findById = () => ({ select: () => ({ lean: async () => account }) })
    try {
        let body
        await listReviews({ user }, { json(data) { body = data } })
        return { filter, body }
    } finally {
        Review.find = originalFindReview
        User.findById = originalFindUser
    }
}

test("admin JWT with only an id can list hidden reviews", async () => {
    const result = await listAs({ id: userId }, { role: "admin", isActive: true })
    assert.deepEqual(result.filter, {})
    assert.deepEqual(result.body, [])
})

test("anonymous visitors only list approved reviews", async () => {
    const result = await listAs(undefined, null)
    assert.deepEqual(result.filter, { isApproved: true })
})

test("deactivated administrators cannot list hidden reviews", async () => {
    const result = await listAs({ id: userId }, { role: "admin", isActive: false })
    assert.deepEqual(result.filter, { isApproved: true })
})
