import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markdoc } from '../dist/module.js';
import { absoulute } from './utils.mjs';

test('preprocessor', async (context) => {
    const preprocess = markdoc();

    await context.test('should return a preprocessor', async () => {
        assert.ok(preprocess.name === 'markdoc');
        assert.ok('markup' in preprocess);
    });
    await context.test('ignores non-extension files', async () => {
        assert.equal(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.svelte',
            }),
            undefined,
        );
    });
    await context.test('handles extension files', async () => {
        assert.deepEqual(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.markdoc',
            }),
            {
                code: '<article><h1>Hello World</h1></article>',
            },
        );
    });
    await context.test('respects config extensions', async () => {
        const preprocess = markdoc({
            extensions: ['.test'],
        });
        assert.equal(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.markdoc',
            }),
            undefined,
        );
        assert.deepEqual(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.test',
            }),
            {
                code: '<article><h1>Hello World</h1></article>',
            },
        );
    });
    await context.test('uses tags', async () => {
        const module_path = absoulute(import.meta.url, './tags/module.svelte');
        const script = `<script>import * as INTERNAL__TAGS from '${module_path}';</script>`;
        const preprocess = markdoc({
            tags: module_path,
        });
        assert.deepEqual(
            await preprocess.markup({
                content: '{% hello %}',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__TAGS.Hello></INTERNAL__TAGS.Hello></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% slot %}slot content{% /slot %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><p><INTERNAL__TAGS.Slot>slot content</INTERNAL__TAGS.Slot></p></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: '{% unknown %}',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article></article>`,
            },
        );
    });
    await context.test('uses nodes', async () => {
        const module_path = absoulute(import.meta.url, './nodes/module.svelte');
        const script = `<script>import * as INTERNAL__NODES from '${module_path}';</script>`;
        const preprocess = markdoc({
            nodes: module_path,
        });
        assert.deepEqual(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `## Hello World`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="2">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `# Hello World{% #my-id %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading id="my-id" level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `# Hello World{% .my-class %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading class="my-class" level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
    });
    await context.test('uses nodes and tags', async () => {
        const nodes_module_path = absoulute(
            import.meta.url,
            './nodes/module.svelte',
        );
        const tags_module_path = absoulute(
            import.meta.url,
            './tags/module.svelte',
        );
        const script = `<script>import * as INTERNAL__TAGS from '${tags_module_path}';import * as INTERNAL__NODES from '${nodes_module_path}';</script>`;
        const preprocess = markdoc({
            nodes: nodes_module_path,
            tags: tags_module_path,
        });
        assert.deepEqual(
            await preprocess.markup({
                content: '# Hello World',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `## Hello World`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="2">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `# Hello World{% #my-id %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading id="my-id" level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `# Hello World{% .my-class %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading class="my-class" level="1">Hello World</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: '{% hello %}',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__TAGS.Hello></INTERNAL__TAGS.Hello></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% slot %}slot content{% /slot %}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><p><INTERNAL__TAGS.Slot>slot content</INTERNAL__TAGS.Slot></p></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: '{% unknown %}',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article></article>`,
            },
        );
    });
    await context.test('uses partials', async () => {
        const partials_module_path = absoulute(import.meta.url, './partials');
        const preprocess = markdoc({
            partials: partials_module_path,
        });
        assert.deepEqual(
            await preprocess.markup({
                content: '{% partial file="test.md" /%}',
                filename: 'test.markdoc',
            }),
            {
                code: `<article><h1>I am a partial</h1></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="variables.md" variables={lorem: "Lorem", ipsum: "Ipsum"}  /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `<article><h1>Lorem Ipsum</h1></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="nested/file.md" /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `<article><h1>I am nested</h1></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="unknown.md" /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `<article></article>`,
            },
        );
    });
    await context.test('uses partials with nodes and tags', async () => {
        const partials_module_path = absoulute(import.meta.url, './partials');
        const nodes_module_path = absoulute(
            import.meta.url,
            './nodes/module.svelte',
        );
        const tags_module_path = absoulute(
            import.meta.url,
            './tags/module.svelte',
        );
        const script = `<script>import * as INTERNAL__TAGS from '${tags_module_path}';import * as INTERNAL__NODES from '${nodes_module_path}';</script>`;
        const preprocess = markdoc({
            partials: partials_module_path,
            nodes: nodes_module_path,
            tags: tags_module_path,
        });
        assert.deepEqual(
            await preprocess.markup({
                content: '{% partial file="test.md" /%}',
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="1">I am a partial</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="variables.md" variables={lorem: "Lorem", ipsum: "Ipsum"}  /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="1">Lorem Ipsum</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="tags.md" /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__TAGS.Hello></INTERNAL__TAGS.Hello><INTERNAL__TAGS.Slot><p>slot content</p></INTERNAL__TAGS.Slot></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="nested/file.md" /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article><INTERNAL__NODES.Heading level="1">I am nested</INTERNAL__NODES.Heading></article>`,
            },
        );
        assert.deepEqual(
            await preprocess.markup({
                content: `{% partial file="unknown.md" /%}`,
                filename: 'test.markdoc',
            }),
            {
                code: `${script}<article></article>`,
            },
        );
    });
});
