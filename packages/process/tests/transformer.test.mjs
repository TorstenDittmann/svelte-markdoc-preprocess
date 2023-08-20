import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitize_for_svelte } from '../dist/transformer.js';

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
