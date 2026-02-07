module.exports = {
  overrides: [
    {
      files: ["client/src/pages/**/*.tsx"],
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
  ],
};
