import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import route from '@routes/index';
import Middleware from './middlewares';

const app = express();
const clients = (process.env.ACCEPTED_CLIENTS || 'http://localhost:5173').split(',');

app.set('trust proxy', true);
app.use(express.json({ limit: '12kb' }));
app.use(express.urlencoded({ extended: true, limit: '6kb' }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use(
  cors({
    origin: clients,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key', 'User-Agent', 'X-User-Id', 'X-Token', 'X-Ref-Token'],
  })
);
app.use(cookieParser());
app.use(Middleware.postmanMiddleware);
app.use('/api/v1', route);

export default app;
