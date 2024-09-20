// src/core/constants.ts
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
import {
  attachScopes,
  babelParse,
  DEFINE_SETUP_COMPONENT,
  generateTransform,
  getLang,
  HELPER_PREFIX,
  isCallOf,
  MagicStringAST,
  normalizePath,
  walkAST
} from "@vue-macros/common";
function scanSetupComponent(code, id) {
  let program;
  try {
    program = babelParse(code, getLang(id));
  } catch {
    return void 0;
  }
  const components = [];
  const imports = [];
  let scope = attachScopes(program, "scope");
  walkAST(program, {
    enter(node) {
      if (node.scope) scope = node.scope;
      const scopes = getScopeDecls(scope);
      if (isCallOf(node, DEFINE_SETUP_COMPONENT)) {
        components.push({
          fn: node,
          decl: node.arguments[0],
          scopes
        });
      } else if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && node.id.typeAnnotation?.type === "TSTypeAnnotation" && node.id.typeAnnotation.typeAnnotation.type === "TSTypeReference" && node.id.typeAnnotation.typeAnnotation.typeName.type === "Identifier" && node.id.typeAnnotation.typeAnnotation.typeName.name === SETUP_COMPONENT_TYPE && node.init) {
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
          `${DEFINE_SETUP_COMPONENT}: invalid setup component definition`
        );
      const body = decl?.body;
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
  const id = normalizePath(_id);
  const s = new MagicStringAST(code);
  const fileContext = scanSetupComponent(code, id);
  if (!fileContext) return;
  const { components } = fileContext;
  ctx[id] = fileContext;
  for (const [i, { node, scopes }] of components.entries()) {
    const importName = `${HELPER_PREFIX}setupComponent_${i}`;
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
  return generateTransform(s, id);
}
function loadSetupComponent(virtualId, ctx, root) {
  const index = +(SETUP_COMPONENT_ID_REGEX.exec(virtualId)?.[1] ?? -1);
  const id = virtualId.replace(SETUP_COMPONENT_ID_REGEX, "");
  const { components, imports } = ctx[id] || ctx[root + id] || {};
  const component = components[index];
  if (!component) return;
  const { body, scopes } = component;
  const lang = getLang(id);
  const s = new MagicStringAST(body);
  const program = babelParse(body, lang, {
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true
  });
  for (const stmt of program.body) {
    if (stmt.type !== "ReturnStatement" || !stmt.argument) continue;
    s.overwriteNode(stmt, `defineRender(${s.sliceNode(stmt.argument)});`);
  }
  const rootVars = Object.keys(
    attachScopes(program, "scope").declarations
  );
  s.prepend(
    `const { ${scopes.filter((name) => !rootVars.includes(name)).join(", ")} } = ${HELPER_PREFIX}ctx();
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
  if (!module?.id) return;
  const affectedModules = getSubModule(module);
  const normalizedId = normalizePath(file);
  const nodeContexts = scanSetupComponent(await read(), normalizedId);
  if (nodeContexts) ctx[normalizedId] = nodeContexts;
  return [...modules, ...affectedModules];
}
function transformPost(code, _id) {
  const s = new MagicStringAST(code);
  const id = normalizePath(_id);
  if (id.endsWith(".vue")) {
    return transformMainEntry();
  } else if (id.includes("type=script")) {
    return transformScript();
  }
  function transformMainEntry() {
    const program = babelParse(code, "js");
    walkAST(program, {
      enter(node, parent) {
        if (node.type === "ExportDefaultDeclaration" && node.declaration) {
          const exportDefault = node.declaration;
          s.prependLeft(
            exportDefault.leadingComments?.[0].start ?? exportDefault.start,
            "(ctx) => "
          );
        } else if (node.type === "Identifier" && node.name === "_sfc_main" && (parent?.type === "CallExpression" && parent.callee.type === "Identifier" && parent.callee.name === "_export_sfc" && node.name === "_sfc_main" || parent?.type === "ExportDefaultDeclaration")) {
          s.appendLeft(node.end, "(ctx)");
        }
      }
    });
    return generateTransform(s, id);
  }
  function transformScript() {
    const program = babelParse(code, getLang(id));
    walkAST(program, {
      enter(node) {
        if (node.type === "ExportDefaultDeclaration" && node.declaration) {
          const exportDefault = node.declaration;
          s.prependLeft(
            exportDefault.leadingComments?.[0].start ?? exportDefault.start,
            `(${HELPER_PREFIX}ctx) => `
          );
        }
      }
    });
    return generateTransform(s, id);
  }
}
function getScopeDecls(scope) {
  const scopes = /* @__PURE__ */ new Set();
  do {
    if (!scope?.declarations) continue;
    Object.keys(scope.declarations).forEach((name) => scopes.add(name));
  } while (scope = scope?.parent);
  return Array.from(scopes);
}

export {
  SETUP_COMPONENT_ID_SUFFIX,
  SETUP_COMPONENT_ID_REGEX,
  SETUP_COMPONENT_SUB_MODULE,
  SETUP_COMPONENT_TYPE,
  isSubModule,
  getMainModule,
  scanSetupComponent,
  transformSetupComponent,
  loadSetupComponent,
  hotUpdateSetupComponent,
  transformPost,
  getScopeDecls
};
