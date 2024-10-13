"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkZU56XJIDjs = require('./chunk-ZU56XJID.js');

// src/index.ts
var _utils = require('@antfu/utils');

// src/vite.ts
var getVitePlugin = (factory) => {
  return (userOptions) => {
    const { plugins } = factory(userOptions, { framework: "vite" });
    return resolvePlugins(plugins, "vite");
  };
};

// src/esbuild.ts
var getEsbuildPlugin = (factory) => {
  return (userOptions) => {
    const { name, plugins } = factory(userOptions, { framework: "esbuild" });
    return {
      name,
      setup(build) {
        for (const plugin of resolvePlugins(plugins, "esbuild")) {
          plugin.setup(build);
        }
      }
    };
  };
};

// src/webpack.ts
var getWebpackPlugin = (factory) => {
  return (userOptions) => {
    const { plugins } = factory(userOptions, { framework: "webpack" });
    return (compiler) => {
      for (const plugin of resolvePlugins(plugins, "webpack")) {
        if (typeof plugin === "object") {
          plugin.apply.call(compiler, compiler);
        } else {
          plugin.call(compiler, compiler);
        }
      }
    };
  };
};

// src/rspack.ts
var getRspackPlugin = (factory) => {
  return (userOptions) => {
    const { plugins } = factory(userOptions, { framework: "rspack" });
    return (compiler) => {
      for (const plugin of resolvePlugins(plugins, "rspack")) {
        if (typeof plugin === "object") {
          plugin.apply.call(compiler, compiler);
        } else {
          plugin.call(compiler, compiler);
        }
      }
    };
  };
};

// src/rolldown.ts
var getRolldownPlugin = (factory) => {
  return (userOptions) => {
    const { plugins } = factory(userOptions, { framework: "rolldown" });
    return resolvePlugins(plugins, "rolldown");
  };
};

// src/index.ts
function flatPlugins(plugins) {
  return _utils.toArray.call(void 0, plugins).flat(Number.POSITIVE_INFINITY);
}
function resolvePlugins(plugins, type) {
  return flatPlugins(plugins).filter((p) => !!p).map((plugin) => {
    if ("instance" in plugin) {
      const { instance, options } = plugin;
      return instance[type](options);
    }
    return plugin;
  });
}
var createCombinePlugin = (factory) => {
  return {
    get rollup() {
      return getRollupPlugin(factory);
    },
    get rolldown() {
      return getRolldownPlugin(factory);
    },
    get vite() {
      return getVitePlugin(factory);
    },
    get esbuild() {
      return getEsbuildPlugin(factory);
    },
    get webpack() {
      return getWebpackPlugin(factory);
    },
    get rspack() {
      return getRspackPlugin(factory);
    },
    get raw() {
      return factory;
    },
    get plugins() {
      return _chunkZU56XJIDjs.getPluginList.call(void 0, factory);
    }
  };
};

// src/rollup.ts
var getRollupPlugin = (factory) => {
  return (userOptions) => {
    const { plugins } = factory(userOptions, { framework: "rollup" });
    return resolvePlugins(plugins, "rollup");
  };
};










exports.getRollupPlugin = getRollupPlugin; exports.getVitePlugin = getVitePlugin; exports.getWebpackPlugin = getWebpackPlugin; exports.getRspackPlugin = getRspackPlugin; exports.getRolldownPlugin = getRolldownPlugin; exports.resolvePlugins = resolvePlugins; exports.createCombinePlugin = createCombinePlugin; exports.getEsbuildPlugin = getEsbuildPlugin;
