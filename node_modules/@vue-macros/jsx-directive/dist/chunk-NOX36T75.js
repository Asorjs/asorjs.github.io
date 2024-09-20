// src/core/index.ts
import {
  babelParse,
  generateTransform,
  getLang,
  MagicStringAST,
  walkAST
} from "@vue-macros/common";

// src/core/v-for.ts
import {
  HELPER_PREFIX,
  importHelperFn
} from "@vue-macros/common";
function resolveVFor(attribute, {
  s,
  version,
  vMemoAttribute
}) {
  if (attribute.value) {
    let item, index, objectIndex, list;
    if (attribute.value.type === "JSXExpressionContainer" && attribute.value.expression.type === "BinaryExpression") {
      if (attribute.value.expression.left.type === "SequenceExpression") {
        const expressions = attribute.value.expression.left.expressions;
        item = expressions[0] ? s.sliceNode(expressions[0]) : "";
        index = expressions[1] ? s.sliceNode(expressions[1]) : "";
        objectIndex = expressions[2] ? s.sliceNode(expressions[2]) : "";
      } else {
        item = s.sliceNode(attribute.value.expression.left);
      }
      list = s.sliceNode(attribute.value.expression.right);
    }
    if (item && list) {
      if (vMemoAttribute) {
        index ??= `${HELPER_PREFIX}index`;
      }
      const renderList = isVue2(version) ? "Array.from" : importHelperFn(
        s,
        0,
        "renderList",
        version ? "vue" : "@vue-macros/jsx-directive/helpers"
      );
      return `${renderList}(${list}, (${item}${index ? `, ${index}` : ""}${objectIndex ? `, ${objectIndex}` : ""}) => `;
    }
  }
  return "";
}
function transformVFor(nodes, s, version) {
  if (nodes.length === 0) return;
  nodes.forEach(({ node, attribute, parent, vMemoAttribute }) => {
    const hasScope = ["JSXElement", "JSXFragment"].includes(
      String(parent?.type)
    );
    s.appendLeft(
      node.start,
      `${hasScope ? "{" : ""}${resolveVFor(attribute, { s, version, vMemoAttribute })}`
    );
    const isTemplate = node.type === "JSXElement" && node.openingElement.name.type === "JSXIdentifier" && node.openingElement.name.name === "template";
    if (isTemplate && node.closingElement) {
      const content = isVue2(version) ? "span" : "";
      s.overwriteNode(node.openingElement.name, content);
      s.overwriteNode(node.closingElement.name, content);
    }
    s.prependRight(node.end, `)${hasScope ? "}" : ""}`);
    s.remove(attribute.start - 1, attribute.end);
  });
}

// src/core/v-html.ts
function transformVHtml(nodes, s, version) {
  nodes.forEach(({ attribute }) => {
    s.overwriteNode(
      attribute.name,
      isVue2(version) ? "domPropsInnerHTML" : "innerHTML"
    );
  });
}

// src/core/v-if.ts
function transformVIf(nodes, s, version) {
  nodes.forEach(({ node, attribute, parent }, index) => {
    const hasScope = ["JSXElement", "JSXFragment"].includes(
      String(parent?.type)
    );
    if (["v-if", "v-else-if"].includes(String(attribute.name.name))) {
      if (attribute.value)
        s.appendLeft(
          node.start,
          `${attribute.name.name === "v-if" && hasScope ? "{" : " "}(${s.slice(
            attribute.value.start + 1,
            attribute.value.end - 1
          )}) ? `
        );
      s.appendRight(
        node.end,
        String(nodes[index + 1]?.attribute.name.name).startsWith("v-else") ? " :" : ` : null${hasScope ? "}" : ""}`
      );
    } else if (attribute.name.name === "v-else") {
      s.appendRight(node.end, hasScope ? "}" : "");
    }
    const isTemplate = node.type === "JSXElement" && node.openingElement.name.type === "JSXIdentifier" && node.openingElement.name.name === "template";
    if (isTemplate && node.closingElement) {
      const content = isVue2(version) ? "span" : "";
      s.overwriteNode(node.openingElement.name, content);
      s.overwriteNode(node.closingElement.name, content);
    }
    s.remove(attribute.start - 1, attribute.end);
  });
}

