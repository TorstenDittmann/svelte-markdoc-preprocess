import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';
import { sanitize_for_svelte } from './transformer';
import { escape } from 'html-escaper';
import { IMAGE_PREFIX, IMPORT_PREFIX } from './constants';
import { createHash } from 'crypto';
import { is_external_url } from './utils';

export function render_html(
    node: RenderableTreeNodes,
    dependencies: Map<string, string>,
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
        return node.map((item) => render_html(item, dependencies)).join('');
    }

    /**
     * if the node is not a Tag, it's invalid.
     */
    if (node === null || typeof node !== 'object' || !Tag.isTag(node)) {
        return '';
    }

    const { name, attributes, children = [] } = node;

    if (!name) {
        return render_html(children, dependencies);
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
            if (
                name === 'img' &&
                key === 'src' &&
                !is_external_url(value) &&
                !value.startsWith('/')
            ) {
                const hash = createHash('sha1').digest('hex');
                const import_name = `${IMAGE_PREFIX}${hash}`;
                dependencies.set(import_name, String(value));
                output += ` ${key.toLowerCase()}=${generate_svelte_attribute_value(
                    import_name,
                    'import',
                )}`;
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
        output += render_html(children, dependencies);
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
