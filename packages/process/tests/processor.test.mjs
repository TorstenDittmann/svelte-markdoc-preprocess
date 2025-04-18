import fg from 'fast-glob';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { basename, join } from 'node:path';
import { markdoc } from '../dist/module.js';
import { read_file } from './utils.mjs';

test('preprocessor', async (context) => {
    const preprocess = markdoc();

    await context.test('should return a preprocessor', async () => {
        assert.ok(preprocess.name === 'svelte-markdoc-preprocess');
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
        await Promise.all(
            ['markdoc', 'mdoc', 'markdown', 'md'].map((extension) => {
                return preprocess
                    .markup({
                        content: '# Hello World',
                        filename: 'test.' + extension,
                    })
                    .then((result) => {
                        return assert.deepEqual(result, {
                            code: '<article><h1>Hello World</h1></article>',
                        });
                    });
            }),
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

    const files = fg.globSync('tests/processor/**', {
        onlyDirectories: true,
    });

    assert(files.length > 0, 'no test files found');

    await Promise.all(
        files.map(async (entry) => {
            return context.test('tests ' + basename(entry), async () => {
                const before = read_file(join(entry, 'source.markdoc'));
                const after = read_file(join(entry, 'compiled.txt')).replace(
                    /\\n/g,
                    '\n',
                );
                const config = await import('../' + join(entry, 'config.mjs'));
                const preprocess = config.default;
                const exception = config.exception ?? false;
                try {
                    const markup = await preprocess.markup({
                        content: before,
                        filename: 'test.markdoc',
                    });
                    assert.equal(markup.code, after);
                } catch (error) {
                    if (exception) {
                        assert.equal(error.message, exception);
                    } else {
                        throw error;
                    }
                }
            });
        }),
    );
});
