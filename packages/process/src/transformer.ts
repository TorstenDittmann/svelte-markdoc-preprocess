import {
    Schema,
    SchemaAttribute,
    parse as markdocParse,
    transform,
    NodeType,
    Tag,
    ConfigType,
    validate,
    Tokenizer,
    Node,
} from '@markdoc/markdoc';
import {
    ScriptTarget,
    SyntaxKind,
    VariableDeclaration,
    createSourceFile,
    getJSDocType,
    getNameOfDeclaration,
    isVariableStatement,
} from 'typescript';
import { dirname, join } from 'path';
import { load as loadYaml } from 'js-yaml';
import { parse as svelteParse, walk } from 'svelte/compiler';
import { render_html } from './renderer';
import {
    get_all_files,
    path_exists,
    read_file,
    relative_posix_path,
    to_absolute_posix_path,
    write_to_file,
} from './utils';
import * as default_schema from './default_schema';
import type { Config } from './config';
import { LAYOUT_IMPORT } from './constants';
import { log_error, log_validation_error } from './log';

type Var = {
    name: string;
    type: StringConstructor | NumberConstructor | BooleanConstructor;
};

type NodeName = NodeType;
type TagName = string;
type PartialName = string;

type NodeTagPartialTriplet = [NodeName[], TagName[], PartialName[]];
type TransformerState = {
    nodes: Map<NodeName, [path: string, Schema]>;
    tags: Map<TagName, [path: string, Schema]>;
    partials: Map<PartialName, [NodeTagPartialTriplet, Node]>;
    normalized: {
        nodes: NodeName[];
        tags: TagName[];
    };
};

let transformer_state: TransformerState | undefined;

function init(
    tags_file: string | null,
    nodes_file: string | null,
    partials_dir: string | null,
): TransformerState {
    const node_with_paths = nodes_file ? each_exported_var(nodes_file) : [];
    const node_with_schemas = [
        ...Object.entries(prepare_nodes(nodes_file, node_with_paths)),
    ];

    const node_state = node_with_paths.map<[NodeName, [path: string, Schema]]>(
        ([node, path]) => [
            node as NodeName,
            [
                path,
                node_with_schemas.find(
                    ([snode]) => snode.toLowerCase() == node.toLowerCase(),
                )![1],
            ],
        ],
    );

    const tag_with_paths = tags_file
        ? each_exported_var(tags_file.toString())
        : [];

    const tag_with_schemas = [
        ...Object.entries(prepare_tags(tags_file, tag_with_paths)),
    ];

    const tag_state = tag_with_paths.map<[TagName, [path: string, Schema]]>(
        ([tag, path]) => [
            tag,
            [
                path,
                tag_with_schemas.find(
                    ([stag]) => stag.toLowerCase() == tag.toLowerCase(),
                )![1],
            ],
        ],
    );

    const partial_schemas = prepare_partials(partials_dir);
    const partial_state = Object.entries(partial_schemas).map<
        [PartialName, [NodeTagPartialTriplet, Node]]
    >(([partial, schema]) => [partial, [flatten_node(schema), schema]]);
    return {
        tags: new Map(tag_state),
        nodes: new Map(node_state),
        partials: new Map(partial_state),
        normalized: {
            nodes: [...node_state.map(([k]) => k)],
            tags: [...tag_state.map(([k]) => k)],
        },
    };
}

function flatten_node(node: Node): NodeTagPartialTriplet {
    const aux_create_state = (node: Node): NodeTagPartialTriplet =>
        is_partial_node(node)
            ? [
                  [],
                  [],
                  node.annotations
                      .filter((a) => a.name == 'file')
                      .map((node) => node.value),
              ]
            : node.tag
              ? [[], [node.tag], []]
              : [[node.type], [], []];

    return node.children.length
        ? combine_nodes_tags_partials([
              aux_create_state(node),
              ...node.children.map(flatten_node),
          ])
        : aux_create_state(node);
}

function combine_nodes_tags_partials(
    data: NodeTagPartialTriplet[],
): NodeTagPartialTriplet {
    return data.reduce<string[][]>(
        (acc, node) => acc.map((k, i) => k.concat(node[i])),
        [[], [], []],
    ) as NodeTagPartialTriplet;
}

