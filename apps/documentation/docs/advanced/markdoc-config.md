# Pass custom Markdoc config

Use the `config` option to pass options directly to Markdoc.

```js title="svelte.config.js"
import { markdoc } from 'svelte-markdoc-preprocess';

markdoc({
    config: {
        variables: {
            company: 'Acme',
        },
        functions: {
            includes: {
                transform(parameters) {
                    const [array, value] = Object.values(parameters);
                    return Array.isArray(array) ? array.includes(value) : false;
                },
            },
        },
    },
});
```

Refer to the Markdoc config reference for all available options: https://markdoc.dev/docs/config#options
