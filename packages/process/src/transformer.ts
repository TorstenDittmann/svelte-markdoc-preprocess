import {
    Schema,
    SchemaAttribute,
    parse as markdocParse,
    transform,
    renderers,
} from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import { parse as svelteParse, walk } from 'svelte/compiler';
import { dirname, join } from 'path';
import { parseSync as swcParse } from '@swc/core';
import type { BindingIdentifier } from '@swc/core';
import type { Config } from './config';

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
    const ast = markdocParse(content);

    /**
     * add used svelte components to the script tag
     */
    let dependencies = '';
    const tags: Record<string, Schema> = {};
    if (layout) {
        const data = readFileSync(layout, 'utf8');
        const t = svelteParse(data);
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
    const nast = transform(ast, {
        tags,
        nodes,
    });

    /**
     * render to html
     */
    const code = sanitizeForSvelte(renderers.html(nast));

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

const expression = new RegExp('<script[^>]*>(.*?)</script>', 's');

type Var = {
    name: string;
    type: StringConstructor | NumberConstructor | BooleanConstructor;
};

function getComponentVars(filename: string, layout: string): Var[] {
    const target = join(dirname(layout), filename);
    const data = readFileSync(target, 'utf8');
    const match = data.match(expression);
    if (!match) {
        return [];
    }
    const script = match[1];
    const result = swcParse(script, {
        syntax: 'typescript',
    });

    return result.body.reduce<Var[]>((prev, node) => {
        if (node.type === 'ExportDeclaration') {
            if (node.declaration.type === 'VariableDeclaration') {
                node.declaration.declarations.forEach((decl) => {
                    if (decl.id.type === 'Identifier') {
                        prev.push({
                            name: decl.id.value,
                            type: tsToType(decl.id),
                        });
                    }
                });
            }
        }
        return prev;
    }, []);
}

const ucMap: Record<string, string> = {
    '{': '&lcub;',
    '}': '&rcub;',
};
const ucRegularExpression = new RegExp(Object.keys(ucMap).join('|'), 'gi');
function sanitizeForSvelte(str: string): string {
    return str.replace(ucRegularExpression, function (matched) {
        return ucMap[matched.toLowerCase()];
    });
}

function tsToType(node: BindingIdentifier): Var['type'] {
    if (node?.typeAnnotation?.typeAnnotation.type === 'TsKeywordType') {
        switch (node.typeAnnotation.typeAnnotation.kind) {
            case 'string':
                return String;
            case 'number':
                return Number;
            case 'boolean':
                return Boolean;
            default:
                throw new Error('Can only handly primitive types.');
        }
    }
    return String;
}
