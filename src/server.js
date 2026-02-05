import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectMongoDB();

app.use(logger);
app.use(cors());
app.use(express.json());

// 1️⃣ маршруты
app.use(notesRoutes);

// 2️⃣ notFound — СРАЗУ после маршрутов
app.use(notFoundHandler);

// 3️⃣ ошибки celebrate
app.use(errors());

// 4️⃣ глобальный errorHandler — ПОСЛЕДНИЙ
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
