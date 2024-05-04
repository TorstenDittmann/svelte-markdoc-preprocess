import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { markdoc } from 'svelte-markdoc-preprocess';

/**
 * @param {string} file
 * @returns {string}
 */
function absoulute(file) {
    return join(dirname(fileURLToPath(import.meta.url)), file);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        markdoc({
            tags: absoulute('./src/lib/Tags.svelte'),
            nodes: absoulute('./src/lib/Nodes.svelte'),
            partials: absoulute('./src/partials'),
            layouts: {
                default: absoulute('./src/lib/layouts/Default.svelte'),
                alternative: absoulute('./src/lib/layouts/Alternative.svelte'),
            },
            enhancedImages: {
                mode: 'automatic',
            },
        }),
    ],
    extensions: ['.markdoc', '.svelte'],
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
        alias: {
            assets: 'src/lib/assets',
        },
    },
};

export default config;
