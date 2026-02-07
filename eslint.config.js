import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["client/src/pages/**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ReturnStatement[argument.value=null]",
          message:
            "Do not return null from page components. Use <Redirect>, <AuthBoundary>, or explicit UI.",
        },
      ],
    },
  },
);
