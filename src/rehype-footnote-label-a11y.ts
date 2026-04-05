import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * GFM injects `<h2 id="footnote-label">` inside `section.footnotes`, which
 * duplicates a manual `## Footnotes` in the Markdown. Replace that heading with
 * a visually hidden `<span id="footnote-label">` so `aria-describedby` on
 * footnote refs still resolves.
 */
export default function rehypeFootnoteLabelA11y() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "section") return;
      const cls = node.properties?.className;
      const isFootnotes =
        Array.isArray(cls) && cls.includes("footnotes");
      if (!isFootnotes) return;

      const first = node.children[0];
      if (
        !first ||
        first.type !== "element" ||
        first.tagName !== "h2" ||
        first.properties?.id !== "footnote-label"
      ) {
        return;
      }

      const span: Element = {
        type: "element",
        tagName: "span",
        properties: {
          id: "footnote-label",
          className: ["sr-only"],
        },
        children: [{ type: "text", value: "Footnotes" }],
      };
      node.children[0] = span;
    });
  };
}
