// src/core/index.ts
import {
  DEFINE_EMITS,
  generateTransform,
  isCallOf,
  isTs,
  isTypeOf,
  MagicStringAST,
  parseSFC,
  resolveObjectKey,
  walkAST
} from "@vue-macros/common";
function transformShortEmits(code, id) {
  const sfc = parseSFC(code, id);
  const { scriptSetup, lang, getSetupAst } = sfc;
  if (!scriptSetup || !isTs(lang)) return;
  const offset = scriptSetup.loc.start.offset;
  const ast = getSetupAst();
  const params = [];
  const s = new MagicStringAST(code);
  walkAST(ast, {
    enter(node) {
      if (isCallOf(node, DEFINE_EMITS) && node.typeParameters?.params?.[0]) {
        let param = node.typeParameters?.params?.[0];
        if (param.type === "TSTypeReference" && param.typeName.type === "Identifier" && ["SE", "ShortEmits"].includes(param.typeName.name) && param.typeParameters?.params[0]) {
          const inner = param.typeParameters?.params[0];
          s.remove(offset + param.start, offset + inner.start);
          s.remove(offset + inner.end, offset + param.end);
          param = inner;
        }
        params.push(param);
      }
    }
  });
  for (const param of params) {
    if (param.type !== "TSTypeLiteral") continue;
    for (const member of param.members) {
      if (!isTypeOf(member, ["TSPropertySignature", "TSMethodSignature"]))
        continue;
      const key = resolveObjectKey(member, true);
      let params2 = "";
      switch (member.type) {
        case "TSPropertySignature": {
          if (!member.typeAnnotation || !isTypeOf(member.typeAnnotation.typeAnnotation, [
            "TSTupleType",
            "TSFunctionType"
          ]))
            continue;
          switch (member.typeAnnotation.typeAnnotation.type) {
            case "TSTupleType":
              params2 = `...args: ${s.sliceNode(
                member.typeAnnotation.typeAnnotation,
                { offset }
              )}`;
              break;
            case "TSFunctionType":
              params2 = stringifyParams(
                member.typeAnnotation.typeAnnotation.parameters
              );
              break;
          }
          break;
        }
        case "TSMethodSignature": {
          params2 = stringifyParams(member.parameters);
          break;
        }
      }
      s.overwriteNode(
        member,
        `(evt: ${key}${params2 ? `, ${params2}` : ""}): void`,
        { offset }
      );
    }
  }
  return generateTransform(s, id);
  function stringifyParams(params2) {
    return params2.length > 0 ? s.sliceNode(params2, { offset }) : "";
  }
}

export {
  transformShortEmits
};
