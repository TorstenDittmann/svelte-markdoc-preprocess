import { markdoc } from '../../../dist/module.js';

export default markdoc({
    highlighter: (code, lang) => `${lang}:${code}`,
});
