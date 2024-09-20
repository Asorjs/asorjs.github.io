"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts










var _common = require('@vue-macros/common');
function transformChainCall(code, id) {
  if (!code.includes(_common.DEFINE_PROPS)) return;
  const { scriptSetup, getSetupAst, offset } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const s = new (0, _common.MagicStringAST)(code);
  const setupAst = getSetupAst();
  _common.walkAST.call(void 0, setupAst, {
    enter(node) {
      if (_common.removeMacroImport.call(void 0, node, s, offset)) return;
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
      withDefaultString ? `${_common.WITH_DEFAULTS}(${definePropsString}, ${withDefaultString})` : definePropsString,
      { offset }
    );
  }
  return _common.generateTransform.call(void 0, s, id);
}
function isChainCall(node) {
  return node.type === "CallExpression" && node.callee.type === "MemberExpression" && _common.isCallOf.call(void 0, node.callee.object, _common.DEFINE_PROPS) && _common.isIdentifierOf.call(void 0, node.callee.property, _common.WITH_DEFAULTS);
}



exports.transformChainCall = transformChainCall;
