import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Svelte Markdoc',
  description: 'Bring the power of Markdoc right into your Svelte applications!',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/TorstenDittmann/svelte-markdoc-preprocess' },
      { icon:'X', mode: 'link', content: 'https://x.com/DittmannTorsten'}
    ],
  },
});