// src/core/v-memo.ts
import {
  HELPER_PREFIX as HELPER_PREFIX2,
  importHelperFn as importHelperFn2
} from "@vue-macros/common";
function transformVMemo(nodes, s, version) {
  if (nodes.length === 0) return;
  const withMemo = importHelperFn2(
    s,
    0,
    "withMemo",
    version ? "vue" : "@vue-macros/jsx-directive/helpers"
  );
  s.prependRight(0, `const ${HELPER_PREFIX2}cache = [];`);
  nodes.forEach(({ node, attribute, parent, vForAttribute }, nodeIndex) => {
    const hasScope = ["JSXElement", "JSXFragment"].includes(
      String(parent?.type)
    );
    s.appendLeft(
      node.start,
      `${hasScope ? "{" : ""}${withMemo}(${attribute.value ? s.slice(attribute.value.start + 1, attribute.value.end - 1) : `[]`}, () => `
    );
    let index = String(nodeIndex);
    let cache = `${HELPER_PREFIX2}cache`;
    let vForIndex = `${HELPER_PREFIX2}index`;
    if (vForAttribute?.value?.type === "JSXExpressionContainer") {
      if (vForAttribute.value.expression.type === "BinaryExpression" && vForAttribute.value.expression.left.type === "SequenceExpression" && vForAttribute.value.expression.left.expressions[1].type === "Identifier")
        vForIndex = vForAttribute.value.expression.left.expressions[1].name;
      cache += `[${index}]`;
      s.appendRight(0, `${cache} = [];`);
      index += ` + ${vForIndex} + 1`;
    }
    s.prependRight(node.end, `, ${cache}, ${index})${hasScope ? "}" : ""}`);
    s.remove(attribute.start - 1, attribute.end);
  });
}

// src/core/v-model.ts
import { importHelperFn as importHelperFn3 } from "@vue-macros/common";
function transformVModel(attribute, s, version) {
  if (attribute.name.type === "JSXNamespacedName" && attribute.value?.type === "JSXExpressionContainer") {
    const matched = attribute.name.name.name.match(/^\$(.*)\$(?:_(.*))?/);
    if (!matched) return;
    let [, argument, modifiers] = matched;
    const value = s.sliceNode(attribute.value.expression);
    argument = `${importHelperFn3(s, 0, "unref", version ? "vue" : "@vue-macros/jsx-directive/helpers")}(${argument})`;
    modifiers = modifiers ? `, [${argument} + "Modifiers"]: { ${modifiers.split("_").map((key) => `${key}: true`).join(", ")} }` : "";
    s.overwriteNode(
      attribute,
      `{...{[${argument}]: ${value}, ["onUpdate:" + ${argument}]: $event => ${value} = $event${modifiers}}}`
    );
  }
}

// src/core/v-on.ts
import {
  HELPER_PREFIX as HELPER_PREFIX3,
  importHelperFn as importHelperFn4
} from "@vue-macros/common";
function transformVOn(nodes, s, version) {
  if (nodes.length > 0 && !isVue2(version))
    s.prependRight(
      0,
      `const ${HELPER_PREFIX3}transformVOn = (obj) => Object.entries(obj).reduce((res, [key, value]) => (res['on' + key[0].toUpperCase() + key.slice(1)] = value, res), {});`
    );
  nodes.forEach(({ attribute }) => {
    if (isVue2(version)) {
      s.remove(attribute.start, attribute.start + 2);
      return;
    }
    s.overwriteNode(
      attribute,
      `{...${HELPER_PREFIX3}transformVOn(${s.slice(
        attribute.value.start + 1,
        attribute.value.end - 1
      )})}`
    );
  });
}
function transformVOnWithModifiers(nodes, s, version) {
  nodes.forEach(({ attribute }) => {
    const attributeName = attribute.name.name.toString();
    if (isVue2(version)) {
      s.overwrite(
        attribute.name.start,
        attribute.name.start + 3,
        `v-on:${attributeName[2].toLowerCase()}`
      );
      if (!attribute.value) s.appendRight(attribute.name.end, "={() => {}}");
      return;
    }
    let [name, ...modifiers] = attributeName.split("_");
    const withModifiersOrKeys = importHelperFn4(
      s,
      0,
      isKeyboardEvent(name) ? "withKeys" : "withModifiers",
      version ? "vue" : "@vue-macros/jsx-directive/helpers"
    );
    modifiers = modifiers.filter((modifier) => {
      if (modifier === "capture") {
        s.appendRight(
          attribute.name.end,
          modifier[0].toUpperCase() + modifier.slice(1)
        );
        return false;
      } else {
        return true;
      }
    });
    const result = `, [${modifiers.map((modifier) => `'${modifier}'`)}])`;
    if (attribute.value?.type === "JSXExpressionContainer") {
      s.appendRight(
        attribute.value.expression.start,
        `${withModifiersOrKeys}(`
      );
      s.appendLeft(attribute.value.expression.end, result);
    } else {
      s.appendRight(
        attribute.name.end,
        `={${withModifiersOrKeys}(() => {}${result}}`
      );
    }
    s.remove(attribute.name.start + name.length, attribute.name.end);
  });
}
function isKeyboardEvent(value) {
  return ["onKeyup", "onKeydown", "onKeypress"].includes(value);
}

