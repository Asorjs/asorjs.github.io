// src/core/index.ts
import {
  DEFINE_PROPS,
  generateTransform,
  isCallOf,
  isIdentifierOf,
  MagicStringAST,
  parseSFC,
  removeMacroImport,
  walkAST,
  WITH_DEFAULTS
} from "@vue-macros/common";
function transformChainCall(code, id) {
  if (!code.includes(DEFINE_PROPS)) return;
  const { scriptSetup, getSetupAst, offset } = parseSFC(code, id);
  if (!scriptSetup) return;
  const s = new MagicStringAST(code);
  const setupAst = getSetupAst();
  walkAST(setupAst, {
    enter(node) {
      if (removeMacroImport(node, s, offset)) return;
      if (isChainCall(node)) processChainCall(node);
    }
  });
  function processChainCall(node) {
    const withDefaultString = node.arguments[0] && s.sliceNode(node.arguments[0], { offset });
    const definePropsString = s.sliceNode(
      node.callee.object,
      { offset }
    );
    s.overwriteNode(
      node,
      withDefaultString ? `${WITH_DEFAULTS}(${definePropsString}, ${withDefaultString})` : definePropsString,
      { offset }
    );
  }
  return generateTransform(s, id);
}
function isChainCall(node) {
  return node.type === "CallExpression" && node.callee.type === "MemberExpression" && isCallOf(node.callee.object, DEFINE_PROPS) && isIdentifierOf(node.callee.property, WITH_DEFAULTS);
}

export {
  transformChainCall
};
