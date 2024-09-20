"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts





var _common = require('@vue-macros/common');
function transformSetupSFC(code, id) {
  const lang = _common.getLang.call(void 0, id);
  const program = _common.babelParse.call(void 0, code, lang);
  const s = new (0, _common.MagicStringAST)(code);
  for (const stmt of program.body) {
    if (stmt.type !== "ExportDefaultDeclaration") continue;
    s.append(`defineRender(${s.sliceNode(stmt.declaration)});`);
    s.removeNode(stmt);
  }
  const attrs = lang ? ` lang="${lang}"` : "";
  s.prepend(`<script setup${attrs}>`);
  s.append(`</script>`);
  return _common.generateTransform.call(void 0, s, id);
}
function hotUpdateSetupSFC({ modules }, filter) {
  function isSubModule(id) {
    const [filename, query] = id.split("?");
    if (!query) return false;
    if (!filter(filename)) return false;
    return true;
  }
  const affectedModules = modules.filter((mod) => mod.id && isSubModule(mod.id));
  return affectedModules;
}




exports.transformSetupSFC = transformSetupSFC; exports.hotUpdateSetupSFC = hotUpdateSetupSFC;
