// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        templateTokenizer: { pug: "vue-eslint-parser-template-tokenizer-pug" },
      },
    },
    rules: {
      "vue/component-name-in-template-casing": ["error", "kebab-case"],
      "vue/html-self-closing": "off",
      "vue/html-end-tags": "off",
      "vue/html-indent": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/multi-word-component-names": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
