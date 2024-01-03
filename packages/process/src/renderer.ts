import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';
import { sanitize_for_svelte } from './transformer';
import { escape } from 'html-escaper';
import { IMAGE_PREFIX, IMPORT_PREFIX } from './constants';
import { is_relative_path, parse_query_params_from_string } from './utils';
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

    const { name, attributes, children = [] } = node;

    if (!name) {
        return render_html(children, dependencies, enhanced_images);
    }

    const is_svelte = is_svelte_component(node);

    /**
     * add attributes to the tag.
     */
    let output = `<${name}`;
    for (const [key, value] of Object.entries(attributes ?? {})) {
        if (is_svelte) {
            output += ` ${key.toLowerCase()}=${generate_svelte_attribute_value(
                value,
            )}`;
        } else {
            if (name === 'img' && key === 'src' && is_relative_path(value)) {
                /**
                 * Allow importing relative images and import them via vite.
                 */
                const unique_name = `${IMAGE_PREFIX}${dependencies.size}`;
                const use_enhanced_img_tag =
                    enhanced_images?.mode === 'automatic' ||
                    (enhanced_images?.mode === 'manually' &&
                        parse_query_params_from_string(String(value)).has(
                            'enhance',
                        ));
                if (use_enhanced_img_tag) {
                    output = output.replace('<img', '<img:enhanced');
                }
                dependencies.set(unique_name, String(value));
                output += ` ${key.toLowerCase()}=${generate_svelte_attribute_value(unique_name, 'import')}`;
            } else {
                output += ` ${key.toLowerCase()}="${sanitize_for_svelte(
                    escape(String(value)),
                )}"`;
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
