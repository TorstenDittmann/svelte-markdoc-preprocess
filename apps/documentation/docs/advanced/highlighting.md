# Add custom code highlighting

Use `highlighter` to transform fenced code blocks before rendering.

```js title="svelte.config.js"
import { markdoc } from 'svelte-markdoc-preprocess';

markdoc({
    highlighter: async (code, language) => {
        return `<pre data-language="${language}"><code>${code}</code></pre>`;
    },
});
```

The function receives `(code, language)` and must return an HTML string.
