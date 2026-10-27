// Schema Mongoose: Appointment
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },
        motorcycleModel: {
            type: String,
            required: true,
            trim: true
        },
        requestedDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending"
        },
        adminNotes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: "appointments"
    }
);

export default mongoose.model("Appointment", appointmentSchema);