"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }







var _chunkJYMSI2QVcjs = require('./chunk-JYMSI2QV.cjs');

// src/index.ts
var _nodeprocess = require('node:process'); var _nodeprocess2 = _interopRequireDefault(_nodeprocess);







var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const root = options.root || _nodeprocess2.default.cwd();
  const version = options.version || _common.detectVueVersion.call(void 0, root);
  return {
    include: [_common.REGEX_SRC_FILE],
    exclude: [_common.REGEX_SETUP_SFC, _common.REGEX_VUE_SUB, _common.REGEX_NODE_MODULES],
    ...options,
    root,
    version
  };
}
var name = "unplugin-vue-setup-component";
var PrePlugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, meta) => {
    const options = resolveOptions(userOptions);
    const filter = _common.createFilter.call(void 0, options);
    const setupComponentContext = {};
    return {
      name: `${name}-pre`,
      enforce: "pre",
      resolveId(id, importer) {
        if (_chunkJYMSI2QVcjs.SETUP_COMPONENT_ID_REGEX.test(id)) return id;
        if (["rollup", "vite"].includes(meta.framework) && importer && _chunkJYMSI2QVcjs.isSubModule.call(void 0, importer)) {
          const mainModule = _chunkJYMSI2QVcjs.getMainModule.call(void 0, importer, options.root);
          return this.resolve(id, mainModule, {
            skipSelf: true
          });
        }
      },
      loadInclude(id) {
        return _chunkJYMSI2QVcjs.SETUP_COMPONENT_ID_REGEX.test(id);
      },
      load(id) {
        return _chunkJYMSI2QVcjs.loadSetupComponent.call(void 0, id, setupComponentContext, options.root);
      },
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return _chunkJYMSI2QVcjs.transformSetupComponent.call(void 0, code, id, setupComponentContext);
      },
      vite: {
        configResolved(config) {
          options.root = config.root;
        },
        handleHotUpdate: (ctx) => {
          if (filter(ctx.file)) {
            return _chunkJYMSI2QVcjs.hotUpdateSetupComponent.call(void 0, ctx, setupComponentContext);
          }
        }
      }
    };
  }
);
var PostPlugin = _unplugin.createUnplugin.call(void 0, 
  () => {
    return {
      name: `${name}-post`,
      enforce: "post",
      transformInclude(id) {
        return _chunkJYMSI2QVcjs.isSubModule.call(void 0, id);
      },
      transform(code, id) {
        return _chunkJYMSI2QVcjs.transformPost.call(void 0, code, id);
      },
      rollup: {
        transform: {
          order: "post",
          handler(code, id) {
            if (!_chunkJYMSI2QVcjs.isSubModule.call(void 0, id)) return;
            return _chunkJYMSI2QVcjs.transformPost.call(void 0, code, id);
          }
        }
      }
    };
  }
);
var plugin = _unplugin.createUnplugin.call(void 0, 
  (options = {}, meta) => {
    return [PrePlugin.raw(options, meta), PostPlugin.raw(options, meta)];
  }
);
var src_default = plugin;



exports.src_default = src_default;
