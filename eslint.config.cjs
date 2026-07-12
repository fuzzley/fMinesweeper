const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "public/**", "src/fMinesweeper/**"],
  },
  js.configs.recommended,
  {
    // Browser application source (ESM).
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        // Vendored libraries exposed as classic-script window globals.
        $: "readonly",
        jQuery: "readonly",
        ko: "readonly",
        _: "readonly",
        moment: "readonly",
      },
    },
  },
  {
    // Node tooling config (CommonJS).
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
];