// src/core/v-slot.ts
import { importHelperFn as importHelperFn5 } from "@vue-macros/common";
function transformVSlot(nodeMap, s, version) {
  Array.from(nodeMap).reverse().forEach(([node, { attributeMap, vSlotAttribute }]) => {
    const result = [` ${isVue2(version) ? "scopedSlots" : "vSlots"}={{`];
    const attributes = Array.from(attributeMap);
    attributes.forEach(
      ([attribute, { children, vIfAttribute, vForAttribute }], index) => {
        if (!attribute) return;
        if (vIfAttribute) {
          if ("v-if" === vIfAttribute.name.name) {
            result.push("...");
          }
          if (["v-if", "v-else-if"].includes(String(vIfAttribute.name.name)) && vIfAttribute.value?.type === "JSXExpressionContainer") {
            result.push(`(${s.sliceNode(vIfAttribute.value.expression)}) ? {`);
          } else if ("v-else" === vIfAttribute.name.name) {
            result.push("{");
          }
        }
        if (vForAttribute) {
          result.push(
            "...Object.fromEntries(",
            resolveVFor(vForAttribute, { s, version }),
            "(["
          );
        }
        let isDynamic = false;
        let attributeName = attribute.name.type === "JSXNamespacedName" ? attribute.name.name.name : "default";
        attributeName = attributeName.replace(/\$(.*)\$/, (_, $1) => {
          isDynamic = true;
          return $1;
        });
        result.push(
          isDynamic ? `[${importHelperFn5(s, 0, "unref", version ? "vue" : "@vue-macros/jsx-directive/helpers")}(${attributeName})]` : `'${attributeName}'`,
          vForAttribute ? ", " : ": ",
          "(",
          attribute.value && attribute.value.type === "JSXExpressionContainer" ? s.sliceNode(attribute.value.expression) : "",
          ") => ",
          isVue2(version) ? "<span>" : "<>",
          children.map((child) => {
            const str = s.sliceNode(
              child.type === "JSXElement" && s.sliceNode(child.openingElement.name) === "template" ? child.children : child
            );
            s.removeNode(child);
            return str;
          }).join("") || " ",
          isVue2(version) ? "</span>," : "</>,"
        );
        if (vForAttribute) {
          result.push("]))),");
        }
        if (vIfAttribute) {
          if (["v-if", "v-else-if"].includes(String(vIfAttribute.name.name))) {
            const nextIndex = index + (attributes[index + 1]?.[0] ? 1 : 2);
            result.push(
              "}",
              String(
                attributes[nextIndex]?.[1].vIfAttribute?.name.name
              ).startsWith("v-else") ? " : " : " : null,"
            );
          } else if ("v-else" === vIfAttribute.name.name) {
            result.push("},");
          }
        }
      }
    );
    if (attributeMap.has(null)) {
      result.push(`default: () => ${isVue2(version) ? "<span>" : "<>"}`);
    } else {
      result.push("}}");
    }
    if (vSlotAttribute) {
      s.overwriteNode(vSlotAttribute, result.join(""));
    } else if (node?.type === "JSXElement") {
      s.overwrite(
        node.openingElement.end - 1,
        node.openingElement.end,
        result.join("")
      );
      s.appendLeft(
        node.closingElement.start,
        attributeMap.has(null) ? `${isVue2(version) ? "</span>" : "</>"}}}>` : ">"
      );
    }
  });
}

