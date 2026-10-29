import User from "../models/User.js"

export const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Autenticación requerida" })

    User.findById(req.user.id).select("role isActive").lean()
        .then(user => {
            if (!user || !user.isActive) return res.status(403).json({ message: "Usuario inactivo o inexistente" })
            if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: "No tienes permisos para realizar esta acción" })
            req.user.role = user.role
            next()
        })
        .catch(next)
}

export const adminRequired = requireRole("admin")
