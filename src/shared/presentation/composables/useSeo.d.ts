export const createStructuredData: (options: {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	pageType?: string;
	breadcrumb?: Array<{ name: string; url: string }>;
	extraGraph?: unknown[];
}) => Record<string, unknown>;

export const createPokemonStructuredData: (pokemon: any, url?: string) => Record<string, unknown> | null;

export const createPokemonArticleStructuredData: (
	pokemon: any,
	url?: string,
	image?: string
) => Record<string, unknown> | null;

export const createPokemonDatasetStructuredData: (pokemon: any, url?: string) => Record<string, unknown> | null;

export const setStructuredData: (data: Record<string, unknown>) => void;

export const setSeoTags: (options?: {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	robots?: string;
	twitterCard?: string;
	locale?: string;
}) => void;

export const applyRouteSeo: (route: any) => void;
