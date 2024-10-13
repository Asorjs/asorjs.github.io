"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/constants.ts
var SETUP_COMPONENT_ID_SUFFIX = "-setup-component-";
var SETUP_COMPONENT_ID_REGEX = /-setup-component-(\d+).vue$/;
var SETUP_COMPONENT_SUB_MODULE = /-setup-component-(\d+).vue.*/;
var SETUP_COMPONENT_TYPE = "SetupFC";

// src/core/sub-module.ts
function isSubModule(id) {
  return SETUP_COMPONENT_SUB_MODULE.test(id);
}
function getMainModule(subModule, root) {
  return root + subModule.replace(SETUP_COMPONENT_SUB_MODULE, "");
}

// src/core/index.ts











var _common = require('@vue-macros/common');
function scanSetupComponent(code, id) {
  let program;
  try {
    program = _common.babelParse.call(void 0, code, _common.getLang.call(void 0, id));
  } catch (e) {
    return void 0;
  }
  const components = [];
  const imports = [];
  let scope = _common.attachScopes.call(void 0, program, "scope");
  _common.walkAST.call(void 0, program, {
    enter(node) {
      if (node.scope) scope = node.scope;
      const scopes = getScopeDecls(scope);
      if (_common.isCallOf.call(void 0, node, _common.DEFINE_SETUP_COMPONENT)) {
        components.push({
          fn: node,
          decl: node.arguments[0],
          scopes
        });
      } else if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && _optionalChain([node, 'access', _ => _.id, 'access', _2 => _2.typeAnnotation, 'optionalAccess', _3 => _3.type]) === "TSTypeAnnotation" && node.id.typeAnnotation.typeAnnotation.type === "TSTypeReference" && node.id.typeAnnotation.typeAnnotation.typeName.type === "Identifier" && node.id.typeAnnotation.typeAnnotation.typeName.name === SETUP_COMPONENT_TYPE && node.init) {
        components.push({
          decl: node.init,
          scopes
        });
      } else if (node.type === "ImportDeclaration") {
        imports.push(code.slice(node.start, node.end));
      }
    },
    leave(node) {
      if (node.scope) scope = scope.parent;
    }
  });
  const ctxComponents = components.map(
    ({ decl, fn, scopes }) => {
      if (!["FunctionExpression", "ArrowFunctionExpression"].includes(decl.type))
        throw new SyntaxError(
          `${_common.DEFINE_SETUP_COMPONENT}: invalid setup component definition`
        );
      const body = _optionalChain([decl, 'optionalAccess', _4 => _4.body]);
      let bodyStart = body.start;
      let bodyEnd = body.end;
      if (body.type === "BlockStatement") {
        bodyStart++;
        bodyEnd--;
      }
      return {
        code: code.slice(decl.start, decl.end),
        body: code.slice(bodyStart, bodyEnd),
        node: fn || decl,
        scopes
      };
    }
  );
  return {
    components: ctxComponents,
    imports
  };
}
function transformSetupComponent(code, _id, ctx) {
  const id = _common.normalizePath.call(void 0, _id);
  const s = new (0, _common.MagicStringAST)(code);
  const fileContext = scanSetupComponent(code, id);
  if (!fileContext) return;
  const { components } = fileContext;
  ctx[id] = fileContext;
  for (const [i, { node, scopes }] of components.entries()) {
    const importName = `${_common.HELPER_PREFIX}setupComponent_${i}`;
    s.overwrite(
      node.start,
      node.end,
      `${importName}(() => ({ ${scopes.join(", ")} }))`
    );
    s.prepend(
      `import ${importName} from '${id}${SETUP_COMPONENT_ID_SUFFIX}${i}.vue'
`
    );
  }
  return _common.generateTransform.call(void 0, s, id);
}
function loadSetupComponent(virtualId, ctx, root) {
  const index = +(_nullishCoalesce(_optionalChain([SETUP_COMPONENT_ID_REGEX, 'access', _5 => _5.exec, 'call', _6 => _6(virtualId), 'optionalAccess', _7 => _7[1]]), () => ( -1)));
  const id = virtualId.replace(SETUP_COMPONENT_ID_REGEX, "");
  const { components, imports } = ctx[id] || ctx[root + id] || {};
  const component = components[index];
  if (!component) return;
  const { body, scopes } = component;
  const lang = _common.getLang.call(void 0, id);
  const s = new (0, _common.MagicStringAST)(body);
  const program = _common.babelParse.call(void 0, body, lang, {
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true
  });
  for (const stmt of program.body) {
    if (stmt.type !== "ReturnStatement" || !stmt.argument) continue;
    s.overwriteNode(stmt, `defineRender(${s.sliceNode(stmt.argument)});`);
  }
  const rootVars = Object.keys(
    _common.attachScopes.call(void 0, program, "scope").declarations
  );
  s.prepend(
    `const { ${scopes.filter((name) => !rootVars.includes(name)).join(", ")} } = ${_common.HELPER_PREFIX}ctx();
`
  );
  for (const i of imports) s.prepend(`${i}
`);
  s.prepend(`<script setup${lang ? ` lang="${lang}"` : ""}>
`);
  s.append(`</script>`);
  return s.toString();
}
async function hotUpdateSetupComponent({ file, modules, read }, ctx) {
  const getSubModule = (module2) => {
    const importedModules = Array.from(module2.importedModules);
    if (importedModules.length === 0) return [];
    return importedModules.filter(({ id }) => id && isSubModule(id)).flatMap((module3) => [module3, ...getSubModule(module3)]);
  };
  const module = modules.find((mod) => mod.file === file);
  if (!_optionalChain([module, 'optionalAccess', _8 => _8.id])) return;
  const affectedModules = getSubModule(module);
  const normalizedId = _common.normalizePath.call(void 0, file);
  const nodeContexts = scanSetupComponent(await read(), normalizedId);
  if (nodeContexts) ctx[normalizedId] = nodeContexts;
  return [...modules, ...affectedModules];
}
function transformPost(code, _id) {
  const s = new (0, _common.MagicStringAST)(code);
  const id = _common.normalizePath.call(void 0, _id);
  if (id.endsWith(".vue")) {
    return transformMainEntry();
  } else if (id.includes("type=script")) {
    return transformScript();
  }
  function transformMainEntry() {
    const program = _common.babelParse.call(void 0, code, "js");
    _common.walkAST.call(void 0, program, {
      enter(node, parent) {
        if (node.type === "ExportDefaultDeclaration" && node.declaration) {
          const exportDefault = node.declaration;
          s.prependLeft(
            _nullishCoalesce(_optionalChain([exportDefault, 'access', _9 => _9.leadingComments, 'optionalAccess', _10 => _10[0], 'access', _11 => _11.start]), () => ( exportDefault.start)),
            "(ctx) => "
          );
        } else if (node.type === "Identifier" && node.name === "_sfc_main" && (_optionalChain([parent, 'optionalAccess', _12 => _12.type]) === "CallExpression" && parent.callee.type === "Identifier" && parent.callee.name === "_export_sfc" && node.name === "_sfc_main" || _optionalChain([parent, 'optionalAccess', _13 => _13.type]) === "ExportDefaultDeclaration")) {
          s.appendLeft(node.end, "(ctx)");
        }
      }
    });
    return _common.generateTransform.call(void 0, s, id);
  }
  function transformScript() {
    const program = _common.babelParse.call(void 0, code, _common.getLang.call(void 0, id));
    _common.walkAST.call(void 0, program, {
      enter(node) {
        if (node.type === "ExportDefaultDeclaration" && node.declaration) {
          const exportDefault = node.declaration;
          s.prependLeft(
            _nullishCoalesce(_optionalChain([exportDefault, 'access', _14 => _14.leadingComments, 'optionalAccess', _15 => _15[0], 'access', _16 => _16.start]), () => ( exportDefault.start)),
            `(${_common.HELPER_PREFIX}ctx) => `
          );
        }
      }
    });
    return _common.generateTransform.call(void 0, s, id);
  }
}
function getScopeDecls(scope) {
  const scopes = /* @__PURE__ */ new Set();
  do {
    if (!_optionalChain([scope, 'optionalAccess', _17 => _17.declarations])) continue;
    Object.keys(scope.declarations).forEach((name) => scopes.add(name));
  } while (scope = _optionalChain([scope, 'optionalAccess', _18 => _18.parent]));
  return Array.from(scopes);
}














exports.SETUP_COMPONENT_ID_SUFFIX = SETUP_COMPONENT_ID_SUFFIX; exports.SETUP_COMPONENT_ID_REGEX = SETUP_COMPONENT_ID_REGEX; exports.SETUP_COMPONENT_SUB_MODULE = SETUP_COMPONENT_SUB_MODULE; exports.SETUP_COMPONENT_TYPE = SETUP_COMPONENT_TYPE; exports.isSubModule = isSubModule; exports.getMainModule = getMainModule; exports.scanSetupComponent = scanSetupComponent; exports.transformSetupComponent = transformSetupComponent; exports.loadSetupComponent = loadSetupComponent; exports.hotUpdateSetupComponent = hotUpdateSetupComponent; exports.transformPost = transformPost; exports.getScopeDecls = getScopeDecls;
