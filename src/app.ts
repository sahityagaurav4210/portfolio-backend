import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import route from '@routes/index';
import Middleware from './middlewares';
import Controller from './controllers';

const app = express();
const clients = (process.env.ACCEPTED_CLIENTS || 'http://localhost:5173').split(',');

app.set('trust proxy', true);
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true, limit: '6kb' }));
app.use('/', Middleware.globalAppResponse);
app.use(
  cors({
    origin: clients,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Api-Key',
      'User-Agent',
      'X-User-Id',
      'X-Token',
      'X-Ref-Token',
    ],
  })
);
app.use(cookieParser());
app.use(Middleware.postmanMiddleware);
app.use('/api/v1', route);

app.get('*', Controller.home().notFound);
app.post('*', Controller.home().notFound);
app.put('*', Controller.home().notFound);
app.patch('*', Controller.home().notFound);
app.delete('*', Controller.home().notFound);
app.use(Middleware.globalErrorHandler);

export default app;
