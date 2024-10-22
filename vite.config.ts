import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const config: UserConfig = {
  plugins: [react()],
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
}

// https://vitejs.dev/config/
export default defineConfig(config);
