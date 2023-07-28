# svelte-markdoc-preprocess

This is a [Svelte](https://svelte.dev) preprocessor that allows you to use Markdoc.

## Features

-   [x] Processor (kinda working)
-   [ ] Processor
-   [x] Configuration
-   [x] Svelte components
-   [x] Auto Components Import from Layout
-   [ ] Frontmatter
-   [ ] Layouts
-   [ ] Tests

## Installation

```bash
npm i -D svelte-markdoc-preprocess
```

```js
// svelte.config.js
import { markdoc } from 'svelte-markdoc-preprocess';

const config = {
    preprocess: [
        vitePreprocess(),
        markdoc({
            layout: join(
                dirname(fileURLToPath(import.meta.url)),
                './src/lib/Layout.svelte',
            ),
        }),
    ],
    extensions: ['.markdoc', '.svelte'],
};
```

```html
<!-- ./src/lib/Layout.svelte -->
<script context="module">
    export { default as Addition } from './Addition.svelte';
    export { default as MyTest } from './Test.svelte';
</script>

<slot />
```

```md
<!-- +page.markdoc -->

# I am a heading

I am a paragraph with **bold** words. But you can also use Svelte Components:

{% mytest /%}
{% addition a=4 b=6 /%}
```

## Experimental

This is totally experimental for now, please don't use it. Even if you're a brave one.
