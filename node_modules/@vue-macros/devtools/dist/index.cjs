'use strict';

var node_path = require('node:path');
var sirv = require('sirv');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var sirv__default = /*#__PURE__*/_interopDefault(sirv);

// src/index.ts
var DEV_SERVER_PATH = "/__vue-macros";
var Devtools = ({ nuxtContext } = {}) => {
  return {
    name: "vue-macros-devtools",
    async configureServer(server) {
      if (nuxtContext?.isClient === false) return;
      {
        server.middlewares.use(
          DEV_SERVER_PATH,
          sirv__default.default(node_path.resolve(__dirname, "client"), {
            single: true,
            dev: true
          })
        );
      }
    }
  };
};

exports.Devtools = Devtools;
