export const TOKEN_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'motoweb-development-secret')

if (!TOKEN_SECRET) {
    throw new Error('JWT_SECRET es obligatorio en producción.')
}

export const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/motoweb"
