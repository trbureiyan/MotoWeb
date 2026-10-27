// Instancia de Express — middlewares globales y montaje de rutas
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

export default app;
