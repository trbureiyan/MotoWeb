import ContactRequest from "../models/ContactRequest.js";
import Service from "../models/Service.js";
import mongoose from "mongoose";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 1200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestCounts = new Map();

const createContactRequestTool = {
    type: "function",
    name: "create_contact_request",
    description: "Guarda una solicitud de contacto después de que el usuario confirme que desea enviarla y haya proporcionado todos los datos requeridos.",
    parameters: {
        type: "object",
        properties: {
            name: { type: "string", description: "Nombre de la persona" },
            contact: { type: "string", description: "Teléfono o correo para responder" },
            motorcycle: { type: "string", description: "Marca y modelo de la moto, si los conoce" },
            service: { type: "string", description: "Servicio por el que pregunta" },
            details: { type: "string", description: "Resumen breve de lo que necesita" },
            confirmed: { type: "boolean", description: "Debe ser true solo después de que la persona confirme explícitamente el envío" }
        },
        required: ["name", "contact", "motorcycle", "service", "details", "confirmed"],
        additionalProperties: false
    },
    strict: true
};

const systemInstructions = (services) => `Eres el asistente virtual del taller MotoTaller en Neiva, Huila. Responde siempre en español, con claridad y brevedad. Ayuda con preguntas sobre el taller y orienta sobre servicios usando únicamente estos datos actuales: ${services || "No hay servicios publicados en este momento."}.

No inventes precios, disponibilidad, tiempos de entrega, diagnósticos ni políticas. Si falta información, dilo y ofrece que el equipo contacte a la persona. No confirmes citas: para agendarlas, indica que debe usar el botón “Agendar cita” del sitio, que abre el proceso oficial y requiere iniciar sesión.

Puedes ofrecer dejar una solicitud para que el taller contacte al usuario. Primero recopila nombre, teléfono o correo, servicio de interés, descripción de lo que necesita y marca/modelo si lo sabe. Resume esos datos y pide exactamente esta confirmación: “¿Confirmas que envíe esta solicitud al taller?”. Llama a create_contact_request únicamente después de que el usuario responda afirmativamente a esa pregunta. La solicitud no es una cita ni garantiza disponibilidad.`;

const getOutputText = (response) => (response.output || [])
    .filter(item => item.type === "message")
    .flatMap(item => item.content || [])
    .filter(item => item.type === "output_text")
    .map(item => item.text)
    .join("\n");

const callOpenAI = async (payload) => {
    const response = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        console.error("OpenAI chat request failed:", response.status, data?.error?.message || "Unknown error");
        const error = new Error("El asistente no está disponible en este momento. Intenta de nuevo en unos minutos.");
        error.statusCode = 502;
        throw error;
    }
    return data;
};

export const respondToChat = async (req, res) => {
    const now = Date.now();
    const ip = req.ip || "unknown";
    const currentWindow = requestCounts.get(ip);
    if (!currentWindow || now - currentWindow.startedAt >= RATE_LIMIT_WINDOW_MS) {
        requestCounts.set(ip, { startedAt: now, count: 1 });
    } else if (currentWindow.count >= RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({ message: "Has enviado varios mensajes seguidos. Espera un momento e intenta de nuevo." });
    } else {
        currentWindow.count += 1;
    }
    if (requestCounts.size > 1000) {
        for (const [address, window] of requestCounts) {
            if (now - window.startedAt >= RATE_LIMIT_WINDOW_MS) requestCounts.delete(address);
        }
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ message: "El asistente aún no está configurado." });
    }

    const { message, history = [] } = req.body || {};
    if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ message: "Escribe un mensaje de hasta 1200 caracteres." });
    }
    if (!Array.isArray(history) || history.length > MAX_HISTORY) {
        return res.status(400).json({ message: "La conversación es demasiado larga. Inicia un chat nuevo." });
    }

    const cleanHistory = history
        .filter(item => ["user", "assistant"].includes(item?.role) && typeof item.content === "string")
        .slice(-MAX_HISTORY)
        .map(item => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_LENGTH) }));
    const services = await Service.find({ isActive: true }).select("name description priceRange_min priceRange_max").sort({ name: 1 }).lean();
    const serviceContext = services.map(service => {
        const hasPriceRange = service.priceRange_min > 0 || service.priceRange_max > 0;
        const priceRange = hasPriceRange
            ? ` Rango orientativo publicado: $${Number(service.priceRange_min || 0).toLocaleString("es-CO")}–$${Number(service.priceRange_max || 0).toLocaleString("es-CO")} COP.`
            : "";
        return `${service.name}: ${service.description || "Descripción no disponible"}.${priceRange}`;
    }).join("; ");
    const model = process.env.OPENAI_MODEL || "gpt-6-luna";
    const instructions = systemInstructions(serviceContext);
    const input = [...cleanHistory, { role: "user", content: message.trim() }];

    let response = await callOpenAI({ model, instructions, input, tools: [createContactRequestTool], tool_choice: "auto" });
    const toolCall = response.output?.find(item => item.type === "function_call" && item.name === "create_contact_request");

    if (toolCall) {
        let details;
        try {
            details = JSON.parse(toolCall.arguments);
        } catch {
            return res.status(502).json({ message: "No se pudo procesar la solicitud. Intenta de nuevo." });
        }
        const contact = String(details.contact || "").trim();
        const validContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || /^[+\d\s().-]{7,25}$/.test(contact);
        const confirmationWasRequested = cleanHistory.at(-1)?.role === "assistant" &&
            cleanHistory.at(-1).content.includes("¿Confirmas que envíe esta solicitud al taller?");
        const userConfirmed = /^(s[ií]|confirmo|confirmar|de acuerdo|correcto|env[ií]ala|env[ií]alo|adelante)\b/i.test(message.trim());
        if (details.confirmed !== true || !String(details.name || "").trim() || !validContact ||
            !String(details.service || "").trim() || !String(details.details || "").trim() ||
            !confirmationWasRequested || !userConfirmed) {
            return res.status(200).json({ reply: "Me faltan algunos datos válidos para enviar la solicitud. ¿Me ayudas a completarlos?", requestCreated: false });
        }

        const request = await ContactRequest.create({
            name: String(details.name).trim().slice(0, 100),
            contact: contact.slice(0, 160),
            motorcycle: String(details.motorcycle || "").trim().slice(0, 120),
            service: String(details.service).trim().slice(0, 120),
            details: String(details.details).trim().slice(0, 1200)
        });
        return res.json({ reply: `Listo, envié tu solicitud al taller con el número ${String(request._id).slice(-6).toUpperCase()}. Se comunicarán contigo por el medio que compartiste. Recuerda que esto no es una cita confirmada.`, requestCreated: true });
    }

    res.json({ reply: getOutputText(response) || "¿Me cuentas un poco más para poder orientarte?", requestCreated: false });
};

export const listContactRequests = async (_req, res) => {
    const requests = await ContactRequest.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(requests.map(request => ({ ...request, id: request._id })));
};

export const updateContactRequest = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "ID de solicitud inválido." });
    }
    const { status } = req.body || {};
    if (!["pending", "contacted", "closed"].includes(status)) {
        return res.status(400).json({ message: "Estado de solicitud inválido." });
    }
    const request = await ContactRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).lean();
    if (!request) return res.status(404).json({ message: "Solicitud no encontrada." });
    res.json({ ...request, id: request._id });
};
