# svelte-markdoc-preprocess

This is a Svelte preprocessor that allows you to use Markdoc.

## Experimental

This is totally experimental for now, please don't use it. Even if you're a brave one.

## Installation

```bash
npm i -D svelte-markdoc-preprocess
```

```js
// svelte.config.js
import { markdoc } from 'svelte-markdoc-preprocess';

const config = {
    preprocess: [markdoc()],
    extensions: ['.markdoc', '.svelte'],
};
```
