export const loadAvailableBrands = async (request = fetch) => {
    const response = await request('/api/brands')
    if (!response.ok) throw new Error('No fue posible cargar las marcas.')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('La respuesta de marcas no es válida.')
    return data.filter(brand => brand.isActive !== false)
}
