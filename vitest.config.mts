import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // React Testing Library trenger globale hooks for å rydde mellom testene.
    globals: true,
    setupFiles: "./src/setupTests.ts",
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/testUtils.tsx"],
    },
  },
});
