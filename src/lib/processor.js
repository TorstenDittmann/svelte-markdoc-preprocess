import { transformer } from "./transformer.js";

export default (options) => {
    options = {
        extensions: [".markdoc"],
        tags: {},
        layout: null,
        ...options
    };
    return {
        name: "markdoc",
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
                options
            });

            return {
                code
            };
        }
    };
};
