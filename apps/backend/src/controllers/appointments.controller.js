import mongoose from "mongoose"
import Brand from "../models/Brand.js"
import Appointment from "../models/Appointment.js"
import BrandRequest from "../models/BrandRequest.js"
import Notification from "../models/Notification.js"
import Payment from "../models/Payment.js"
import { findBrand } from "./brands.controller.js"
import { findService } from "./services.controller.js"

// Motivos de ingreso permitidos al cliente en citas raíz.
// Las citas encadenadas no pasan por esta validación: su motivo es la novedad que resuelven.
const CLIENT_MOTIVES = ["DIAGNOSTICO", "REVISION", "MANTENIMIENTO PREVENTIVO"]

const normalizeServiceName = (value = "") =>
    String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase()

const MAX_NOVEDADES = 15

// Normaliza el array de novedades que envía el admin al completar una cita raíz.
// Devuelve null si el payload no es un array (para distinguir de un array vacío).
const sanitizeNovedades = (input) => {
    if (!Array.isArray(input)) return null
    return input
        .map(item => {
            const description = String(item?.description ?? "").trim()
            if (!description) return null
            const severity = ["low", "medium", "high"].includes(item?.severity) ? item.severity : "medium"
            const estimatedCost = Number(item?.estimatedCost)
            return {
                description: description.slice(0, 300),
                severity,
                estimatedCost: Number.isFinite(estimatedCost) && estimatedCost >= 0 ? estimatedCost : 0
            }
        })
        .filter(Boolean)
        .slice(0, MAX_NOVEDADES)
}

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
    parentAppointment: appointment.parentAppointment || null,
    chainRoot: appointment.chainRoot || null,
    chainReason: appointment.chainReason || "",
    isChain: Boolean(appointment.parentAppointment),
    novedades: (appointment.novedades || []).map(novedad => ({
        id: novedad._id,
        description: novedad.description,
        severity: novedad.severity,
        estimatedCost: novedad.estimatedCost,
        status: novedad.status,
        resolvedByAppointment: novedad.resolvedByAppointment || null,
        resolvedAt: novedad.resolvedAt || null,
        createdAt: novedad.createdAt
    })),
    resolvesNovedades: (appointment.resolvesNovedades || []).map(id => String(id)),
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
    if (!CLIENT_MOTIVES.includes(normalizeServiceName(serviceDoc.name))) {
        return res.status(400).json({ message: "El motivo de ingreso debe ser diagnóstico, revisión o mantenimiento preventivo." })
    }

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

