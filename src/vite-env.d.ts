/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION_HASH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
