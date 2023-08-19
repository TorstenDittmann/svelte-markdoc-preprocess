import {
    Schema,
    SchemaAttribute,
    parse as markdocParse,
    transform,
    renderers,
    NodeType,
    Tag,
} from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';
import { parse as svelteParse, walk } from 'svelte/compiler';
import { dirname, join } from 'path';
import { parseSync as swcParse } from '@swc/core';
import type { BindingIdentifier } from '@swc/core';
import type { Config } from './config';
import * as default_schema from './default_schema';

type Var = {
    name: string;
    type: StringConstructor | NumberConstructor | BooleanConstructor;
};

export function transformer({
    content,
    nodes_file,
    tags_file,
    layouts,
}: {
    content: string;
    nodes_file: Config['nodes'];
    tags_file: Config['tags'];
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
    const has_layout = selected_layout !== undefined;

    /**
     * add used svelte components to the script tag
     */
    let dependencies = '';
    const tags = prepare_tags(tags_file);
    const has_tags = Object.keys(tags).length > 0;
    const nodes = prepare_nodes(nodes_file);
    const has_nodes = Object.keys(nodes).length > 0;

    /**
     * add import for tags
     */
    if (has_tags) {
        dependencies += `import * as INTERNAL__TAGS from '${tags_file}';`;
    }

    /**
     * add import for nodes
     */
    if (has_nodes) {
        dependencies += `import * as INTERNAL__NODES from '${nodes_file}';`;
    }

    /**
     * add import for layout
     */
    if (has_layout) {
        dependencies += `import INTERNAL__LAYOUT from '${selected_layout}';`;
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
    if (has_layout) {
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

function get_node_defaults(node_type: NodeType): Partial<Schema> {
    switch (node_type) {
        case 'blockquote':
            return default_schema.blockquote;
        case 'em':
            return default_schema.em;
        case 'heading':
            return default_schema.heading;
        case 'hr':
            return default_schema.hr;
        case 'image':
            return default_schema.image;
        case 'inline':
            return default_schema.inline;
        case 'item':
            return default_schema.item;
        case 'link':
            return default_schema.link;
        case 'list':
            return default_schema.list;
        case 'paragraph':
            return default_schema.paragraph;
        case 'strong':
            return default_schema.strong;
        case 'table':
            return default_schema.table;
        case 'code':
            return default_schema.code;
        case 'comment':
            return default_schema.comment;
        case 'document':
            return default_schema.document;
        case 'error':
            return default_schema.error;
        case 'fence':
            return default_schema.fence;
        case 'hardbreak':
            return default_schema.hardbreak;
        case 'node':
            return default_schema.node;
        case 's':
            return default_schema.s;
        case 'softbreak':
            return default_schema.softbreak;
        case 'tbody':
            return default_schema.tbody;
        case 'td':
            return default_schema.td;
        case 'text':
            return default_schema.text;
        case 'th':
            return default_schema.th;
        case 'thead':
            return default_schema.thead;
        case 'tr':
            return default_schema.tr;
        default:
            throw new Error(`Unknown node type: ${node_type}`);
    }
}

function prepare_nodes(
    nodes_file: Config['nodes'],
): Partial<Record<NodeType, Schema>> {
    const nodes: Record<string, Schema> = {};
    if (nodes_file) {
        for (const [name] of each_exported_var(nodes_file)) {
            nodes[name.toLowerCase()] = {
                ...get_node_defaults(name.toLowerCase() as NodeType),
                transform(node, config) {
                    return new Tag(
                        `INTERNAL__NODES.${name}`,
                        node.transformAttributes(config),
                        node.transformChildren(config),
                    );
                },
            };
        }
    }

    return nodes;
}

function prepare_tags(tags_file: Config['tags']): Record<string, Schema> {
    const tags: Record<string, Schema> = {};
    if (tags_file) {
        for (const [name, value] of each_exported_var(tags_file)) {
            /**
             * extract all exported variables from the components
             */
            const attributes = get_component_vars(String(value), tags_file);
            tags[name.toLowerCase()] = {
                render: 'INTERNAL__TAGS.' + name,
                attributes,
            };
        }
    }
    return tags;
}

function each_exported_var(filepath: string): Array<[string, string]> {
    const data = readFileSync(filepath, 'utf8');
    const t = svelteParse(data);
    const tup: Array<[string, string]> = [];
    //@ts-ignore weird types here from svelte
    walk(t, {
        enter(node, parent) {
            if (node.type === 'ExportSpecifier') {
                if (
                    parent?.type === 'ExportNamedDeclaration' &&
                    parent?.source
                ) {
                    tup.push([node.exported.name, String(parent.source.value)]);
                }
            }
        },
    });
    return tup;
}
