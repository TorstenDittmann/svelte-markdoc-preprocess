import { Config } from './config';
import { transformer } from './transformer';
import type { PreprocessorGroup } from 'svelte/compiler';

const processor = (
    {
        extensions = ['.markdoc'],
        layouts = null,
        nodes = null,
        tags = null,
    }: Config = {
        extensions: ['.markdoc'],
        layouts: null,
        nodes: null,
        tags: null,
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
                layouts,
                nodes_file: nodes,
                tags_file: tags,
            });

            return {
                code,
            };
        },
    };
};

export default processor;
