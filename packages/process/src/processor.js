import { transformer } from './transformer.js';

/**
 * This is just a text.
 *
 * @param {import("./index.js").Config} options
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
const processor = ({ extensions = ['.markdoc'], layout = null, tags = {} }) => {
    return {
        name: 'markdoc',
        async markup({ content, filename }) {
            /**
             * Only use on specific extensions
             */
            if (!extensions.find((extension) => filename?.endsWith(extension)))
                return;

            /**
             * Add svelte components to be used with markdoc tags
             */
            const code = transformer({
                content,
                tags,
                layout,
            });

            return {
                code,
            };
        },
    };
};

export default processor;
