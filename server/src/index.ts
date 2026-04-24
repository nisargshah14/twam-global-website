import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import imagesRoutes from './routes/images.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const corsOptions = config.nodeEnv === 'production'
  ? {}
  : { origin: 'http://localhost:4200', credentials: true };
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/images', imagesRoutes);

// Serve Angular dist in production
if (config.nodeEnv === 'production') {
  app.use(express.static(config.distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(config.distDir, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
});
