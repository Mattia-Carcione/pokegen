import boundaries from "eslint-plugin-boundaries";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

const layerRules = [
	{ from: "core", allow: ["core"] },
	{ from: "config", allow: ["config"] },
	{ from: "commons", allow: ["core", "commons", "assets"] },
	{ from: "infrastructure", allow: ["core", "commons", "config", "infrastructure", "assets"] },

	{ from: "module-domain", allow: ["core", "commons", "config", "module-domain"] },
	{ from: "module-application", allow: ["core", "commons", "config", "module-domain", "module-application"] },
	{
		from: "module-persistence",
		allow: [
			"core",
			"commons",
			"config",
			"infrastructure",
			"assets",
			"module-domain",
			"module-application",
			"module-persistence",
			"module-assets",
		],
	},
	{
		from: "module-presentation",
		allow: [
			"core",
			"commons",
			"config",
			"assets",
			"module-domain",
			"module-application",
			"module-presentation",
			"module-assets",
		],
	},
	{ from: "module-assets", allow: ["module-assets", "assets"] },

	{
		from: "app",
		allow: [
			"core",
			"commons",
			"config",
			"module-domain",
			"module-application",
			"module-presentation",
			"module-assets",
			"app",
			"assets",
		],
	},
	{
		from: "app-di",
		allow: [
			"core",
			"commons",
			"config",
			"infrastructure",
			"module-domain",
			"module-application",
			"module-persistence",
			"module-presentation",
			"module-assets",
			"app",
			"assets",
		],
	},
	{ from: "assets", allow: ["assets"] },
];

export default [
	{
		ignores: ["dist/**", "coverage/**", "node_modules/**"],
	},
	{
		files: ["**/*.{js,ts,vue}"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				sourceType: "module",
				ecmaVersion: "latest",
			},
		},
		plugins: {
			vue,
			boundaries,
		},
		settings: {
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json",
				},
				node: {
					extensions: [".js", ".ts", ".vue", ".json"],
				},
			},
			"boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
			"boundaries/elements": [
				{ type: "assets", pattern: "assets/**" },
				{ type: "app-di", pattern: "src/app/di/**" },
				{ type: "app", pattern: "src/app/**" },
				{ type: "commons", pattern: "src/commons/**" },
				{ type: "config", pattern: "src/config/**" },
				{ type: "core", pattern: "src/core/**" },
				{ type: "infrastructure", pattern: "src/infrastructure/**" },
				{ type: "module-assets", pattern: "src/modules/*/assets/**", capture: ["module"] },
				{ type: "module-domain", pattern: "src/modules/*/domain/**", capture: ["module"] },
				{ type: "module-application", pattern: "src/modules/*/application/**", capture: ["module"] },
				{ type: "module-persistence", pattern: "src/modules/*/persistence/**", capture: ["module"] },
				{ type: "module-presentation", pattern: "src/modules/*/presentation/**", capture: ["module"] },
			],
		},
		rules: {
			"boundaries/no-unknown": "error",
			"boundaries/element-types": ["error", { default: "disallow", rules: layerRules }],
		},
	},
];
