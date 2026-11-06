import mongoose from "mongoose";

const brandRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80
        },
        normalizedName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true
        },
        approvedBrand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand"
        }
    },
    {
        timestamps: true,
        collection: "brandRequests"
    }
);

brandRequestSchema.index(
    { normalizedName: 1, user: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } }
);

export default mongoose.model("BrandRequest", brandRequestSchema);
