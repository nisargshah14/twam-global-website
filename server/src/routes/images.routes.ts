import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import { config } from '../config';
import { generateFilename } from '../utils/imageHelpers';
import { verifyToken } from '../middleware/auth';

const router = Router();

const VALID_FOLDERS = ['banner', 'product'] as const;
type ImageFolder = typeof VALID_FOLDERS[number];

function isValidFolder(f: string): f is ImageFolder {
  return (VALID_FOLDERS as readonly string[]).includes(f);
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = (req.body as { folder?: string }).folder ?? 'product';
    if (!isValidFolder(folder)) {
      cb(new Error('Invalid folder'), '');
      return;
    }
    cb(null, path.join(config.uploadDir, folder));
  },
  filename: (_req, file, cb) => {
    cb(null, generateFilename(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpeg, png, and webp images are allowed'));
    }
  },
});

// GET /api/images — list all images by folder
router.get('/', verifyToken, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Record<string, string[]> = {};
    for (const folder of VALID_FOLDERS) {
      const dir = path.join(config.uploadDir, folder);
      try {
        const files = await fs.readdir(dir);
        result[folder] = files
          .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
          .map((f) => `assets/images/uploads/${folder}/${f}`);
      } catch {
        result[folder] = [];
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/images/upload — upload a single image
router.post('/upload', verifyToken, upload.single('image'), (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const folder = (req.body as { folder?: string }).folder ?? 'product';
  const filePath = `assets/images/uploads/${folder}/${req.file.filename}`;
  res.json({ path: filePath });

  void next; // satisfy linter — multer errors reach next via the error handler
});

// DELETE /api/images/:folder/:filename
router.delete('/:folder/:filename', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { folder, filename } = req.params;

  if (!isValidFolder(folder)) {
    res.status(400).json({ error: 'Invalid folder' });
    return;
  }

  // Prevent path traversal
  if (filename.includes('/') || filename.includes('..') || filename.includes('\\')) {
    res.status(400).json({ error: 'Invalid filename' });
    return;
  }

  try {
    await fs.unlink(path.join(config.uploadDir, folder, filename));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
