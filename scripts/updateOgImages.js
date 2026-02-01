import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const ogDir = path.join(projectRoot, 'public', 'og');
const pokeapiListPath = path.join(projectRoot, 'assets', 'mock_data', 'pokeapi-list.json');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const escapeXml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const getTitleFontSize = (title = '') => {
  const length = title.length;
  if (length > 22) return 64;
  if (length > 16) return 76;
  if (length > 12) return 88;
  return 104;
};

const buildSvg = ({ title, subtitle }) => {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle || '');
  const titleSize = getTitleFontSize(title);

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">\n` +
    `  <defs>\n` +
    `    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">\n` +
    `      <stop stop-color="#1E1B4B"/>\n` +
    `      <stop offset="1" stop-color="#0F172A"/>\n` +
    `    </linearGradient>\n` +
    `  </defs>\n` +
    `  <rect width="1200" height="630" fill="url(#bg)"/>\n` +
    `  <circle cx="1020" cy="120" r="220" fill="#22C55E" fill-opacity="0.12"/>\n` +
    `  <circle cx="180" cy="520" r="260" fill="#38BDF8" fill-opacity="0.12"/>\n` +
    `  <rect x="80" y="80" width="180" height="48" rx="24" fill="#F97316"/>\n` +
    `  <text x="170" y="112" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#0F172A">PokéGen</text>\n` +
    `  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800" fill="#F8FAFC">${safeTitle}</text>\n` +
    `  <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="500" fill="#CBD5F5">${safeSubtitle}</text>\n` +
    `  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#94A3B8">mattia-carcione.github.io/pokegen</text>\n` +
    `</svg>\n`;
};

const readPokemonList = () => {
  if (!fs.existsSync(pokeapiListPath)) {
    return [];
  }
  const raw = fs.readFileSync(pokeapiListPath, 'utf-8');
  const json = JSON.parse(raw);
  if (!json?.results || !Array.isArray(json.results)) {
    return [];
  }
  return json.results
    .map((entry) => entry?.name)
    .filter((name) => typeof name === 'string' && name.length > 0);
};

const writeSvg = (filePath, title, subtitle) => {
  const svg = buildSvg({ title, subtitle });
  fs.writeFileSync(filePath, svg, 'utf-8');
};

ensureDir(ogDir);

writeSvg(path.join(ogDir, 'default.svg'), 'PokéGen', 'Pokédex by Generation');

for (let i = 1; i <= 9; i += 1) {
  writeSvg(path.join(ogDir, `generation-${i}.svg`), `Generation ${i}`, 'Browse Pokémon by generation');
}

const pokemonNames = readPokemonList();
for (const name of pokemonNames) {
  const safeName = encodeURIComponent(name);
  writeSvg(path.join(ogDir, `pokemon-${safeName}.svg`), name, 'Pokémon details and stats');
}
