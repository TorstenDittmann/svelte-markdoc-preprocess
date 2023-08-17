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

type Var = {
    name: string;
    type: StringConstructor | NumberConstructor | BooleanConstructor;
};

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
        //@ts-ignore weird types here from svelte
        walk(t, {
            enter(node, parent) {
                if (node.type === 'ExportSpecifier') {
                    if (
                        parent?.type === 'ExportNamedDeclaration' &&
                        parent?.source
                    ) {
                        /**
                         * extract all exported variables from the components
                         */
                        const attributes = get_component_vars(
                            String(parent.source.value),
                            selected_layout,
                        );

                        tags[node.exported.name.toLowerCase()] = {
                            render: node.exported.name,
                            attributes,
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
    /**
     * add all dependencies to the document
     */
    if (dependencies) {
        transformed += `<script>${dependencies}</script>`;
    }
    /**
     * wrap the document in the layout
     */
    if (selected_layout) {
        transformed += `<INTERNAL__LAYOUT>${code}</INTERNAL__LAYOUT>`;
    } else {
        transformed += code;
    }

    return transformed;
}

const script_tags_regular_expression = new RegExp(
    '<script[^>]*>(.*?)</script>',
    's',
);

/**
 * Extracts all exported variables from a svelte component.
 *
 * @param path relative path of the component
 * @param layout absoulte path of the layout
 */
export function get_component_vars(
    path: string,
    layout: string,
): Record<string, SchemaAttribute> {
    const target = join(dirname(layout), path);
    const data = readFileSync(target, 'utf8');
    const match = data.match(script_tags_regular_expression);
    if (!match) {
        return {};
    }

    /**
     * parse the script with swc
     */
    const script = match[1];
    const result = swcParse(script, {
        syntax: 'typescript',
    });

    /**
     * find and return all exported variables
     */
    return result.body.reduce<Record<string, SchemaAttribute>>((prev, node) => {
        if (node.type === 'ExportDeclaration') {
            if (node.declaration.type === 'VariableDeclaration') {
                node.declaration.declarations.forEach((decl) => {
                    if (decl.id.type === 'Identifier') {
                        prev[decl.id.value] = {
                            type: ts_to_type(decl.id),
                        };
                    }
                });
            }
        }
        return prev;
    }, {});
}

const uc_map: Record<string, string> = {
    '{': '&lcub;',
    '}': '&rcub;',
};
const uc_regular_expression = new RegExp(Object.keys(uc_map).join('|'), 'gi');
/**
 * Replaces all the special characters that might intefer with the svelte compiler.
 *
 * @param content string to sanitize
 * @returns
 */
export function sanitize_for_svelte(content: string): string {
    return content.replace(
        uc_regular_expression,
        (matched) => uc_map[matched.toLowerCase()],
    );
}

/**
 * Converts a typescript type to a type constructor for Markdoc.
 *
 * @param node typescript node
 * @returns
 */
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
