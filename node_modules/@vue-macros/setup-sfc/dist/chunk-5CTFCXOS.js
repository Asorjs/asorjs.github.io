// src/core/index.ts
import {
  babelParse,
  generateTransform,
  getLang,
  MagicStringAST
} from "@vue-macros/common";
function transformSetupSFC(code, id) {
  const lang = getLang(id);
  const program = babelParse(code, lang);
  const s = new MagicStringAST(code);
  for (const stmt of program.body) {
    if (stmt.type !== "ExportDefaultDeclaration") continue;
    s.append(`defineRender(${s.sliceNode(stmt.declaration)});`);
    s.removeNode(stmt);
  }
  const attrs = lang ? ` lang="${lang}"` : "";
  s.prepend(`<script setup${attrs}>`);
  s.append(`</script>`);
  return generateTransform(s, id);
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

export {
  transformSetupSFC,
  hotUpdateSetupSFC
};
