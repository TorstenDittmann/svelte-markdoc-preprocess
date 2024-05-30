# Layouts

You can define layouts in the `markdoc` options.

```js title="svelte.config.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

markdoc({
    layouts: {
        default: join(
            dirname(fileURLToPath(import.meta.url)),
            './src/lib/Layout.svelte',
        ),
    },
});
```

Layout files are basically Svelte components with a slot. The `default` slot is used for all files.

```html title="./src/lib/Layout.svelte"
<nav>...</nav>

<slot />
```

### Named

If you want to use a named layout for a specific file, you can specify it in the frontmatter.

```js title="svelte.config.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

markdoc({
    layouts: {
        default: join(
            dirname(fileURLToPath(import.meta.url)),
            './src/lib/Layout.svelte',
        ),
        some_other_layout: join(
            dirname(fileURLToPath(import.meta.url)),
            './src/lib/SomeOtherLayout.svelte',
        ),
    },
});
```

```md title="+page.markdoc"
---
layout: some_other_layout
---

# some other content
```

### Props

Layouts will be passed the frontmatter as props from the Markdoc file.

```html title="./src/lib/Layout.svelte"
<script>
    export let title;
    export let description;
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content="{description}" />
</svelte:head>
```

```md title="+page.markdoc"
---
title: Lorem ipsum
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
---
```
