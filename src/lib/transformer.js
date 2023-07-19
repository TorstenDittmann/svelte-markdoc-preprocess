import Markdoc from "@markdoc/markdoc";

export function transformer({ content, options, tags }) {
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
     * transform the ast with svelte components
     */
    const nodes = Markdoc.transform(ast, {
        tags
    });

    /**
     * render  to html
     */
    const code = Markdoc.renderers.html(nodes);

    /**
     * add used svelte components to the script tag
     */
    const dependencies = [...components].reduce(
        (prev, curr) => `${prev}\nimport ${curr} from '$lib/${curr}.svelte';`,
        ""
    );

    return `<script>${dependencies}</script>${code}`;
}
