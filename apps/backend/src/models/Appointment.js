// Schema Mongoose: Appointment
import mongoose from "mongoose";

// Novedad detectada durante un servicio (diagnóstico, revisión o mantenimiento).
// Vive embebida en la cita raíz de la cadena; las citas hijas la referencian.
const novedadSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        // Costo estimado informativo. Nunca define el monto del pago:
        // el admin fija paymentAmount al completar cada cita.
        estimatedCost: {
            type: Number,
            min: 0,
            default: 0
        },
        status: {
            type: String,
            enum: ["open", "scheduled", "resolved"],
            default: "open"
        },
        resolvedByAppointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null
        },
        resolvedAt: {
            type: Date,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);

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
            required: false
        },
        brandName: {
            type: String,
            trim: true
        },
        brandRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BrandRequest"
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
        },
        statusReason: {
            type: String,
            trim: true,
            maxlength: 500
        },
        // Cita padre inmediata. null en la cita original.
        parentAppointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
            index: true
        },
        // Cita original de la cadena. null en la original; apunta a la raíz en las hijas.
        chainRoot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
            index: true
        },
        // Motivo visible en citas hijas (ej. "Cambio de pastillas + Purga de líquido").
        chainReason: {
            type: String,
            trim: true,
            maxlength: 300
        },
        // Novedades detectadas en la cita original.
        novedades: {
            type: [novedadSchema],
            default: []
        },
        // Ids de las novedades del root que esta cita hija resuelve.
        resolvesNovedades: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            default: []
        }
    },
    {
        timestamps: true,
        collection: "appointments"
    }
);

export default mongoose.model("Appointment", appointmentSchema);