import path from 'path';

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext)
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return `${base}_${ts}${ext}`;
}
