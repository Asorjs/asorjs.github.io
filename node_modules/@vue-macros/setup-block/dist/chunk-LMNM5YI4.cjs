"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts



var _common = require('@vue-macros/common');
var _compilerdom = require('@vue/compiler-dom');
function transformSetupBlock(code, id, lang) {
  const s = new (0, _common.MagicStringAST)(code);
  const node = _compilerdom.parse.call(void 0, code, {
    // @ts-ignore TODO remove ignore in 3.4
    parseMode: "sfc",
    // there are no components at SFC parsing level
    isNativeTag: () => true,
    // preserve all whitespaces
    isPreTag: () => true,
    // @ts-ignore (this has been removed in Vue 3.4)
    getTextMode: ({ tag, props }, parent) => {
      if (!parent && tag !== "template" || // <template lang="xxx"> should also be treated as raw text
      tag === "template" && props.some(
        (p) => p.type === 6 && p.name === "lang" && p.value && p.value.content && p.value.content !== "html"
      )) {
        return 2;
      } else {
        return 0;
      }
    }
  });
  for (const child of node.children) {
    if (child.type === 1 && child.tag === "setup") {
      const hasLang = child.props.some((p) => p.name === "lang");
      let codegen = "script setup";
      if (!hasLang && lang) {
        codegen += ` lang="${lang}"`;
      }
      s.overwrite(
        child.loc.start.offset + 1,
        child.loc.start.offset + 6,
        codegen
      );
      s.overwrite(
        child.loc.end.offset - 6,
        child.loc.end.offset - 1,
        "script"
      );
    }
  }
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformSetupBlock = transformSetupBlock;
