"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkPBGZ5VXYcjs = require('./chunk-PBGZ5VXY.cjs');

// src/index.ts





var _common = require('@vue-macros/common');


var _unplugin = require('unplugin');
function resolveOptions(options, framework) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  const include = _common.getFilterPattern.call(void 0, 
    [_common.FilterFileType.VUE_SFC_WITH_SETUP, _common.FilterFileType.SETUP_SFC],
    framework
  );
  return {
    include,
    ...options,
    version
  };
}
var name = "unplugin-vue-define-props";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform: _chunkPBGZ5VXYcjs.transformDefineProps
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
