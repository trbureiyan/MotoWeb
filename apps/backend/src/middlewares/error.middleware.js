export const errorMiddleware = (error, _req, res, _next) => {
    console.error(error)
    const candidate = error.statusCode || error.status
    const status = Number.isInteger(candidate) && candidate >= 400 && candidate <= 599 ? candidate : 500
    const message = status < 500
        ? (error.expose && error.message) || "Solicitud inválida"
        : "Error interno del servidor"
    res.status(status).json({ message })
}
