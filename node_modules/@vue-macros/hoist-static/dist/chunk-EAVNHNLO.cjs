"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/index.ts





var _common = require('@vue-macros/common');


var _unplugin = require('unplugin');

// src/core/index.ts







var MAGIC_COMMENT = "hoist-static";
function transformHoistStatic(code, id) {
  function moveToScript(decl, prefix = "") {
    if (scriptOffset === void 0) scriptOffset = normalScript.start();
    const text = `
${prefix}${s.sliceNode(decl, { offset: setupOffset })}`;
    s.appendRight(scriptOffset, text);
    s.removeNode(decl, { offset: setupOffset });
  }
  const sfc = _common.parseSFC.call(void 0, code, id);
  const { scriptSetup, getSetupAst } = sfc;
  if (!scriptSetup) return;
  const setupOffset = scriptSetup.loc.start.offset;
  const setupOffsetEnd = scriptSetup.loc.end.offset;
  const s = new (0, _common.MagicStringAST)(code);
  const program = getSetupAst();
  let normalScript = _common.addNormalScript.call(void 0, sfc, s);
  let scriptOffset;
  for (const stmt of program.body) {
    if (stmt.type === "VariableDeclaration" && stmt.kind === "const") {
      const decls = stmt.declarations;
      let count = 0;
      for (const [i, decl] of decls.entries()) {
        if (!decl.init || !_common.isStaticExpression.call(void 0, decl.init, {
          unary: true,
          magicComment: MAGIC_COMMENT
        }))
          continue;
        count++;
        moveToScript(decl, "const ");
        if (decls.length > 1) {
          const isLast = i === decls.length - 1;
          const start = isLast ? decls[i - 1].end : decl.end;
          const end = isLast ? decl.start : decls[i + 1].start;
          s.remove(setupOffset + start, setupOffset + end);
        }
      }
      if (count === decls.length) {
        s.removeNode(stmt, { offset: setupOffset });
      }
    } else if (stmt.type === "TSEnumDeclaration") {
      const isAllConstant = stmt.members.every(
        (member) => !member.initializer || _common.isStaticExpression.call(void 0, member.initializer, {
          unary: true,
          magicComment: MAGIC_COMMENT
        })
      );
      if (!isAllConstant) continue;
      moveToScript(stmt);
    }
  }
  const restSetup = s.slice(setupOffset, setupOffsetEnd);
  if (restSetup.trim().length === 0) {
    s.appendLeft(setupOffsetEnd, "/* hoist static placeholder */");
  }
  if (scriptOffset !== void 0) normalScript.end();
  return _common.generateTransform.call(void 0, s, id);
}

// src/index.ts
function resolveOptions(options, framework) {
  const version = options.version || _common.detectVueVersion.call(void 0, );
  const include = _common.getFilterPattern.call(void 0, 
    [_common.FilterFileType.VUE_SFC_WITH_SETUP, _common.FilterFileType.SETUP_SFC],
    framework
  );
  return {
    include,
    ...options,
    version
  };
}
var name = "unplugin-vue-hoist-static";
var plugin = _unplugin.createUnplugin.call(void 0, 
  (userOptions = {}, { framework }) => {
    const options = resolveOptions(userOptions, framework);
    const filter = _common.createFilter.call(void 0, options);
    return {
      name,
      enforce: "pre",
      transformInclude: filter,
      transform: transformHoistStatic
    };
  }
);
var src_default = plugin;



exports.src_default = src_default;
