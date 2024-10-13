"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts






var _common = require('@vue-macros/common');
function transformDefineSlots(code, id) {
  if (!code.includes(_common.DEFINE_SLOTS)) return;
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const s = new (0, _common.MagicStringAST)(code);
  for (const stmt of getSetupAst().body) {
    if (stmt.type === "ExpressionStatement" && _common.isCallOf.call(void 0, stmt.expression, _common.DEFINE_SLOTS)) {
      s.overwriteNode(stmt, "/*defineSlots*/", {
        offset: scriptSetup.loc.start.offset
      });
    }
  }
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformDefineSlots = transformDefineSlots;
