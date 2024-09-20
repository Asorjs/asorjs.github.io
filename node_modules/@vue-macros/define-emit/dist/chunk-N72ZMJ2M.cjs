"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/index.ts









var _common = require('@vue-macros/common');
var EMIT_VARIABLE_NAME = `${_common.HELPER_PREFIX}emit`;
function transformDefineEmit(code, id) {
  if (!code.includes(_common.DEFINE_EMIT)) return;
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const offset = scriptSetup.loc.start.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const setupAst = getSetupAst();
  const emits = [];
  _common.walkAST.call(void 0, setupAst, {
    enter(node, parent) {
      if (!_common.isCallOf.call(void 0, node, _common.DEFINE_EMIT)) return;
      const [name, validator] = node.arguments;
      let emitName;
      if (!name) {
        if (_optionalChain([parent, 'optionalAccess', _ => _.type]) !== "VariableDeclarator" || parent.id.type !== "Identifier") {
          throw new Error(
            `A variable must be used to receive the return value of ${_common.DEFINE_EMIT}.`
          );
        }
        emitName = parent.id.name;
      } else if (name.type !== "StringLiteral") {
        throw new Error(
          `The first argument of ${_common.DEFINE_EMIT} must be a string literal.`
        );
      } else {
        emitName = name.value;
      }
      emits.push({
        name: emitName,
        validator: validator ? s.sliceNode(validator, { offset }) : void 0
      });
      s.overwriteNode(
        node,
        `(...args) => ${EMIT_VARIABLE_NAME}(${JSON.stringify(
          emitName
        )}, ...args)`,
        { offset }
      );
    }
  });
  if (emits.length > 0) {
    s.prependLeft(
      offset,
      `
const ${EMIT_VARIABLE_NAME} = defineEmits(${mountEmits()})
`
    );
  }
  return _common.generateTransform.call(void 0, s, id);
  function mountEmits() {
    const isAllWithoutOptions = emits.every(({ validator }) => !validator);
    if (isAllWithoutOptions) {
      return `[${emits.map(({ name }) => JSON.stringify(name)).join(", ")}]`;
    }
    return `{
      ${emits.map(
      ({ name, validator }) => `${_common.escapeKey.call(void 0, name)}: ${validator || `null`}`
    ).join(",\n  ")}
    }`;
  }
}




exports.EMIT_VARIABLE_NAME = EMIT_VARIABLE_NAME; exports.transformDefineEmit = transformDefineEmit;
