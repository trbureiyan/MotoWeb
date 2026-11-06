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
