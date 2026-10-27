// Schema Mongoose: WorkshopStat
import mongoose from "mongoose";

const workshopStatSchema = new mongoose.Schema(
    {
        period_month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        period_year: {
            type: Number,
            required: true
        },
        totalAppointments: {
            type: Number,
            default: 0
        },
        completedAppointments: {
            type: Number,
            default: 0
        },
        cancelledAppointments: {
            type: Number,
            default: 0
        },
        topService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        },
        topBrand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand"
        },
        totalRevenue: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "workshop_stats"
    }
);

// Un único registro de estadísticas por período (mes/año)
workshopStatSchema.index({ period_month: 1, period_year: 1 }, { unique: true });

export default mongoose.model("WorkshopStat", workshopStatSchema);
