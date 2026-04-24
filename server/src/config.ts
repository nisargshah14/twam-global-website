import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../server/.env') });

const SRC_ROOT = path.resolve(__dirname, '../../src');

export const config = {
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  adminUser: process.env['ADMIN_USER'] ?? 'admin',
  adminPass: process.env['ADMIN_PASS'] ?? '',
  jwtSecret: process.env['JWT_SECRET'] ?? 'dev_secret_change_in_prod',
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  contentDir: path.join(SRC_ROOT, 'assets', 'content'),
  uploadDir: path.join(SRC_ROOT, 'assets', 'images', 'uploads'),
  distDir: path.resolve(__dirname, '../../dist/twam-global/browser'),
  productSlugs: ['spices', 'oilseeds', 'edibleoils', 'sugar', 'rice', 'raisins', 'agri', 'pulses'] as const,
};

export type ProductSlug = typeof config.productSlugs[number];
