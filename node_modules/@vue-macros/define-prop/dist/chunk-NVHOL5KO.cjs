"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/helper/code.ts?raw
var code_default = "export default props=>{return Array.isArray(props)?props.reduce((normalized,p)=>(normalized[p]=null,normalized),{}):props};\n";

// src/core/helper/index.ts
var _common = require('@vue-macros/common');
var helperId = `${_common.VIRTUAL_ID_PREFIX}/define-prop/helper`;

// src/core/utils.ts
function stringifyArray(strs) {
  return `[${strs.map((s) => JSON.stringify(s)).join(", ")}]`;
}

// src/core/johnson-edition.ts
var _api = require('@vue-macros/api');

var johnsonEdition = ({ s, offset, resolveTSType }) => {
  const props = [];
  return {
    walkCall(node, parent) {
      const [value, required, rest] = node.arguments;
      if (_optionalChain([parent, 'optionalAccess', _ => _.type]) !== "VariableDeclarator" || parent.id.type !== "Identifier")
        throw new Error(
          `A variable must be used to receive the return value of ${_common.DEFINE_PROP} (johnsonEdition)`
        );
      const propName = parent.id.name;
      props.push({
        name: propName,
        value: value ? s.sliceNode(value, { offset }) : void 0,
        required: required ? s.sliceNode(required, { offset }) : void 0,
        rest: rest ? s.sliceNode(rest, { offset }) : void 0,
        typeParameter: _optionalChain([node, 'access', _2 => _2.typeParameters, 'optionalAccess', _3 => _3.params, 'access', _4 => _4[0]])
      });
      return propName;
    },
    async genRuntimeProps(isProduction) {
      if (props.length === 0) return;
      const isAllWithoutOptions = props.every(
        ({ typeParameter, value, required, rest }) => !typeParameter && !value && !required && !rest
      );
      if (isAllWithoutOptions) {
        return stringifyArray(props.map(({ name }) => name));
      }
      let propsString = "{\n";
      for (const { name, value, required, rest, typeParameter } of props) {
        let def;
        const types = typeParameter && await resolveTSType(typeParameter);
        if (rest && !value && !required && !types) {
          def = rest;
        } else {
          const properties = [];
          if (value) properties.push(`default: ${value}`);
          if (required) properties.push(`required: ${required}`);
          if (rest) properties.push(`...${rest}`);
          def = _api.genRuntimePropDefinition.call(void 0, types, isProduction, properties);
        }
        propsString += `  ${_common.escapeKey.call(void 0, name)}: ${def},
`;
      }
      propsString += "}";
      return propsString;
    }
  };
};

// src/core/kevin-edition.ts


var kevinEdition = ({ s, offset, resolveTSType }) => {
  const props = [];
  return {
    walkCall(node, parent) {
      const [name, definition] = node.arguments;
      let propName;
      if (!name) {
        if (_optionalChain([parent, 'optionalAccess', _5 => _5.type]) !== "VariableDeclarator" || parent.id.type !== "Identifier")
          throw new Error(
            `A variable must be used to receive the return value of ${_common.DEFINE_PROP} when the first argument is not passed. (kevinEdition)`
          );
        propName = parent.id.name;
      } else if (name.type !== "StringLiteral") {
        throw new Error(
          `The first argument of ${_common.DEFINE_PROP} must be a literal string. (kevinEdition)`
        );
      } else {
        propName = name.value;
      }
      props.push({
        name: propName,
        definition: definition ? s.sliceNode(definition, { offset }) : void 0,
        typeParameter: _optionalChain([node, 'access', _6 => _6.typeParameters, 'optionalAccess', _7 => _7.params, 'access', _8 => _8[0]])
      });
      return propName;
    },
    async genRuntimeProps(isProduction) {
      if (props.length === 0) return;
      const isAllWithoutOptions = props.every(
        ({ definition, typeParameter }) => !definition && !typeParameter
      );
      if (isAllWithoutOptions) {
        return stringifyArray(props.map(({ name }) => name));
      }
      let propsString = "{\n";
      for (const { name, definition, typeParameter } of props) {
        let def;
        const types = typeParameter && await resolveTSType(typeParameter);
        if (definition && !types) {
          def = definition;
        } else {
          const properties = [];
          if (definition) properties.push(`...${definition}`);
          def = _api.genRuntimePropDefinition.call(void 0, types, isProduction, properties);
        }
        propsString += `  ${_common.escapeKey.call(void 0, name)}: ${def},
`;
      }
      propsString += "}";
      return propsString;
    }
  };
};

