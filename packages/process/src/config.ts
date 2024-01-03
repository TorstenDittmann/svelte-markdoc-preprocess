import { ConfigType, ValidateError } from '@markdoc/markdoc';

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
     * The threshold for validation errors to stop the build.
     */
    validationThreshold: ValidateError['error']['level'] | null;
    /**
     * Whether to allow comments in the source files.
     */
    allowComments: boolean;
    /**
     * Configuration for the markdoc compiler.
     */
    config: ConfigType | null;
    /**
     * Adds support for @sveltejs/enhanced-img
     */
    enhancedImages: {
        /**
         * The mode for enhanced images. 'automatic' will enhance all relative images, 'manually' will only enhance images with the `enhance` query parameter.
         */
        mode: 'automatic' | 'manually';
    } | null;
};
