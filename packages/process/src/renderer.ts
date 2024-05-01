import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';
import { sanitize_for_svelte } from './transformer';
import { escape } from 'html-escaper';
import { IMPORT_PREFIX } from './constants';

export function render_html(node: RenderableTreeNodes): string {
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
        return node.map(render_html).join('');
    }

    /**
     * if the node is not a Tag, it's invalid.
     */
    if (node === null || typeof node !== 'object' || !Tag.isTag(node)) {
        return '';
    }

    const { name, attributes, children = [] } = node;

    if (!name) {
        return render_html(children);
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
            output += ` ${key.toLowerCase()}="${sanitize_for_svelte(
                escape(String(value)),
            )}"`;
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
        output += render_html(children);
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
    return Tag.isTag(node);
}

function generate_svelte_attribute_value(value: unknown): string {
    switch (typeof value) {
        case 'string':
            return `"${sanitize_for_svelte(escape(String(value)))}"`;
        case 'number':
        case 'boolean':
            return `{${String(value)}}`;
        case 'object':
            return `{${JSON.stringify(value)}}`;
        default:
            throw new Error(`Invalid attribute value: ${value}`);
    }
}
