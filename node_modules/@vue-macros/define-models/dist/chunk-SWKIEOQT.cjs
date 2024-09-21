"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/helper/emit-helper.ts?raw
var emit_helper_default = "export default(emitFn,key,value,...args)=>{emitFn(key,value);return args.length>0?args[0]:value};\n";

// src/core/helper/use-vmodel.ts?raw
var use_vmodel_default = 'import{useVModel}from"@vueuse/core";import{getCurrentInstance}from"vue";export default(...keys)=>{const props=getCurrentInstance().proxy.$props;const ret=Object.create(null);for(const _k of keys){if(typeof _k==="string"){ret[_k]=useVModel(props,_k,void 0,{eventName:`update:${_k}`,passive:true})}else{const[key,prop=key,eventName=`update:${key}`,options={}]=_k;ret[key]=useVModel(props,prop,void 0,{eventName,passive:true,...options})}}return ret};\n';

// src/core/helper/index.ts
var _common = require('@vue-macros/common');
var helperPrefix = `${_common.VIRTUAL_ID_PREFIX}/define-models`;
var emitHelperId = `${helperPrefix}/emit-helper`;
var useVmodelHelperId = `${helperPrefix}/use-vmodel`;

// src/core/index.ts
















var _astwalkerscope = require('ast-walker-scope');
function transformDefineModels(code, id, version, unified) {
  let hasDefineProps = false;
  let hasDefineEmits = false;
  let hasDefineModels = false;
  let propsTypeDecl;
  let propsDestructureDecl;
  let emitsTypeDecl;
  let emitsIdentifier;
  let runtimeDefineFn;
  let modelDecl;
  let modelDeclKind;
  let modelTypeDecl;
  let modelIdentifier;
  let modelDestructureDecl;
  const modelIdentifiers = /* @__PURE__ */ new Set();
  const modelVue2 = { prop: "", event: "" };
  let mode;
  function processDefinePropsOrEmits(node, declId) {
    if (_common.isCallOf.call(void 0, node, _common.WITH_DEFAULTS)) {
      node = node.arguments[0];
    }
    let type;
    if (_common.isCallOf.call(void 0, node, _common.DEFINE_PROPS)) {
      type = "props";
    } else if (_common.isCallOf.call(void 0, node, _common.DEFINE_EMITS)) {
      type = "emits";
    } else {
      return false;
    }
    const fnName = type === "props" ? _common.DEFINE_PROPS : _common.DEFINE_EMITS;
    if (node.arguments[0]) {
      runtimeDefineFn = fnName;
      return false;
    }
    if (type === "props") hasDefineProps = true;
    else hasDefineEmits = true;
    const typeDecl = _optionalChain([node, 'access', _ => _.typeParameters, 'optionalAccess', _2 => _2.params, 'optionalAccess', _3 => _3[0]]);
    if (!typeDecl)
      throw new SyntaxError(
        `${fnName}() expected a type parameter when used with ${_common.DEFINE_MODELS}.`
      );
    if (type === "props") propsTypeDecl = typeDecl;
    else emitsTypeDecl = typeDecl;
    if (declId) {
      if (type === "props" && declId.type === "ObjectPattern") {
        propsDestructureDecl = declId;
      } else if (type === "emits" && declId.type === "Identifier") {
        emitsIdentifier = declId.name;
      }
    } else if (type === "emits") {
      emitsIdentifier = `_${_common.DEFINE_MODELS}_emit`;
      s.prependRight(setupOffset + node.start, `const ${emitsIdentifier} = `);
    }
    return true;
  }
  function processDefineModels(node, declId, kind) {
    if (_common.isCallOf.call(void 0, node, _common.DEFINE_MODELS)) mode = "runtime";
    else if (_common.isCallOf.call(void 0, node, _common.DEFINE_MODELS_DOLLAR)) mode = "reactivity-transform";
    else return false;
    if (hasDefineModels) {
      throw new SyntaxError(`duplicate ${_common.DEFINE_MODELS}() call`);
    }
    hasDefineModels = true;
    modelDecl = node;
    modelTypeDecl = _optionalChain([node, 'access', _4 => _4.typeParameters, 'optionalAccess', _5 => _5.params, 'access', _6 => _6[0]]);
    if (!modelTypeDecl) {
      throw new SyntaxError(`expected a type parameter for ${_common.DEFINE_MODELS}.`);
    }
    if (mode === "reactivity-transform" && declId) {
      const ids = _astwalkerscope.extractIdentifiers.call(void 0, declId);
      ids.forEach((id2) => modelIdentifiers.add(id2));
      if (declId.type === "ObjectPattern") {
        modelDestructureDecl = declId;
        for (const property of declId.properties) {
          if (property.type === "RestElement") {
            throw new SyntaxError("rest element is not supported");
          }
        }
      } else {
        modelIdentifier = scriptSetup.loc.source.slice(
          declId.start,
          declId.end
        );
      }
    }
    if (kind) modelDeclKind = kind;
    return true;
  }
  function processDefineOptions(node) {
    if (!_common.isCallOf.call(void 0, node, _common.DEFINE_OPTIONS)) return false;
    const [arg] = node.arguments;
    if (arg) processVue2Model(arg);
    return true;
  }
  function processVue2Script() {
    if (!script) return;
    const scriptAst = getScriptAst().body;
    if (scriptAst.length === 0) return;
    for (const node of scriptAst) {
      if (node.type === "ExportDefaultDeclaration") {
        const { declaration } = node;
        if (declaration.type === "ObjectExpression") {
          processVue2Model(declaration);
        } else if (declaration.type === "CallExpression" && declaration.callee.type === "Identifier" && ["defineComponent", "DO_defineComponent"].includes(
          declaration.callee.name
        )) {
          declaration.arguments.forEach((arg) => {
            if (arg.type === "ObjectExpression") {
              processVue2Model(arg);
            }
          });
        }
      }
    }
  }
  function processVue2Model(node) {
    if (node.type !== "ObjectExpression") return false;
    const model = node.properties.find(
      (prop) => prop.type === "ObjectProperty" && prop.key.type === "Identifier" && prop.key.name === "model" && prop.value.type === "ObjectExpression" && prop.value.properties.length === 2
    );
    if (!model) return false;
    model.value.properties.forEach((propertyItem) => {
      if (propertyItem.type === "ObjectProperty" && propertyItem.key.type === "Identifier" && propertyItem.value.type === "StringLiteral" && ["prop", "event"].includes(propertyItem.key.name)) {
        const key = propertyItem.key.name;
        modelVue2[key] = propertyItem.value.value;
      }
    });
    return true;
  }
  function extractPropsDefinitions(node) {
    const members = node.type === "TSTypeLiteral" ? node.members : node.body;
    const map2 = /* @__PURE__ */ Object.create(null);
    for (const m of members) {
      if ((m.type === "TSPropertySignature" || m.type === "TSMethodSignature") && m.key.type === "Identifier") {
        const type = _optionalChain([m, 'access', _7 => _7.typeAnnotation, 'optionalAccess', _8 => _8.typeAnnotation]);
        let typeAnnotation = "";
        let options;
        if (type) {
          typeAnnotation += `${m.optional ? "?" : ""}: `;
          if (type.type === "TSTypeReference" && type.typeName.type === "Identifier" && type.typeName.name === "ModelOptions" && _optionalChain([type, 'access', _9 => _9.typeParameters, 'optionalAccess', _10 => _10.type]) === "TSTypeParameterInstantiation" && type.typeParameters.params[0]) {
            typeAnnotation += setupContent.slice(
              type.typeParameters.params[0].start,
              type.typeParameters.params[0].end
            );
            if (_optionalChain([type, 'access', _11 => _11.typeParameters, 'access', _12 => _12.params, 'access', _13 => _13[1], 'optionalAccess', _14 => _14.type]) === "TSTypeLiteral") {
              options = /* @__PURE__ */ Object.create(null);
              for (const m2 of type.typeParameters.params[1].members) {
                if ((m2.type === "TSPropertySignature" || m2.type === "TSMethodSignature") && m2.key.type === "Identifier") {
                  const type2 = _optionalChain([m2, 'access', _15 => _15.typeAnnotation, 'optionalAccess', _16 => _16.typeAnnotation]);
                  if (type2)
                    options[setupContent.slice(m2.key.start, m2.key.end)] = setupContent.slice(type2.start, type2.end);
                }
              }
            }
          } else typeAnnotation += setupContent.slice(type.start, type.end);
        }
        map2[m.key.name] = { typeAnnotation, options };
      }
    }
    return map2;
  }
  function getPropKey(key, omitDefault = false) {
    if (unified && version === 2 && key === "modelValue") {
      return "value";
    }
    return !omitDefault ? key : void 0;
  }
  function getEventKey(key, omitDefault = false) {
    if (version === 2) {
      if (modelVue2.prop === key) {
        return modelVue2.event;
      } else if (key === "value" || unified && key === "modelValue") {
        return "input";
      }
    }
    return !omitDefault ? `update:${key}` : void 0;
  }
  function rewriteMacros() {
    rewriteDefines();
    if (mode === "runtime") {
      rewriteRuntime();
    }
    function rewriteDefines() {
      const propsText = Object.entries(map).map(
        ([key, { typeAnnotation }]) => `${getPropKey(key)}${typeAnnotation}`
      ).join(";\n");
      const emitsText = Object.entries(map).map(
        ([key, { typeAnnotation }]) => `(evt: '${getEventKey(key)}', value${typeAnnotation}): void;`
      ).join("\n  ");
      if (hasDefineProps) {
        s.overwriteNode(
          propsTypeDecl,
          `(${s.sliceNode(propsTypeDecl, {
            offset: setupOffset
          })}) & {
  ${propsText}
}`,
          { offset: setupOffset }
        );
        if (mode === "reactivity-transform" && propsDestructureDecl && modelDestructureDecl)
          for (const property of modelDestructureDecl.properties) {
            const text = code.slice(
              setupOffset + property.start,
              setupOffset + property.end
            );
            s.appendLeft(
              setupOffset + propsDestructureDecl.start + 1,
              `${text}, `
            );
          }
      } else {
        let text = "";
        const kind = modelDeclKind || "let";
        if (mode === "reactivity-transform") {
          if (modelIdentifier) {
            text = modelIdentifier;
          } else if (modelDestructureDecl) {
            text = code.slice(
              setupOffset + modelDestructureDecl.start,
              setupOffset + modelDestructureDecl.end
            );
          }
        }
        s.appendRight(
          setupOffset,
          `
${text ? `${kind} ${text} = ` : ""}defineProps<{
  ${propsText}
}>();`
        );
      }
      if (hasDefineEmits) {
        s.overwriteNode(
          emitsTypeDecl,
          `(${s.sliceNode(emitsTypeDecl, {
            offset: setupOffset
          })}) & {
  ${emitsText}
}`,
          { offset: setupOffset }
        );
      } else {
        emitsIdentifier = `${_common.HELPER_PREFIX}emit`;
        s.appendRight(
          setupOffset,
          `
${mode === "reactivity-transform" ? `const ${emitsIdentifier} = ` : ""}defineEmits<{
  ${emitsText}
}>();`
        );
      }
    }
  }
  function rewriteRuntime() {
    const text = `${_common.importHelperFn.call(void 0, 
      s,
      setupOffset,
      "useVModel",
      useVmodelHelperId,
      true
    )}(${Object.entries(map).map(([name, { options }]) => {
      const prop = getPropKey(name, true);
      const evt = getEventKey(name, true);
      if (!prop && !evt && !options) return stringifyValue(name);
      const args = [name, prop, evt].map((arg) => stringifyValue(arg));
      if (options) {
        const str = Object.entries(options).map(([k, v]) => `  ${stringifyValue(k)}: ${v}`).join(",\n");
        args.push(`{
${str}
}`);
      }
      return `[${args.join(", ")}]`;
    }).join(", ")})`;
    s.overwriteNode(modelDecl, text, { offset: setupOffset });
  }
  function processAssignModelVariable() {
    if (!emitsIdentifier)
      throw new Error(
        `Identifier of returning value of ${_common.DEFINE_EMITS} is not found, please report this issue.
${_common.REPO_ISSUE_URL}`
      );
    function overwrite(node, id2, value, original = false) {
      const eventName = aliasMap[id2.name];
      const content = `${_common.importHelperFn.call(void 0, 
        s,
        setupOffset,
        "emitHelper",
        emitHelperId,
        true
      )}(${emitsIdentifier}, '${getEventKey(String(eventName))}', ${value}${original ? `, ${id2.name}` : ""})`;
      s.overwriteNode(node, content, { offset: setupOffset });
    }
    _astwalkerscope.walkAST.call(void 0, setupAst, {
      leave(node) {
        if (node.type === "AssignmentExpression") {
          if (node.left.type !== "Identifier") return;
          const id2 = this.scope[node.left.name];
          if (!modelIdentifiers.has(id2)) return;
          const left = s.sliceNode(node.left, { offset: setupOffset });
          let right = s.sliceNode(node.right, { offset: setupOffset });
          if (node.operator !== "=") {
            right = `${left} ${node.operator.replace(/=$/, "")} ${right}`;
          }
          overwrite(node, id2, right);
        } else if (node.type === "UpdateExpression") {
          if (node.argument.type !== "Identifier") return;
          const id2 = this.scope[node.argument.name];
          if (!modelIdentifiers.has(id2)) return;
          let value = node.argument.name;
          if (node.operator === "++") value += " + 1";
          else value += " - 1";
          overwrite(node, id2, value, !node.prefix);
        }
      }
    });
  }
  if (!code.includes(_common.DEFINE_MODELS)) return;
  const { script, scriptSetup, getSetupAst, getScriptAst } = _common.parseSFC.call(void 0, code, id);
  if (!scriptSetup) return;
  const setupOffset = scriptSetup.loc.start.offset;
  const setupContent = scriptSetup.content;
  const setupAst = getSetupAst().body;
  const s = new (0, _common.MagicStringAST)(code);
  if (version === 2) processVue2Script();
  for (const node of setupAst) {
    if (node.type === "ExpressionStatement") {
      processDefinePropsOrEmits(node.expression);
      if (version === 2) {
        processDefineOptions(node.expression);
      }
      if (processDefineModels(node.expression) && mode === "reactivity-transform")
        s.remove(node.start + setupOffset, node.end + setupOffset);
    } else if (node.type === "VariableDeclaration" && !node.declare) {
      const total = node.declarations.length;
      let left = total;
      for (let i = 0; i < total; i++) {
        const decl = node.declarations[i];
        if (decl.init) {
          processDefinePropsOrEmits(decl.init, decl.id);
          if (processDefineModels(decl.init, decl.id, node.kind) && mode === "reactivity-transform") {
            if (left === 1) {
              s.remove(node.start + setupOffset, node.end + setupOffset);
            } else {
              let start = decl.start + setupOffset;
              let end = decl.end + setupOffset;
              if (i < total - 1) {
                end = node.declarations[i + 1].start + setupOffset;
              } else {
                start = node.declarations[i - 1].end + setupOffset;
              }
              s.remove(start, end);
              left--;
            }
          }
        }
      }
    }
  }
  if (!modelTypeDecl) return;
  if (runtimeDefineFn)
    throw new SyntaxError(
      `${runtimeDefineFn}() cannot accept non-type arguments when used with ${_common.DEFINE_MODELS}()`
    );
  if (modelTypeDecl.type !== "TSTypeLiteral") {
    throw new SyntaxError(
      `type argument passed to ${_common.DEFINE_MODELS}() must be a literal type, or a reference to an interface or literal type.`
    );
  }
  const map = extractPropsDefinitions(modelTypeDecl);
  const aliasMap = /* @__PURE__ */ Object.create(null);
  if (modelDestructureDecl)
    for (const p of modelDestructureDecl.properties) {
      if (p.type !== "ObjectProperty") continue;
      try {
        const key = _common.resolveObjectKey.call(void 0, p);
        if (p.value.type !== "Identifier") continue;
        aliasMap[p.value.name] = key;
      } catch (e) {
      }
    }
  rewriteMacros();
  if (mode === "reactivity-transform" && hasDefineModels)
    processAssignModelVariable();
  return _common.generateTransform.call(void 0, s, id);
}
function stringifyValue(value) {
  return value !== void 0 ? JSON.stringify(value) : "undefined";
}








exports.emit_helper_default = emit_helper_default; exports.use_vmodel_default = use_vmodel_default; exports.helperPrefix = helperPrefix; exports.emitHelperId = emitHelperId; exports.useVmodelHelperId = useVmodelHelperId; exports.transformDefineModels = transformDefineModels;
