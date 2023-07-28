import { Config } from './config';
import { transformer } from './transformer';
import type { PreprocessorGroup } from 'svelte/compiler';

const processor = ({
    extensions = ['.markdoc'],
    layout = null,
    nodes = {},
}: Config): PreprocessorGroup => {
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
                layout,
            });

            return {
                code,
            };
        },
    };
};

export default processor;