function is_partial_node(node: Node): boolean {
    return (
        node.type == 'tag' && node.tag == 'partial' && !!node.annotations.length
    );
}

function flatten_partials(
    travel_state: PartialName[],
    transformer_state: TransformerState,
    partial_name: PartialName,
): NodeTagPartialTriplet {
    if (travel_state.includes(partial_name)) {
        throw new Error(
            `resolve deps failed: detected cyclic error in partial in the order ${[
                ...travel_state,
                partial_name,
            ]}`,
        );
    }

    if (!partial_name.length) {
        return [[], [], []];
    }

    travel_state = [...travel_state, partial_name];
    const res = transformer_state.partials.get(partial_name)?.[0] ?? [
        [],
        [],
        [],
    ];
    const [, , remaining_partials] = res;

    return remaining_partials.length
        ? combine_nodes_tags_partials(
              remaining_partials.map((v) =>
                  flatten_partials(travel_state, transformer_state, v),
              ),
          )
        : res;
}

export function transformer({
    content,
    filename,
    nodes_file,
    tags_file,
    partials_dir,
    layouts,
    generate_schema,
    config,
    validation_threshold,
    allow_comments,
}: {
    content: string;
    filename: string;
    nodes_file: Config['nodes'];
    tags_file: Config['tags'];
    partials_dir: Config['partials'];
    layouts: Config['layouts'];
    generate_schema: Config['generateSchema'];
    config: Config['config'];
    validation_threshold: Config['validationThreshold'];
    allow_comments: Config['allowComments'];
}): string {
    if (!transformer_state)
        transformer_state = init(tags_file, nodes_file, partials_dir);

    /**
     * create tokenizer
     */
    const tokenizer = new Tokenizer({
        allowComments: allow_comments,
    });
    const tokens = tokenizer.tokenize(content);
    /**
     * create ast for markdoc
     */
    const ast = markdocParse(tokens);

    const [used_cur_nodes, used_cur_tags, used_cur_partials] = flatten_node(
        ast,
    ).map((nodes) => [...new Set(nodes)]);

    const [used_partials_nodes, used_partials_tags, empty_partials] =
        combine_nodes_tags_partials(
            used_cur_partials.map((p) =>
                flatten_partials([], transformer_state!, p),
            ),
        );

    if (empty_partials.length) {
        throw new Error('should never happend');
    }

    const [used_nodes, used_tags] = combine_nodes_tags_partials([
        [used_cur_nodes as NodeName[], used_cur_tags, []],
        [used_partials_nodes, used_partials_tags, []],
    ]);

    const used_normalized_nodes = [
        ...new Set(
            used_nodes
                .map((k) =>
                    transformer_state!.normalized.nodes.find(
                        (n) => n.toLowerCase() == k.toLowerCase(),
                    ),
                )
                .filter(Boolean),
        ),
    ];

    const used_normalized_tags = [
        ...new Set(
            used_tags.map(
                (k) =>
                    transformer_state!.normalized.tags.find(
                        (n) => n.toLowerCase() == k.toLowerCase(),
                    )!,
            ),
        ),
    ];

    //

    /**
     * load frontmatter
     */
    const frontmatter = (
        ast.attributes.frontmatter ? loadYaml(ast.attributes.frontmatter) : {}
    ) as Record<string, string>;
    const has_frontmatter = Object.keys(frontmatter).length > 0;

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

    const tags = used_normalized_tags.map((name) => [
        name,
        transformer_state!.tags.get(name)![0],
    ]); // tags must be presented

    const nodes = used_normalized_nodes
        .map((name) => [name, transformer_state!.nodes.get(name!)?.[0]])
        .filter(([, maybe_schema]) => maybe_schema) as [string, string][]; // node can be fall back to the default

    const partials = Object.fromEntries(
        [...transformer_state!.partials.entries()]
            .filter(([k]) => used_cur_partials.includes(k))
            .map(([partial, [, node]]) => [partial, node]),
    );

    /**
     * add import for tags
     */
    if (used_cur_tags.length) {
        dependencies +=
            tags
                .map(
                    ([comp, path]) =>
                        `import ${comp} from '${relative_posix_path(
                            filename,
                            to_absolute_posix_path(
                                filename,
                                tags_file ?? '',
                                path,
                            ),
                        )}';`,
                )
                .join('') ?? '';
    }

    /**
     * add import for nodes
     */

    if (used_cur_nodes.length) {
        dependencies +=
            nodes
                .map(
                    ([comp, path]) =>
                        `import ${comp}  from '${relative_posix_path(
                            filename,
                            to_absolute_posix_path(
                                filename,
                                nodes_file ?? '',
                                path,
                            ),
                        )}';`,
                )
                .join('') ?? '';
    }

    /**
     * add import for layout
     */
    if (selected_layout && has_layout) {
        dependencies += `import ${LAYOUT_IMPORT} from '${relative_posix_path(
            filename,
            selected_layout,
        )}';`;
    }

    /**
     * generate schema for markdoc extension
     */
    if (generate_schema) {
        create_schema(
            Object.fromEntries(
                [...transformer_state.tags.entries()].map(
                    ([comp, [, schema]]) => [comp, schema],
                ),
            ),
        );
    }

    /**
     * create configuration for markdoc
     */
    const configuration: ConfigType = {
        tags: {
            ...config?.tags,
            ...Object.fromEntries(
                [...transformer_state.tags.entries()].map(
                    ([comp, [, schema]]) => [comp.toLowerCase(), schema],
                ),
            ),
        },

        nodes: {
            ...config?.nodes,
            ...Object.fromEntries(
                [...transformer_state.nodes.entries()].map(
                    ([comp, [, schema]]) => [comp.toLowerCase(), schema],
                ),
            ),
        },
        partials: {
            ...config?.partials,
            ...partials,
        },
        variables: {
            ...config?.variables,
            frontmatter,
        },
        functions: config?.functions,
        validation: config?.validation,
    };

    /**
     * validate markdoc asd and log errors, warnings & co
     */
    const thresholds = new Map<Config['validationThreshold'], number>([
        ['debug', 0],
        ['info', 1],
        ['warning', 2],
        ['error', 3],
        ['critical', 4],
    ]);
    const threshold = thresholds.get(validation_threshold);
    const errors = validate(ast, configuration);
    for (const error of errors) {
        log_validation_error(error, filename);
        const level = thresholds.get(error.error.level);
        if (threshold && level && level >= threshold) {
            throw new Error(error.error.message);
        }
    }

    /**
     * transform the ast with svelte components
     */
    const nast = transform(ast, configuration);

    /**
     * render to html
     */
    const code = render_html(nast);

    let transformed = '';

    /**
     * add module context if frontmatter is used
     */
    if (Object.keys(frontmatter).length > 0) {
        transformed += create_module_context(frontmatter);
    }

    /**
     * add all dependencies to the document
     */
    if (dependencies) {
        transformed += `<script>${dependencies}</script>`;
    }

    /**
     * wrap the content in the layout
     */
    if (has_layout) {
        transformed += `<${LAYOUT_IMPORT}`;
        transformed += has_frontmatter ? ' {...frontmatter}>' : '>';
        transformed += code;
        transformed += `</${LAYOUT_IMPORT}>`;
    } else {
        transformed += code;
    }

    return transformed;
}

