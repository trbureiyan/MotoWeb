import User from "../models/User.js"
import bcrypt from "bcrypt"
import { createAccessToken } from "../libs/jwt.js"


export const register = async (req, res) => {
    const { name, email, phone, password } = req.body

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            phone,
            passwordHash
        })

        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id })

        res.cookie("token", token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })
        res.json({
            id: userSaved._id,
            name: userSaved.name,
            email: userSaved.email,
            phone: userSaved.phone,
            role: userSaved.role,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Ya existe una cuenta con ese correo." })
        res.status(500).json({ message: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({ email: email.toLowerCase() })
        if (!userFound || !userFound.isActive) return res.status(401).json({ message: "Correo o contraseña incorrectos." })

        const isMatch = await bcrypt.compare(password, userFound.passwordHash)
        if (!isMatch) return res.status(401).json({ message: "Correo o contraseña incorrectos." })

        const token = await createAccessToken({ id: userFound._id })

        res.cookie("token", token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })
        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            phone: userFound.phone,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" })

    res.json({
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        phone: userFound.phone,
        role: userFound.role,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    })
}
