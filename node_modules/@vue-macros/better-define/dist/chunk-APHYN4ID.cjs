"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/index.ts



var _api = require('@vue-macros/api');







var _common = require('@vue-macros/common');
async function transformBetterDefine(code, id, isProduction = false) {
  const s = new (0, _common.MagicStringAST)(code);
  const sfc = _common.parseSFC.call(void 0, code, id);
  if (!sfc.scriptSetup) return;
  const offset = sfc.scriptSetup.loc.start.offset;
  const result = await _api.analyzeSFC.call(void 0, s, sfc);
  if (result.props) {
    await processProps(result.props);
  }
  if (result.emits) {
    processEmits(result.emits);
  }
  return _common.generateTransform.call(void 0, s, id);
  async function processProps(props) {
    const runtimeDefs = await props.getRuntimeDefinitions();
    const runtimeDecls = `{
  ${Object.entries(runtimeDefs).map(([key, { type, required, default: defaultDecl }]) => {
      let defaultString = "";
      if (defaultDecl) defaultString = defaultDecl("default");
      const properties = [];
      if (!isProduction) properties.push(`required: ${required}`);
      if (defaultString) properties.push(defaultString);
      return `${_common.escapeKey.call(void 0, key)}: ${_api.genRuntimePropDefinition.call(void 0, 
        type,
        isProduction,
        properties
      )}`;
    }).join(",\n  ")}
}`;
    let decl = runtimeDecls;
    if (props.withDefaultsAst && !props.defaults) {
      decl = `${_common.importHelperFn.call(void 0, 
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
    s.overwriteNode(emits.defineEmitsAst, `${_common.DEFINE_EMITS}(${runtimeDecls})`, {
      offset
    });
  }
}



exports.transformBetterDefine = transformBetterDefine;
