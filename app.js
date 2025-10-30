import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// routers
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();

// --- middleware stack ---
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50kb' }));
app.use(xss());
app.use(hpp());
app.use(compression());

// logging & rate limiting by env
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', limiter);
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- health & api routes ---
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);

// --- unknown route & error handler ---
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

export default app;
