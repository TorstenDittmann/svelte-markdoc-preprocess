import { transformer } from "./transformer.js";

export default (
    options = {
        extensions: [".markdoc"]
    }
) => {
    const tags = {
        mytest: {
            render: "Test",
            selfClosing: true
        },
        second: {
            render: "Test"
        },
        addition: {
            render: "Addition",
            attributes: {
                a: {
                    type: Number
                },
                b: {
                    type: Number
                }
            }
        }
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
                tags
            });

            return {
                code
            };
        }
    };
};
