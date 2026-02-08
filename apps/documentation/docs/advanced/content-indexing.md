# Indexing

Each `.markdoc` file exports `frontmatter`, so you can build content lists (for example blog indexes) from `load` functions.

```md title="src/routes/blog/hello.markdoc"
---
title: My Blog Post
description: This post explains how indexing works.
date: 2026-01-01
---

# My Blog Post
```

```ts title="src/routes/blog/+page.server.ts"
export function load() {
    const modules = import.meta.glob('./*.markdoc', {
        eager: true,
    });

    const posts = Object.entries(modules).map(([filepath, module]) => {
        const { frontmatter } = module as {
            frontmatter: {
                title: string;
                description?: string;
                date?: string;
            };
        };

        return {
            slug: filepath.replace('./', '').replace('.markdoc', ''),
            ...frontmatter,
        };
    });

    return { posts };
}
```
