// src/core/index.ts
import {
  generateTransform,
  MagicStringAST
} from "@vue-macros/common";
import { parse } from "@vue/compiler-dom";
function transformSetupBlock(code, id, lang) {
  const s = new MagicStringAST(code);
  const node = parse(code, {
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
  return generateTransform(s, id);
}

export {
  transformSetupBlock
};
