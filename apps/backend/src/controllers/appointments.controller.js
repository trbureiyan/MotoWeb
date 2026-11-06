import mongoose from "mongoose"
import Brand from "../models/Brand.js"
import Appointment from "../models/Appointment.js"
import BrandRequest from "../models/BrandRequest.js"
import Notification from "../models/Notification.js"
import Payment from "../models/Payment.js"
import { findBrand } from "./brands.controller.js"
import { findService } from "./services.controller.js"

const serializeAppointment = (appointment, payment = null) => ({
    id: appointment._id,
    user: appointment.user,
    brand: appointment.brandName || appointment.brandRequest?.name || appointment.brand?.name || appointment.brand,
    brandId: appointment.brand?._id || appointment.brand,
    brandRequestId: appointment.brandRequest?._id || appointment.brandRequest || null,
    service: appointment.service?.name || appointment.service,
    serviceId: appointment.service?._id || appointment.service,
    motorcycleModel: appointment.motorcycleModel,
    requestedDate: appointment.requestedDate,
    status: appointment.status,
    adminNotes: appointment.adminNotes || "",
    statusReason: appointment.statusReason || "",
    payment: payment ? {
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt || null
    } : null,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
})

export const listAppointments = async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {}
    const appointments = await Appointment.find(filter)
        .populate("user", "name email phone")
        .populate("brand", "name slug")
        .populate("brandRequest", "name")
        .populate("service", "name")
        .sort({ requestedDate: 1, createdAt: -1 })
        .lean()
    const payments = await Payment.find({ appointment: { $in: appointments.map(appointment => appointment._id) } }).lean()
    const paymentsByAppointment = new Map(payments.map(payment => [String(payment.appointment), payment]))
    res.json(appointments.map(appointment => serializeAppointment(
        appointment,
        paymentsByAppointment.get(String(appointment._id))
    )))
}

export const listClientAppointments = async (req, res) => {
    const appointments = await Appointment.find({ user: req.user.id })
        .populate("brand", "name slug")
        .populate("brandRequest", "name")
        .populate("service", "name")
        .sort({ requestedDate: -1, createdAt: -1 })
        .lean()
    const payments = await Payment.find({ appointment: { $in: appointments.map(appointment => appointment._id) } }).lean()
    const paymentsByAppointment = new Map(payments.map(payment => [String(payment.appointment), payment]))
    res.json(appointments.map(appointment => serializeAppointment(
        appointment,
        paymentsByAppointment.get(String(appointment._id))
    )))
}

export const createAppointment = async (req, res) => {
    const { brand, brandRequestId, service, motorcycleModel, requestedDate } = req.body
    if ((!brand && !brandRequestId) || !service || !motorcycleModel || !requestedDate) {
        return res.status(400).json({ message: "Marca, servicio, modelo y fecha son obligatorios" })
    }
    if (brandRequestId && !mongoose.isValidObjectId(brandRequestId)) {
        return res.status(400).json({ message: "ID de solicitud de marca inválido" })
    }

    const [brandDoc, brandRequest, serviceDoc] = await Promise.all([
        brandRequestId ? null : findBrand(brand),
        brandRequestId
            ? BrandRequest.findOne({ _id: brandRequestId, user: req.user.id })
            : null,
        findService(service)
    ])
    if (brandRequestId && (!brandRequest || brandRequest.status === "rejected")) {
        return res.status(400).json({ message: "La solicitud de marca no existe o fue rechazada." })
    }
    if (!brandRequestId && (!brandDoc || !brandDoc.isActive)) {
        return res.status(400).json({ message: "La marca seleccionada no está disponible" })
    }
    const approvedBrand = brandRequest?.status === "approved"
        ? await Brand.findById(brandRequest.approvedBrand)
        : null
    if (brandRequest?.status === "approved" && (!approvedBrand || !approvedBrand.isActive)) {
        return res.status(400).json({ message: "La marca aprobada ya no está disponible." })
    }
    if (!serviceDoc) return res.status(400).json({ message: "El servicio seleccionado no existe" })

    const date = new Date(requestedDate)
    if (Number.isNaN(date.getTime())) return res.status(400).json({ message: "La fecha solicitada no es válida" })

    const appointment = await Appointment.create({
        user: req.user.id,
        brand: approvedBrand?._id || brandDoc?._id,
        brandName: approvedBrand?.name || brandRequest?.name || brandDoc.name,
        brandRequest: brandRequest?._id,
        service: serviceDoc._id,
        motorcycleModel: motorcycleModel.trim(),
        requestedDate: date,
        status: "pending"
    })
    const populated = await Appointment.findById(appointment._id)
        .populate("user", "name email phone")
        .populate("brand", "name slug")
        .populate("brandRequest", "name")
        .populate("service", "name")
        .lean()
    const serializedAppointment = serializeAppointment(populated)
    await Notification.create({
        user: req.user.id,
        appointment: appointment._id,
        type: "appointment_pending",
        message: `Recibimos tu solicitud de cita para ${serializedAppointment.brand} ${serializedAppointment.motorcycleModel} · ${serializedAppointment.service} · fecha ${new Date(serializedAppointment.requestedDate).toLocaleDateString("es-CO", { timeZone: "UTC" })}.`
    })
    res.status(201).json(serializedAppointment)
}

