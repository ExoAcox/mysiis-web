/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "path";
import magicalSvg from "vite-plugin-magical-svg";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), magicalSvg({ target: "react" })],
    resolve: {
        alias: {
            "@features": path.join(__dirname, "./features"),
            "@hooks": path.join(__dirname, "./utils/hooks"),
            "@libs": path.join(__dirname, "./utils/libs"),
            "@api": path.join(__dirname, "./utils/api"),
            "@functions": path.join(__dirname, "./utils/functions"),
            "@styles": path.join(__dirname, "./styles"),
            "@pages": path.join(__dirname, "./pages"),
            "@components": path.join(__dirname, "./components"),
            "@data": path.join(__dirname, "./utils/data"),
            "@public": path.join(__dirname, "./public"),
            "@images": path.join(__dirname, "./public/images"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
        exclude: [...configDefaults.exclude, "**/build/**"],
        // watchExclude: [...configDefaults.watchExclude, "**/build/**"],
        coverage: {
            all: true,
            exclude: [".next/**", "**/__tests__/**", "**/**.d.ts"],
            include: ["**/pages/**", "**/features/**", "**/components/**", "**/utils/**"],
            reporter: ["html", "lcov"],
        },
    },
});
