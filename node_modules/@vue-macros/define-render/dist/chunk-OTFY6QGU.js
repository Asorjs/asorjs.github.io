import {
  transformDefineRender
} from "./chunk-HXZCRXMM.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  REGEX_SETUP_SFC,
  REGEX_VUE_SFC
} from "@vue-macros/common";
import { createUnplugin } from "unplugin";
function resolveOptions(options) {
  const version = options.version || detectVueVersion();
  return {
    include: [
      REGEX_VUE_SFC,
      REGEX_SETUP_SFC,
      /\.(vue|setup\.[cm]?[jt]sx?)\?vue/
    ],
    version,
    ...options
  };
}
var name = "unplugin-vue-define-render";
var plugin = createUnplugin(
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = createFilter(options);
    return {
      name,
      enforce: "post",
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return transformDefineRender(code, id, options);
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
