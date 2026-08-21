import { markdoc } from '../../../dist/module.js';
import { absoulute } from '../../utils.mjs';

export default markdoc({
    nodes: absoulute(import.meta.url, '../../nodes/module.svelte'),
    config: {
        nodes: {
            fence: {
                attributes: {
                    highlight: { type: String },
                },
            },
        },
    },
});
