# Advanced

## Display lists of pages

If you want to get a list of all .markdoc files in a directory, for example in a blog you want to list all posts, you can use the `import.meta.glob` function.

```md
---
title: My Blog Post
description: This is a blog post and it is awesome.
date: 2021-01-01
---

# My Blog Post

...
```

```js title="+page.server.js"
export function load() {
    const modules = import.meta.glob('./blog/*.markdoc', {
        eager: true
    });

    const posts = Object.entries(modules).map(([filepath, module]) => {
        const { frontmatter } = module;
        return {
            filepath,
            title: frontmatter.title,
            description: frontmatter.description,
            date: frontmatter.date
        };
    });

    return {
        posts
    };
}
```


## Visual Studio Code `experimental`

The preprocessor automatically generates a schema file at `.svelte-kit/markdoc_schema.js` which can be used with the official [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=Stripe.markdoc-language-support).

In the `markdoc.config.json` [configuration file](https://github.com/markdoc/language-server#configuration-quickstart) point to the schema file:

```json
[
  {
    "id": "my-site",
    "path": "docs/content",
    "schema": {
      "path": ".svelte-kit/markdoc_schema.js",
      "type": "esm",
      "property": "default",
      "watch": true
    }
  }
]
```

## Markdoc configuration

You can configure the underlying Markdoc compiler by passing a [configuration object](https://markdoc.dev/docs/config#options).

```js title="svelte.config.js"
markdoc({
    config: {
      variables: {
        name: 'Dr. Mark',
        frontmatter: {
          title: 'Configuration options'
        }
      },
      functions: {
        includes: {
          transform(parameters, config) {
            const [array, value] = Object.values(parameters);

            return Array.isArray(array) ? array.includes(value) : false;
          }
        }
      }
    }
})
```
