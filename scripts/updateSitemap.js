import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
const pokeapiListPath = path.join(projectRoot, 'assets', 'mock_data', 'pokeapi-list.json');

const BASE_URL = 'https://mattia-carcione.github.io/pokegen';

const staticUrls = [
  { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${BASE_URL}/privacy`, changefreq: 'yearly', priority: '0.3' },
  { loc: `${BASE_URL}/terms`, changefreq: 'yearly', priority: '0.3' },
  { loc: `${BASE_URL}/generation/1`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/2`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/3`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/4`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/5`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/6`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/7`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/8`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/generation/9`, changefreq: 'weekly', priority: '0.8' },
];

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

const getFileLastmod = (filePath, fallback) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return fallback;
  }
};

const escapeXml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const buildUrlTag = ({ loc, changefreq, priority, lastmod }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  `    <lastmod>${lastmod}</lastmod>`,
  `    <changefreq>${changefreq}</changefreq>`,
  `    <priority>${priority}</priority>`,
  '  </url>',
].join('\n');

const pokemonNames = readPokemonList();
const lastmod = new Date().toISOString().split('T')[0];
const pokemonLastmod = getFileLastmod(pokeapiListPath, lastmod);

const pokemonUrls = pokemonNames.map((name) => ({
  loc: `${BASE_URL}/pokemon/${encodeURIComponent(name)}`,
  lastmod: pokemonLastmod,
  changefreq: 'weekly',
  priority: '0.6',
}));

const staticUrlsWithLastmod = staticUrls.map((entry) => ({
  ...entry,
  lastmod,
}));

const allUrls = [...staticUrlsWithLastmod, ...pokemonUrls];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allUrls.map(buildUrlTag),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(sitemapPath, xml, 'utf-8');
