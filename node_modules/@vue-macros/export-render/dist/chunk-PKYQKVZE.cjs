"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts




var _common = require('@vue-macros/common');
function transformExportRender(code, id) {
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const s = new (0, _common.MagicStringAST)(code);
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
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformExportRender = transformExportRender;
