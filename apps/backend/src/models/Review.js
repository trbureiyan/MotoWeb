// Schema Mongoose: Review
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        authorName: {
            type: String,
            trim: true,
            maxlength: 100
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        motorcycle: {
            type: String,
            trim: true,
            default: "",
            maxlength: 120
        },
        isApproved: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "reviews"
    }
);

export default mongoose.model("Review", reviewSchema);
