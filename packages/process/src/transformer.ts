import Markdoc, { Schema, SchemaAttribute } from '@markdoc/markdoc';
import type { Config } from './config';
import { readFileSync } from 'fs';
import { compile, parse, walk } from 'svelte/compiler';
import { dirname, join } from 'path';
import { BaseNode, Var } from 'svelte/types/compiler/interfaces';

export function transformer({
    content,
    nodes,
    layout,
}: {
    content: string;
    nodes: Config['nodes'];
    layout: Config['layout'];
}): string {
    /**
     * create ast for markdoc
     */
    const ast = Markdoc.parse(content);

    /**
     * add used svelte components to the script tag
     */
    let dependencies = '';
    const tags: Record<string, Schema> = {};
    if (layout) {
        const data = readFileSync(layout, 'utf8');
        const t = parse(data);
        //@ts-ignore weird types here
        walk(t, {
            enter(node, parent) {
                if (node.type === 'ExportSpecifier') {
                    if (
                        parent?.type === 'ExportNamedDeclaration' &&
                        parent?.source
                    ) {
                        const vars = getComponentVars(
                            String(parent.source.value),
                            layout,
                        );
                        tags[node.exported.name.toLowerCase()] = {
                            render: node.exported.name,
                            attributes: vars.reduce<
                                Record<string, SchemaAttribute>
                            >((prev, curr) => {
                                prev[curr.name] = {
                                    type: String,
                                };

                                return prev;
                            }, {}),
                        };
                    }
                }
            },
        });

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

        dependencies += `import INTERNAL__LAYOUT from '${layout}';`;
        dependencies += `import {${[...components].join(
            ', ',
        )}} from '${layout}';`;
    }

    /**
     * transform the ast with svelte components
     */
    const nast = Markdoc.transform(ast, {
        tags,
        nodes,
    });

    /**
     * render  to html
     */
    const code = Markdoc.renderers.html(nast);

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

function getComponentVars(filename: string, layout: string): Var[] {
    const target = join(dirname(layout), filename);
    const data = readFileSync(target, 'utf8');
    const { vars } = compile(data);

    return vars;
}
