"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunk3QPOBBGMcjs = require('./chunk-3QPOBBGM.cjs');

// src/index.ts




var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  return {
    include: [_common.REGEX_SETUP_SFC_SUB],
    exclude: [/vitest\.setup\.\w+$/],
    ...options,
    version
  };
}
var name = "unplugin-vue-setup-sfc";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform: _chunk3QPOBBGMcjs.transformSetupSFC,
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
            return _chunk3QPOBBGMcjs.hotUpdateSetupSFC.call(void 0, ctx, filter);
          }
        }
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
