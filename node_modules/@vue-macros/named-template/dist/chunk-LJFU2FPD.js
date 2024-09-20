import {
  MAIN_TEMPLATE,
  QUERY_NAMED_TEMPLATE,
  QUERY_TEMPLATE,
  parseVueRequest,
  postTransform,
  preTransform
} from "./chunk-3JCYISGA.js";

// src/index.ts
import {
  createFilter,
  detectVueVersion,
  REGEX_VUE_SFC
} from "@vue-macros/common";
import { createUnplugin } from "unplugin";
function resolveOptions(options) {
  const version = options.version || detectVueVersion();
  return {
    include: [REGEX_VUE_SFC],
    ...options,
    version
  };
}
var name = "unplugin-vue-named-template";
var PrePlugin = createUnplugin((userOptions = {}) => {
  const options = resolveOptions(userOptions);
  const filter = createFilter(options);
  const templateContent = /* @__PURE__ */ Object.create(null);
  return {
    name: `${name}-pre`,
    enforce: "pre",
    loadInclude(id) {
      return id.includes(QUERY_TEMPLATE);
    },
    load(id) {
      const { filename, query } = parseVueRequest(id);
      const content = templateContent[filename]?.["mainTemplate" in query ? MAIN_TEMPLATE : query.name];
      return content;
    },
    transformInclude(id) {
      return filter(id) || id.includes(QUERY_NAMED_TEMPLATE);
    },
    transform(code, id) {
      if (id.includes(QUERY_NAMED_TEMPLATE)) {
        const { filename, query } = parseVueRequest(id);
        const { name: name2 } = query;
        const request = `${filename}?vue&${QUERY_TEMPLATE}&name=${name2}`;
        return `import { createTextVNode } from 'vue'
        import { render } from ${JSON.stringify(request)}
export default {
render: (...args) => {
  const r = render(...args)
  return typeof r === 'string' ? createTextVNode(r) : r
}
}`;
      } else {
        return preTransform(code, id, templateContent);
      }
    }
  };
});
var PostPlugin = createUnplugin((userOptions = {}) => {
  const options = resolveOptions(userOptions);
  const filter = createFilter(options);
  const customBlocks = /* @__PURE__ */ Object.create(null);
  function transformInclude(id) {
    return filter(id) || id.includes(QUERY_TEMPLATE);
  }
  return {
    name: `${name}-post`,
    enforce: "post",
    transformInclude,
    transform(code, id) {
      return postTransform(code, id, customBlocks);
    },
    rollup: {
      transform: {
        order: "post",
        handler(code, id) {
          if (!transformInclude(id)) return;
          return postTransform(code, id, customBlocks);
        }
      }
    }
  };
});
var plugin = createUnplugin(
  (userOptions = {}, meta) => {
    return [PrePlugin.raw(userOptions, meta), PostPlugin.raw(userOptions, meta)];
  }
);
var src_default = plugin;

export {
  PrePlugin,
  PostPlugin,
  src_default
};
