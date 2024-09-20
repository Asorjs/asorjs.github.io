import {
  hotUpdateSetupSFC,
  transformSetupSFC
} from "./chunk-5CTFCXOS.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  REGEX_SETUP_SFC_SUB
} from "@vue-macros/common";
import { createUnplugin } from "unplugin";
function resolveOptions(options) {
  const version = options.version || detectVueVersion();
  return {
    include: [REGEX_SETUP_SFC_SUB],
    exclude: [/vitest\.setup\.\w+$/],
    ...options,
    version
  };
}
var name = "unplugin-vue-setup-sfc";
var plugin = createUnplugin(
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = createFilter(options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform: transformSetupSFC,
      vite: {
        config() {
          return {
            esbuild: {
              exclude: options.include,
              include: options.exclude
            }
          };
        },
        handleHotUpdate: (ctx) => {
          if (filter(ctx.file)) {
            return hotUpdateSetupSFC(ctx, filter);
          }
        }
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
