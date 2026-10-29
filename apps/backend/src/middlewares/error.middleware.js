export const errorMiddleware = (error, _req, res, _next) => {
    console.error(error)
    res.status(error.statusCode || 500).json({ message: error.message || "Error interno del servidor" })
}
