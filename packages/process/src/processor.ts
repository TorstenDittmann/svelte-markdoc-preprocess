import { Config } from './config';
import { transformer } from './transformer';
import type { PreprocessorGroup } from 'svelte/compiler';

const processor = (
    {
        extensions = ['.markdoc'],
        layouts = null,
        nodes = null,
        tags = null,
        config = null,
        generateSchema = true,
    }: Config = {
        extensions: ['.markdoc'],
        layouts: null,
        nodes: null,
        tags: null,
        config: null,
        generateSchema: true,
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
                config,
                content,
                layouts,
                generate_schema: generateSchema,
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
