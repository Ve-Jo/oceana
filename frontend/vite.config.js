import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import Terminal from "vite-plugin-terminal";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), Terminal({ console: "terminal" })],
	envDir: "./../",
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
				ws: false,
			},
		},
	},
});
