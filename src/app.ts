import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import route from './routes';

const app = express();

app.set('trust proxy', true);
app.use(express.json({ limit: '12kb' }));
app.use(express.urlencoded({ extended: true, limit: '6kb' }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use(cors({ origin: process.env.ACCEPTED_CLIENTS, credentials: true }));
app.use(cookieParser());

app.use('/api/v1', route);

export default app;
