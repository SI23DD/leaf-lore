import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRouter from './routes/books';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: [
    FRONTEND_URL,
    'http://localhost:3000',
    'https://leaf-lore.vercel.app',
    'https://leaflore.in',
    'https://www.leaflore.in',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'Leaf & Lore API' }));

// Routes
app.use('/api/books', booksRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);

// 404
app.use('*', (_, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`Leaf & Lore API running on http://localhost:${PORT}`);
});

export default app;
