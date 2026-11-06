import GalleryImage from "../models/GalleryImage.js"

const serializeGalleryImage = (image) => ({
    ...image,
    id: image._id
})

export const listGalleryImages = async (req, res) => {
    const images = await GalleryImage.find({ isActive: true })
        .sort({ displayOrder: 1, _id: 1 })
        .lean()

    res.json(images.map(serializeGalleryImage))
}

export const createGalleryImage = async (req, res) => {
    const imageUrl = typeof req.body?.imageUrl === "string" ? req.body.imageUrl.trim() : ""
    const caption = typeof req.body?.caption === "string" ? req.body.caption.trim() : ""

    if (!imageUrl) return res.status(400).json({ message: "El enlace de la imagen es obligatorio" })
    if (imageUrl.length > 2048) return res.status(400).json({ message: "El enlace de la imagen es demasiado largo" })
    if (caption.length > 200) return res.status(400).json({ message: "La descripción no puede superar los 200 caracteres" })

    let parsedUrl
    try {
        parsedUrl = new URL(imageUrl)
    } catch {
        return res.status(400).json({ message: "El enlace de la imagen no es válido" })
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({ message: "El enlace debe usar HTTP o HTTPS" })
    }

    const lastImage = await GalleryImage.findOne().sort({ displayOrder: -1 }).select("displayOrder").lean()
    const image = await GalleryImage.create({
        imageUrl,
        caption,
        displayOrder: (lastImage?.displayOrder ?? -1) + 1,
        isActive: true
    })

    res.status(201).json(serializeGalleryImage(image.toObject()))
}
