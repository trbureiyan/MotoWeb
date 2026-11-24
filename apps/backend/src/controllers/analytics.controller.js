// Controller: analytics
// Telemetría de navegación (page_views) + resumen agregado para el panel admin.
import PageView from "../models/PageView.js";
import { computeMonthlyStat } from "../services/workshopStats.service.js";

const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 };

const resolveRange = (range) => {
    const days = RANGE_DAYS[range] || RANGE_DAYS["30d"];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return { days, since };
};

// Deriva el tipo de dispositivo a partir del User-Agent (server-side, no se confía en el cliente).
const detectDevice = (userAgent = "") => {
    const ua = String(userAgent).toLowerCase();
    if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet";
    if (/mobi|iphone|ipod|android|blackberry|windows phone/.test(ua)) return "mobile";
    if (/windows|macintosh|mac os|linux|cros/.test(ua)) return "desktop";
    return "unknown";
};

// POST /api/analytics/views — registra una vista/evento. Público (optionalAuth).
export const recordView = async (req, res) => {
    const { section, event } = req.body;

    await PageView.create({
        section,
        event,
        device: detectDevice(req.headers["user-agent"]),
        user: req.user?.id || null
    });

    res.status(202).json({ ok: true });
};

// GET /api/analytics/summary?range=7d|30d|90d — agregados para el dashboard (solo admin).
export const getSummary = async (req, res) => {
    const range = RANGE_DAYS[req.query.range] ? req.query.range : "30d";
    const { days, since } = resolveRange(range);
    const match = { createdAt: { $gte: since } };

    const [totalsAgg, bySection, byEvent, byDevice, timeseries] = await Promise.all([
        PageView.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    views: { $sum: 1 },
                    authenticated: { $sum: { $cond: [{ $ne: ["$user", null] }, 1, 0] } },
                    uniqueUsers: { $addToSet: "$user" }
                }
            },
            {
                $project: {
                    _id: 0,
                    views: 1,
                    authenticated: 1,
                    anonymous: { $subtract: ["$views", "$authenticated"] },
                    uniqueUsers: {
                        $size: {
                            $filter: {
                                input: "$uniqueUsers",
                                as: "u",
                                cond: { $ne: ["$$u", null] }
                            }
                        }
                    }
                }
            }
        ]),
        PageView.aggregate([
            { $match: match },
            { $group: { _id: "$section", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, section: "$_id", count: 1 } }
        ]),
        PageView.aggregate([
            { $match: match },
            { $group: { _id: "$event", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, event: "$_id", count: 1 } }
        ]),
        PageView.aggregate([
            { $match: match },
            { $group: { _id: "$device", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, device: { $ifNull: ["$_id", "unknown"] }, count: 1 } }
        ]),
        PageView.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: "$_id", count: 1 } }
        ])
    ]);

    const totals = totalsAgg[0] || { views: 0, authenticated: 0, anonymous: 0, uniqueUsers: 0 };

    res.json({
        range,
        days,
        since,
        totals,
        bySection,
        byEvent,
        byDevice,
        timeseries,
        topSection: bySection[0]?.section || null
    });
};

// POST /api/analytics/rollup — consolida un mes en workshop_stats (solo admin).
export const runRollup = async (req, res) => {
    const now = new Date();
    const year = Number(req.body?.year) || now.getUTCFullYear();
    const month = Number(req.body?.month) || now.getUTCMonth() + 1;

    if (!Number.isInteger(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Mes inválido (debe estar entre 1 y 12)." });
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        return res.status(400).json({ message: "Año inválido." });
    }

    const stat = await computeMonthlyStat(year, month);
    res.json(stat);
};
