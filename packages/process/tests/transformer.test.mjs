import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    sanitize_for_svelte,
    create_module_context,
    get_component_vars,
} from '../dist/transformer.js';
import { absoulute } from './utils.mjs';

test('sanitize for svelte', async (context) => {
    await Promise.all(
        ['{', '}', '{svelte_var}'].map(async (char) =>
            context.test(`takes care of ${char}`, () => {
                const sanitized = sanitize_for_svelte(char);
                assert.ok(!sanitized.includes(char));
                assert.ok(sanitized.startsWith('&'));
                assert.ok(sanitized.endsWith(';'));
            }),
        ),
    );
});

test('create module context', async (context) => {
    await context.test('primitives', () => {
        const context = create_module_context({
            string: 'text',
            number: 123,
            boolean: true,
        });
        assert.equal(
            context,
            '<script module>export const frontmatter = {"string":"text","number":123,"boolean":true};</script>',
        );
    });
});

test('get component vars', async (context) => {
    const layout = absoulute(import.meta.url, './tags/module.svelte');
    await context.test('untyped', () => {
        const path = './untyped.svelte';
        const vars = get_component_vars(path, layout);
        assert.ok(vars.number.required === true);
        assert.ok(vars.string.required === true);
        assert.ok(vars.boolean.required === true);
    });
    await context.test('typescript', () => {
        const path = './typescript.svelte';
        const vars = get_component_vars(path, layout);
        assert.ok(vars.number.required === true);
        assert.ok(vars.string.required === true);
        assert.ok(vars.boolean.required === true);
    });
    await context.test('jsdoc', () => {
        const path = './jsdoc.svelte';
        const vars = get_component_vars(path, layout);
        assert.ok(vars.number.required === true);
        assert.ok(vars.string.required === true);
        assert.ok(vars.boolean.required === true);
    });
    await context.test('infer', () => {
        const path = './infer.svelte';
        const vars = get_component_vars(path, layout);
        assert.ok(vars.number.required === false);
        assert.ok(vars.string.required === false);
        assert.ok(vars.boolean.required === false);
    });
    await context.test('fallback', () => {
        const path = './fallback.svelte';
        const vars = get_component_vars(path, layout);
        assert.ok(vars.fallback.required === true);
    });
});
