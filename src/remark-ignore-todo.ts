// Import the necessary modules and types from unified, remark-parse, and remark-stringify
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

// https://github.com/syntax-tree/mdast?tab=readme-ov-file#listitem-gfm
// When using GFM, the todo item gets converted into a 'checked' property on the ListItem
// So removing TODOs, requires checking this attribute because '[ ]' will not appear in the text.

// Define the custom remark plugin for increasing headings
export default function remarkIgnoreTODO() {
  return function (tree: Root) {
    visit(tree, "list", (node, index, parent) => {
      node.children.forEach((listItem, listIndex) => {
        if (listItem.checked !== null) {
          parent?.children.splice(index, 1); // Remove the node from its parent
        }
      });
    });
  };
}
