import index from './index.html';

// bun serve.ts         : dev server with HMR, bundled with the settings in bunfig.toml [serve.static]
// bun serve.ts preview : serves the dist build
const preview = Bun.argv[2] === 'preview';
const dir = preview ? 'dist' : 'public';

const server = Bun.serve({
  hostname: 'localhost',
  port: 5173,
  routes: preview ? undefined : { '/': index },
  async fetch(req) {
    const { pathname } = new URL(req.url);
    const file = Bun.file(`${dir}${pathname === '/' ? '/index.html' : pathname}`);
    return (await file.exists()) ? new Response(file) : new Response('Not Found', { status: 404 });
  },
});
console.log(server.url.href);
