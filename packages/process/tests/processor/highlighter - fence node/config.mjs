import { markdoc } from '../../../dist/module.js';
import { absoulute } from '../../utils.mjs';

export default markdoc({
    nodes: absoulute(import.meta.url, '../../nodes/module.svelte'),
    highlighter: (code, lang) => `${lang}:${code}`,
});
