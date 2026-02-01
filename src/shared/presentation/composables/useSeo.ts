import { SITE_URL } from '@/config/appConfig';

const SITE_NAME = 'PokéGen';
const DEFAULT_DESCRIPTION = 'Explore Pokémon by generation, search by name, and view detailed stats, evolutions, and lore with PokéGen.';
const DEFAULT_IMAGE = '/og/default.svg';
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';
const DEFAULT_TWITTER_CARD = 'summary_large_image';
const DEFAULT_TYPE = 'website';
const DEFAULT_LOCALE = 'en_US';

const isAbsoluteUrl = (value?: string) => /^https?:\/\//i.test(value || '');

const getSiteOrigin = () => {
  if (import.meta?.env?.PROD && SITE_URL) {
    return SITE_URL.replace(/\/$/, '');
  }
  return window.location.origin;
};

const toAbsoluteUrl = (value?: string) => {
  const origin = getSiteOrigin();
  if (!value) {
    return origin + '/';
  }
  if (isAbsoluteUrl(value)) {
    return value;
  }
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${origin}${normalized}`;
};

const ensureMeta = (attr: string, key: string) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
};

const setMetaContent = (attr: string, key: string, content?: string) => {
  if (!content) return;
  const el = ensureMeta(attr, key);
  el.setAttribute('content', content);
};

const setLinkTag = (rel: string, href?: string) => {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  if (href) {
    el.setAttribute('href', href);
  }
};

const formatTemplate = (template?: string, params: Record<string, unknown> = {}, query: Record<string, unknown> = {}) => {
  if (!template) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (params[key] !== undefined) return String(params[key]);
    if (query[key] !== undefined) return String(query[key]);
    return '';
  });
};

export const createStructuredData = ({
  title,
  description,
  url,
  image,
  pageType = 'WebPage',
  breadcrumb,
  extraGraph = [],
}: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  pageType?: string;
  breadcrumb?: Array<{ name: string; url: string }>;
  extraGraph?: unknown[];
}) => {
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const absoluteImage = toAbsoluteUrl(image || DEFAULT_IMAGE);
  const siteHome = toAbsoluteUrl('/');

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'Organization',
      '@id': `${siteHome}#organization`,
      name: SITE_NAME,
      url: siteHome,
      logo: {
        '@type': 'ImageObject',
        url: absoluteImage,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteHome}#website`,
      name: SITE_NAME,
      url: siteHome,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteHome}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': pageType,
      '@id': `${absoluteUrl}#webpage`,
      name: title || SITE_NAME,
      description: description || DEFAULT_DESCRIPTION,
      url: absoluteUrl,
      isPartOf: { '@id': `${absoluteUrl}#website` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: absoluteImage,
      },
    },
  ];

  if (breadcrumb?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: toAbsoluteUrl(item.url),
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [...graph, ...extraGraph],
  };
};

export const createPokemonStructuredData = (pokemon: any, url?: string) => {
  if (!pokemon) return null;
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const absoluteImage = toAbsoluteUrl(pokemon.sprite || DEFAULT_IMAGE);
  const additionalProperty: Array<{ '@type': string; name: string; value: string }> = [];

  if (pokemon.types?.length) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Types',
      value: pokemon.types.map((type: { name: string }) => type.name).join(', '),
    });
  }

  if (pokemon.height !== undefined) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Height',
      value: `${pokemon.height}`,
    });
  }

  if (pokemon.weight !== undefined) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Weight',
      value: `${pokemon.weight}`,
    });
  }

  return {
    '@type': 'Thing',
    '@id': `${absoluteUrl}#pokemon`,
    name: pokemon.name,
    image: absoluteImage,
    description: pokemon.genus || `${pokemon.name} profile and stats.`,
    url: absoluteUrl,
    additionalProperty,
  };
};

