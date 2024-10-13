import {
  transformSetupBlock
} from "./chunk-2HR5V3XQ.js";

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
    include: [REGEX_VUE_SFC, REGEX_SETUP_SFC],
    defaultLang: "ts",
    ...options,
    version
  };
}
var name = "unplugin-vue-setup-block";
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
        return transformSetupBlock(code, id, options.defaultLang);
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
