// Servicio: consolidación mensual de estadísticas del taller.
// Reúne datos de citas, pagos y visitas (page_views) en un único registro
// por período (mes/año) de la colección workshop_stats.
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";
import PageView from "../models/PageView.js";
import WorkshopStat from "../models/WorkshopStat.js";

const monthRange = (year, month) => {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    return { start, end };
};

// Calcula (y hace upsert de) las estadísticas del mes indicado.
// Idempotente: volver a ejecutarlo sobre el mismo período actualiza el registro.
export const computeMonthlyStat = async (year, month) => {
    const { start, end } = monthRange(year, month);
    const dateMatch = { $gte: start, $lt: end };

    const [
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        topServiceAgg,
        topBrandAgg,
        revenueAgg,
        totalPageViews,
        topSectionAgg
    ] = await Promise.all([
        Appointment.countDocuments({ requestedDate: dateMatch }),
        Appointment.countDocuments({ requestedDate: dateMatch, status: "completed" }),
        Appointment.countDocuments({ requestedDate: dateMatch, status: "cancelled" }),
        Appointment.aggregate([
            { $match: { requestedDate: dateMatch, service: { $ne: null } } },
            { $group: { _id: "$service", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]),
        Appointment.aggregate([
            { $match: { requestedDate: dateMatch, brand: { $ne: null } } },
            { $group: { _id: "$brand", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]),
        Payment.aggregate([
            { $match: { status: "paid", paidAt: dateMatch } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        PageView.countDocuments({ createdAt: dateMatch }),
        PageView.aggregate([
            { $match: { createdAt: dateMatch } },
            { $group: { _id: "$section", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ])
    ]);

    const payload = {
        period_month: month,
        period_year: year,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        topService: topServiceAgg[0]?._id || null,
        topBrand: topBrandAgg[0]?._id || null,
        totalRevenue: revenueAgg[0]?.total || 0,
        // Sin sistema de reseñas activo todavía: se mantiene en 0.
        averageRating: 0,
        totalPageViews,
        topSection: topSectionAgg[0]?._id || ""
    };

    const stat = await WorkshopStat.findOneAndUpdate(
        { period_month: month, period_year: year },
        payload,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    )
        .populate("topService", "name")
        .populate("topBrand", "name")
        .lean();

    return {
        id: stat._id,
        periodMonth: stat.period_month,
        periodYear: stat.period_year,
        totalAppointments: stat.totalAppointments,
        completedAppointments: stat.completedAppointments,
        cancelledAppointments: stat.cancelledAppointments,
        topService: stat.topService ? { id: stat.topService._id, name: stat.topService.name } : null,
        topBrand: stat.topBrand ? { id: stat.topBrand._id, name: stat.topBrand.name } : null,
        totalRevenue: stat.totalRevenue,
        averageRating: stat.averageRating,
        totalPageViews: stat.totalPageViews,
        topSection: stat.topSection
    };
};
