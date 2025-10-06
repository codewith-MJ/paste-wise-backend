export default {
	parserOptions: {
		project: "./tsconfig.json",
	},
	settings: {
		"import/resolver": {
			typescript: {
				project: "./tsconfig.json",
			},
		},
	},
	plugins: ["import"],
	rules: {
		"import/no-relative-parent-imports": "warn",
	},
};
