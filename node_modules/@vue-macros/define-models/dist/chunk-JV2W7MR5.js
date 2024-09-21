import {
  emitHelperId,
  emit_helper_default,
  helperPrefix,
  transformDefineModels,
  useVmodelHelperId,
  use_vmodel_default
} from "./chunk-U43QEDMR.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  FilterFileType,
  getFilterPattern,
  normalizePath
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
    unified: true,
    ...options,
    version
  };
}
var name = "unplugin-vue-define-models";
var plugin = createUnplugin(
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = createFilter(options);
    return {
      name,
      enforce: "pre",
      resolveId(id) {
        if (normalizePath(id).startsWith(helperPrefix)) return id;
      },
      loadInclude(id) {
        return normalizePath(id).startsWith(helperPrefix);
      },
      load(_id) {
        const id = normalizePath(_id);
        if (id === emitHelperId) return emit_helper_default;
        else if (id === useVmodelHelperId) return use_vmodel_default;
      },
      transformInclude: filter,
      transform(code, id) {
        return transformDefineModels(code, id, options.version, options.unified);
      }
    };
  }
);
var src_default = plugin;

export {
  src_default
};
