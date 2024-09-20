"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/index.ts







var _common = require('@vue-macros/common');
function transformExportProps(code, id) {
  const { scriptSetup, getSetupAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const offset = scriptSetup.loc.start.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const props = /* @__PURE__ */ Object.create(null);
  let hasDefineProps = false;
  const setupAst = getSetupAst();
  for (const stmt of setupAst.body) {
    if (stmt.type === "ExportNamedDeclaration" && _optionalChain([stmt, 'access', _ => _.declaration, 'optionalAccess', _2 => _2.type]) === "VariableDeclaration") {
      for (const decl of stmt.declaration.declarations) {
        walkVariableDeclarator(decl, stmt.declaration.kind);
      }
      s.removeNode(stmt, { offset });
    } else if (_common.isCallOf.call(void 0, stmt, _common.DEFINE_PROPS) || _common.isCallOf.call(void 0, stmt, _common.WITH_DEFAULTS)) {
      hasDefineProps = true;
    }
  }
  if (Object.keys(props).length === 0) return;
  else if (hasDefineProps)
    throw new Error("Don't support export props mixed with defineProps");
  let propsCodegen = "";
  let destructureString = "";
  let modelCodegen = "";
  for (const [name, { isModel, type, defaultValue }] of Object.entries(props)) {
    if (isModel) {
      modelCodegen += `
let ${name} = $(defineModel("${name}"${defaultValue ? `, { default: () => (${defaultValue}) }` : ""}))`;
    } else {
      propsCodegen += `  ${name}${defaultValue ? "?" : ""}${type},
`;
      destructureString += ` ${name}${defaultValue ? ` = ${defaultValue}` : ""},`;
    }
  }
  if (propsCodegen)
    propsCodegen = `const {${destructureString} } = defineProps<{
${propsCodegen}}>()`;
  s.prependLeft(offset, `
${propsCodegen}${modelCodegen}`);
  return _common.generateTransform.call(void 0, s, id);
  function walkVariableDeclarator(decl, kind) {
    if (decl.id.type !== "Identifier") {
      throw new Error("Only support identifier in export props");
    } else if (decl.init && (_common.isCallOf.call(void 0, decl.init, _common.DEFINE_PROPS) || _common.isCallOf.call(void 0, decl.init, _common.WITH_DEFAULTS))) {
      hasDefineProps = true;
      return;
    }
    const name = decl.id.name;
    const type = decl.id.typeAnnotation ? s.sliceNode(decl.id.typeAnnotation, { offset }) : ": any";
    const defaultValue = decl.init ? s.sliceNode(decl.init, { offset }) : void 0;
    props[name] = {
      type,
      defaultValue,
      isModel: kind === "let" || kind === "var"
    };
  }
}



exports.transformExportProps = transformExportProps;
