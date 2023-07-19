import Markdoc from "@markdoc/markdoc";

export function transformer({ content, options }) {
    const { tags, layout } = options;
    /**
     * create ast for markdoc
     */
    const ast = Markdoc.parse(content);

    /**
     * identify all tags used in the document
     */
    const components = new Set();
    for (const node of ast.walk()) {
        if (node.type === "tag") {
            if (node.tag in tags) {
                components.add(tags[node.tag].render);
            }
        }
    }

    /**
     * add used svelte components to the script tag
     */
    let dependencies = "";
    if (layout) {
        dependencies += `import INTERNAL__LAYOUT from '${layout}';`;
        dependencies += `import {${[...components].join(", ")}} from '${layout}';`;
    }

    /**
     * transform the ast with svelte components
     */
    const nodes = Markdoc.transform(ast, {
        tags
    });

    /**
     * render  to html
     */
    const code = Markdoc.renderers.html(nodes);

    return `<script>${dependencies}</script><INTERNAL__LAYOUT>${code}</INTERNAL__LAYOUT>`;
}
