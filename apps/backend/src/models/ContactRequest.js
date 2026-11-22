import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        contact: { type: String, required: true, trim: true, maxlength: 160 },
        motorcycle: { type: String, trim: true, maxlength: 120, default: "" },
        service: { type: String, required: true, trim: true, maxlength: 120 },
        details: { type: String, required: true, trim: true, maxlength: 1200 },
        source: { type: String, enum: ["home_chat"], default: "home_chat" },
        status: { type: String, enum: ["pending", "contacted", "closed"], default: "pending" }
    },
    { timestamps: true, collection: "contact_requests" }
);

export default mongoose.model("ContactRequest", contactRequestSchema);
