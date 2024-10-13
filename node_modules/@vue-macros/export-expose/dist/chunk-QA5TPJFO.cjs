"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts





var _common = require('@vue-macros/common');
var _compilersfc = require('@vue/compiler-sfc');
var MACROS_VAR_PREFIX = `${_common.HELPER_PREFIX}expose_`;
function transformExportExpose(code, id) {
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const s = new (0, _common.MagicStringAST)(code);
  const nodes = getSetupAst().body;
  const offset = scriptSetup.loc.start.offset;
  const exposed = /* @__PURE__ */ Object.create(null);
  let i = 0;
  for (const stmt of nodes) {
    const start = offset + stmt.start;
    const end = start + 6;
    if (stmt.type === "ExportNamedDeclaration" && stmt.exportKind === "value") {
      if (stmt.declaration) {
        if (stmt.declaration.type === "VariableDeclaration" && !stmt.declaration.declare) {
          for (const decl of stmt.declaration.declarations) {
            for (const id2 of _compilersfc.extractIdentifiers.call(void 0, decl.id)) {
              exposed[id2.name] = id2.name;
            }
          }
        } else if ((stmt.declaration.type === "FunctionDeclaration" || stmt.declaration.type === "ClassDeclaration" || stmt.declaration.type === "TSEnumDeclaration") && !stmt.declaration.declare) {
          exposed[stmt.declaration.id.name] = stmt.declaration.id.name;
        }
        s.remove(start, end);
      } else {
        for (const specifier of stmt.specifiers) {
          let exported, local;
          if (specifier.type === "ExportSpecifier") {
            if (specifier.exportKind === "type") continue;
            exported = specifier.exported.type === "Identifier" ? specifier.exported.name : specifier.exported.value;
            if (stmt.source) {
              local = MACROS_VAR_PREFIX + String(i++);
              if (specifier.local.name === exported) {
                s.overwriteNode(
                  specifier.local,
                  `${specifier.local.name} as ${local}`,
                  { offset }
                );
              } else {
                s.overwriteNode(specifier.exported, local, { offset });
              }
            } else {
              local = specifier.local.name;
            }
          } else if (specifier.type === "ExportNamespaceSpecifier") {
            local = MACROS_VAR_PREFIX + String(i++);
            exported = specifier.exported.name;
            s.overwriteNode(specifier.exported, local, { offset });
          } else continue;
          exposed[exported] = local;
        }
        if (stmt.source) {
          s.overwrite(start, end, "import");
        } else {
          s.removeNode(stmt, { offset });
        }
      }
    } else if (stmt.type === "ExportAllDeclaration" && stmt.exportKind === "value") {
      throw new Error(
        "export from another module is not supported. Please import and export separately."
      );
    } else if (stmt.type === "ExportDefaultDeclaration") {
      throw new Error(
        "export default is not supported. Please use named export."
      );
    }
  }
  if (Object.keys(exposed).length === 0) return;
  let codegen = "";
  for (const [exported, local] of Object.entries(exposed)) {
    codegen += `
  `;
    if (exported === local) {
      codegen += `${exported},`;
    } else {
      codegen += `${exported}: ${local},`;
    }
  }
  codegen = `defineExpose({${codegen}
})`;
  s.prependLeft(scriptSetup.loc.end.offset, `${codegen}
`);
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformExportExpose = transformExportExpose;
