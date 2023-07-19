import { transformer } from "./transformer.js";

export default (options) => {
    options = {
        extensions: [".markdoc"],
        tags: {},
        ...options
    };
    return {
        async markup({ content, filename }) {
            /**
             * Only use on specific extensions
             */
            if (!options.extensions.find((extension) => filename.endsWith(extension))) return;

            /**
             * Add svelte components to be used with markdoc tags
             */
            const code = transformer({
                content,
                options,
                tags: options.tags
            });

            return {
                code
            };
        }
    };
};
