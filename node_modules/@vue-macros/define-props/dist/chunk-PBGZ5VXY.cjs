"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts








var _common = require('@vue-macros/common');
function transformDefineProps(code, id) {
  if (!code.includes(_common.DEFINE_PROPS_DOLLAR)) return;
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const offset = scriptSetup.loc.start.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const setupAst = getSetupAst();
  _common.walkAST.call(void 0, setupAst, {
    enter(node) {
      if (_common.isCallOf.call(void 0, node, _common.DEFINE_PROPS_DOLLAR)) {
        s.overwriteNode(
          node.callee,
          // add space for fixing mapping
          ` ${_common.DEFINE_PROPS}`,
          { offset }
        );
      }
    }
  });
  return _common.generateTransform.call(void 0, s, id);
}



exports.transformDefineProps = transformDefineProps;
