"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/index.ts









var _common = require('@vue-macros/common');
function transformDefineRender(code, id, options) {
  if (!code.includes(_common.DEFINE_RENDER)) return;
  const lang = _common.getLang.call(void 0, id);
  const program = _common.babelParse.call(void 0, code, lang === "vue" ? "js" : lang);
  const nodes = [];
  _common.walkAST.call(void 0, program, {
    enter(node, parent) {
      if (node.type !== "ExpressionStatement" || !_common.isCallOf.call(void 0, node.expression, _common.DEFINE_RENDER) || _optionalChain([parent, 'optionalAccess', _ => _.type]) !== "BlockStatement")
        return;
      nodes.push({
        parent,
        node,
        arg: node.expression.arguments[0]
      });
    }
  });
  if (nodes.length === 0) return;
  const s = new (0, _common.MagicStringAST)(code);
  for (const { parent, node, arg } of nodes) {
    const returnStmt = parent.body.find(
      (node2) => node2.type === "ReturnStatement"
    );
    if (returnStmt) s.removeNode(returnStmt);
    const index = returnStmt ? returnStmt.start : parent.end - 1;
    const shouldAddFn = !options.vapor && !_common.isFunctionType.call(void 0, arg) && arg.type !== "Identifier";
    s.appendLeft(index, `return ${shouldAddFn ? "() => (" : ""}`);
    s.moveNode(arg, index);
    if (shouldAddFn) s.appendRight(index, `)`);
    s.remove(node.start, arg.start);
    s.remove(arg.end, node.end);
  }
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformDefineRender = transformDefineRender;
