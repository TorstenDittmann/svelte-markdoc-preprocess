# Configuration

Pass options to `markdoc(...)` inside your `svelte.config.js`.

```js title="svelte.config.js"
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { markdoc } from 'svelte-markdoc-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        markdoc({
            // options here
        }),
    ],
    extensions: ['.markdoc', '.svelte'],
};

export default config;
```

## Options

### `extensions`

**Type:** `string[]`

**Default:** `['.markdoc', '.mdoc', '.markdown', '.md']`

File extensions to process with Markdoc.

### `nodes`

**Type:** `string | null`

**Default:** `null`

Absolute path to a `.svelte` file that exports node components from `<script module>`.

### `tags`

**Type:** `string | null`

**Default:** `null`

Absolute path to a `.svelte` file that exports tag components from `<script module>`.

### `partials`

**Type:** `string | null`

**Default:** `null`

Absolute path to the partials directory.

### `generateSchema`

**Type:** `boolean`

**Default:** `true`

Generates `.svelte-kit/markdoc_schema.js` for the official [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=Stripe.markdoc-language-support).

### `layouts`

**Type:** `Record<string, string> | null`

**Default:** `null`

Map of layout names to absolute `.svelte` file paths.

### `validationThreshold`

**Type:** `"debug" | "info" | "warning" | "error" | "critical" | null`

**Default:** `'error'`

Minimum validation level that should fail the build.

### `allowComments`

**Type:** `boolean`

**Default:** `false`

Allow HTML comments (`<!-- -->`) in Markdoc files.

### `config`

**Type:** `ConfigType | null`

**Default:** `null`

Pass configuration directly to Markdoc (for example `variables`, `functions`, `validation`, `tags`, `nodes`, and `partials`).

### `highlighter`

**Type:** `((code: string, language: string) => Promise<string>) | null`

**Default:** `null`

Custom syntax highlighter used for fenced code blocks. The returned string is rendered as HTML.

```js title="svelte.config.js"
import { markdoc } from 'svelte-markdoc-preprocess';

markdoc({
    highlighter: async (code, language) => {
        if (language === 'js') {
            return `<span class="language-js">${code}</span>`;
        }

        return code;
    },
});
```
