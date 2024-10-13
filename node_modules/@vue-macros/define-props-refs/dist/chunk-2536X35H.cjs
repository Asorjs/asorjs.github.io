"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts












var _common = require('@vue-macros/common');
function transformDefinePropsRefs(code, id) {
  if (!code.includes(_common.DEFINE_PROPS_REFS)) return;
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const offset = scriptSetup.loc.start.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const setupAst = getSetupAst();
  _common.walkAST.call(void 0, setupAst, {
    enter(node) {
      _common.removeMacroImport.call(void 0, node, s, offset);
      if (_common.isCallOf.call(void 0, node, _common.WITH_DEFAULTS) && _common.isCallOf.call(void 0, node.arguments[0], _common.DEFINE_PROPS_REFS)) {
        processDefinePropsRefs(node.arguments[0], node);
        this.skip();
      } else if (_common.isCallOf.call(void 0, node, _common.DEFINE_PROPS_REFS)) {
        processDefinePropsRefs(node);
      }
    }
  });
  return _common.generateTransform.call(void 0, s, id);
  function processDefinePropsRefs(propsCall, defaultsCall) {
    let code2 = `${_common.DEFINE_PROPS}${s.slice(
      offset + propsCall.callee.end,
      offset + propsCall.end
    )}`;
    if (defaultsCall) {
      code2 = `${_common.WITH_DEFAULTS}(${code2}, ${s.sliceNode(
        defaultsCall.arguments[1],
        { offset }
      )})`;
    }
    s.prependLeft(offset, `
const ${_common.HELPER_PREFIX}props = ${code2}`);
    s.overwriteNode(
      defaultsCall || propsCall,
      `${_common.importHelperFn.call(void 0, s, offset, "toRefs")}(${_common.HELPER_PREFIX}props)`,
      {
        offset
      }
    );
  }
}



exports.transformDefinePropsRefs = transformDefinePropsRefs;
