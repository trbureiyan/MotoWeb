import { readFile } from "node:fs/promises"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

try {
    const envText = await readFile(new URL("../.env", import.meta.url), "utf8")
    for (const line of envText.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
        if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2")
    }
} catch (error) {
    if (error.code !== "ENOENT") throw error
}

const { MONGO_URI } = await import("../src/config.js")
const { default: User } = await import("../src/models/User.js")
const { default: Brand } = await import("../src/models/Brand.js")
const { default: Service } = await import("../src/models/Service.js")

const brands = ["DUCATI", "BMW", "KTM", "YAMAHA", "TRIUMPH", "SUZUKI", "HONDA", "KAWASAKI", "APRILIA"].map(name => ({
    name,
    slug: name.toLowerCase(),
    logoUrl: "",
    isActive: true
}))

const services = [
    { name: "MANTENIMIENTO PREVENTIVO", description: "Inspección multipunto, cambio de aceite, filtros y ajuste general.", estimatedHours: 3, priceRange_min: 150000, priceRange_max: 350000 },
    { name: "TUNING ECU / MAPEO", description: "Calibración de inyección y encendido en dinamómetro.", estimatedHours: 4, priceRange_min: 400000, priceRange_max: 850000 },
    { name: "FRENOS", description: "Mantenimiento de calipers, líquido y pastillas de freno.", estimatedHours: 2, priceRange_min: 90000, priceRange_max: 220000 },
    { name: "DIAGNÓSTICO", description: "Escaneo electrónico y diagnóstico multimarca.", estimatedHours: 1, priceRange_min: 80000, priceRange_max: 140000 },
    { name: "PREPARACIÓN CIRCUITO", description: "Ajuste de suspensión, seguridad y mapas de competición.", estimatedHours: 5, priceRange_min: 350000, priceRange_max: 750000 },
    { name: "OTRO", description: "Servicio personalizado solicitado por el cliente.", estimatedHours: 1, priceRange_min: 0, priceRange_max: 0 }
].map(service => ({ ...service, isActive: true }))

const upsertMany = async (Model, entries, key) => {
    await Model.bulkWrite(entries.map(entry => ({
        updateOne: {
            filter: { [key]: entry[key] },
            update: { $setOnInsert: entry },
            upsert: true
        }
    })))
}

await mongoose.connect(MONGO_URI)
await upsertMany(Brand, brands, "slug")
await upsertMany(Service, services, "name")

const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@mototaller.com"
const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin12345!"
const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() })
if (!existingAdmin) {
    await User.create({
        name: "Administrador Moto.Taller",
        email: adminEmail,
        phone: process.env.SEED_ADMIN_PHONE || "3000000000",
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: "admin",
        isActive: true
    })
    console.log(`Administrador creado: ${adminEmail}`)
} else {
    console.log(`El administrador ya existe: ${adminEmail}`)
}

console.log(`Seed completado: ${brands.length} marcas y ${services.length} servicios disponibles.`)
await mongoose.connection.close()