// src/core/index.ts













var PROPS_VARIABLE_NAME = `${_common.HELPER_PREFIX}props`;
async function transformDefineProp(code, id, edition = "kevinEdition", isProduction = false) {
  if (!code.includes(_common.DEFINE_PROP)) return;
  const sfc = _common.parseSFC.call(void 0, code, id);
  if (!sfc.scriptSetup) return;
  const setupAst = sfc.getSetupAst();
  const offset = sfc.scriptSetup.loc.start.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const { walkCall, genRuntimeProps } = (edition === "kevinEdition" ? kevinEdition : johnsonEdition)({ s, offset, resolveTSType });
  let definePropsCall;
  const parentMap = /* @__PURE__ */ new WeakMap();
  _common.walkAST.call(void 0, setupAst, {
    enter: (node, parent) => {
      if (_common.isCallOf.call(void 0, node, _common.DEFINE_PROPS)) {
        definePropsCall = node;
      }
      parentMap.set(node, parent);
      if (!_common.isCallOf.call(void 0, node, [_common.DEFINE_PROP, _common.DEFINE_PROP_DOLLAR])) return;
      const isCallOfDollar = _common.isCallOf.call(void 0, parent, "$") && _common.isCallOf.call(void 0, node, _common.DEFINE_PROP);
      const isReactiveTransform = isCallOfDollar || _common.isCallOf.call(void 0, node, _common.DEFINE_PROP_DOLLAR);
      const propName = walkCall(
        node,
        isCallOfDollar ? parentMap.get(parent) : parent
      );
      s.overwriteNode(
        isCallOfDollar ? parent : node,
        `${isReactiveTransform ? "$(" : ""}${_common.importHelperFn.call(void 0, 
          s,
          offset,
          "toRef"
        )}(__props, ${JSON.stringify(propName)})${isReactiveTransform ? ")" : ""}`,
        { offset }
      );
    }
  });
  const runtimeProps = await genRuntimeProps(isProduction);
  if (!runtimeProps) return;
  if (_optionalChain([definePropsCall, 'optionalAccess', _9 => _9.typeParameters])) {
    throw new SyntaxError(
      `defineProp cannot be used with defineProps<T>() in the same component.`
    );
  }
  if (definePropsCall && definePropsCall.arguments.length > 0) {
    const originalProps = s.sliceNode(definePropsCall.arguments[0], { offset });
    const normalizePropsOrEmits = _common.importHelperFn.call(void 0, 
      s,
      offset,
      "normalizePropsOrEmits",
      helperId,
      true
    );
    s.overwriteNode(
      definePropsCall.arguments[0],
      `{ ...${normalizePropsOrEmits}(${originalProps}), ...${normalizePropsOrEmits}(${runtimeProps}) }`,
      {
        offset
      }
    );
  } else {
    s.prependLeft(
      offset,
      `
const ${PROPS_VARIABLE_NAME} = defineProps(${runtimeProps});
`
    );
  }
  return _common.generateTransform.call(void 0, s, id);
  async function resolveTSType(type) {
    const resolved = await _api.resolveTSReferencedType.call(void 0, {
      scope: {
        kind: "file",
        filePath: id,
        content: sfc.scriptSetup.content,
        ast: setupAst.body
      },
      type
    });
    return resolved && _api.inferRuntimeType.call(void 0, resolved);
  }
}









exports.code_default = code_default; exports.helperId = helperId; exports.stringifyArray = stringifyArray; exports.johnsonEdition = johnsonEdition; exports.kevinEdition = kevinEdition; exports.PROPS_VARIABLE_NAME = PROPS_VARIABLE_NAME; exports.transformDefineProp = transformDefineProp;
