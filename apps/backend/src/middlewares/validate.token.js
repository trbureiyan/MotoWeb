import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../config.js"
import User from "../models/User.js"

export const authRequired = (req, res, next) => {
    // Req.cookies existe gracias a cookie-parser (montado en app.js).
    // Acceso defensivo para no lanzar TypeError si no hay cookie.
    const token = req.cookies?.token

    if (!token) return res.status(401).json({ message: "No token provided" })

    jwt.verify(token, TOKEN_SECRET, (error, payload) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" })
        }
        User.findById(payload.id).select("role isActive name").lean()
            .then(user => {
                if (!user || !user.isActive) {
                    return res.status(403).json({ message: "Usuario inactivo o inexistente" })
                }
                req.user = { id: payload.id, role: user.role, name: user.name }
                next()
            })
            .catch(next)
    })
}
