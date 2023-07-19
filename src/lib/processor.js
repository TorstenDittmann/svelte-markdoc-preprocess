import Markdoc from '@markdoc/markdoc';

export function markdoc() {
	//TODO: move this to functions argument
	const extensions = ['.markdoc'];
	return {
		markup: async ({ content, filename }) => {
			/**
			 * Only use on specific extensions
			 */
			if (!extensions.find((extension) => filename.endsWith(extension))) return;

			/**
			 * Add svelte components to be used with markdoc tags
			 */
			const tags = {
				mytest: {
					render: 'Test',
					selfClosing: true
				},
				second: {
					render: 'Test'
				},
				addition: {
					render: 'Addition',
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

			/**
			 * create ast for markdoc
			 */
			const ast = Markdoc.parse(content);

			/**
			 * identify all tags used in the document
			 */
			const components = new Set();
			for (const node of ast.walk()) {
				if (node.type === 'tag') {
					if (node.tag in tags) {
						components.add(tags[node.tag].render);
					}
				}
			}

			/**
			 * transform the ast with svelte components
			 */
			const nodes = Markdoc.transform(ast, {
				tags
			});

			/**
			 * render  to html
			 */
			const code = Markdoc.renderers.html(nodes);

			/**
			 * add used svelte components to the script tag
			 */
			const dependencies = [...components].reduce(
				(prev, curr) => `${prev}\nimport ${curr} from '$lib/${curr}.svelte';`,
				''
			);

			return {
				code: `<script>${dependencies}</script>${code}`
			};
		}
	};
}
