# Quickstart

Get `svelte-markdoc-preprocess` running in a SvelteKit project.

## Quick install with sv

The community add-on installs the package and updates your Svelte configuration for you:

```sh
npx sv add @dittmann/sv-markdoc
```

Community add-ons are currently experimental. Follow the manual steps below if you prefer to configure
the preprocessor yourself.

## Manual install

### 1) Install

```sh
npm i -D svelte-markdoc-preprocess
```

### 2) Configure SvelteKit

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

### 3) Create your first page

```md title="src/routes/+page.markdoc"
---
title: Hello from Markdoc
---

# { $frontmatter.title }

This page is rendered from a `.markdoc` file.
```