export const createPokemonArticleStructuredData = (pokemon: any, url?: string, image?: string) => {
  if (!pokemon) return null;
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const absoluteImage = toAbsoluteUrl(image || pokemon.sprite || DEFAULT_IMAGE);
  const description = pokemon.genus
    ? `${pokemon.genus} Find stats, types, evolutions, and lore for ${pokemon.name}.`
    : `Find stats, types, evolutions, and lore for ${pokemon.name}.`;

  return {
    '@type': 'Article',
    '@id': `${absoluteUrl}#article`,
    headline: pokemon.name,
    description,
    image: [absoluteImage],
    mainEntityOfPage: absoluteUrl,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl(DEFAULT_IMAGE),
      },
    },
  };
};

export const createPokemonDatasetStructuredData = (pokemon: any, url?: string) => {
  if (!pokemon) return null;
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const description = pokemon.genus
    ? `${pokemon.genus} dataset for ${pokemon.name}.`
    : `Dataset for ${pokemon.name}.`;
  const keywords = Array.isArray(pokemon.types)
    ? pokemon.types.map((type: { name: string }) => type.name)
    : [];

  return {
    '@type': 'Dataset',
    '@id': `${absoluteUrl}#dataset`,
    name: `${pokemon.name} dataset`,
    description,
    url: absoluteUrl,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    keywords,
    license: 'https://pokeapi.co/docs/v2',
  };
};

export const setStructuredData = (data: Record<string, unknown>) => {
  if (!data) return;
  const id = 'structured-data';
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
};

export const setSeoTags = ({
  title,
  description,
  image,
  url,
  type,
  robots,
  twitterCard,
  locale,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  twitterCard?: string;
  locale?: string;
} = {}) => {
  const finalTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Pokédex by Generation`;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalUrl = toAbsoluteUrl(url || window.location.href);
  const finalImage = toAbsoluteUrl(image || DEFAULT_IMAGE);
  const finalType = type || DEFAULT_TYPE;
  const finalLocale = locale || DEFAULT_LOCALE;

  document.title = finalTitle;

  setMetaContent('name', 'description', finalDescription);
  setMetaContent('name', 'robots', robots || 'index, follow');

  setMetaContent('property', 'og:title', finalTitle);
  setMetaContent('property', 'og:description', finalDescription);
  setMetaContent('property', 'og:type', finalType);
  setMetaContent('property', 'og:url', finalUrl);
  setMetaContent('property', 'og:image', finalImage);
  setMetaContent('property', 'og:image:width', OG_IMAGE_WIDTH);
  setMetaContent('property', 'og:image:height', OG_IMAGE_HEIGHT);
  setMetaContent('property', 'og:image:alt', title || SITE_NAME);
  setMetaContent('property', 'og:site_name', SITE_NAME);
  setMetaContent('property', 'og:locale', finalLocale);

  setMetaContent('name', 'twitter:card', twitterCard || DEFAULT_TWITTER_CARD);
  setMetaContent('name', 'twitter:title', finalTitle);
  setMetaContent('name', 'twitter:description', finalDescription);
  setMetaContent('name', 'twitter:image', finalImage);
  setMetaContent('name', 'twitter:image:alt', title || SITE_NAME);

  setLinkTag('canonical', finalUrl);
};

export const applyRouteSeo = (route: any) => {
  const seo = route?.meta?.seo || {};
  const structured = route?.meta?.structuredData || {};

  const title = formatTemplate(seo.title, route.params, route.query);
  const description = formatTemplate(seo.description, route.params, route.query);
  const image = formatTemplate(seo.image, route.params, route.query);
  const url = formatTemplate(seo.url, route.params, route.query) || window.location.href;
  const pageType = seo.pageType || 'WebPage';
  const breadcrumb = (seo.breadcrumb || []).map((item: { name: string; url: string }) => ({
    name: formatTemplate(item.name, route.params, route.query),
    url: formatTemplate(item.url, route.params, route.query),
  }));

  setSeoTags({
    title,
    description,
    image,
    url,
    type: seo.type,
    robots: seo.robots,
    twitterCard: seo.twitterCard,
    locale: seo.locale,
  });

  const structuredData = createStructuredData({
    title: title || SITE_NAME,
    description,
    url,
    image,
    pageType,
    breadcrumb,
    extraGraph: structured.extraGraph || [],
  });

  setStructuredData(structuredData);
};
