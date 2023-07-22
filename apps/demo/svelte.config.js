import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { markdoc } from 'svelte-markdoc-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        markdoc({
            layout: join(dirname(fileURLToPath(import.meta.url)), './src/lib/Layout.svelte'),
            tags: {
                mytest: {
                    render: 'Test',
                    selfClosing: true,
                },
                addition: {
                    render: 'Addition',
                    attributes: {
                        a: {
                            type: Number,
                        },
                        b: {
                            type: Number,
                        },
                    },
                },
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
