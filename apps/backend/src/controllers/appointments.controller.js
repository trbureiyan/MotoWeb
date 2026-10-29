import mongoose from "mongoose"
import Appointment from "../models/Appointment.js"
import { findBrand } from "./brands.controller.js"
import { findService } from "./services.controller.js"

const serializeAppointment = (appointment) => ({
    id: appointment._id,
    user: appointment.user,
    brand: appointment.brand?.name || appointment.brand,
    brandId: appointment.brand?._id || appointment.brand,
    service: appointment.service?.name || appointment.service,
    serviceId: appointment.service?._id || appointment.service,
    motorcycleModel: appointment.motorcycleModel,
    requestedDate: appointment.requestedDate,
    status: appointment.status,
    adminNotes: appointment.adminNotes || "",
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
})

export const listAppointments = async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {}
    const appointments = await Appointment.find(filter)
        .populate("user", "name email phone")
        .populate("brand", "name slug")
        .populate("service", "name")
        .sort({ requestedDate: 1, createdAt: -1 })
        .lean()
    res.json(appointments.map(serializeAppointment))
}

export const createAppointment = async (req, res) => {
    const { brand, service, motorcycleModel, requestedDate } = req.body
    if (!brand || !service || !motorcycleModel || !requestedDate) {
        return res.status(400).json({ message: "Marca, servicio, modelo y fecha son obligatorios" })
    }

    const [brandDoc, serviceDoc] = await Promise.all([findBrand(brand), findService(service)])
    if (!brandDoc) return res.status(400).json({ message: "La marca seleccionada no existe" })
    if (!serviceDoc) return res.status(400).json({ message: "El servicio seleccionado no existe" })

    const date = new Date(requestedDate)
    if (Number.isNaN(date.getTime())) return res.status(400).json({ message: "La fecha solicitada no es válida" })

    const appointment = await Appointment.create({
        user: req.user.id,
        brand: brandDoc._id,
        service: serviceDoc._id,
        motorcycleModel: motorcycleModel.trim(),
        requestedDate: date,
        status: "pending"
    })
    const populated = await Appointment.findById(appointment._id)
        .populate("user", "name email phone")
        .populate("brand", "name slug")
        .populate("service", "name")
        .lean()
    res.status(201).json(serializeAppointment(populated))
}

export const updateAppointment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de cita inválido" })
    const allowed = {}
    if (req.body.status !== undefined) allowed.status = req.body.status
    if (req.body.adminNotes !== undefined) allowed.adminNotes = String(req.body.adminNotes).trim()
    if (!Object.keys(allowed).length) return res.status(400).json({ message: "No hay cambios para aplicar" })

    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true })
            .populate("user", "name email phone")
            .populate("brand", "name slug")
            .populate("service", "name")
            .lean()
        if (!appointment) return res.status(404).json({ message: "Cita no encontrada" })
        res.json(serializeAppointment(appointment))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
