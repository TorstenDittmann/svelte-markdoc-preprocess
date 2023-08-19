import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { markdoc } from 'svelte-markdoc-preprocess';

const layout = join(dirname(fileURLToPath(import.meta.url)), './src/lib/Layout.svelte');
const nodes = join(dirname(fileURLToPath(import.meta.url)), './src/lib/Nodes.svelte');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        markdoc({
            tags: layout,
            nodes,
            layouts: {
                default: layout,
                alternative: join(
                    dirname(fileURLToPath(import.meta.url)),
                    './src/lib/LayoutAlternative.svelte',
                ),
            },
        }),
    ],
    extensions: ['.markdoc', '.svelte'],
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
    },
};

export default config;
