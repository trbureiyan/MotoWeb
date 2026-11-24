import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Adjunta req.user si hay una cookie JWT válida; si no existe o es inválida,
// continúa sin autenticar. Se usa en endpoints públicos que quieren asociar la
// acción a un usuario cuando está disponible (p. ej. telemetría de page_views)
// sin bloquear a los visitantes anónimos.
export const optionalAuth = (req, _res, next) => {
    const token = req.cookies?.token;
    if (!token) return next();

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (!error && user) req.user = user;
        next();
    });
};
