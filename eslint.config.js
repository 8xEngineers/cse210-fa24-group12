import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: [
      "src/**/*.ts",
    ]
  },
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    rules: {
      "no-cond-assign": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "no-useless-catch": "warn",
      "no-useless-escape": "warn",

      "@typescript-eslint/no-array-constructor": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn"
    }
  }
)