// src/core/index.ts
function transformJsxDirective(code, id, version) {
  const lang = getLang(id);
  if (!["jsx", "tsx"].includes(lang)) return;
  const s = new MagicStringAST(code);
  const vIfMap = /* @__PURE__ */ new Map();
  const vForNodes = [];
  const vMemoNodes = [];
  const vHtmlNodes = [];
  const vSlotMap = /* @__PURE__ */ new Map();
  const vOnNodes = [];
  const vOnWithModifiers = [];
  walkAST(babelParse(code, lang), {
    enter(node, parent) {
      if (node.type !== "JSXElement") return;
      const tagName = s.sliceNode(node.openingElement.name);
      let vIfAttribute;
      let vForAttribute;
      let vMemoAttribute;
      let vSlotAttribute;
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type !== "JSXAttribute") continue;
        if (["v-if", "v-else-if", "v-else"].includes(String(attribute.name.name))) {
          vIfAttribute = attribute;
        } else if (attribute.name.name === "v-for") {
          vForAttribute = attribute;
        } else if (["v-memo", "v-once"].includes(String(attribute.name.name))) {
          vMemoAttribute = attribute;
        } else if (attribute.name.name === "v-html") {
          vHtmlNodes.push({
            node,
            attribute
          });
        } else if ((attribute.name.type === "JSXNamespacedName" ? attribute.name.namespace : attribute.name).name === "v-slot") {
          vSlotAttribute = attribute;
        } else if (attribute.name.name === "v-on") {
          vOnNodes.push({
            node,
            attribute
          });
        } else if (/^on[A-Z]\S*_\S+/.test(String(attribute.name.name))) {
          vOnWithModifiers.push({
            node,
            attribute
          });
        } else if (attribute.name.type === "JSXNamespacedName" && attribute.name.namespace.name === "v-model") {
          transformVModel(attribute, s, version);
        }
      }
      if (!(vSlotAttribute && tagName === "template")) {
        if (vIfAttribute) {
          vIfMap.get(parent) || vIfMap.set(parent, []);
          vIfMap.get(parent).push({
            node,
            attribute: vIfAttribute,
            parent
          });
        }
        if (vForAttribute) {
          vForNodes.push({
            node,
            attribute: vForAttribute,
            parent: vIfAttribute ? void 0 : parent,
            vMemoAttribute
          });
        }
      }
      if (vMemoAttribute) {
        vMemoNodes.push({
          node,
          attribute: vMemoAttribute,
          parent: vForAttribute || vIfAttribute ? void 0 : parent,
          vForAttribute
        });
      }
      if (vSlotAttribute) {
        const slotNode = tagName === "template" ? parent : node;
        if (slotNode?.type !== "JSXElement") return;
        const attributeMap = vSlotMap.get(slotNode)?.attributeMap || vSlotMap.set(slotNode, {
          vSlotAttribute: tagName !== "template" ? vSlotAttribute : void 0,
          attributeMap: /* @__PURE__ */ new Map()
        }).get(slotNode).attributeMap;
        const children = attributeMap.get(vSlotAttribute)?.children || attributeMap.set(vSlotAttribute, {
          children: [],
          ...tagName === "template" ? {
            vIfAttribute,
            vForAttribute
          } : {}
        }).get(vSlotAttribute).children;
        if (slotNode === parent) {
          children.push(node);
          if (attributeMap.get(null)) return;
          for (const child of parent.children) {
            if (child.type === "JSXElement" && s.sliceNode(child.openingElement.name) === "template" || child.type === "JSXText" && !s.sliceNode(child).trim())
              continue;
            const defaultNodes = attributeMap.get(null)?.children || attributeMap.set(null, { children: [] }).get(null).children;
            defaultNodes.push(child);
          }
        } else {
          children.push(...node.children);
        }
      }
    }
  });
  vIfMap.forEach((nodes) => transformVIf(nodes, s, version));
  transformVFor(vForNodes, s, version);
  if (!version || version >= 3.2) transformVMemo(vMemoNodes, s, version);
  transformVHtml(vHtmlNodes, s, version);
  transformVOn(vOnNodes, s, version);
  transformVOnWithModifiers(vOnWithModifiers, s, version);
  transformVSlot(vSlotMap, s, version);
  return generateTransform(s, id);
}
function isVue2(version) {
  return version >= 2 && version < 3;
}

export {
  transformJsxDirective,
  isVue2
};
