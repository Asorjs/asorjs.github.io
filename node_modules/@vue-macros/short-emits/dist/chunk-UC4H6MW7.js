import {
  transformShortEmits
} from "./chunk-E5VGCFWS.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  FilterFileType,
  getFilterPattern
} from "@vue-macros/common";
import {
  createUnplugin
} from "unplugin";
function resolveOptions(options, framework) {
  const version = options.version || detectVueVersion();
  const include = getFilterPattern(
    [FilterFileType.VUE_SFC_WITH_SETUP, FilterFileType.SETUP_SFC],
    framework
  );
  return {
    include,
    ...options,
    version
  };
}
var name = "unplugin-vue-short-emits";
var plugin = createUnplugin(
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = createFilter(options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform: transformShortEmits
    };
  }
);
var src_default = plugin;

export {
  src_default
};
