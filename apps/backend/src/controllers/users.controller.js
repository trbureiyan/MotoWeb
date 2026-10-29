import mongoose from "mongoose"
import User from "../models/User.js"

export const listUsers = async (_req, res) => {
    const users = await User.find({}, "name email phone role isActive createdAt updatedAt").sort({ createdAt: -1 }).lean()
    res.json(users.map(user => ({ ...user, id: user._id })))
}

export const updateUser = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "ID de usuario inválido" })
    const allowed = {}
    if (req.body.role !== undefined) allowed.role = req.body.role
    if (req.body.isActive !== undefined) allowed.isActive = Boolean(req.body.isActive)
    if (!Object.keys(allowed).length) return res.status(400).json({ message: "No hay cambios para aplicar" })

    try {
        const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true }).select("name email phone role isActive createdAt updatedAt").lean()
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" })
        res.json({ ...user, id: user._id })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
