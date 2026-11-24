export const resolveReviews = data => {
    if (!Array.isArray(data)) throw new Error("La respuesta de opiniones no es válida.")
    return data
}
