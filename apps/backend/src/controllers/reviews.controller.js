import mongoose from "mongoose";
import Review from "../models/Review.js";
import User from "../models/User.js";

const serializeReview = (r) => {
    const displayName = r.user?.name || (r.authorName && r.authorName !== "Cliente verificado" ? r.authorName : "Cliente verificado");
    return {
        id: r._id,
        rating: r.rating,
        comment: r.comment,
        motorcycle: r.motorcycle || "",
        isApproved: r.isApproved !== false,
        createdAt: r.createdAt,
        name: displayName,
        userRole: r.user?.role || "client",
        userId: r.user?._id || r.user
    };
};

export const listReviews = async (req, res) => {
    const isAdmin = req.user?.role === "admin";
    const filter = isAdmin ? {} : { isApproved: true };

    const reviews = await Review.find(filter)
        .populate("user", "name role")
        .sort({ createdAt: -1 })
        .lean();

    res.json(reviews.map(serializeReview));
};

export const createReview = async (req, res) => {
    const { rating, comment, motorcycle, appointmentId } = req.body || {};

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: "La calificación debe ser un número entero entre 1 y 5 estrellas." });
    }

    const trimmedComment = typeof comment === "string" ? comment.trim() : "";
    if (!trimmedComment || trimmedComment.length < 3) {
        return res.status(400).json({ message: "El comentario debe contener al menos 3 caracteres." });
    }
    if (trimmedComment.length > 1000) {
        return res.status(400).json({ message: "El comentario no puede exceder los 1000 caracteres." });
    }

    const trimmedMotorcycle = typeof motorcycle === "string" ? motorcycle.trim().slice(0, 120) : "";

    // Obtenemos el nombre real del usuario directamente desde la BD
    const userDoc = await User.findById(req.user.id).select("name role").lean();
    const authorName = userDoc?.name || "Cliente verificado";

    const review = await Review.create({
        user: req.user.id,
        authorName,
        rating: numRating,
        comment: trimmedComment,
        motorcycle: trimmedMotorcycle,
        appointment: mongoose.isValidObjectId(appointmentId) ? appointmentId : undefined,
        isApproved: true
    });

    const populated = await Review.findById(review._id).populate("user", "name role").lean();
    res.status(201).json(serializeReview(populated));
};

export const updateReview = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "ID de reseña inválido." });
    }

    const { isApproved } = req.body || {};
    if (typeof isApproved !== "boolean") {
        return res.status(400).json({ message: "El campo isApproved debe ser un booleano." });
    }

    const review = await Review.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true, runValidators: true }
    ).populate("user", "name role").lean();

    if (!review) {
        return res.status(404).json({ message: "Reseña no encontrada." });
    }

    res.json(serializeReview(review));
};

export const deleteReview = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "ID de reseña inválido." });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
        return res.status(404).json({ message: "Reseña no encontrada." });
    }

    res.json({ message: "Reseña eliminada correctamente.", id });
};
