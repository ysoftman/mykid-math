// Values the bundler inlines (build.ts and bunfig.toml)
interface ImportMeta {
  readonly env: { readonly DEV: boolean };
  readonly hot: { data: { root?: import('react-dom/client').Root } };
}
declare const __APP_BUILD_TIME__: string;

declare module '*.css';
declare module '*.webp' {
  const src: string;
  export default src;
}
