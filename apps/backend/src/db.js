import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";
import "./models/Appointment.js";
import "./models/Brand.js";
import "./models/GalleryImage.js";
import "./models/Notification.js";
import "./models/PageView.js";
import "./models/Payment.js";
import "./models/Review.js";
import "./models/Service.js";
import "./models/User.js";
import "./models/WorkshopStat.js";

const initializeCollections = async () => {
    const database = mongoose.connection.db;

    for (const modelName of mongoose.modelNames()) {
        const model = mongoose.model(modelName);
        const collectionName = model.collection.collectionName;
        const collectionExists = await database
            .listCollections({ name: collectionName }, { nameOnly: true })
            .hasNext();

        if (!collectionExists) {
            await model.createCollection();
        }

        await model.createIndexes();
        console.log(`Colección lista: ${collectionName}`);
    }
};

// Prefiere la URI del entorno (.env). Si no existe, corta con un error claro
// en lugar de hardcodear credenciales en el código.
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB connected");
        await initializeCollections();
    } catch (error) {
        console.error("DB connection error:", error.message);
        // Re-lanzamos el error para que el servidor pueda detenerse si falla la conexión
        throw error;
    }
};
