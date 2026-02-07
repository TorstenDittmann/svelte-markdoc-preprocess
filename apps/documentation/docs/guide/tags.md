# Tags

You can use Svelte components for tags, the same way you do for nodes.

Create a Svelte file and export Svelte components with the same name as the node from the module script.

```html title="./src/lib/Tags.svelte"
<script module>
    export { default as Multiply } from './Multiply.svelte';
</script>
```

```js title="svelte.config.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

markdoc({
    tags: join(
        dirname(fileURLToPath(import.meta.url)),
        './src/lib/Tags.svelte',
    ),
});
```

```html title="./src/lib/Multiply.svelte"
<script>
    let { a, b } = $props();
</script>

<p>{a} * {b} = {a * b}</p>
```

```md title="./src/routes/+page.markdoc"
# I am in a markdoc file

{% multiply a=2 b=3 /%}
```
