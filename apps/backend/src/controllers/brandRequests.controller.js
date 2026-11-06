import mongoose from "mongoose";
import Brand from "../models/Brand.js";
import BrandRequest from "../models/BrandRequest.js";
import { findBrand } from "./brands.controller.js";

const normalizeName = (name) => name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const serializeRequest = (request) => ({
    id: request._id,
    name: request.name,
    normalizedName: request.normalizedName,
    status: request.status,
    user: request.user,
    approvedBrand: request.approvedBrand,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
});

export const createBrandRequest = async (req, res) => {
    const name = typeof req.body.name === "string" ? req.body.name.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 80) {
        return res.status(400).json({ message: "El nombre debe tener entre 2 y 80 caracteres." });
    }

    if (await findBrand(name)) {
        return res.status(409).json({ message: "Esa marca ya está registrada en el catálogo." });
    }

    const normalizedName = normalizeName(name);
    try {
        const existingRequest = await BrandRequest.findOne({
            normalizedName,
            user: req.user.id,
            status: "pending"
        });
        if (existingRequest) {
            return res.json(serializeRequest(existingRequest));
        }

        const request = await BrandRequest.create({ name, normalizedName, user: req.user.id });
        res.status(201).json(serializeRequest(request));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Ya tienes una solicitud de revisión para esa marca." });
        }
        throw error;
    }
};

export const listBrandRequests = async (_req, res) => {
    const requests = await BrandRequest.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();
    res.json(requests.map(serializeRequest));
};

export const reviewBrandRequest = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "ID de solicitud inválido." });
    }

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "La solicitud debe aprobarse o rechazarse." });
    }

    const request = await BrandRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Solicitud no encontrada." });
    if (request.status !== "pending") {
        return res.status(409).json({ message: "Esta solicitud ya fue revisada." });
    }

    if (status === "rejected") {
        request.status = "rejected";
        await request.save();
        return res.json(serializeRequest(await request.populate("user", "name email")));
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim().toUpperCase() : "";
    const slug = typeof req.body.slug === "string" ? req.body.slug.trim().toLowerCase() : "";
    const logoUrl = typeof req.body.logoUrl === "string" ? req.body.logoUrl.trim() : "";
    if (!name || !slug) {
        return res.status(400).json({ message: "El nombre y el identificador de la marca son obligatorios." });
    }

    try {
        const duplicateName = await Brand.findOne({
            name: new RegExp(`^${escapeRegex(name)}$`, "i")
        });
        if (duplicateName) {
            return res.status(409).json({ message: "Ya existe una marca con ese nombre." });
        }

        const brand = await Brand.create({ name, slug, logoUrl, isActive: true });
        request.status = "approved";
        request.approvedBrand = brand._id;
        await request.save();

        return res.json({
            ...serializeRequest(await request.populate("user", "name email")),
            brand: { ...brand.toObject(), id: brand._id }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Ya existe una marca con ese identificador." });
        }
        throw error;
    }
};
