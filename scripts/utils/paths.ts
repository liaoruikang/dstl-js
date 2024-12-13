import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const rootDir = resolve(__dirname, '..', '..');
export const packageDir = resolve(rootDir, 'packages');
