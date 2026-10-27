// Schema Mongoose: Brand
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        logoUrl: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: "brands"
    }
);

export default mongoose.model("Brand", brandSchema);
