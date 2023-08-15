import {
    Schema,
    SchemaAttribute,
    parse as markdocParse,
    transform,
    renderers,
} from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';
import { parse as svelteParse, walk } from 'svelte/compiler';
import { dirname, join } from 'path';
import { parseSync as swcParse } from '@swc/core';
import type { BindingIdentifier } from '@swc/core';
import type { Config } from './config';

export function transformer({
    content,
    nodes,
    layouts,
}: {
    content: string;
    nodes: Config['nodes'];
    layouts: Config['layouts'];
}): string {
    /**
     * create ast for markdoc
     */
    const ast = markdocParse(content);

    /**
     * load frontmatter
     */
    const frontmatter = (
        ast.attributes.frontmatter ? loadYaml(ast.attributes.frontmatter) : {}
    ) as Record<string, string>;

    /**
     * get layout from frontmatter, use default or no at all
     */
    const selected_layout = layouts
        ? layouts[frontmatter?.layout ?? 'default'] ?? undefined
        : undefined;

    /**
     * add used svelte components to the script tag
     */
    let dependencies = '';
    const tags: Record<string, Schema> = {};
    if (selected_layout) {
        const data = readFileSync(selected_layout, 'utf8');
        const t = svelteParse(data);
        //@ts-ignore weird types here
        walk(t, {
            enter(node, parent) {
                if (node.type === 'ExportSpecifier') {
                    if (
                        parent?.type === 'ExportNamedDeclaration' &&
                        parent?.source
                    ) {
                        const vars = get_component_vars(
                            String(parent.source.value),
                            selected_layout,
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

        dependencies += `import INTERNAL__LAYOUT from '${selected_layout}';`;
        dependencies += `import {${[...components].join(
            ', ',
        )}} from '${selected_layout}';`;
    }

    /**
     * transform the ast with svelte components
     */
    const nast = transform(ast, {
        tags,
        nodes,
        variables: {
            frontmatter,
        },
    });

    /**
     * render to html
     */
    const code = sanitize_for_svelte(renderers.html(nast));

    let transformed = '';
    if (dependencies) {
        transformed += `<script>${dependencies}</script>`;
    }
    if (selected_layout) {
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

export function get_component_vars(filename: string, layout: string): Var[] {
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
                            type: ts_to_type(decl.id),
                        });
                    }
                });
            }
        }
        return prev;
    }, []);
}

const uc_map: Record<string, string> = {
    '{': '&lcub;',
    '}': '&rcub;',
};
const u_regular_expression = new RegExp(Object.keys(uc_map).join('|'), 'gi');
export function sanitize_for_svelte(str: string): string {
    return str.replace(u_regular_expression, function (matched) {
        return uc_map[matched.toLowerCase()];
    });
}

export function ts_to_type(node: BindingIdentifier): Var['type'] {
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
