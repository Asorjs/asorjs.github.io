"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkLMNM5YI4cjs = require('./chunk-LMNM5YI4.cjs');

// src/index.ts





var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  return {
    include: [_common.REGEX_VUE_SFC, _common.REGEX_SETUP_SFC],
    defaultLang: "ts",
    ...options,
    version
  };
}
var name = "unplugin-vue-setup-block";
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
        return _chunkLMNM5YI4cjs.transformSetupBlock.call(void 0, code, id, options.defaultLang);
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
