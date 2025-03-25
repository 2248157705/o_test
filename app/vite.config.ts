import path from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import eslintPlugin from "vite-plugin-eslint";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log("defineConfig", command, mode);
  return {
    build: {
      target: "es2020",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      uni(),
      eslintPlugin({
        cache: false,
        exclude: [
          "**/node_modules/**",
          "**/unpackage/**",
          "**/.vscode/**",
          "androidPrivacy.json",
        ],
      }),

      // visualizer({
      //   // 打包完成后自动打开浏览器，显示产物体积报告
      //   open: true,
      // }),
    ],
  };
});
