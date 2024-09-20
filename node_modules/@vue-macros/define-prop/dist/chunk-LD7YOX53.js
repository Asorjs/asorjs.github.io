// src/core/helper/code.ts?raw
var code_default = "export default props=>{return Array.isArray(props)?props.reduce((normalized,p)=>(normalized[p]=null,normalized),{}):props};\n";

// src/core/helper/index.ts
import { VIRTUAL_ID_PREFIX } from "@vue-macros/common";
var helperId = `${VIRTUAL_ID_PREFIX}/define-prop/helper`;

// src/core/utils.ts
function stringifyArray(strs) {
  return `[${strs.map((s) => JSON.stringify(s)).join(", ")}]`;
}

// src/core/johnson-edition.ts
import { genRuntimePropDefinition } from "@vue-macros/api";
import { DEFINE_PROP, escapeKey } from "@vue-macros/common";
var johnsonEdition = ({ s, offset, resolveTSType }) => {
  const props = [];
  return {
    walkCall(node, parent) {
      const [value, required, rest] = node.arguments;
      if (parent?.type !== "VariableDeclarator" || parent.id.type !== "Identifier")
        throw new Error(
          `A variable must be used to receive the return value of ${DEFINE_PROP} (johnsonEdition)`
        );
      const propName = parent.id.name;
      props.push({
        name: propName,
        value: value ? s.sliceNode(value, { offset }) : void 0,
        required: required ? s.sliceNode(required, { offset }) : void 0,
        rest: rest ? s.sliceNode(rest, { offset }) : void 0,
        typeParameter: node.typeParameters?.params[0]
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
          def = genRuntimePropDefinition(types, isProduction, properties);
        }
        propsString += `  ${escapeKey(name)}: ${def},
`;
      }
      propsString += "}";
      return propsString;
    }
  };
};

// src/core/kevin-edition.ts
import { genRuntimePropDefinition as genRuntimePropDefinition2 } from "@vue-macros/api";
import { DEFINE_PROP as DEFINE_PROP2, escapeKey as escapeKey2 } from "@vue-macros/common";
var kevinEdition = ({ s, offset, resolveTSType }) => {
  const props = [];
  return {
    walkCall(node, parent) {
      const [name, definition] = node.arguments;
      let propName;
      if (!name) {
        if (parent?.type !== "VariableDeclarator" || parent.id.type !== "Identifier")
          throw new Error(
            `A variable must be used to receive the return value of ${DEFINE_PROP2} when the first argument is not passed. (kevinEdition)`
          );
        propName = parent.id.name;
      } else if (name.type !== "StringLiteral") {
        throw new Error(
          `The first argument of ${DEFINE_PROP2} must be a literal string. (kevinEdition)`
        );
      } else {
        propName = name.value;
      }
      props.push({
        name: propName,
        definition: definition ? s.sliceNode(definition, { offset }) : void 0,
        typeParameter: node.typeParameters?.params[0]
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
          def = genRuntimePropDefinition2(types, isProduction, properties);
        }
        propsString += `  ${escapeKey2(name)}: ${def},
`;
      }
      propsString += "}";
      return propsString;
    }
  };
};

// src/core/index.ts
import { inferRuntimeType, resolveTSReferencedType } from "@vue-macros/api";
import {
  DEFINE_PROP as DEFINE_PROP3,
  DEFINE_PROP_DOLLAR,
  DEFINE_PROPS,
  generateTransform,
  HELPER_PREFIX,
  importHelperFn,
  isCallOf,
  MagicStringAST,
  parseSFC,
  walkAST
} from "@vue-macros/common";
var PROPS_VARIABLE_NAME = `${HELPER_PREFIX}props`;
async function transformDefineProp(code, id, edition = "kevinEdition", isProduction = false) {
  if (!code.includes(DEFINE_PROP3)) return;
  const sfc = parseSFC(code, id);
  if (!sfc.scriptSetup) return;
  const setupAst = sfc.getSetupAst();
  const offset = sfc.scriptSetup.loc.start.offset;
  const s = new MagicStringAST(code);
  const { walkCall, genRuntimeProps } = (edition === "kevinEdition" ? kevinEdition : johnsonEdition)({ s, offset, resolveTSType });
  let definePropsCall;
  const parentMap = /* @__PURE__ */ new WeakMap();
  walkAST(setupAst, {
    enter: (node, parent) => {
      if (isCallOf(node, DEFINE_PROPS)) {
        definePropsCall = node;
      }
      parentMap.set(node, parent);
      if (!isCallOf(node, [DEFINE_PROP3, DEFINE_PROP_DOLLAR])) return;
      const isCallOfDollar = isCallOf(parent, "$") && isCallOf(node, DEFINE_PROP3);
      const isReactiveTransform = isCallOfDollar || isCallOf(node, DEFINE_PROP_DOLLAR);
      const propName = walkCall(
        node,
        isCallOfDollar ? parentMap.get(parent) : parent
      );
      s.overwriteNode(
        isCallOfDollar ? parent : node,
        `${isReactiveTransform ? "$(" : ""}${importHelperFn(
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
  if (definePropsCall?.typeParameters) {
    throw new SyntaxError(
      `defineProp cannot be used with defineProps<T>() in the same component.`
    );
  }
  if (definePropsCall && definePropsCall.arguments.length > 0) {
    const originalProps = s.sliceNode(definePropsCall.arguments[0], { offset });
    const normalizePropsOrEmits = importHelperFn(
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
  return generateTransform(s, id);
  async function resolveTSType(type) {
    const resolved = await resolveTSReferencedType({
      scope: {
        kind: "file",
        filePath: id,
        content: sfc.scriptSetup.content,
        ast: setupAst.body
      },
      type
    });
    return resolved && inferRuntimeType(resolved);
  }
}

export {
  code_default,
  helperId,
  stringifyArray,
  johnsonEdition,
  kevinEdition,
  PROPS_VARIABLE_NAME,
  transformDefineProp
};
