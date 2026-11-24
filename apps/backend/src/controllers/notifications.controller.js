import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const serializeNotification = (notification) => ({
    id: notification._id,
    appointment: notification.appointment?._id || notification.appointment,
    type: notification.type,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt
});

export const listClientNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .lean();
    res.json(notifications.map(serializeNotification));
};

export const markClientNotificationRead = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "ID de notificación inválido." });
    }

    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { isRead: true },
        { new: true }
    ).lean();

    if (!notification) return res.status(404).json({ message: "Notificación no encontrada." });
    res.json(serializeNotification(notification));
};
