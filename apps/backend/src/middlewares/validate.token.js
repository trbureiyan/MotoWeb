import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../config.js"

export const authRequired = (req, res, next) => {
    // Req.cookies existe gracias a cookie-parser (montado en app.js).
    // Acceso defensivo para no lanzar TypeError si no hay cookie.
    const token = req.cookies?.token

    if (!token) return res.status(401).json({ message: "No token provided" })

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" })
        }
        req.user = user

        next()
    })
}