import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    env: {
      node: true, // Enable Node.js environment
    },
  },
  pluginJs.configs.recommended,
];
