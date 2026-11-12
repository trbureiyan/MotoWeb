import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";

export const listAdminPayments = async (_req, res) => {
    const payments = await Payment.find({ status: "paid" })
        .select("amount paidAt appointment")
        .populate({
            path: "appointment",
            select: "user",
            populate: {
                path: "user",
                select: "name email"
            }
        })
        .sort({ paidAt: -1 })
        .lean();

    res.json(payments.map(payment => ({
        id: payment._id,
        userName: payment.appointment?.user?.name || "Usuario no disponible",
        userEmail: payment.appointment?.user?.email || "Correo no disponible",
        amount: payment.amount,
        date: payment.paidAt
    })));
};

export const simulateChainPayment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
        return res.status(400).json({ message: "ID de cita inválido." });
    }

    const appointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        user: req.user.id
    })
        .select("_id chainRoot brandName motorcycleModel brand")
        .populate("brand", "name")
        .lean();
    if (!appointment) {
        return res.status(404).json({ message: "No se encontró la cita para este cliente." });
    }

    // Acepta la raíz o cualquier hija; siempre cobra la cadena completa.
    const rootId = appointment.chainRoot || appointment._id;
    const root = String(rootId) === String(appointment._id)
        ? appointment
        : await Appointment.findOne({ _id: rootId, user: req.user.id })
            .select("_id brandName motorcycleModel brand")
            .populate("brand", "name")
            .lean();
    if (!root) {
        return res.status(404).json({ message: "No se encontró la cita original de la cadena." });
    }

    // Excluye citas canceladas: sus pagos pendientes ya no deben cobrarse.
    const chainAppointments = await Appointment.find({
        user: req.user.id,
        status: { $ne: "cancelled" },
        $or: [{ _id: root._id }, { chainRoot: root._id }]
    }).select("_id").lean();
    const chainIds = chainAppointments.map(item => item._id);

    const pendingPayments = await Payment.find({
        appointment: { $in: chainIds },
        status: "pending"
    }).select("_id amount").lean();
    if (!pendingPayments.length) {
        const anyPayment = await Payment.countDocuments({ appointment: { $in: chainIds } });
        return res.status(anyPayment ? 409 : 404).json({
            message: anyPayment
                ? "Los pagos de esta cadena ya fueron registrados."
                : "El monto del pago aún no ha sido configurado."
        });
    }

    const paidAt = new Date();
    const total = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    await Payment.updateMany(
        { _id: { $in: pendingPayments.map(payment => payment._id) } },
        { status: "paid", paidAt }
    );

    const brandName = root.brandName || root.brand?.name || "tu moto";
    await Notification.create({
        user: req.user.id,
        appointment: root._id,
        type: "payment_paid",
        message: `Pago simulado registrado: $${total.toLocaleString("es-CO")} COP por ${pendingPayments.length} servicio(s) de la cadena de ${brandName} ${root.motorcycleModel}.`
    });

    res.json({
        appointment: root._id,
        amount: total,
        count: pendingPayments.length,
        status: "paid",
        paidAt
    });
};

export const simulateClientPayment = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
        return res.status(400).json({ message: "ID de cita inválido." });
    }

    const appointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        user: req.user.id,
        status: "completed"
    })
        .select("_id brandName motorcycleModel requestedDate brand service")
        .populate("brand", "name")
        .populate("service", "name");
    if (!appointment) {
        return res.status(404).json({ message: "No se encontró una cita completada para este cliente." });
    }

    const payment = await Payment.findOneAndUpdate(
        { appointment: appointment._id, status: "pending" },
        { status: "paid", paidAt: new Date() },
        { new: true, runValidators: true }
    ).lean();

    if (!payment) {
        const existingPayment = await Payment.findOne({ appointment: appointment._id }).lean();
        if (!existingPayment) {
            return res.status(404).json({ message: "El monto del pago aún no ha sido configurado." });
        }
        return res.status(409).json({ message: "Este pago ya fue registrado o no está disponible." });
    }

    const brandName = appointment.brandName || appointment.brand?.name || "Marca no especificada";
    await Notification.create({
        user: req.user.id,
        appointment: appointment._id,
        type: "payment_paid",
        message: `Pago simulado registrado: $${payment.amount.toLocaleString("es-CO")} COP por el servicio ${appointment.service?.name || "Servicio"} de ${brandName} ${appointment.motorcycleModel}.`
    });

    res.json({
        id: payment._id,
        appointment: payment.appointment,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt
    });
};
