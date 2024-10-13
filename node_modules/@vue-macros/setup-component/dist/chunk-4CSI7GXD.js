import {
  SETUP_COMPONENT_ID_REGEX,
  getMainModule,
  hotUpdateSetupComponent,
  isSubModule,
  loadSetupComponent,
  transformPost,
  transformSetupComponent
} from "./chunk-K4SVGEY3.js";

// src/index.ts
import process from "node:process";
import {
  createFilter,
  detectVueVersion,
  REGEX_NODE_MODULES,
  REGEX_SETUP_SFC,
  REGEX_SRC_FILE,
  REGEX_VUE_SUB
} from "@vue-macros/common";
import { createUnplugin } from "unplugin";
function resolveOptions(options) {
  const root = options.root || process.cwd();
  const version = options.version || detectVueVersion(root);
  return {
    include: [REGEX_SRC_FILE],
    exclude: [REGEX_SETUP_SFC, REGEX_VUE_SUB, REGEX_NODE_MODULES],
    ...options,
    root,
    version
  };
}
var name = "unplugin-vue-setup-component";
var PrePlugin = createUnplugin(
  (userOptions = {}, meta) => {
    const options = resolveOptions(userOptions);
    const filter = createFilter(options);
    const setupComponentContext = {};
    return {
      name: `${name}-pre`,
      enforce: "pre",
      resolveId(id, importer) {
        if (SETUP_COMPONENT_ID_REGEX.test(id)) return id;
        if (["rollup", "vite"].includes(meta.framework) && importer && isSubModule(importer)) {
          const mainModule = getMainModule(importer, options.root);
          return this.resolve(id, mainModule, {
            skipSelf: true
          });
        }
      },
      loadInclude(id) {
        return SETUP_COMPONENT_ID_REGEX.test(id);
      },
      load(id) {
        return loadSetupComponent(id, setupComponentContext, options.root);
      },
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return transformSetupComponent(code, id, setupComponentContext);
      },
      vite: {
        configResolved(config) {
          options.root = config.root;
        },
        handleHotUpdate: (ctx) => {
          if (filter(ctx.file)) {
            return hotUpdateSetupComponent(ctx, setupComponentContext);
          }
        }
      }
    };
  }
);
var PostPlugin = createUnplugin(
  () => {
    return {
      name: `${name}-post`,
      enforce: "post",
      transformInclude(id) {
        return isSubModule(id);
      },
      transform(code, id) {
        return transformPost(code, id);
      },
      rollup: {
        transform: {
          order: "post",
          handler(code, id) {
            if (!isSubModule(id)) return;
            return transformPost(code, id);
          }
        }
      }
    };
  }
);
var plugin = createUnplugin(
  (options = {}, meta) => {
    return [PrePlugin.raw(options, meta), PostPlugin.raw(options, meta)];
  }
);
var src_default = plugin;

export {
  src_default
};
