import mongoose from "mongoose"
import Brand from "../models/Brand.js"

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const listBrands = async (req, res) => {
    const filter = req.query.active === "false" ? {} : { isActive: true }
    const brands = await Brand.find(filter).sort({ name: 1 }).lean()
    res.json(brands.map(brand => ({ ...brand, id: brand._id })))
}

export const createBrand = async (req, res) => {
    const { name, slug, logoUrl = "", isActive = true } = req.body
    if (!name || !slug) return res.status(400).json({ message: "El nombre y el slug son obligatorios" })

    try {
        const brand = await Brand.create({ name: name.trim(), slug: slug.trim().toLowerCase(), logoUrl, isActive })
        res.status(201).json({ ...brand.toObject(), id: brand._id })
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Ya existe una marca con ese slug" })
        res.status(400).json({ message: error.message })
    }
}

export const updateBrand = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de marca inválido" })

    const allowed = (({ name, slug, logoUrl, isActive }) => ({ name, slug, logoUrl, isActive }))(req.body)
    Object.keys(allowed).forEach(key => allowed[key] === undefined && delete allowed[key])
    if (allowed.slug) allowed.slug = allowed.slug.trim().toLowerCase()
    if (allowed.name) allowed.name = allowed.name.trim()

    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true }).lean()
        if (!brand) return res.status(404).json({ message: "Marca no encontrada" })
        res.json({ ...brand, id: brand._id })
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Ya existe una marca con ese slug" })
        res.status(400).json({ message: error.message })
    }
}

export const findBrand = async (value) => {
    if (!value) return null
    if (mongoose.isValidObjectId(value)) return Brand.findById(value)
    const pattern = new RegExp(`^${escapeRegex(value.trim())}$`, "i")
    return Brand.findOne({ $or: [{ slug: pattern }, { name: pattern }] })
}
