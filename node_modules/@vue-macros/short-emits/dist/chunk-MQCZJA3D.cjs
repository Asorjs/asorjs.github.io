"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/index.ts










var _common = require('@vue-macros/common');
function transformShortEmits(code, id) {
  const sfc = _common.parseSFC.call(void 0, code, id);
  const { scriptSetup, lang, getSetupAst } = sfc;
  if (!scriptSetup || !_common.isTs.call(void 0, lang)) return;
  const offset = scriptSetup.loc.start.offset;
  const ast = getSetupAst();
  const params = [];
  const s = new (0, _common.MagicStringAST)(code);
  _common.walkAST.call(void 0, ast, {
    enter(node) {
      if (_common.isCallOf.call(void 0, node, _common.DEFINE_EMITS) && _optionalChain([node, 'access', _ => _.typeParameters, 'optionalAccess', _2 => _2.params, 'optionalAccess', _3 => _3[0]])) {
        let param = _optionalChain([node, 'access', _4 => _4.typeParameters, 'optionalAccess', _5 => _5.params, 'optionalAccess', _6 => _6[0]]);
        if (param.type === "TSTypeReference" && param.typeName.type === "Identifier" && ["SE", "ShortEmits"].includes(param.typeName.name) && _optionalChain([param, 'access', _7 => _7.typeParameters, 'optionalAccess', _8 => _8.params, 'access', _9 => _9[0]])) {
          const inner = _optionalChain([param, 'access', _10 => _10.typeParameters, 'optionalAccess', _11 => _11.params, 'access', _12 => _12[0]]);
          s.remove(offset + param.start, offset + inner.start);
          s.remove(offset + inner.end, offset + param.end);
          param = inner;
        }
        params.push(param);
      }
    }
  });
  for (const param of params) {
    if (param.type !== "TSTypeLiteral") continue;
    for (const member of param.members) {
      if (!_common.isTypeOf.call(void 0, member, ["TSPropertySignature", "TSMethodSignature"]))
        continue;
      const key = _common.resolveObjectKey.call(void 0, member, true);
      let params2 = "";
      switch (member.type) {
        case "TSPropertySignature": {
          if (!member.typeAnnotation || !_common.isTypeOf.call(void 0, member.typeAnnotation.typeAnnotation, [
            "TSTupleType",
            "TSFunctionType"
          ]))
            continue;
          switch (member.typeAnnotation.typeAnnotation.type) {
            case "TSTupleType":
              params2 = `...args: ${s.sliceNode(
                member.typeAnnotation.typeAnnotation,
                { offset }
              )}`;
              break;
            case "TSFunctionType":
              params2 = stringifyParams(
                member.typeAnnotation.typeAnnotation.parameters
              );
              break;
          }
          break;
        }
        case "TSMethodSignature": {
          params2 = stringifyParams(member.parameters);
          break;
        }
      }
      s.overwriteNode(
        member,
        `(evt: ${key}${params2 ? `, ${params2}` : ""}): void`,
        { offset }
      );
    }
  }
  return _common.generateTransform.call(void 0, s, id);
  function stringifyParams(params2) {
    return params2.length > 0 ? s.sliceNode(params2, { offset }) : "";
  }
}



exports.transformShortEmits = transformShortEmits;
