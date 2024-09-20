// src/core/index.ts
import {
  babelParse,
  DEFINE_RENDER,
  generateTransform,
  getLang,
  isCallOf,
  isFunctionType,
  MagicStringAST,
  walkAST
} from "@vue-macros/common";
function transformDefineRender(code, id, options) {
  if (!code.includes(DEFINE_RENDER)) return;
  const lang = getLang(id);
  const program = babelParse(code, lang === "vue" ? "js" : lang);
  const nodes = [];
  walkAST(program, {
    enter(node, parent) {
      if (node.type !== "ExpressionStatement" || !isCallOf(node.expression, DEFINE_RENDER) || parent?.type !== "BlockStatement")
        return;
      nodes.push({
        parent,
        node,
        arg: node.expression.arguments[0]
      });
    }
  });
  if (nodes.length === 0) return;
  const s = new MagicStringAST(code);
  for (const { parent, node, arg } of nodes) {
    const returnStmt = parent.body.find(
      (node2) => node2.type === "ReturnStatement"
    );
    if (returnStmt) s.removeNode(returnStmt);
    const index = returnStmt ? returnStmt.start : parent.end - 1;
    const shouldAddFn = !options.vapor && !isFunctionType(arg) && arg.type !== "Identifier";
    s.appendLeft(index, `return ${shouldAddFn ? "() => (" : ""}`);
    s.moveNode(arg, index);
    if (shouldAddFn) s.appendRight(index, `)`);
    s.remove(node.start, arg.start);
    s.remove(arg.end, node.end);
  }
  return generateTransform(s, id);
}

export {
  transformDefineRender
};
