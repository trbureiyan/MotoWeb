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
const { default: GalleryImage } = await import("../src/models/GalleryImage.js")
const { default: Review } = await import("../src/models/Review.js")

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
    { name: "REVISIÓN", description: "Revisión general de seguridad, niveles y estado mecánico.", estimatedHours: 2, priceRange_min: 100000, priceRange_max: 200000 },
    { name: "PREPARACIÓN CIRCUITO", description: "Ajuste de suspensión, seguridad y mapas de competición.", estimatedHours: 5, priceRange_min: 350000, priceRange_max: 750000 },
    { name: "OTRO", description: "Servicio personalizado solicitado por el cliente.", estimatedHours: 1, priceRange_min: 0, priceRange_max: 0 }
].map(service => ({ ...service, isActive: true }))

const galleryImages = [
    ["https://images.pexels.com/photos/17243626/pexels-photo-17243626.jpeg?auto=compress&cs=tinysrgb&w=1000", "BMW S1000RR 2024 - Tuning ECU"],
    ["https://images.pexels.com/photos/8532387/pexels-photo-8532387.png?auto=compress&cs=tinysrgb&w=1000", "Yamaha R1 - Suspensión"],
    ["https://images.pexels.com/photos/30180721/pexels-photo-30180721.jpeg?auto=compress&cs=tinysrgb&w=1000", "Kawasaki ZX-10R - Frenos Brembo"],
    ["https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?w=1000&q=70&auto=format&fit=crop", "Ducati Panigale V4 - Mapeo Dyno"],
    ["https://images.pexels.com/photos/33203558/pexels-photo-33203558.jpeg?auto=compress&cs=tinysrgb&w=1000", "Honda CBR 1000RR-R - Mantenimiento"],
    ["https://images.pexels.com/photos/17900720/pexels-photo-17900720.jpeg?auto=compress&cs=tinysrgb&w=1000", "Suzuki GSX-R 1000 - Full Service"],
    ["https://www.moto.ch/wp-content/uploads/2024/12/Honda-CB1000-Hornet_01-1300x867.jpg", "Honda CB1000 Hornet SP 2024"],
    ["https://images.pexels.com/photos/11605405/pexels-photo-11605405.jpeg?auto=compress&cs=tinysrgb&w=1000", "Aprilia RSV4 - Puesta a punto"],
    ["https://images.pexels.com/photos/27184237/pexels-photo-27184237.jpeg?auto=compress&cs=tinysrgb&w=1000", "Ducati Multistrada v4 - Detalle final"],
    ["https://images.pexels.com/photos/33522279/pexels-photo-33522279.jpeg?auto=compress&cs=tinysrgb&w=1000", "Triumph Street Triple - Revisión general"],
    ["https://images.unsplash.com/photo-1656767112164-f9f59766357d?q=70&w=1000&auto=format&fit=crop", "KTM 1290 Super Duke - Diagnóstico ECU"],
    ["https://images.pexels.com/photos/9064725/pexels-photo-9064725.jpeg?auto=compress&cs=tinysrgb&w=1000", "BMW R nineT - Servicio premium"]
].map(([imageUrl, caption], index) => ({
    imageUrl,
    caption,
    displayOrder: index + 1,
    isActive: true
}))

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
await upsertMany(GalleryImage, galleryImages, "imageUrl")

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

const mechanicEmail = process.env.SEED_MECHANIC_EMAIL || "mecanico@mototaller.com"
const mechanicPassword = process.env.SEED_MECHANIC_PASSWORD || "Mecanico12345!"
const existingMechanic = await User.findOne({ email: mechanicEmail.toLowerCase() })
if (!existingMechanic) {
    await User.create({
        name: process.env.SEED_MECHANIC_NAME || "Mecánico Moto.Taller",
        email: mechanicEmail,
        phone: process.env.SEED_MECHANIC_PHONE || "3000000001",
        passwordHash: await bcrypt.hash(mechanicPassword, 10),
        role: "mechanic",
        isActive: true
    })
    console.log(`Mecánico creado: ${mechanicEmail}`)
} else {
    console.log(`El mecánico ya existe: ${mechanicEmail}`)
}

const seedReviews = [
    {
        authorName: "Carlos Restrepo",
        motorcycle: "Kawasaki ZX-10R",
        comment: "El mejor tuning que le han hecho a mi moto. La respuesta en bajas revoluciones es increíble y la entrega de potencia lineal me quitó 2 segundos en el circuito.",
        rating: 5,
        isApproved: true
    },
    {
        authorName: "Alejandro Gómez",
        motorcycle: "Yamaha R6",
        comment: "Mantenimiento impecable. Salen de aquí sin que nada quede al aire. Confíen en el taller para moto de alta cilindrada.",
        rating: 5,
        isApproved: true
    },
    {
        authorName: "Juan David Pérez",
        motorcycle: "BMW S1000RR",
        comment: "No le dejo mi moto a nadie más. El dyno muestra exactamente lo que le hacen a tu moto, pura transparencia y resultados reales en cada marcha.",
        rating: 5,
        isApproved: true
    }
];

const adminUser = existingAdmin || await User.findOne({ email: adminEmail.toLowerCase() });
if (adminUser) {
    const existingReviewsCount = await Review.countDocuments();
    if (existingReviewsCount === 0) {
        await Review.insertMany(seedReviews.map(r => ({ ...r, user: adminUser._id })));
        console.log("Reseñas iniciales creadas.");
    }
}

console.log(`Seed completado: ${brands.length} marcas, ${services.length} servicios y ${galleryImages.length} imágenes de galería disponibles.`)
await mongoose.connection.close()
