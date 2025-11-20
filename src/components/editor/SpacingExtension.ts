import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Node as ProsemirrorNode } from "prosemirror-model";

export interface SpacingOptions {
  showIndicators: boolean;
}

export const SpacingExtension = Extension.create<SpacingOptions>({
  name: "spacing",

  addOptions() {
    return {
      showIndicators: false,
    };
  },

  addStorage() {
    return {
      showIndicators: this.options.showIndicators,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("spacing"),
        props: {
          decorations: (state) => {
            // Access storage via the extension instance bound to the editor
            // But inside the plugin, 'this' is not the extension.
            // We need a way to access the storage.
            // The editor instance is available in the plugin spec if we construct it differently?
            // No.

            // Alternative: Use the editor instance which is available in `this.editor` in `addProseMirrorPlugins`
            const { showIndicators } = this.storage;

            if (!showIndicators) {
              return DecorationSet.empty;
            }

            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node: ProsemirrorNode, pos: number) => {
              if (node.type.name === "paragraph") {
                const text = node.textContent;
                const wordCount = text
                  .split(/\s+/)
                  .filter((w) => w.length > 0).length;

                if (wordCount > 0) {
                  const widget = document.createElement("span");
                  widget.className = "spacing-badge";
                  widget.style.marginLeft = "8px";
                  widget.style.fontSize = "0.75rem";
                  widget.style.padding = "2px 6px";
                  widget.style.borderRadius = "4px";
                  widget.style.userSelect = "none";

                  // Logic from existing app (simplified)
                  if (wordCount < 50) {
                    widget.textContent = `${wordCount} words (Compact)`;
                    widget.style.backgroundColor = "#d1fae5"; // green-100
                    widget.style.color = "#065f46"; // green-800
                  } else if (wordCount < 150) {
                    widget.textContent = `${wordCount} words (Balanced)`;
                    widget.style.backgroundColor = "#dbeafe"; // blue-100
                    widget.style.color = "#1e40af"; // blue-800
                  } else {
                    widget.textContent = `${wordCount} words (Extended)`;
                    widget.style.backgroundColor = "#fee2e2"; // red-100
                    widget.style.color = "#991b1b"; // red-800
                  }

                  // Add widget at the end of the paragraph
                  decorations.push(
                    Decoration.widget(pos + node.nodeSize - 1, widget)
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
