// Schema Mongoose: GalleryImage
import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        caption: {
            type: String,
            trim: true
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        },
        displayOrder: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: "gallery_images"
    }
);

export default mongoose.model("GalleryImage", galleryImageSchema);
