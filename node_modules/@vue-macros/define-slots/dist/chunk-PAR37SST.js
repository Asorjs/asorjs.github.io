// src/core/index.ts
import {
  DEFINE_SLOTS,
  generateTransform,
  isCallOf,
  MagicStringAST,
  parseSFC
} from "@vue-macros/common";
function transformDefineSlots(code, id) {
  if (!code.includes(DEFINE_SLOTS)) return;
  const { scriptSetup, getSetupAst } = parseSFC(code, id);
  if (!scriptSetup) return;
  const s = new MagicStringAST(code);
  for (const stmt of getSetupAst().body) {
    if (stmt.type === "ExpressionStatement" && isCallOf(stmt.expression, DEFINE_SLOTS)) {
      s.overwriteNode(stmt, "/*defineSlots*/", {
        offset: scriptSetup.loc.start.offset
      });
    }
  }
  return generateTransform(s, id);
}

export {
  transformDefineSlots
};
