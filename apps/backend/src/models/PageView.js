// Schema Mongoose: PageView
import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
    {
        section: {
            type: String,
            required: true,
            trim: true
        },
        event: {
            type: String,
            required: true,
            trim: true
        },
        device: {
            type: String,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "page_views"
    }
);

export default mongoose.model("PageView", pageViewSchema);
