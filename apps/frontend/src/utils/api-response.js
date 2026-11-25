export const readApiResponse = async response => {
    try {
        return await response.json()
    } catch {
        throw new Error('No fue posible obtener una respuesta válida del servidor. Inténtalo de nuevo.')
    }
}

export const apiErrorMessage = error => error instanceof TypeError
    ? 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
    : error.message || 'No se pudo conectar con el servidor.'
