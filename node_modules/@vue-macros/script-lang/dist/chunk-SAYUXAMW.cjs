"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/index.ts




var _common = require('@vue-macros/common');
function transformScriptLang(code, id, options) {
  const s = new (0, _common.MagicString)(code);
  const lang = ` lang="${_optionalChain([options, 'optionalAccess', _ => _.defaultLang]) || "ts"}"`;
  const {
    sfc: {
      descriptor: { script, scriptSetup }
    }
  } = _common.parseSFC.call(void 0, code, id);
  if (script && !script.attrs.lang) {
    const start = script.loc.start.offset;
    s.appendLeft(start - 1, lang);
  }
  if (scriptSetup && !scriptSetup.attrs.lang) {
    const start = scriptSetup.loc.start.offset;
    s.appendLeft(start - 1, lang);
  }
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformScriptLang = transformScriptLang;