export function create_module_context(
    frontmatter: Record<string, string>,
): string {
    return (
        `<script context="module">` +
        `export const frontmatter = ${JSON.stringify(frontmatter)};` +
        `</script>`
    );
}

const script_tags_regular_expression = new RegExp(
    '<script[^>]*>(.*?)</script>',
    's',
);

export function get_component_vars(
    path: string,
    layout: string,
): Record<string, SchemaAttribute> {
    const target = join(dirname(layout), path);
    const data = read_file(target);
    const match = data.match(script_tags_regular_expression);
    if (!match) {
        return {};
    }

    /**
     * create an ast using typescript
     */
    const script = match[1];
    const source = createSourceFile(target, script, ScriptTarget.Latest, true);

    /**
     * find and return all exported variables
     */
    return source.statements.reduce<Record<string, SchemaAttribute>>(
        (prev, node) => {
            if (isVariableStatement(node)) {
                const is_export_keyword = node.modifiers?.some(
                    (v) => v.kind === SyntaxKind.ExportKeyword,
                );
                if (is_export_keyword) {
                    const declaration = node.declarationList.declarations.find(
                        (d) => d.name.kind === SyntaxKind.Identifier,
                    );
                    const name =
                        getNameOfDeclaration(declaration)?.getText(source);
                    if (!declaration || !name) {
                        return prev;
                    }
                    const type = ts_to_type(declaration);
                    prev[name] = {
                        type,
                        required: !declaration.initializer,
                    };
                }
            }

            return prev;
        },
        {},
    );
}

