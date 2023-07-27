import Markdoc from '@markdoc/markdoc';
import type { Config } from './config';

export function transformer({
    content,
    tags,
    layout,
}: {
    content: string;
    tags: Config['tags'];
    layout: Config['layout'];
}): string {
    /**
     * create ast for markdoc
     */
    const ast = Markdoc.parse(content);

    /**
     * identify all tags used in the document
     */
    const components = new Set();
    for (const node of ast.walk()) {
        if (node.type === 'tag' && node?.tag) {
            if (node.tag in tags) {
                components.add(tags[node.tag].render);
            }
        }
    }

    /**
     * add used svelte components to the script tag
     */
    let dependencies = '';
    if (layout) {
        // const data = readFileSync(layout, 'utf8');
        // const t = compile(data, {});

        dependencies += `import INTERNAL__LAYOUT from '${layout}';`;
        dependencies += `import {${[...components].join(
            ', ',
        )}} from '${layout}';`;
    }

    /**
     * transform the ast with svelte components
     */
    const nodes = Markdoc.transform(ast, {
        tags,
    });

    /**
     * render  to html
     */
    const code = Markdoc.renderers.html(nodes);

    let transformed = '';
    if (dependencies) {
        transformed += `<script>${dependencies}</script>`;
    }
    if (layout) {
        transformed += `<INTERNAL__LAYOUT>${code}</INTERNAL__LAYOUT>`;
    } else {
        transformed += code;
    }
    return transformed;
}
