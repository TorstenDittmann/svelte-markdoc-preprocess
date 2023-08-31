import { markdoc } from '../../../dist/module.js';
import { absoulute } from '../../utils.mjs';

export default markdoc({
    tags: absoulute(import.meta.url, '../../tags/module.svelte'),
    nodes: absoulute(import.meta.url, '../../nodes/module.svelte'),
    partials: absoulute(import.meta.url, '../../partials'),
});
