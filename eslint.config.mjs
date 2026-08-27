import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        // This repo also holds the separate Express backend as a subdirectory,
        // with its own eslint.config.js — without this, the frontend's config
        // (no eslint-plugin-security) tries to lint it too and produces bogus
        // "rule not found" errors for every security/* rule the backend uses.
        "haitech-medical-backend-main/**",
    ]),
]);

export default eslintConfig;
