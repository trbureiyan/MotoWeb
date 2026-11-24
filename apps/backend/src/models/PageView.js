// Schema Mongoose: PageView
// Telemetría de navegación: qué sección y evento ocurrió, desde qué dispositivo
// y, cuando la visita está autenticada, a qué usuario pertenece.
import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
    {
        section: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60
        },
        event: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60
        },
        device: {
            type: String,
            enum: ["desktop", "mobile", "tablet", "unknown"],
            default: "unknown"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "page_views"
    }
);

// Índices para acelerar las agregaciones del dashboard de analítica.
pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ section: 1, createdAt: -1 });
pageViewSchema.index({ event: 1, createdAt: -1 });
pageViewSchema.index({ device: 1 });

export default mongoose.model("PageView", pageViewSchema);
