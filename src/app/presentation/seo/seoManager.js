const SITE_NAME = 'PokéGen';
const DEFAULT_DESCRIPTION = 'Explore Pokémon by generation, search by types or names, compare moves (power, accuracy, PP, TM/MT), and view detailed stats, evolutions, and lore with PokéGen.';
const DEFAULT_IMAGE = '/poke-icon.svg';
const DEFAULT_TYPE = 'website';
const DEFAULT_LOCALE = 'en_US';

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || '');

const toAbsoluteUrl = (value) => {
  if (!value) {
    return window.location.origin + '/';
  }
  if (isAbsoluteUrl(value)) {
    return value;
  }
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${window.location.origin}${normalized}`;
};

const ensureMeta = (attr, key) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
};

const setMetaContent = (attr, key, content) => {
  if (!content) return;
  const el = ensureMeta(attr, key);
  el.setAttribute('content', content);
};

const setLinkTag = (rel, href) => {
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

const formatTemplate = (template, params = {}, query = {}) => {
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
}) => {
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const absoluteImage = toAbsoluteUrl(image || DEFAULT_IMAGE);

  const graph = [
    {
      '@type': 'Organization',
      '@id': `${absoluteUrl}#organization`,
      name: SITE_NAME,
      url: absoluteUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteImage,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${absoluteUrl}#website`,
      name: SITE_NAME,
      url: absoluteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${absoluteUrl}?search={search_term_string}`,
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

export const createPokemonStructuredData = (pokemon, url) => {
  if (!pokemon) return null;
  const absoluteUrl = toAbsoluteUrl(url || window.location.href);
  const absoluteImage = toAbsoluteUrl(pokemon.sprite || DEFAULT_IMAGE);
  const additionalProperty = [];

  if (pokemon.types?.length) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Types',
      value: pokemon.types.map((type) => type.name).join(', '),
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

export const setStructuredData = (data) => {
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
  setMetaContent('property', 'og:site_name', SITE_NAME);
  setMetaContent('property', 'og:locale', finalLocale);

  setMetaContent('name', 'twitter:card', twitterCard || 'summary');
  setMetaContent('name', 'twitter:title', finalTitle);
  setMetaContent('name', 'twitter:description', finalDescription);
  setMetaContent('name', 'twitter:image', finalImage);

  setLinkTag('canonical', finalUrl);
};

export const applyRouteSeo = (route) => {
  const seo = route?.meta?.seo || {};
  const structured = route?.meta?.structuredData || {};

  const title = formatTemplate(seo.title, route.params, route.query);
  const description = formatTemplate(seo.description, route.params, route.query);
  const image = formatTemplate(seo.image, route.params, route.query);
  const url = formatTemplate(seo.url, route.params, route.query) || window.location.href;
  const pageType = seo.pageType || 'WebPage';
  const breadcrumb = (seo.breadcrumb || []).map((item) => ({
    name: formatTemplate(item.name, route.params, route.query),
    url: formatTemplate(item.url, route.params, route.query),
  }));

  setSeoTags({
    title,
    description,
    image,
    url,
    type: seo.type,
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
