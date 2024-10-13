"use strict";Object.defineProperty(exports, "__esModule", {value: true});






var _chunkSWKIEOQTcjs = require('./chunk-SWKIEOQT.cjs');

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
    unified: true,
    ...options,
    version
  };
}
var name = "unplugin-vue-define-models";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      resolveId(id) {
        if (_common.normalizePath.call(void 0, id).startsWith(_chunkSWKIEOQTcjs.helperPrefix)) return id;
      },
      loadInclude(id) {
        return _common.normalizePath.call(void 0, id).startsWith(_chunkSWKIEOQTcjs.helperPrefix);
      },
      load(_id) {
        const id = _common.normalizePath.call(void 0, _id);
        if (id === _chunkSWKIEOQTcjs.emitHelperId) return _chunkSWKIEOQTcjs.emit_helper_default;
        else if (id === _chunkSWKIEOQTcjs.useVmodelHelperId) return _chunkSWKIEOQTcjs.use_vmodel_default;
      },
      transformInclude: filter,
      transform(code, id) {
        return _chunkSWKIEOQTcjs.transformDefineModels.call(void 0, code, id, options.version, options.unified);
      }
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
