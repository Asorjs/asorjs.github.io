// src/core/index.ts
import {
  DEFINE_PROPS,
  DEFINE_PROPS_DOLLAR,
  generateTransform,
  isCallOf,
  MagicStringAST,
  parseSFC,
  walkAST
} from "@vue-macros/common";
function transformDefineProps(code, id) {
  if (!code.includes(DEFINE_PROPS_DOLLAR)) return;
  const { scriptSetup, getSetupAst } = parseSFC(code, id);
  if (!scriptSetup) return;
  const offset = scriptSetup.loc.start.offset;
  const s = new MagicStringAST(code);
  const setupAst = getSetupAst();
  walkAST(setupAst, {
    enter(node) {
      if (isCallOf(node, DEFINE_PROPS_DOLLAR)) {
        s.overwriteNode(
          node.callee,
          // add space for fixing mapping
          ` ${DEFINE_PROPS}`,
          { offset }
        );
      }
    }
  });
  return generateTransform(s, id);
}

export {
  transformDefineProps
};
