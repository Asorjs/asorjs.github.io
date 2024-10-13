"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkSAYUXAMWcjs = require('./chunk-SAYUXAMW.cjs');

// src/index.ts





var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  return {
    include: [_common.REGEX_VUE_SFC],
    version,
    ...options
  };
}
var name = "unplugin-vue-script-lang";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return _chunkSAYUXAMWcjs.transformScriptLang.call(void 0, code, id, options);
      },
      vite: {
        handleHotUpdate(ctx) {
          _common.hackViteHMR.call(void 0, 
            ctx,
            filter,
            (code, id) => _chunkSAYUXAMWcjs.transformScriptLang.call(void 0, code, id, options)
          );
        }
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
