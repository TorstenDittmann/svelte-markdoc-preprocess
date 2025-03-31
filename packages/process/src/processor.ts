import { Config } from './config.js';
import { transformer } from './transformer.js';
import type { PreprocessorGroup } from 'svelte/compiler';

const default_config: Config = {
    extensions: ['.markdoc', '.mdoc', '.markdown', '.md'],
    generateSchema: true,
    layouts: null,
    nodes: null,
    tags: null,
    partials: null,
    config: null,
    validationThreshold: 'error',
    allowComments: false,
    highlighter: null,
};

const processor = ({
    extensions = default_config.extensions,
    generateSchema = default_config.generateSchema,
    layouts = default_config.layouts,
    nodes = default_config.nodes,
    tags = default_config.tags,
    partials = default_config.partials,
    config = default_config.config,
    validationThreshold = default_config.validationThreshold,
    allowComments = default_config.allowComments,
    highlighter: highlighter = default_config.highlighter,
}: Partial<Config> = default_config): PreprocessorGroup => {
    return {
        name: 'svelte-markdoc-preprocess',
        async markup({ content, filename }) {
            /**
             * Only use on specific extensions
             */
            if (
                !filename ||
                !extensions.find((extension) => filename?.endsWith(extension))
            )
                return;

            /**
             * Add svelte components to be used with markdoc tags
             */
            const code = await transformer({
                filename,
                config,
                content,
                layouts,
                generate_schema: generateSchema,
                nodes_file: nodes,
                tags_file: tags,
                partials_dir: partials,
                validation_threshold: validationThreshold,
                allow_comments: allowComments,
                highlighter,
            });

            return {
                code,
            };
        },
    };
};

export default processor;
