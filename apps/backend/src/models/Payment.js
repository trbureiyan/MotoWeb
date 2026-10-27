// Schema Mongoose: Payment
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true
        },
        paidAt: {
            type: Date
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "paid", "refunded", "failed"],
            default: "pending"
        },
        adminNotes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: "payments"
    }
);

export default mongoose.model("Payment", paymentSchema);
