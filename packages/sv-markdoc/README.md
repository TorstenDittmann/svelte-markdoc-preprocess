# @dittmann/sv-markdoc

An [`sv`](https://svelte.dev/docs/cli) community add-on that installs and configures
[`svelte-markdoc-preprocess`](https://svelte-markdoc-preprocess.pages.dev) in a Svelte or SvelteKit project.

## Usage

```sh
npx sv add @dittmann/sv-markdoc
```

This will:

- add `svelte-markdoc-preprocess` to your `devDependencies`
- add `markdoc()` to `preprocess` in your Svelte configuration
- register the `.markdoc` (and `.svelte`) extensions

## Development

```sh
bun install
bun run build
bun run demo-create   # scaffold a demo project
bun run demo-add      # run the add-on against it
bun run test
```

## Release

This package is released separately from `svelte-markdoc-preprocess`. Before publishing, update the
version and verify that the dependency version in `src/index.js` matches `packages/process/package.json`.

```sh
bun run build
bun run test
bun run check
npm publish
```

After publishing, smoke test the package from a temporary directory:

```sh
npx sv create t --add @dittmann/sv-markdoc --no-install
```
