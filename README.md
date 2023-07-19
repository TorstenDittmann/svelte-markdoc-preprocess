# svelte-markdoc-preprocess

This is a [Svelte](https://svelte.dev) preprocessor that allows you to use Markdoc.

## Features

-   [x] Processor (kinda working)
-   [ ] Processor
-   [ ] Configuration
-   [ ] Svelte components
-   [ ] Auto Components Import from folder
-   [ ] Frontmatter
-   [ ] Layouts
-   [ ] Tests

## Installation

```bash
npm i -D svelte-markdoc-preprocess
```

```js
// svelte.config.js
import markdoc from "svelte-markdoc-preprocess";

const config = {
    preprocess: [markdoc()],
    extensions: [".markdoc", ".svelte"]
};
```

## Options

### `processor`

The processor is the function that will be used to process the Markdoc file. It takes the source code as input and should return the processed code. It can be synchronous or asynchronous.

The default processor is `remark-parse` from [remark](

## Experimental

This is totally experimental for now, please don't use it. Even if you're a brave one.
