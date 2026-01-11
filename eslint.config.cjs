module.exports = [
  {
    files: ["**/*.js"],      // analiza todos los JS
    extends: ["eslint:recommended", "prettier"],
    env: {
      node: true,
      es6: true,
      jest: true
    },
    parserOptions: {
      ecmaVersion: 2018
    },
    rules: {
      "no-console": "warn"
    }
  }
]
