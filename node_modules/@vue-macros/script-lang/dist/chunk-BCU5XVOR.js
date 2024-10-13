// src/core/index.ts
import {
  generateTransform,
  MagicString,
  parseSFC
} from "@vue-macros/common";
function transformScriptLang(code, id, options) {
  const s = new MagicString(code);
  const lang = ` lang="${options?.defaultLang || "ts"}"`;
  const {
    sfc: {
      descriptor: { script, scriptSetup }
    }
  } = parseSFC(code, id);
  if (script && !script.attrs.lang) {
    const start = script.loc.start.offset;
    s.appendLeft(start - 1, lang);
  }
  if (scriptSetup && !scriptSetup.attrs.lang) {
    const start = scriptSetup.loc.start.offset;
    s.appendLeft(start - 1, lang);
  }
  return generateTransform(s, id);
}

export {
  transformScriptLang
};
