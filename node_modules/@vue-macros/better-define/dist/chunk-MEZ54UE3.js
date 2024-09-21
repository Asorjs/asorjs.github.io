// src/core/index.ts
import {
  analyzeSFC,
  genRuntimePropDefinition
} from "@vue-macros/api";
import {
  DEFINE_EMITS,
  escapeKey,
  generateTransform,
  importHelperFn,
  MagicStringAST,
  parseSFC
} from "@vue-macros/common";
async function transformBetterDefine(code, id, isProduction = false) {
  const s = new MagicStringAST(code);
  const sfc = parseSFC(code, id);
  if (!sfc.scriptSetup) return;
  const offset = sfc.scriptSetup.loc.start.offset;
  const result = await analyzeSFC(s, sfc);
  if (result.props) {
    await processProps(result.props);
  }
  if (result.emits) {
    processEmits(result.emits);
  }
  return generateTransform(s, id);
  async function processProps(props) {
    const runtimeDefs = await props.getRuntimeDefinitions();
    const runtimeDecls = `{
  ${Object.entries(runtimeDefs).map(([key, { type, required, default: defaultDecl }]) => {
      let defaultString = "";
      if (defaultDecl) defaultString = defaultDecl("default");
      const properties = [];
      if (!isProduction) properties.push(`required: ${required}`);
      if (defaultString) properties.push(defaultString);
      return `${escapeKey(key)}: ${genRuntimePropDefinition(
        type,
        isProduction,
        properties
      )}`;
    }).join(",\n  ")}
}`;
    let decl = runtimeDecls;
    if (props.withDefaultsAst && !props.defaults) {
      decl = `${importHelperFn(
        s,
        offset,
        "mergeDefaults"
      )}(${decl}, ${s.sliceNode(props.withDefaultsAst.arguments[1], {
        offset
      })})`;
    }
    decl = `defineProps(${decl})`;
    s.overwriteNode(props.withDefaultsAst || props.definePropsAst, decl, {
      offset
    });
  }
  function processEmits(emits) {
    const runtimeDecls = `[${Object.keys(emits.definitions).map((name) => JSON.stringify(name)).join(", ")}]`;
    s.overwriteNode(emits.defineEmitsAst, `${DEFINE_EMITS}(${runtimeDecls})`, {
      offset
    });
  }
}

export {
  transformBetterDefine
};
