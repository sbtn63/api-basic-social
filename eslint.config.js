// eslint.config.cjs
import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.mocha,
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": [
        "error", {
          "argsIgnorePattern": "^next$",
          "ignoreRestSiblings": true
        }
      ]
    }
  }
];
