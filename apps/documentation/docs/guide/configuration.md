# Configuration

You can pass the configuration to the preprocessor in the `svelte.config.js` like this:

```js title="svelte.config.js"
import { markdoc } from 'svelte-markdoc-preprocess';

const config = {
    preprocess: [
        vitePreprocess(),
        markdoc({
            // configuration here
        }),
    ],
};
```

## Options

#### `extensions`

**Type**: `string[]`

**Default**: `['.markdoc', '.mdoc', '.markdown', '.md']`

Extensions to be processed.

#### `nodes`

**Type**: `string | null`

**Default**: `null`

Absoulute path to the `.svelte` file exporting components for nodes.

#### tags

**Type**: `string | null`

**Default**: `null`

Absoulute path to the `.svelte` file exporting components for tags.

#### partials

**Type**: `string`

**Default**: `null`

Absoulute path to the folder for partials.

#### generateSchema

**Type**: `boolean`

**Default**: `true`

Generate schema files under `./svelte-kit/markdoc-schema.json` to be used with the official [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=Stripe.markdoc-language-support).

#### layouts

**Type**: `Record<string, string> | null`

**Default**: `null`

Layouts to be used for pages.

#### validationThreshold

**Type**: `"error" | "debug" | "info" | "warning" | "critical"`

**Default**: `error`

The threshold for validation errors to stop the build.

#### allowComments

**Type**: `boolean`

**Default**: `false`

Allow comments in the markdown files.
