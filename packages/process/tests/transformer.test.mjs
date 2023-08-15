import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitize_for_svelte, ts_to_type } from '../dist/transformer.js';

test('tsToType', async (context) => {
    const node = {
        type: 'BindingIdentifier',
    };
    await context.test('handles strings', () => {
        const type = ts_to_type({
            ...node,
            typeAnnotation: {
                typeAnnotation: {
                    type: 'TsKeywordType',
                    kind: 'string',
                },
            },
        });
        assert.equal(type, String);
    });
    await context.test('handles numbers', () => {
        const type = ts_to_type({
            ...node,
            typeAnnotation: {
                typeAnnotation: {
                    type: 'TsKeywordType',
                    kind: 'number',
                },
            },
        });
        assert.equal(type, Number);
    });
    await context.test('handles boolean', () => {
        const type = ts_to_type({
            ...node,
            typeAnnotation: {
                typeAnnotation: {
                    type: 'TsKeywordType',
                    kind: 'boolean',
                },
            },
        });
        assert.equal(type, Boolean);
    });
    await context.test('falls back to string', () => {
        const type = ts_to_type(node);
        assert.equal(type, String);
    });
});

test('sanitize for svelte', async (context) => {
    await Promise.all(
        ['{', '}'].map(async (char) =>
            context.test(`takes care of ${char}`, () => {
                const sanitized = sanitize_for_svelte(char);
                assert.ok(!sanitized.includes(char));
                assert.ok(sanitized.startsWith('&'));
                assert.ok(sanitized.endsWith(';'));
            }),
        ),
    );
});
