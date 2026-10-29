import mongoose from "mongoose"
import Service from "../models/Service.js"

export const listServices = async (req, res) => {
    const filter = req.query.active === "false" ? {} : { isActive: true }
    const services = await Service.find(filter).sort({ name: 1 }).lean()
    res.json(services.map(service => ({ ...service, id: service._id })))
}

export const createService = async (req, res) => {
    const { name, description = "", estimatedHours = 0, priceRange_min = 0, priceRange_max = 0, isActive = true } = req.body
    if (!name) return res.status(400).json({ message: "El nombre del servicio es obligatorio" })

    const service = await Service.create({ name: name.trim(), description, estimatedHours, priceRange_min, priceRange_max, isActive })
    res.status(201).json({ ...service.toObject(), id: service._id })
}

export const updateService = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de servicio inválido" })

    const allowed = (({ name, description, estimatedHours, priceRange_min, priceRange_max, isActive }) => ({ name, description, estimatedHours, priceRange_min, priceRange_max, isActive }))(req.body)
    Object.keys(allowed).forEach(key => allowed[key] === undefined && delete allowed[key])
    if (allowed.name) allowed.name = allowed.name.trim()

    try {
        const service = await Service.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true }).lean()
        if (!service) return res.status(404).json({ message: "Servicio no encontrado" })
        res.json({ ...service, id: service._id })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const findService = async (value) => {
    if (!value) return null
    if (mongoose.isValidObjectId(value)) return Service.findById(value)
    return Service.findOne({ name: new RegExp(`^${String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim()}$`, "i") })
}
