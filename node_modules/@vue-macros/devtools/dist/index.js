import { fileURLToPath } from 'url';
import path from 'path';
import { resolve } from 'node:path';
import sirv from 'sirv';

// ../../node_modules/.pnpm/tsup@8.2.4_jiti@1.21.6_postcss@8.4.45_tsx@4.19.1_typescript@5.6.2_yaml@2.5.1/node_modules/tsup/assets/esm_shims.js
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();
var DEV_SERVER_PATH = "/__vue-macros";
var Devtools = ({ nuxtContext } = {}) => {
  return {
    name: "vue-macros-devtools",
    async configureServer(server) {
      if (nuxtContext?.isClient === false) return;
      {
        server.middlewares.use(
          DEV_SERVER_PATH,
          sirv(resolve(__dirname, "client"), {
            single: true,
            dev: true
          })
        );
      }
    }
  };
};

export { Devtools };
