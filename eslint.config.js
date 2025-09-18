// libs
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierrc from "./.prettierrc.js";

console.log("ESLint configuration loaded.", prettierrc);
export default [
    {
        files: ["**/*.ts", "**/*.js"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                globals: {
                    console: "readonly",
                    process: "readonly",
                    __dirname: "readonly",
                },
            },
        },
        ignores: ["node_modules", "dist", "build"],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            "prettier/prettier": [
                "error",
                {
                    ...prettierrc,
                },
            ],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
];
