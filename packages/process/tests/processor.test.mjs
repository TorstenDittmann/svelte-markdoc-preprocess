import { test } from "node:test";
import assert from "node:assert/strict";
import { markdoc } from "../dist/module.js";

test("preprocessor", async (context) => {
    const preprocess = markdoc();

    await context.test('should return a preprocessor', async () => {
        assert.ok(preprocess.name === 'markdoc');
        assert.ok('markup' in preprocess);
    });
    await context.test('ignores non-extension files', async () => {
        assert.equal(await preprocess.markup({
            content: '# Hello World',
            filename: 'test.svelte'
        }), undefined);
    });

    await context.test('handles extension files', async () => {
        assert.deepEqual(await preprocess.markup({
            content: '# Hello World',
            filename: 'test.markdoc'
        }), {
            code: '<article><h1>Hello World</h1></article>'
        });
    });

    await context.test('respects config extensions', async () => {
        const preprocess = markdoc({
            extensions: ['.test']
        });
        assert.equal(await preprocess.markup({
            content: '# Hello World',
            filename: 'test.markdoc'
        }), undefined);
        assert.deepEqual(await preprocess.markup({
            content: '# Hello World',
            filename: 'test.test'
        }), {
            code: '<article><h1>Hello World</h1></article>'
        });
    });

});