import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    css: {
        devSourcemap: true
    },
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                dinner: resolve(__dirname, "dinner.html")
            }
        }
    }
});