import { markdoc } from '../../../dist/module.js';
import { absoulute } from '../../utils.mjs';

export default markdoc({
    layouts: {
        default: absoulute(import.meta.url, '../../layouts/default.svelte'),
        named: absoulute(import.meta.url, '../../layouts/named.svelte'),
    },
});
