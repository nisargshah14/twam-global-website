import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const tmp = path.join(os.tmpdir(), `twam_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
  await fs.writeFile(tmp, json, 'utf-8');
  await fs.rename(tmp, filePath);
}
