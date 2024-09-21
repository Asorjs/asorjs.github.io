"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkO3WD442Xcjs = require('./chunk-O3WD442X.cjs');

// src/index.ts







var _common = require('@vue-macros/common');


var _unplugin = require('unplugin');
function resolveOptions(options, framework) {
  const version = options.version || _common.detectVueVersion.call(void 0, void 0, 0);
  const include = _common.getFilterPattern.call(void 0, [_common.FilterFileType.SRC_FILE], framework);
  return {
    include,
    exclude: [_common.REGEX_NODE_MODULES, _common.REGEX_SETUP_SFC],
    ...options,
    version
  };
}
var name = "unplugin-vue-jsx-directive";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform(code, id) {
        return _chunkO3WD442Xcjs.transformJsxDirective.call(void 0, code, id, options.version);
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
