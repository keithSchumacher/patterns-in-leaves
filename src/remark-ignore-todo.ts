import { visit } from "unist-util-visit";
import type { Root, Node, Parent } from "mdast";

// Custom remark plugin to remove TODO items (ie GitHub Flavored Markdown task lists)
export default function remarkIgnoreTODO() {
  return function (tree: Root) {
    visit(tree, "listItem", visitor, true); // Reverse traversal
  };

  // Visitor function to handle each list item
  function visitor(
    node: ListItemGfm,
    index: number | undefined,
    parent: Parent | undefined
  ) {
    if (node.type === "listItem" && node.checked !== null) {
      if (parent && typeof index === "number") {
        parent.children.splice(index, 1); // Remove the node
        return index; // Return the new index to adjust the visitor
      }
    }
  }

  // Extending the ListItem type for GitHub Flavored Markdown (GFM) specifics
  interface ListItemGfm extends Node {
    checked?: boolean | null; // Optional boolean to indicate checked state
  }

  // Additional context for ListItemGFM
  // See: https://github.com/syntax-tree/mdast?tab=readme#listitem-gfm
  // In GFM, a todo item is converted into a 'checked' property on the ListItem
}
