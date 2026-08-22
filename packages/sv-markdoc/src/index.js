import { color, svelteConfig } from '@sveltejs/sv-utils';
import { defineAddon } from 'sv';

export default defineAddon({
    id: 'markdoc',
    shortDescription: 'svelte + markdoc',
    homepage: 'https://svelte-markdoc-preprocess.pages.dev',
    options: {},

    run: ({ sv, cwd }) => {
        sv.devDependency('svelte-markdoc-preprocess', '^3.0.4');

        svelteConfig.edit({ sv, cwd }, ({ ast, property, override, js }) => {
            js.imports.addNamed(ast, {
                from: 'svelte-markdoc-preprocess',
                imports: ['markdoc'],
            });

            // preprocess
            let preprocessorArray = property('preprocess', {
                fallback: js.array.create(),
            });
            const isArray = preprocessorArray.type === 'ArrayExpression';

            if (!isArray) {
                const previousElement = preprocessorArray;
                preprocessorArray = js.array.create();
                js.array.append(preprocessorArray, previousElement);
                override({ preprocess: preprocessorArray });
            }

            const markdocCall = js.functions.createCall({
                name: 'markdoc',
                args: [],
            });
            js.array.append(preprocessorArray, markdocCall);

            // extensions
            const extensionsArray = property('extensions', {
                fallback: js.array.create(),
            });
            js.array.append(extensionsArray, '.markdoc');
            js.array.append(extensionsArray, '.svelte');
        });
    },

    nextSteps: () => [
        `Create a ${color.path('+page.markdoc')} file in your routes and start writing Markdoc`,
        `Read the docs at https://svelte-markdoc-preprocess.pages.dev`,
    ],
});
