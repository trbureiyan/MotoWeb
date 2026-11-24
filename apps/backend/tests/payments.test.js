import assert from "node:assert/strict"
import test from "node:test"
import Appointment from "../src/models/Appointment.js"
import Notification from "../src/models/Notification.js"
import Payment from "../src/models/Payment.js"
import { simulateChainPayment } from "../src/controllers/payments.controller.js"

const appointmentId = "507f1f77bcf86cd799439011"
const userId = "507f191e810c19729de860ea"
const paymentId = "507f1f77bcf86cd799439012"

const query = value => ({
    select() { return this },
    populate() { return this },
    lean: async () => value
})

const invoke = async () => {
    const res = {
        code: 200,
        status(code) { this.code = code; return this },
        json(body) { this.body = body; return this }
    }
    await simulateChainPayment({ params: { appointmentId }, user: { id: userId } }, res)
    return res
}

test("a chain payment excludes appointments that are not completed", async () => {
    const saved = { findOne: Appointment.findOne, find: Appointment.find, findPayment: Payment.find, count: Payment.countDocuments, update: Payment.updateMany, create: Notification.create }
    let chainFilter
    Appointment.findOne = () => query({ _id: appointmentId, brandName: "Moto", motorcycleModel: "Demo" })
    Appointment.find = filter => {
        chainFilter = filter
        return query(filter.status === "completed" ? [] : [{ _id: appointmentId }])
    }
    Payment.find = filter => query(filter.appointment.$in.length ? [{ _id: paymentId, amount: 100 }] : [])
    Payment.countDocuments = async () => 0
    Payment.updateMany = async () => ({ modifiedCount: 1 })
    Notification.create = async () => ({})
    try {
        const result = await invoke()
        assert.equal(chainFilter.status, "completed")
        assert.equal(result.code, 404)
    } finally {
        Appointment.findOne = saved.findOne
        Appointment.find = saved.find
        Payment.find = saved.findPayment
        Payment.countDocuments = saved.count
        Payment.updateMany = saved.update
        Notification.create = saved.create
    }
})

test("concurrent payment submissions notify only for a newly paid item", async () => {
    const saved = { findOne: Appointment.findOne, find: Appointment.find, findPayment: Payment.find, count: Payment.countDocuments, update: Payment.updateMany, claim: Payment.findOneAndUpdate, create: Notification.create }
    let paid = false
    let notifications = 0
    Appointment.findOne = () => query({ _id: appointmentId, brandName: "Moto", motorcycleModel: "Demo" })
    Appointment.find = () => query([{ _id: appointmentId }])
    Payment.find = () => query([{ _id: paymentId, amount: 100 }])
    Payment.countDocuments = async () => 1
    Payment.updateMany = async () => ({ modifiedCount: paid ? 0 : (paid = true, 1) })
    Payment.findOneAndUpdate = () => query(paid ? null : (paid = true, { _id: paymentId, amount: 100 }))
    Notification.create = async () => { notifications++ }
    try {
        const [first, second] = await Promise.all([invoke(), invoke()])
        assert.deepEqual([first.code, second.code].sort(), [200, 409])
        assert.equal(notifications, 1)
    } finally {
        Appointment.findOne = saved.findOne
        Appointment.find = saved.find
        Payment.find = saved.findPayment
        Payment.countDocuments = saved.count
        Payment.updateMany = saved.update
        Payment.findOneAndUpdate = saved.claim
        Notification.create = saved.create
    }
})
