import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    sanitize_for_svelte,
    create_module_context,
} from '../dist/transformer.js';

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
            '<script context="module">export const frontmatter = {"string":"text","number":123,"boolean":true};</script>',
        );
    });
});
