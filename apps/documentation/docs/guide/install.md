# Quickstart

Get `svelte-markdoc-preprocess` running in a SvelteKit project in three steps.

## 1) Install

```sh
npm i -D svelte-markdoc-preprocess
```

## 2) Configure SvelteKit

```js title="svelte.config.js"
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { markdoc } from 'svelte-markdoc-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess(), markdoc()],
    extensions: ['.markdoc', '.svelte'],
};

export default config;
```

## 3) Create your first page

```md title="src/routes/+page.markdoc"
---
title: Hello from Markdoc
---

# { $frontmatter.title }

This page is rendered from a `.markdoc` file.
```