const uc_map: Record<string, string> = {
    '{': '&lcub;',
    '}': '&rcub;',
};
const uc_regular_expression = new RegExp(Object.keys(uc_map).join('|'), 'gi');

export function sanitize_for_svelte(content: string): string {
    return content.replace(
        uc_regular_expression,
        (matched) => uc_map[matched.toLowerCase()],
    );
}

export function ts_to_type(declaration: VariableDeclaration): Var['type'] {
    const kind = declaration.type?.kind
        ? declaration.type.kind
        : getJSDocType(declaration.parent.parent)?.kind;
    if (kind) {
        switch (kind) {
            case SyntaxKind.StringKeyword:
                return String;
            case SyntaxKind.NumberKeyword:
                return Number;
            case SyntaxKind.BooleanKeyword:
                return Boolean;
            default:
                throw new Error('Can only handly primitive types.');
        }
    }
    const initializer = declaration?.initializer;
    if (initializer) {
        switch (initializer.kind) {
            case SyntaxKind.StringLiteral:
                return String;
            case SyntaxKind.NumericLiteral:
            case SyntaxKind.BigIntLiteral:
                return Number;
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
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
    comps_with_paths: Array<[string, string]>,
): Partial<Record<NodeType, Schema>> {
    const nodes: Record<string, Schema> = {};
    if (nodes_file) {
        for (const [name] of comps_with_paths) {
            const type = name.toLowerCase() as NodeType;

            nodes[name.toLowerCase()] = {
                ...get_node_defaults(type),
                transform(node, config) {
                    return new Tag(
                        name,
                        node.transformAttributes(config),
                        node.transformChildren(config),
                    );
                },
            };
        }
    }

    return nodes;
}

function prepare_tags(
    tags_file: Config['tags'],
    comps_with_paths: Array<[string, string]>,
): Record<string, Schema> {
    const tags: Record<string, Schema> = {};
    if (tags_file) {
        for (const [name, value] of comps_with_paths) {
            /**
             * extract all exported variables from the components
             */
            const attributes = get_component_vars(String(value), tags_file);
            tags[name.toLowerCase()] = {
                render: name,
                attributes,
            };
        }
    }
    return tags;
}

function prepare_partials(
    folder: Config['partials'],
): Record<string, ReturnType<typeof markdocParse>> {
    if (!folder) {
        return {};
    }

    return get_all_files(folder).reduce<ReturnType<typeof prepare_partials>>(
        (carry, file) => {
            carry[file] = markdocParse(read_file(folder, file));
            return carry;
        },
        {},
    );
}

function each_exported_var(filepath: string): Array<[string, string]> {
    const data = read_file(filepath);
    const ast = svelteParse(data);
    const tup: Array<[string, string]> = [];
    //@ts-ignore weird types here from svelte
    walk(ast, {
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

function create_schema(tags: Record<string, Schema>): void {
    // TODO: this part is really ugly, but it works.
    const raw = JSON.stringify(tags, (key, value) => {
        if (key === 'type') {
            switch (true) {
                case value === Number:
                    return '%%NUMBER%%';
                case value === String:
                    return '%%STRING%%';
                case value === Boolean:
                    return '%%BOOLEAN%%';
            }
        }
        return value;
    });
    const object = raw
        .replaceAll('"%%NUMBER%%"', 'Number')
        .replaceAll('"%%STRING%%"', 'String')
        .replaceAll('"%%BOOLEAN%%"', 'Boolean');
    const content = `export default { tags: ${object} };`;

    const target_directory = join(process.cwd(), '.svelte-kit');
    const target_file = join(target_directory, 'markdoc_schema.js');
    if (path_exists(target_directory)) {
        try {
            if (path_exists(target_file)) {
                if (content === read_file(target_file)) {
                    return;
                }
            }
            write_to_file(target_file, content);
        } catch (err) {
            if (err instanceof Error) {
                log_error(err.message);
            } else {
                console.error(err);
            }
        }
    }
}
