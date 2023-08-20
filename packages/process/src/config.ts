import { ConfigType } from '@markdoc/markdoc';

export type Config = {
    /**
     * Extensions to be processed.
     */
    extensions: string[];
    /**
     * Absoulute path to the .svelte file exporting components for nodes.
     */
    nodes: string | null;
    /**
     * Absoulute path to the .svelte file exporting components for tags.
     */
    tags: string | null;
    /**
     * Absoulute path to the folder for partials.
     */
    partials: string | null;
    /**
     * Generate schema files under `./svelte-kit/markdoc-schema.json` to be used with the official [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=Stripe.markdoc-language-support).
     */
    generateSchema: boolean;
    /**
     * Layouts to be used for pages.
     */
    layouts: {
        default: string;
        [key: string]: string;
    } | null;
    /**
     * Configuration for the markdoc compiler.
     */
    config: ConfigType | null;
};
