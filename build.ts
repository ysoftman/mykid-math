import { $ } from 'bun';
import tailwind from 'bun-plugin-tailwind';

await $`rm -rf dist`;
await Bun.build({
  entrypoints: ['index.html'],
  outdir: 'dist',
  minify: true,
  // GitHub Pages serves the app from /mykid-math/
  publicPath: process.env.GITHUB_ACTIONS === 'true' ? '/mykid-math/' : '/',
  plugins: [tailwind],
  define: {
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    'import.meta.env.DEV': 'false',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
// Like Vite's publicDir, files under public/ keep their paths
await $`cp -R public/. dist`;
