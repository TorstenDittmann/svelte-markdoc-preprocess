import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    title: 'Svelte Markdoc',
    description:
        'Bring the power of Markdoc right into your Svelte applications!',
    icon: '/favicon.png',
    logoText: 'svelte-markdoc-preprocess',
    logo: {
        light: '/logo.svg',
        dark: '/logo.svg',
    },
    themeConfig: {
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content:
                    'https://github.com/TorstenDittmann/svelte-markdoc-preprocess',
            },
            {
                icon: 'X',
                mode: 'link',
                content: 'https://x.com/DittmannTorsten',
            },
        ],
    },
});
