import assert from "node:assert/strict"
import test from "node:test"
import Appointment from "../src/models/Appointment.js"
import Notification from "../src/models/Notification.js"
import Payment from "../src/models/Payment.js"
import { updateAppointment } from "../src/controllers/appointments.controller.js"

const id = "507f1f77bcf86cd799439011"
const userId = "507f191e810c19729de860ea"

const invoke = async (document, body, createPayment = async () => ({})) => {
    const originalFind = Appointment.findById
    const originalFindPayment = Payment.findOne
    const originalCreate = Payment.create
    const originalNotify = Notification.create
    let saves = 0
    let creates = 0
    let notifications = 0
    let reads = 0
    document.save = async () => { saves++ }
    Appointment.findById = () => ++reads === 1
        ? Promise.resolve(document)
        : {
            populate() { return this },
            lean: async () => document
        }
    Payment.findOne = () => {
        const payment = creates ? { amount: 100, status: "pending", appointment: id } : null
        return {
            lean: async () => payment,
            then: (resolve, reject) => Promise.resolve(payment).then(resolve, reject)
        }
    }
    Payment.create = async () => { creates++; return createPayment() }
    Notification.create = async () => { notifications++ }
    const res = {
        code: 200,
        status(code) { this.code = code; return this },
        json(body) { this.body = body; return this }
    }
    try {
        await updateAppointment({ params: { id }, body, user: { id: userId, role: "admin" } }, res)
        return { res, saves, creates, notifications, document }
    } finally {
        Appointment.findById = originalFind
        Payment.findOne = originalFindPayment
        Payment.create = originalCreate
        Notification.create = originalNotify
    }
}

const document = (status = "confirmed") => ({
    _id: id, user: userId, status, novedades: [], parentAppointment: null,
    requestedDate: new Date(), motorcycleModel: "Demo", brandName: "Moto"
})

test("a failed payment creation does not complete the appointment", async () => {
    const result = await invoke(document(), { status: "completed", paymentAmount: 100, novedades: [] }, async () => {
        throw new Error("payment unavailable")
    })
    assert.equal(result.res.code, 400)
    assert.equal(result.saves, 0)
    assert.equal(result.document.status, "confirmed")
})

test("completion rejects an invalid amount before saving", async () => {
    const result = await invoke(document(), { status: "completed", paymentAmount: 0, novedades: [] })
    assert.equal(result.res.code, 400)
    assert.equal(result.saves, 0)
    assert.equal(result.creates, 0)
})

test("completion with no findings creates the pending payment and notifies the client", async () => {
    const result = await invoke(document(), { status: "completed", paymentAmount: 100, novedades: [] })
    assert.equal(result.res.code, 200, JSON.stringify(result.res.body))
    assert.equal(result.document.status, "completed")
    assert.equal(result.creates, 1)
    assert.equal(result.saves, 1)
    assert.equal(result.notifications, 1)
    assert.deepEqual(result.res.body.novedades, [])
    assert.equal(result.res.body.payment.amount, 100)
})

test("completed appointments cannot return to pending", async () => {
    const result = await invoke(document("completed"), { status: "pending" })
    assert.equal(result.res.code, 409)
    assert.equal(result.saves, 0)
})

test("completed appointments without a payment still allow amount recovery", async () => {
    const result = await invoke(document("completed"), { status: "completed", paymentAmount: 100 })
    assert.equal(result.creates, 1)
    assert.equal(result.res.code, 200, JSON.stringify(result.res.body))
})