export const updateAppointment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de cita inválido" })
    const allowed = {}
    if (req.body.status !== undefined) allowed.status = req.body.status
    if (req.body.adminNotes !== undefined) allowed.adminNotes = String(req.body.adminNotes).trim()
    if (req.body.statusReason !== undefined) allowed.statusReason = String(req.body.statusReason).trim()
    if (req.body.paymentAmount !== undefined) allowed.paymentAmount = Number(req.body.paymentAmount)
    if (!Object.keys(allowed).length) return res.status(400).json({ message: "No hay cambios para aplicar" })

    try {
        const appointmentDocument = await Appointment.findById(req.params.id)
        if (!appointmentDocument) return res.status(404).json({ message: "Cita no encontrada" })

        const previousStatus = appointmentDocument.status
        const paymentAmount = allowed.paymentAmount
        const existingPayment = allowed.status === "completed" && previousStatus === "completed"
            ? await Payment.findOne({ appointment: appointmentDocument._id }).select("_id")
            : null
        const shouldCreatePayment = allowed.status === "completed" &&
            (previousStatus !== "completed" || !existingPayment)

        if (allowed.status === "cancelled" && previousStatus !== "cancelled" &&
            !(allowed.statusReason ?? appointmentDocument.statusReason)?.trim()) {
            return res.status(400).json({ message: "Indica el motivo de cancelación para notificar al cliente." })
        }
        if (shouldCreatePayment && (!Number.isFinite(paymentAmount) || paymentAmount <= 0)) {
            return res.status(400).json({ message: "Indica un monto final mayor que cero para completar la cita." })
        }

        delete allowed.paymentAmount
        Object.assign(appointmentDocument, allowed)
        await appointmentDocument.save()

        if (shouldCreatePayment) {
            await Payment.create({
                appointment: appointmentDocument._id,
                amount: paymentAmount,
                status: "pending"
            })
        }

        if (allowed.status && allowed.status !== previousStatus &&
            ["confirmed", "completed", "cancelled"].includes(allowed.status)) {
            const brandName = appointmentDocument.brandName ||
                (await Brand.findById(appointmentDocument.brand).select("name").lean())?.name ||
                "Marca no especificada"
            const serviceName = (await findService(appointmentDocument.service))?.name || "Servicio"
            const date = new Date(appointmentDocument.requestedDate).toLocaleDateString("es-CO", { timeZone: "UTC" })
            const statusLabels = {
                confirmed: "confirmada",
                completed: "completada",
                cancelled: "cancelada"
            }
            const payment = allowed.status === "completed"
                ? await Payment.findOne({ appointment: appointmentDocument._id }).lean()
                : null
            const amount = payment
                ? ` Monto final: $${payment.amount.toLocaleString("es-CO")} COP.`
                : ""
            const details = `${brandName} ${appointmentDocument.motorcycleModel} · ${serviceName} · fecha ${date}`
            const reason = allowed.status === "cancelled" && appointmentDocument.statusReason
                ? ` Motivo: ${appointmentDocument.statusReason}`
                : ""

            await Notification.create({
                user: appointmentDocument.user,
                appointment: appointmentDocument._id,
                type: `appointment_${allowed.status}`,
                message: `Tu cita para ${details} fue ${statusLabels[allowed.status]}.${amount}${reason}`
            })
        }

        const appointment = await Appointment.findById(appointmentDocument._id)
            .populate("user", "name email phone")
            .populate("brand", "name slug")
            .populate("brandRequest", "name")
            .populate("service", "name")
            .lean()
        if (!appointment) return res.status(404).json({ message: "Cita no encontrada" })
        const payment = await Payment.findOne({ appointment: appointmentDocument._id }).lean()
        res.json(serializeAppointment(appointment, payment))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
