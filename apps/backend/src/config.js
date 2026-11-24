export const TOKEN_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'motoweb-development-secret')

if (!TOKEN_SECRET) {
    throw new Error('JWT_SECRET es obligatorio en producción.')
}

const configuredMongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
const normalizedMongoUri = configuredMongoUri
    ?.replace(/\s+#.*$/, '')
    .trim()
    .replace(/%20(?=\?|$)/i, '')

if (process.env.NODE_ENV === 'production' && !normalizedMongoUri) {
    throw new Error('MONGODB_URI es obligatorio en producción.')
}

export const MONGO_URI = normalizedMongoUri || "mongodb://localhost:27017/motoweb"