// Crea una cita hija a partir de las novedades abiertas de una cita raíz completada.
// El cliente elige qué novedades corregir y la fecha; marca y modelo se heredan.
export const createChainAppointment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "ID de cita inválido" })
    }

    const { novedadIds, requestedDate } = req.body
    if (!Array.isArray(novedadIds) || !novedadIds.length) {
        return res.status(400).json({ message: "Selecciona al menos una novedad para agendar." })
    }
    const ids = [...new Set(novedadIds.map(id => String(id)))]
    if (!ids.every(id => mongoose.isValidObjectId(id))) {
        return res.status(400).json({ message: "Una de las novedades seleccionadas no es válida." })
    }
    if (!requestedDate) return res.status(400).json({ message: "Indica la fecha para la corrección." })
    const date = new Date(requestedDate)
    if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: "La fecha solicitada no es válida" })
    }

    const source = await Appointment.findOne({ _id: req.params.id, user: req.user.id }).lean()
    if (!source) return res.status(404).json({ message: "Cita no encontrada" })

    // Acepta tanto la raíz como cualquier cita de la cadena; siempre opera sobre la raíz.
    const rootId = source.chainRoot || source._id
    const root = String(rootId) === String(source._id)
        ? source
        : await Appointment.findOne({ _id: rootId, user: req.user.id }).lean()
    if (!root) return res.status(404).json({ message: "Cita original no encontrada" })
    if (root.parentAppointment) {
        return res.status(400).json({ message: "Solo la cita original puede generar correcciones." })
    }
    if (root.status !== "completed") {
        return res.status(400).json({ message: "La cita debe estar completada para agendar correcciones." })
    }

    const novedadesById = new Map((root.novedades || []).map(novedad => [String(novedad._id), novedad]))
    const selected = ids.map(id => novedadesById.get(id))
    if (selected.some(novedad => !novedad)) {
        return res.status(400).json({ message: "Alguna novedad no pertenece a esta cita." })
    }
    if (selected.some(novedad => novedad.status === "resolved")) {
        return res.status(400).json({ message: "Alguna novedad seleccionada ya fue resuelta." })
    }

    const activeChildren = await Appointment.find({
        chainRoot: root._id,
        status: { $in: ["pending", "confirmed"] }
    }).select("resolvesNovedades").lean()
    const alreadyScheduled = new Set(activeChildren.flatMap(child => (child.resolvesNovedades || []).map(String)))
    if (ids.some(id => alreadyScheduled.has(id))) {
        return res.status(409).json({ message: "Alguna novedad ya tiene una cita de corrección pendiente." })
    }

    const chainReason = selected.map(novedad => novedad.description).join(" + ").slice(0, 300)
    const child = await Appointment.create({
        user: root.user,
        brand: root.brand,
        brandName: root.brandName,
        brandRequest: root.brandRequest,
        service: root.service,
        motorcycleModel: root.motorcycleModel,
        requestedDate: date,
        status: "pending",
        parentAppointment: root._id,
        chainRoot: root._id,
        chainReason,
        resolvesNovedades: ids
    })

    await Appointment.updateOne(
        { _id: root._id },
        { $set: { "novedades.$[novedad].status": "scheduled" } },
        { arrayFilters: [{ "novedad._id": { $in: ids }, "novedad.status": "open" }] }
    )

    const populated = await Appointment.findById(child._id)
        .populate("user", "name email phone")
        .populate("brand", "name slug")
        .populate("brandRequest", "name")
        .populate("service", "name")
        .lean()

    await Notification.create({
        user: root.user,
        appointment: child._id,
        type: "appointment_chain_scheduled",
        message: `Agendamos la corrección de ${ids.length} novedad(es) para ${root.brandName || "tu moto"} ${root.motorcycleModel} · fecha ${date.toLocaleDateString("es-CO", { timeZone: "UTC" })}. Motivo: ${chainReason}.`
    })

    res.status(201).json(serializeAppointment(populated))
}

