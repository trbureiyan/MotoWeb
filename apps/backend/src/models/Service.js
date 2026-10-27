// Schema Mongoose: Service
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        estimatedHours: {
            type: Number,
            default: 0
        },
        priceRange_min: {
            type: Number,
            default: 0
        },
        priceRange_max: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: "services"
    }
);

export default mongoose.model("Service", serviceSchema);
