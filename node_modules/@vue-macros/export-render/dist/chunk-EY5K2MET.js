// src/core/index.ts
import {
  generateTransform,
  MagicStringAST,
  parseSFC
} from "@vue-macros/common";
function transformExportRender(code, id) {
  const { scriptSetup, getSetupAst } = parseSFC(code, id);
  if (!scriptSetup) return;
  const s = new MagicStringAST(code);
  const nodes = getSetupAst().body;
  const offset = scriptSetup.loc.start.offset;
  let codegen = "";
  for (const stmt of nodes) {
    if (stmt.type === "ExportDefaultDeclaration" && stmt.exportKind === "value") {
      codegen = s.sliceNode(stmt.declaration, { offset });
      s.removeNode(stmt, { offset });
    }
  }
  if (codegen.length === 0) return;
  codegen = `defineRender(${codegen})`;
  s.prependLeft(scriptSetup.loc.end.offset, `${codegen}
`);
  return generateTransform(s, id);
}

export {
  transformExportRender
};
