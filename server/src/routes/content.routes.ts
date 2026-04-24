import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { config, ProductSlug } from '../config';
import { readJson, writeJson } from '../utils/fileHelpers';
import { verifyToken } from '../middleware/auth';

const router = Router();

const VALID_PAGES = ['home', 'about', 'contact'] as const;
type PageSlug = typeof VALID_PAGES[number];

function isValidPage(p: string): p is PageSlug {
  return (VALID_PAGES as readonly string[]).includes(p);
}

function isValidProductSlug(s: string): s is ProductSlug {
  return (config.productSlugs as readonly string[]).includes(s);
}

// GET /api/content/pages/:page
router.get('/pages/:page', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.params;
  if (!isValidPage(page)) {
    res.status(400).json({ error: 'Invalid page' });
    return;
  }
  try {
    const data = await readJson(path.join(config.contentDir, 'pages', `${page}.json`));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/content/pages/:page
router.put('/pages/:page', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.params;
  if (!isValidPage(page)) {
    res.status(400).json({ error: 'Invalid page' });
    return;
  }
  try {
    await writeJson(path.join(config.contentDir, 'pages', `${page}.json`), req.body);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/content/products — all categories
router.get('/products', verifyToken, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await Promise.all(
      config.productSlugs.map(async (slug) => {
        const data = await readJson(path.join(config.contentDir, 'products', `${slug}.json`));
        return { slug, ...data as object };
      })
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/content/products/:slug
router.get('/products/:slug', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  if (!isValidProductSlug(slug)) {
    res.status(400).json({ error: 'Invalid product slug' });
    return;
  }
  try {
    const data = await readJson(path.join(config.contentDir, 'products', `${slug}.json`));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/content/products/:slug
router.put('/products/:slug', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  if (!isValidProductSlug(slug)) {
    res.status(400).json({ error: 'Invalid product slug' });
    return;
  }
  try {
    await writeJson(path.join(config.contentDir, 'products', `${slug}.json`), req.body);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
