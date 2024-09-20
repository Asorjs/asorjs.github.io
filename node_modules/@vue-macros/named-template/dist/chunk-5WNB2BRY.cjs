"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }






var _chunkKEUILPOZcjs = require('./chunk-KEUILPOZ.cjs');

// src/index.ts




var _common = require('@vue-macros/common');
var _unplugin = require('unplugin');
function resolveOptions(options) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  return {
    include: [_common.REGEX_VUE_SFC],
    ...options,
    version
  };
}
var name = "unplugin-vue-named-template";
var PrePlugin = _unplugin.createUnplugin.call(void 0, (userOptions = {}) => {
  const options = resolveOptions(userOptions);
  const filter = _common.createFilter.call(void 0, options);
  const templateContent = /* @__PURE__ */ Object.create(null);
  return {
    name: `${name}-pre`,
    enforce: "pre",
    loadInclude(id) {
      return id.includes(_chunkKEUILPOZcjs.QUERY_TEMPLATE);
    },
    load(id) {
      const { filename, query } = _chunkKEUILPOZcjs.parseVueRequest.call(void 0, id);
      const content = _optionalChain([templateContent, 'access', _ => _[filename], 'optionalAccess', _2 => _2["mainTemplate" in query ? _chunkKEUILPOZcjs.MAIN_TEMPLATE : query.name]]);
      return content;
    },
    transformInclude(id) {
      return filter(id) || id.includes(_chunkKEUILPOZcjs.QUERY_NAMED_TEMPLATE);
    },
    transform(code, id) {
      if (id.includes(_chunkKEUILPOZcjs.QUERY_NAMED_TEMPLATE)) {
        const { filename, query } = _chunkKEUILPOZcjs.parseVueRequest.call(void 0, id);
        const { name: name2 } = query;
        const request = `${filename}?vue&${_chunkKEUILPOZcjs.QUERY_TEMPLATE}&name=${name2}`;
        return `import { createTextVNode } from 'vue'
        import { render } from ${JSON.stringify(request)}
export default {
render: (...args) => {
  const r = render(...args)
  return typeof r === 'string' ? createTextVNode(r) : r
}
}`;
      } else {
        return _chunkKEUILPOZcjs.preTransform.call(void 0, code, id, templateContent);
      }
    }
  };
});
var PostPlugin = _unplugin.createUnplugin.call(void 0, (userOptions = {}) => {
  const options = resolveOptions(userOptions);
  const filter = _common.createFilter.call(void 0, options);
  const customBlocks = /* @__PURE__ */ Object.create(null);
  function transformInclude(id) {
    return filter(id) || id.includes(_chunkKEUILPOZcjs.QUERY_TEMPLATE);
  }
  return {
    name: `${name}-post`,
    enforce: "post",
    transformInclude,
    transform(code, id) {
      return _chunkKEUILPOZcjs.postTransform.call(void 0, code, id, customBlocks);
    },
    rollup: {
      transform: {
        order: "post",
        handler(code, id) {
          if (!transformInclude(id)) return;
          return _chunkKEUILPOZcjs.postTransform.call(void 0, code, id, customBlocks);
        }
      }
    }
  };
});
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, meta) => {
    return [PrePlugin.raw(userOptions, meta), PostPlugin.raw(userOptions, meta)];
  }
);
var src_default = plugin;





exports.PrePlugin = PrePlugin; exports.PostPlugin = PostPlugin; exports.src_default = src_default;
