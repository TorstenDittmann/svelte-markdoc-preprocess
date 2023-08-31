import { markdoc } from '../../../dist/module.js';
import { absoulute } from '../../utils.mjs';

export default markdoc({
    partials: absoulute(import.meta.url, '../../partials'),
});
