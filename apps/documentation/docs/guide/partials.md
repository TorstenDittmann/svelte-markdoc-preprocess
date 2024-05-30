# Partials

You pass a directory to the configuration and it will automatically load all files to be used as [partials](https://markdoc.dev/docs/partials).

```js title="svelte.config.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

markdoc({
    partials: join(dirname(fileURLToPath(import.meta.url)), './src/lib/partials'),
})
```

```md title="./src/lib/partials/header.md"
# My header
```

Here's an example of including the `header.md` file as a partial.

`{% partial file="header.md" /%}`

```md title="./src/routes/+page.markdoc"
{ % partial file="header.md" /% }
```

### Passing variables

Partials are like any other tags, so you can pass variables as attributes to them such as:

```md title="./src/routes/+page.markdoc"
{ % partial file="header.md" variables={name: "My header name"} /% }
```

and access the variables as you would in a regular Markdoc document:

```md title="./src/lib/partials/header.md"
# { % $name % }
```
