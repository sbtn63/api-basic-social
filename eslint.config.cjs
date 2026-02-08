// eslint.config.cjs
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020
      },
      globals: {
        // Node y Jest
        console: "readonly",
        process: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
      }
    },
    rules: {
      "no-console": "warn"
    }
  }
];
