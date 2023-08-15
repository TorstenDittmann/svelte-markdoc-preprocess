import { Config } from './config';
import { transformer } from './transformer';
import type { PreprocessorGroup } from 'svelte/compiler';

const processor = (
    { extensions = ['.markdoc'], layouts = null, nodes = {} }: Config = {
        extensions: ['.markdoc'],
        layouts: null,
        nodes: {},
    },
): PreprocessorGroup => {
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
                nodes,
                layouts,
            });

            return {
                code,
            };
        },
    };
};

export default processor;
