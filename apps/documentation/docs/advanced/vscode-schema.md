# Visual Studio Code schema support

With `generateSchema: true` (default), the preprocessor writes `.svelte-kit/markdoc_schema.js`.

You can point the official [Markdoc VS Code extension](https://marketplace.visualstudio.com/items?itemName=Stripe.markdoc-language-support) to that file in `markdoc.config.json`:

```json title="markdoc.config.json"
[
    {
        "id": "my-site",
        "path": "src/routes",
        "schema": {
            "path": ".svelte-kit/markdoc_schema.js",
            "type": "esm",
            "property": "default",
            "watch": true
        }
    }
]
```
