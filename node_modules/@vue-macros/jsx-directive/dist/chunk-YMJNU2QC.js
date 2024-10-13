import {
  transformJsxDirective
} from "./chunk-NOX36T75.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  FilterFileType,
  getFilterPattern,
  REGEX_NODE_MODULES,
  REGEX_SETUP_SFC
} from "@vue-macros/common";
import {
  createUnplugin
} from "unplugin";
function resolveOptions(options, framework) {
  const version = options.version || detectVueVersion(void 0, 0);
  const include = getFilterPattern([FilterFileType.SRC_FILE], framework);
  return {
    include,
    exclude: [REGEX_NODE_MODULES, REGEX_SETUP_SFC],
    ...options,
    version
  };
}
var name = "unplugin-vue-jsx-directive";
var plugin = createUnplugin(
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = createFilter(options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform(code, id) {
        return transformJsxDirective(code, id, options.version);
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
