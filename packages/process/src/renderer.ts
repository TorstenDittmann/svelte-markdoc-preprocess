import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';
import { sanitize_for_svelte } from './transformer';
import { escape } from 'html-escaper';
import { IMAGE_PREFIX, IMPORT_PREFIX, NODES_IMPORT } from './constants';
import {
    is_relative_path,
    parse_query_params_from_string,
    replace_query_params_from_string,
} from './utils';
import { Config } from './config';

export function render_html(
    node: RenderableTreeNodes,
    dependencies: Map<string, string>,
    enhanced_images: Config['enhancedImages'],
): string {
    /**
     * if the node is a string or number, it's a text node.
     */
    if (typeof node === 'string' || typeof node === 'number') {
        return sanitize_for_svelte(escape(String(node)));
    }

    /**
     * if the node is an array, render its items.
     */
    if (Array.isArray(node)) {
        return node
            .map((item) => render_html(item, dependencies, enhanced_images))
            .join('');
    }

    /**
     * if the node is not a Tag, it's invalid.
     */
    if (node === null || typeof node !== 'object' || !Tag.isTag(node)) {
        return '';
    }

    let { name, attributes, children = [] } = node;

    if (!name) {
        return render_html(children, dependencies, enhanced_images);
    }

    const is_svelte = is_svelte_component(node);

    /**
     * add attributes to the tag.
     */
    let output = `<${name}`;
    for (const [key, value] of Object.entries(attributes ?? {})) {
        const is_src_key = key === 'src';
        const is_imported_image = is_src_key && is_relative_path(value);
        if (is_svelte) {
            switch (name.toLowerCase()) {
                case `${NODES_IMPORT}.image`.toLowerCase():
                    if (is_src_key) {
                        if (is_imported_image) {
                            const unique_name = `${IMAGE_PREFIX}${dependencies.size}`;
                            dependencies.set(unique_name, String(value));
                            output += ` imported={true} ${key.toLowerCase()}=${generate_svelte_attribute_value(
                                unique_name,
                                'import',
                            )}`;
                            break;
                        } else {
                            output += ` imported={false}`;
                        }
                    }

                default:
                    output += ` ${key.toLowerCase()}=${generate_svelte_attribute_value(
                        value,
                    )}`;
                    break;
            }
        } else {
            switch (name.toLowerCase()) {
                case 'img':
                    if (is_imported_image) {
                        /**
                         * Allow importing relative images and import them via vite.
                         */
                        const unique_name = `${IMAGE_PREFIX}${dependencies.size}`;
                        const params = parse_query_params_from_string(
                            String(value),
                        );
                        const use_enhanced_img_tag =
                            enhanced_images?.mode === 'automatic' ||
                            (enhanced_images?.mode === 'manually' &&
                                params.has('enhanced'));
                        if (use_enhanced_img_tag) {
                            output = output.replace('<img', '<enhanced:img');
                            name = 'enhanced:img';
                            params.set('enhanced', 'true');
                            dependencies.set(
                                unique_name,
                                replace_query_params_from_string(
                                    String(value),
                                    params,
                                ),
                            );
                        } else {
                            dependencies.set(unique_name, String(value));
                        }
                        output += ` ${key.toLowerCase()}=${generate_svelte_attribute_value(
                            unique_name,
                            'import',
                        )}`;
                        break;
                    }
                default:
                    output += ` ${key.toLowerCase()}="${sanitize_for_svelte(
                        escape(String(value)),
                    )}"`;
                    break;
            }
        }
    }
    output += '>';

    /**
     * if the tag is a void element, it doesn't need a closing tag.
     */
    if (is_void_element(name)) {
        return output;
    }

    /**
     * render the children if present.
     */
    if (children.length) {
        output += render_html(children, dependencies, enhanced_images);
    }

    /**
     * close the tag.
     */
    output += `</${name}>`;

    return output;
}

function is_void_element(name: string): boolean {
    return [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
    ].includes(name);
}

function is_svelte_component(node: RenderableTreeNodes): boolean {
    return Tag.isTag(node) && node.name.startsWith(IMPORT_PREFIX);
}

function generate_svelte_attribute_value(
    value: unknown,
    type?: string,
): string {
    switch (type ?? typeof value) {
        case 'string':
            return `"${sanitize_for_svelte(escape(String(value)))}"`;
        case 'import':
        case 'number':
        case 'boolean':
            return `{${String(value)}}`;
        case 'object':
            return `{${JSON.stringify(value)}}`;
        default:
            throw new Error(`Invalid attribute value: ${value}`);
    }
}
