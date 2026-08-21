# Nodes

You can use Svelte components in your markdown files, you can define Svelte Component for each node.

Create a Svelte file and export Svelte components with the same name as the node from the module script.

```html title="src/lib/Nodes.svelte"
<script module>
    export { default as Heading } from './Heading.svelte';
</script>
```

```js title="svelte.config.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

markdoc({
    nodes: join(
        dirname(fileURLToPath(import.meta.url)),
        './src/lib/Nodes.svelte',
    ),
});
```

```html title="./src/lib/Heading.svelte"
<script>
    let { level, children } = $props();
</script>

<svelte:element this={`h${level}`}>{@render children?.()}</svelte:element>
```

You can find a list of available nodes [here](https://markdoc.dev/docs/nodes#built-in-nodes).

## Custom attributes

Declare additional node attributes through the Markdoc `config` option. They
will be passed to the corresponding Svelte component alongside the built-in
attributes.

```js title="svelte.config.js"
markdoc({
    nodes: './src/lib/Nodes.svelte',
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
```

Node attributes use Markdoc annotation syntax.

````markdoc title="+page.markdoc"
```js {% highlight="{1-2,4}" %}
console.log('highlight me');
```
````

The Fence component can then receive `highlight` through `$props()`.
