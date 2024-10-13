"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/core/constants.ts
var QUERY_NAMED_TEMPLATE = "?vue&type=named-template";
var QUERY_TEMPLATE = "type=template&namedTemplate";
var QUERY_TEMPLATE_MAIN = `${QUERY_TEMPLATE}&mainTemplate`;
var MAIN_TEMPLATE = Symbol();

// src/core/utils.ts
function getChildrenLocation(node) {
  if (node.children.length > 0) {
    const lastChild = node.children.at(-1);
    return [node.children[0].loc.start.offset, lastChild.loc.end.offset];
  } else {
    return void 0;
  }
}
function parseVueRequest(id) {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query = Object.fromEntries(new URLSearchParams(rawQuery));
  if (query.vue != null) {
    query.vue = true;
  }
  if (query.index != null) {
    query.index = Number(query.index);
  }
  if (query.raw != null) {
    query.raw = true;
  }
  if (query.url != null) {
    query.url = true;
  }
  if (query.scoped != null) {
    query.scoped = true;
  }
  return {
    filename,
    query
  };
}

// src/core/index.ts









var _common = require('@vue-macros/common');




var _compilerdom = require('@vue/compiler-dom');
function transformTemplateIs(s) {
  return (node) => {
    if (!(node.type === 1 && node.tag === "template"))
      return;
    const propIs = node.props.find(
      (prop) => prop.type === 6 && prop.name === "is"
    );
    if (!_optionalChain([propIs, 'optionalAccess', _ => _.value])) return;
    const refName = propIs.value.content;
    s.overwrite(
      node.loc.start.offset,
      node.loc.end.offset,
      `<component is="named-template-${refName}" />`
    );
  };
}
function preTransform(code, id, templateContent) {
  const root = _compilerdom.parse.call(void 0, code);
  const templates = root.children.filter(
    (node) => node.type === 1 && node.tag === "template"
  );
  if (templates.length <= 1) return;
  const s = new (0, _common.MagicStringAST)(code);
  for (const node of templates) {
    const propName = node.props.find(
      (prop) => prop.type === 6 && prop.name === "name"
    );
    if (!propName) {
      preTransformMainTemplate({ s, root, node, id, templateContent });
      continue;
    } else if (!propName.value) {
      continue;
    }
    const name = propName.value.content;
    let template = "";
    const templateLoc = getChildrenLocation(node);
    if (templateLoc) {
      template = s.slice(...templateLoc);
    }
    if (!templateContent[id]) templateContent[id] = /* @__PURE__ */ Object.create(null);
    templateContent[id][name] = template;
    s.appendLeft(node.loc.start.offset, `<named-template name="${name}">`);
    s.appendLeft(node.loc.end.offset, "</named-template>");
  }
  return _common.generateTransform.call(void 0, s, id);
}
function preTransformMainTemplate({
  s,
  root,
  node,
  id,
  templateContent
}) {
  const ctx = _compilerdom.createTransformContext.call(void 0, root, {
    filename: id,
    nodeTransforms: [transformTemplateIs(s)]
  });
  _compilerdom.traverseNode.call(void 0, node, ctx);
  const loc = getChildrenLocation(node);
  if (!loc) return;
  if (!templateContent[id]) templateContent[id] = /* @__PURE__ */ Object.create(null);
  templateContent[id][MAIN_TEMPLATE] = s.slice(...loc);
  s.remove(...loc);
  const offset = node.loc.start.offset + 1 + node.tag.length;
  s.appendLeft(offset, ` src="${`${id}?vue&${QUERY_TEMPLATE_MAIN}`}"`);
}
function postTransform(code, id, customBlocks) {
  const lang = _common.getLang.call(void 0, id);
  const program = _common.babelParse.call(void 0, code, lang);
  const { filename } = parseVueRequest(id);
  if (!id.includes(QUERY_TEMPLATE_MAIN)) {
    postTransformMainEntry(program, filename, customBlocks);
    return;
  }
  const s = new (0, _common.MagicStringAST)(code);
  const subTemplates = [];
  for (const node of program.body) {
    if (node.type === "ExportNamedDeclaration" && _optionalChain([node, 'access', _2 => _2.declaration, 'optionalAccess', _3 => _3.type]) === "FunctionDeclaration" && _optionalChain([node, 'access', _4 => _4.declaration, 'access', _5 => _5.id, 'optionalAccess', _6 => _6.name]) === "render") {
      const params = node.declaration.params;
      if (params.length > 0) {
        const lastParams = params[node.declaration.params.length - 1];
        const loc = [params[0].start, lastParams.end];
        const paramsText = s.slice(...loc);
        s.overwrite(...loc, "...args");
        s.appendLeft(
          node.declaration.body.start + 1,
          `
 let [${paramsText}] = args`
        );
      }
    }
  }
  _common.walkAST.call(void 0, program, {
    enter(node) {
      if (_common.isCallOf.call(void 0, node, ["_createVNode", "_createBlock"]) && _common.isCallOf.call(void 0, node.arguments[0], "_resolveDynamicComponent") && node.arguments[0].arguments[0].type === "StringLiteral" && node.arguments[0].arguments[0].value.startsWith("named-template-")) {
        subTemplates.push({
          vnode: node,
          component: node.arguments[0],
          name: node.arguments[0].arguments[0].value.replace(
            "named-template-",
            ""
          ),
          fnName: node.callee.name
        });
      }
    }
  });
  if (subTemplates.length === 0) return;
  for (const { vnode, component, name, fnName } of subTemplates) {
    const block = _optionalChain([customBlocks, 'access', _7 => _7[filename], 'optionalAccess', _8 => _8[name]]);
    if (!block) throw new SyntaxError(`Unknown named template: ${name}`);
    const render = `${_common.HELPER_PREFIX}block_${escapeTemplateName(
      name
    )}.render(...args)`;
    if (fnName === "_createVNode") {
      s.overwriteNode(vnode, render);
    } else if (fnName === "_createBlock") {
      s.overwriteNode(component, _common.importHelperFn.call(void 0, s, 0, "Fragment"));
      const text = `${vnode.arguments[1] ? "" : ", null"}, [${render}]`;
      s.appendLeft((vnode.arguments[1] || vnode.arguments[0]).end, text);
    }
  }
  for (const [name, source] of Object.entries(customBlocks[filename])) {
    s.prepend(
      `import ${_common.HELPER_PREFIX}block_${escapeTemplateName(
        name
      )} from ${JSON.stringify(source)};
`
    );
  }
  return _common.generateTransform.call(void 0, s, id);
}
function postTransformMainEntry(program, id, customBlocks) {
  for (const node of program.body) {
    if (node.type === "ImportDeclaration" && node.source.value.includes(QUERY_NAMED_TEMPLATE)) {
      const { name } = parseVueRequest(node.source.value).query;
      if (!customBlocks[id]) customBlocks[id] = /* @__PURE__ */ Object.create(null);
      customBlocks[id][name] = node.source.value;
    }
  }
}
function escapeTemplateName(name) {
  return name.replaceAll("-", "$DASH");
}













exports.QUERY_NAMED_TEMPLATE = QUERY_NAMED_TEMPLATE; exports.QUERY_TEMPLATE = QUERY_TEMPLATE; exports.QUERY_TEMPLATE_MAIN = QUERY_TEMPLATE_MAIN; exports.MAIN_TEMPLATE = MAIN_TEMPLATE; exports.getChildrenLocation = getChildrenLocation; exports.parseVueRequest = parseVueRequest; exports.transformTemplateIs = transformTemplateIs; exports.preTransform = preTransform; exports.preTransformMainTemplate = preTransformMainTemplate; exports.postTransform = postTransform; exports.postTransformMainEntry = postTransformMainEntry;
