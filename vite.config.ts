import { defineConfig, UserConfig } from 'vite'
import preact from "@preact/preset-vite";
import { resolve } from 'path'

const config: UserConfig = {
  plugins: [preact()],
  build: {
    copyPublicDir: false,
  }
};

if (process.env.BUILD_SERVER) {
  config.build!.ssr = resolve(__dirname, "src/server/index.ts");
  config.build!.outDir = "./dist/server";
} else {
  config.build!.ssrManifest = true;
  config.build!.outDir = "./dist/client";
	config.build!.rollupOptions = {
		input: {
			index: resolve(__dirname, "index.html"),
			upload: resolve(__dirname, "upload.html")
		}
	};
}

// https://vitejs.dev/config/
export default defineConfig(config);
