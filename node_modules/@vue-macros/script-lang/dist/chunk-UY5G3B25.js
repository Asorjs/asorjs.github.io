import {
  transformScriptLang
} from "./chunk-BCU5XVOR.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  hackViteHMR,
  REGEX_VUE_SFC
} from "@vue-macros/common";
import { createUnplugin } from "unplugin";
function resolveOptions(options) {
  const version = options.version || detectVueVersion();
  return {
    include: [REGEX_VUE_SFC],
    version,
    ...options
  };
}
var name = "unplugin-vue-script-lang";
var plugin = createUnplugin(
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = createFilter(options);
    return {
      name,
      enforce: "pre",
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return transformScriptLang(code, id, options);
      },
      vite: {
        handleHotUpdate(ctx) {
          hackViteHMR(
            ctx,
            filter,
            (code, id) => transformScriptLang(code, id, options)
          );
        }
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