export const updateAppointment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de cita inválido" })
    const allowed = {}
    if (req.body.status !== undefined) allowed.status = req.body.status
    if (req.body.adminNotes !== undefined) allowed.adminNotes = String(req.body.adminNotes).trim()
    if (req.body.statusReason !== undefined) allowed.statusReason = String(req.body.statusReason).trim()
    if (req.body.paymentAmount !== undefined) allowed.paymentAmount = Number(req.body.paymentAmount)
    const hasNovedadesInput = req.body.novedades !== undefined
    const novedadesInput = hasNovedadesInput ? sanitizeNovedades(req.body.novedades) : null
    if (hasNovedadesInput && novedadesInput === null) {
        return res.status(400).json({ message: "El formato de novedades no es válido." })
    }
    if (!Object.keys(allowed).length) return res.status(400).json({ message: "No hay cambios para aplicar" })

    try {
        const appointmentDocument = await Appointment.findById(req.params.id)
        if (!appointmentDocument) return res.status(404).json({ message: "Cita no encontrada" })

        const previousStatus = appointmentDocument.status
        const isRoot = !appointmentDocument.parentAppointment
        if (hasNovedadesInput) {
            if (!isRoot) return res.status(400).json({ message: "Solo la cita original puede registrar novedades." })
            if (allowed.status !== "completed") return res.status(400).json({ message: "Las novedades solo se registran al completar la cita." })
            if (previousStatus === "completed" || appointmentDocument.novedades?.length) {
                return res.status(400).json({ message: "Las novedades de esta cita ya fueron registradas." })
            }
        }
        // Completar una cita raíz exige registrar novedades (aunque sea un array vacío).
        const completesRoot = isRoot && allowed.status === "completed" && previousStatus !== "completed"
        if (completesRoot && !hasNovedadesInput && !appointmentDocument.novedades?.length) {
            return res.status(400).json({ message: "Registra las novedades encontradas o confirma que no hay novedades para completar la cita." })
        }
        const paymentAmount = allowed.paymentAmount
        const existingPayment = allowed.status === "completed"
            ? await Payment.findOne({ appointment: appointmentDocument._id })
            : null
        const shouldCreatePayment = allowed.status === "completed" && !existingPayment

        if (allowed.status === "cancelled" && previousStatus !== "cancelled") {
            if (isRoot) {
                const activeChildren = await Appointment.countDocuments({
                    chainRoot: appointmentDocument._id,
                    status: { $in: ["pending", "confirmed"] }
                })
                if (activeChildren > 0) {
                    return res.status(400).json({ message: "No puedes cancelar la cita original mientras tenga correcciones pendientes o confirmadas." })
                }
            }
            if (!(allowed.statusReason ?? appointmentDocument.statusReason)?.trim()) {
                return res.status(400).json({ message: "Indica el motivo de cancelación para notificar al cliente." })
            }
        }
        if (shouldCreatePayment && (!Number.isFinite(paymentAmount) || paymentAmount <= 0)) {
            return res.status(400).json({ message: "Indica un monto final mayor que cero para completar la cita." })
        }

        delete allowed.paymentAmount
        Object.assign(appointmentDocument, allowed)
        if (hasNovedadesInput) appointmentDocument.novedades = novedadesInput
        await appointmentDocument.save()

        if (shouldCreatePayment) {
            await Payment.create({
                appointment: appointmentDocument._id,
                amount: paymentAmount,
                status: "pending"
            })
        } else if (allowed.status === "completed" && existingPayment?.status === "pending" &&
            Number.isFinite(paymentAmount) && paymentAmount > 0) {
            // Re-completar una cita cancelada actualiza el monto sin duplicar el pago.
            existingPayment.amount = paymentAmount
            await existingPayment.save()
        }

        // Al completar una cita hija, marcar como resueltas las novedades que resolvía.
        if (allowed.status === "completed" && !isRoot && appointmentDocument.chainRoot &&
            appointmentDocument.resolvesNovedades?.length) {
            await Appointment.updateOne(
                { _id: appointmentDocument.chainRoot },
                {
                    $set: {
                        "novedades.$[novedad].status": "resolved",
                        "novedades.$[novedad].resolvedAt": new Date(),
                        "novedades.$[novedad].resolvedByAppointment": appointmentDocument._id
                    }
                },
                { arrayFilters: [{ "novedad._id": { $in: appointmentDocument.resolvesNovedades } }] }
            )
        }

        // Al cancelar una cita hija, sus novedades vuelven a estar abiertas y reagendables.
        if (allowed.status === "cancelled" && previousStatus !== "cancelled" && !isRoot &&
            appointmentDocument.chainRoot && appointmentDocument.resolvesNovedades?.length) {
            const reopen = {
                "novedades.$[novedad].status": "open",
                "novedades.$[novedad].resolvedAt": null,
                "novedades.$[novedad].resolvedByAppointment": null
            }
            await Appointment.updateOne(
                { _id: appointmentDocument.chainRoot },
                { $set: reopen },
                { arrayFilters: [{ "novedad._id": { $in: appointmentDocument.resolvesNovedades }, "novedad.status": "scheduled" }] }
            )
            await Appointment.updateOne(
                { _id: appointmentDocument.chainRoot },
                { $set: reopen },
                { arrayFilters: [{ "novedad._id": { $in: appointmentDocument.resolvesNovedades }, "novedad.resolvedByAppointment": appointmentDocument._id }] }
            )
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
            const findings = allowed.status === "completed"
                ? isRoot
                    ? appointmentDocument.novedades?.length
                        ? ` Encontramos ${appointmentDocument.novedades.length} novedad(es) para revisar.`
                        : " Sin novedades adicionales."
                    : appointmentDocument.resolvesNovedades?.length
                        ? ` Se resolvieron ${appointmentDocument.resolvesNovedades.length} novedad(es) de la cadena.`
                        : ""
                : ""
            const chainNote = allowed.status === "cancelled" && !isRoot &&
                appointmentDocument.resolvesNovedades?.length
                ? ` Las ${appointmentDocument.resolvesNovedades.length} novedad(es) vinculadas vuelven a estar disponibles para reagendar.`
                : ""

            await Notification.create({
                user: appointmentDocument.user,
                appointment: appointmentDocument._id,
                type: `appointment_${allowed.status}`,
                message: `Tu cita para ${details} fue ${statusLabels[allowed.status]}.${amount}${findings}${chainNote}${reason}`
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
