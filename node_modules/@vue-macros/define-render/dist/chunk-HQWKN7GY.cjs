"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkESCBA4DWcjs = require('./chunk-ESCBA4DW.cjs');

// src/index.ts





var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  return {
    include: [
      _common.REGEX_VUE_SFC,
      _common.REGEX_SETUP_SFC,
      /\.(vue|setup\.[cm]?[jt]sx?)\?vue/
    ],
    version,
    ...options
  };
}
var name = "unplugin-vue-define-render";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}) => {
    const options = resolveOptions(userOptions);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "post",
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return _chunkESCBA4DWcjs.transformDefineRender.call(void 0, code, id, options);
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
